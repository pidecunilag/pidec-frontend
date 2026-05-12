'use client';

import { useMemo, useState } from 'react';
import { Download, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  EmptyState,
  PageHero,
  STAGE_META,
  StageStepper,
  StatusBadge,
  StudentPanel,
  formatDateTime,
  getStageSubmission,
  isTeamLeader,
} from '@/components/student/dashboard-utils';
import { extractApiError } from '@/lib/api/client';
import { AUTOSAVE_INTERVAL_MS } from '@/lib/constants';
import { getAutosaveKey, useAutosave } from '@/lib/hooks/use-autosave';
import { useAuth } from '@/lib/hooks/use-auth';
import { useEdition } from '@/lib/hooks/use-edition';
import { useSubmissions } from '@/lib/hooks/use-submissions';
import { useTeam } from '@/lib/hooks/use-team';
import type { Stage2FormData, Stage3FormData, UploadedSubmissionFile } from '@/lib/types';

const emptyStage2: Stage2FormData = {
  design_summary: '',
  engineering_decisions: '',
  constraints_addressed: '',
  testing_results: '',
};

const emptyStage3: Stage3FormData = {
  final_documentation_summary: '',
  team_ready: true,
};

export default function StudentSubmissionsPage() {
  const { user } = useAuth();
  const { edition, isLoading: editionLoading } = useEdition();
  const { team, isLoading: teamLoading } = useTeam();
  const {
    submissions,
    isLoading,
    submitStage1,
    submitStage2,
    submitStage3,
    uploadFile,
    isSubmittingStage1,
    isSubmittingStage2,
    isSubmittingStage3,
    isUploadingFile,
  } = useSubmissions();
  const [stage1Token, setStage1Token] = useState('');
  const [stage1Files, setStage1Files] = useState<UploadedSubmissionFile[]>([]);
  const [stage2VideoLink, setStage2VideoLink] = useState('');
  const [stage2Data, setStage2Data] = useState<Stage2FormData>(emptyStage2);
  const [stage3Data, setStage3Data] = useState<Stage3FormData>(emptyStage3);
  const [stage2Files, setStage2Files] = useState<UploadedSubmissionFile[]>([]);
  const [stage3Files, setStage3Files] = useState<UploadedSubmissionFile[]>([]);
  const [confirmStage, setConfirmStage] = useState<1 | 2 | 3 | null>(null);
  const activeStage = edition?.activeStage === 1 || edition?.activeStage === 2 || edition?.activeStage === 3
    ? edition.activeStage
    : null;
  const activeSubmission = activeStage ? getStageSubmission(submissions, activeStage) : null;
  const leader = isTeamLeader(team, user);
  const canSubmit = Boolean(
    team &&
      leader &&
      team.status === 'active' &&
      activeStage &&
      edition?.submissionWindowOpen &&
      !activeSubmission,
  );
  const draftKey = team && edition && activeStage
    ? getAutosaveKey(team.id, edition.id, activeStage)
    : 'pidec_draft_unavailable';
  const draftPayload = useMemo(
    () => ({
      stage1Token,
      stage1Files,
      stage2VideoLink,
      stage2Data,
      stage2Files,
      stage3Data,
      stage3Files,
    }),
    [stage1Token, stage1Files, stage2VideoLink, stage2Data, stage2Files, stage3Data, stage3Files],
  );
  const hasDraftContent = useMemo(() => {
    const hasStage1Content =
      stage1Token.trim().length > 0 ||
      stage1Files.length > 0;
    const hasStage2Content =
      stage2VideoLink.trim().length > 0 ||
      Object.values(stage2Data).some((value) => value.trim().length > 0) ||
      stage2Files.length > 0;
    const hasStage3Content =
      stage3Data.final_documentation_summary.trim().length > 0 ||
      stage3Data.team_ready !== true ||
      stage3Files.length > 0;

    return hasStage1Content || hasStage2Content || hasStage3Content;
  }, [stage1Token, stage1Files, stage2VideoLink, stage2Data, stage2Files, stage3Data, stage3Files]);
  const { hasSavedDraft, restoreDraft, clearDraft } = useAutosave(
    draftKey,
    draftPayload,
    AUTOSAVE_INTERVAL_MS,
    {
      enabled: Boolean(team && edition && activeStage && canSubmit),
      debounceMs: 800,
      shouldSave: hasDraftContent,
    },
  );

  const restoreSavedDraft = () => {
    const draft = restoreDraft();
    if (!draft) return toast.error('No saved draft found.');
    setStage1Token(draft.stage1Token ?? '');
    setStage1Files(draft.stage1Files ?? []);
    setStage2VideoLink(draft.stage2VideoLink ?? '');
    setStage2Data(draft.stage2Data ?? emptyStage2);
    setStage2Files(draft.stage2Files ?? []);
    setStage3Data(draft.stage3Data ?? emptyStage3);
    setStage3Files(draft.stage3Files ?? []);
    toast.success('Draft restored.');
  };

  const uploadStageFile = async (file: File | undefined, stage: 1 | 2 | 3) => {
    if (!file) return;
    try {
      const uploaded = await uploadFile({ file, stage });
      if (stage === 1) setStage1Files([uploaded]);
      if (stage === 2) setStage2Files((files) => [...files, uploaded]);
      if (stage === 3) setStage3Files((files) => [...files, uploaded]);
      toast.success('File uploaded.');
    } catch (error) {
      toast.error(extractApiError(error).message);
    }
  };

  const submitConfirmedStage = async () => {
    try {
      if (confirmStage === 1) {
        await submitStage1({
          token: stage1Token,
          formData: { submission_type: 'document_upload' },
          fileIds: stage1Files.map((file) => file.id),
        });
      }
      if (confirmStage === 2) {
        await submitStage2({
          videoLink: stage2VideoLink,
          formData: stage2Data,
          fileIds: stage2Files.map((file) => file.id),
        });
      }
      if (confirmStage === 3) {
        await submitStage3({
          formData: stage3Data,
          fileIds: stage3Files.map((file) => file.id),
        });
      }
      clearDraft();
      setStage1Token('');
      setStage1Files([]);
      setStage2VideoLink('');
      setStage2Data(emptyStage2);
      setStage2Files([]);
      setStage3Data(emptyStage3);
      setStage3Files([]);
      toast.success('Submission received.');
    } catch (error) {
      toast.error(extractApiError(error).message);
    } finally {
      setConfirmStage(null);
    }
  };

  const validateAndConfirm = (stage: 1 | 2 | 3) => {
    if (!canSubmit) return toast.error('You cannot submit for this stage right now.');
    if (stage === 1) {
      if (!stage1Token.trim()) return toast.error('Department token is required.');
      if (stage1Files.length !== 1) return toast.error('Upload one PDF or Word proposal document.');
    }
    if (stage === 2) {
      if (!stage2VideoLink.trim()) return toast.error('Video link is required.');
      if (Object.values(stage2Data).some((value) => !value.trim())) {
        return toast.error('Complete every Stage 2 section.');
      }
    }
    if (stage === 3) {
      if (!stage3Data.final_documentation_summary.trim()) return toast.error('Final documentation summary is required.');
      if (stage3Data.team_ready !== true) return toast.error('Confirm team readiness before submitting.');
      if (stage3Files.length === 0) return toast.error('Upload at least one final document.');
    }
    setConfirmStage(stage);
  };

  const loading = isLoading || teamLoading || editionLoading;

  return (
    <div className="space-y-8">
      <PageHero
        title="Submit your team work"
        description="Only team leaders can submit. Everyone on the team can track status and published feedback."
      />

      <StudentPanel title="Stage Progress" description={edition?.theme ?? 'Current PIDEC stage status'}>
        <StageStepper activeStage={edition?.activeStage} />
      </StudentPanel>

      <StudentPanel title="Submission History" description="All submitted stages for your team.">
        {loading ? (
          <Skeleton className="h-32 w-full rounded-xl" />
        ) : submissions.length === 0 ? (
          <EmptyState title="No submissions yet" description="Your team submissions will appear here after the leader submits." />
        ) : (
          <div className="overflow-hidden rounded-xl border bg-white/80">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Files</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{STAGE_META[submission.stage].title}</TableCell>
                    <TableCell><StatusBadge status={submission.status} /></TableCell>
                    <TableCell>{formatDateTime(submission.submittedAt)}</TableCell>
                    <TableCell>{submission.files?.length ?? 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </StudentPanel>

      {!team ? (
        <StudentPanel title="Submission Locked" description="You need a team before submitting.">
          <EmptyState title="No team yet" description="Create or join a team from the team workspace before attempting a submission." />
        </StudentPanel>
      ) : !leader ? (
        <StudentPanel title="Read Only Access" description="Only team leaders can submit.">
          <p className="rounded-xl border bg-white/80 p-4 text-sm text-muted-foreground">
            You can view team submissions here, but your team leader is responsible for final submission.
          </p>
        </StudentPanel>
      ) : activeSubmission ? (
        <StudentPanel title="Stage Already Submitted" description="This stage is locked after submission.">
          <div className="flex flex-col gap-3 rounded-xl border bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Stage {activeSubmission.stage} is submitted</p>
              <p className="text-sm text-muted-foreground">Submitted {formatDateTime(activeSubmission.submittedAt)}</p>
            </div>
            <StatusBadge status={activeSubmission.status} />
          </div>
        </StudentPanel>
      ) : !canSubmit ? (
        <StudentPanel title="Submission Window Closed" description="The active submission form appears when admin opens the window.">
          <p className="rounded-xl border bg-white/80 p-4 text-sm text-muted-foreground">
            Your team is ready, but submissions are not open for the current stage.
          </p>
        </StudentPanel>
      ) : activeStage === 1 ? (
        <>
          <DraftRestoreBar hasDraft={hasSavedDraft} onRestore={restoreSavedDraft} />
          <Stage1Form
            token={stage1Token}
            setToken={setStage1Token}
            files={stage1Files}
            setFiles={setStage1Files}
            isUploading={isUploadingFile}
            isSubmitting={isSubmittingStage1}
            onUpload={(file) => uploadStageFile(file, 1)}
            onSubmit={() => validateAndConfirm(1)}
          />
        </>
      ) : activeStage === 2 ? (
        <>
          <DraftRestoreBar hasDraft={hasSavedDraft} onRestore={restoreSavedDraft} />
          <Stage2Form
            videoLink={stage2VideoLink}
            setVideoLink={setStage2VideoLink}
            data={stage2Data}
            setData={setStage2Data}
            files={stage2Files}
            setFiles={setStage2Files}
            isUploading={isUploadingFile}
            isSubmitting={isSubmittingStage2}
            onUpload={(file) => uploadStageFile(file, 2)}
            onSubmit={() => validateAndConfirm(2)}
          />
        </>
      ) : activeStage === 3 ? (
        <>
          <DraftRestoreBar hasDraft={hasSavedDraft} onRestore={restoreSavedDraft} />
          <Stage3Form
            data={stage3Data}
            setData={setStage3Data}
            files={stage3Files}
            setFiles={setStage3Files}
            isUploading={isUploadingFile}
            isSubmitting={isSubmittingStage3}
            onUpload={(file) => uploadStageFile(file, 3)}
            onSubmit={() => validateAndConfirm(3)}
          />
        </>
      ) : null}

      <AlertDialog open={confirmStage !== null} onOpenChange={(open) => !open && setConfirmStage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Stage {confirmStage}?</AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm carefully. Once submitted, your team response is locked for this stage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="rounded-xl border bg-white/80 p-4 text-sm">
            <p className="font-medium">Review summary</p>
            <p className="mt-1 text-muted-foreground">
              {confirmStage === 1 && `${stage1Files.length} proposal document attached.`}
              {confirmStage === 2 && `${stage2Files.length} file(s) attached with your prototype video link.`}
              {confirmStage === 3 && `${stage3Files.length} final document(s) attached.`}
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={submitConfirmedStage}>Submit now</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Stage1Form({
  token,
  setToken,
  files,
  setFiles,
  isUploading,
  isSubmitting,
  onUpload,
  onSubmit,
}: {
  token: string;
  setToken: (value: string) => void;
  files: UploadedSubmissionFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadedSubmissionFile[]>>;
  isUploading: boolean;
  isSubmitting: boolean;
  onUpload: (file: File | undefined) => void;
  onSubmit: () => void;
}) {
  return (
    <StudentPanel title="Stage 1 Proposal" description="Upload one PDF or Word proposal document using the PIDEC guide.">
      <div className="space-y-5">
        <div className="rounded-2xl border border-[rgba(255,85,0,0.16)] bg-[rgba(255,85,0,0.06)] p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-orange)]">
                Proposal guide
              </p>
              <h3 className="mt-2 text-xl font-semibold text-[var(--brand-plum)]">
                Use the template before uploading
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Your document should cover the problem, proposed engineering solution, theme alignment,
                feasibility, and departmental relevance within the total word limit.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0">
              <a href="/templates/stage-1-proposal-template.docx" download>
                <Download className="mr-2 h-4 w-4" />
                Download template
              </a>
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="stage-token">Department token</Label>
          <Input id="stage-token" value={token} onChange={(event) => setToken(event.target.value)} placeholder="12 character token" />
        </div>
        <FileUploadList
          files={files}
          setFiles={setFiles}
          isUploading={isUploading}
          onUpload={onUpload}
          title="Proposal document"
          description="Accepted: PDF, DOC, DOCX. Max 50MB. Uploading a new document replaces the current one."
          accept=".pdf,.doc,.docx"
          maxFiles={1}
        />
        <Button onClick={onSubmit} disabled={isSubmitting || isUploading}>
          {isSubmitting ? 'Submitting...' : 'Review and submit Stage 1'}
        </Button>
      </div>
    </StudentPanel>
  );
}

function DraftRestoreBar({
  hasDraft,
  onRestore,
}: {
  hasDraft: boolean;
  onRestore: () => void;
}) {
  if (!hasDraft) return null;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[rgba(255,85,0,0.2)] bg-[rgba(255,85,0,0.08)] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-[var(--brand-plum)]">Saved draft found</p>
        <p className="text-sm text-muted-foreground">Restore your previous work before continuing.</p>
      </div>
      <Button type="button" variant="outline" onClick={onRestore}>
        Restore draft
      </Button>
    </div>
  );
}

function Stage2Form({
  videoLink,
  setVideoLink,
  data,
  setData,
  files,
  setFiles,
  isUploading,
  isSubmitting,
  onUpload,
  onSubmit,
}: {
  videoLink: string;
  setVideoLink: (value: string) => void;
  data: Stage2FormData;
  setData: React.Dispatch<React.SetStateAction<Stage2FormData>>;
  files: UploadedSubmissionFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadedSubmissionFile[]>>;
  isUploading: boolean;
  isSubmitting: boolean;
  onUpload: (file: File | undefined) => void;
  onSubmit: () => void;
}) {
  const fields = [
    ['design_summary', 'Detailed design and technical documentation'],
    ['engineering_decisions', 'Engineering decisions justification'],
    ['constraints_addressed', 'Constraints and how addressed'],
    ['testing_results', 'Preliminary testing or validation results'],
  ] as const;

  return (
    <StudentPanel title="Stage 2 Prototype Submission" description="Submit your demo video link and technical documentation.">
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="video-link">YouTube or Google Drive video link</Label>
          <Input id="video-link" value={videoLink} onChange={(event) => setVideoLink(event.target.value)} placeholder="https://..." />
          <p className="text-xs text-muted-foreground">YouTube must be unlisted. Google Drive must be shared with anyone with the link.</p>
        </div>
        {fields.map(([key, label]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <Textarea id={key} value={data[key]} onChange={(event) => setData((current) => ({ ...current, [key]: event.target.value }))} className="min-h-28" />
          </div>
        ))}
        <FileUploadList files={files} setFiles={setFiles} isUploading={isUploading} onUpload={onUpload} optional />
        <Button onClick={onSubmit} disabled={isSubmitting || isUploading}>
          {isSubmitting ? 'Submitting...' : 'Review and submit Stage 2'}
        </Button>
      </div>
    </StudentPanel>
  );
}

function Stage3Form({
  data,
  setData,
  files,
  setFiles,
  isUploading,
  isSubmitting,
  onUpload,
  onSubmit,
}: {
  data: Stage3FormData;
  setData: React.Dispatch<React.SetStateAction<Stage3FormData>>;
  files: UploadedSubmissionFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadedSubmissionFile[]>>;
  isUploading: boolean;
  isSubmitting: boolean;
  onUpload: (file: File | undefined) => void;
  onSubmit: () => void;
}) {
  return (
    <StudentPanel title="Stage 3 Finale Documents" description="Upload final documentation and confirm readiness for the Grand Finale.">
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="final-summary">Final documentation summary</Label>
          <Textarea
            id="final-summary"
            value={data.final_documentation_summary}
            onChange={(event) => setData((current) => ({ ...current, final_documentation_summary: event.target.value }))}
            className="min-h-32"
          />
        </div>
        <label className="flex gap-3 rounded-xl border bg-white/80 p-4 text-sm">
          <Checkbox checked={data.team_ready} onCheckedChange={(checked) => setData((current) => ({ ...current, team_ready: checked === true }))} />
          <span>We confirm our team is ready for the Grand Finale.</span>
        </label>
        <FileUploadList files={files} setFiles={setFiles} isUploading={isUploading} onUpload={onUpload} />
        <Button onClick={onSubmit} disabled={isSubmitting || isUploading}>
          {isSubmitting ? 'Submitting...' : 'Review and submit Stage 3'}
        </Button>
      </div>
    </StudentPanel>
  );
}

function FileUploadList({
  files,
  setFiles,
  isUploading,
  onUpload,
  optional = false,
  title = 'Supporting files',
  description = 'Accepted: PDF, DOCX, PPTX, ZIP, PNG, JPG, WEBP. Max 50MB.',
  accept = '.pdf,.docx,.pptx,.zip,.png,.jpg,.jpeg,.webp',
  maxFiles,
}: {
  files: UploadedSubmissionFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadedSubmissionFile[]>>;
  isUploading: boolean;
  onUpload: (file: File | undefined) => void;
  optional?: boolean;
  title?: string;
  description?: string;
  accept?: string;
  maxFiles?: number;
}) {
  return (
    <div className="space-y-3 rounded-xl border bg-white/80 p-4">
      <div>
        <p className="font-medium">{title} {optional ? <span className="text-muted-foreground">(optional)</span> : null}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[rgba(42,0,59,0.18)] bg-white/70 p-6 text-center transition hover:border-[var(--brand-purple)] hover:bg-[rgba(142,77,255,0.06)]">
        <UploadCloud className="h-8 w-8 text-[var(--brand-purple)]" />
        <span className="mt-2 text-sm font-medium">{isUploading ? 'Uploading...' : 'Click to upload file'}</span>
        <input
          type="file"
          className="sr-only"
          disabled={isUploading}
          accept={accept}
          onChange={(event) => {
            onUpload(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
      </label>
      {files.length > 0 ? (
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between gap-3 rounded-lg bg-[rgba(142,77,255,0.08)] p-3 text-sm">
              <span className="truncate">{file.filename}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setFiles((current) => current.filter((item) => item.id !== file.id))}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <Badge variant="secondary">{maxFiles === 1 ? 'No document uploaded' : 'No files uploaded'}</Badge>
      )}
    </div>
  );
}
