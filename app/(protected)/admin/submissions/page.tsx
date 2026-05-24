'use client';

import { useState } from 'react';
import { Download, FileText, Search } from 'lucide-react';
import { toast } from 'sonner';

import { submissionsAdminApi } from '@/lib/api/admin';
import { extractApiError } from '@/lib/api/client';
import { DEPARTMENTS } from '@/lib/constants';
import { useAdminSubmissions } from '@/lib/hooks/use-admin';
import type { SubmissionFile } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SubmissionsPage() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [stage, setStage] = useState('all');

  const params = {
    ...(search && { q: search }),
    ...(department !== 'all' && { department }),
    ...(stage !== 'all' && { stage: Number(stage) }),
  };

  const { data, isPending } = useAdminSubmissions(
    Object.keys(params).length > 0 ? params : undefined,
  );

  const submissions = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Submissions</h2>
        <p className="text-muted-foreground">
          View all team submissions across stages.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENTS.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="1">Stage 1</SelectItem>
            <SelectItem value="2">Stage 2</SelectItem>
            <SelectItem value="3">Stage 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No submissions found.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Team</th>
                  <th className="px-4 py-3 text-left font-medium">Department</th>
                  <th className="px-4 py-3 text-left font-medium">Submitted by</th>
                  <th className="px-4 py-3 text-left font-medium">Stage</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Files</th>
                  <th className="px-4 py-3 text-left font-medium">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">
                      {submission.teams?.name ?? (
                        <span className="font-mono text-xs text-muted-foreground">
                          {submission.teamId}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {submission.teams?.department ?? '-'}
                    </td>
                    <td className="px-4 py-3">
                      {submission.users ? (
                        <div>
                          <p className="font-medium">{submission.users.name}</p>
                          <p className="text-xs text-muted-foreground">{submission.users.email}</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">Stage {submission.stage}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          submission.status === 'feedback_available'
                            ? 'default'
                            : submission.status === 'submitted'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {submission.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <SubmissionFiles submissionId={submission.id} files={submission.files} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {submission.submittedAt
                        ? new Date(submission.submittedAt).toLocaleDateString()
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function SubmissionFiles({
  submissionId,
  files,
}: {
  submissionId: string;
  files: SubmissionFile[];
}) {
  if (!files?.length) {
    return <span className="text-xs text-muted-foreground">No files</span>;
  }

  return (
    <div className="flex min-w-48 flex-col gap-2">
      {files.map((file) => (
        <SubmissionFileDownloadButton
          key={file.id ?? file.url}
          submissionId={submissionId}
          file={file}
        />
      ))}
    </div>
  );
}

function SubmissionFileDownloadButton({
  submissionId,
  file,
}: {
  submissionId: string;
  file: SubmissionFile;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const fileId = file.id ?? file.url;

  async function downloadFile() {
    try {
      setIsDownloading(true);
      const download = await submissionsAdminApi.getSubmissionFileDownload(submissionId, fileId);
      const link = document.createElement('a');
      link.href = download.url;
      link.download = download.filename;
      link.rel = 'noreferrer';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error(extractApiError(error).message);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={downloadFile}
      disabled={isDownloading}
      className="w-fit max-w-56 justify-start"
    >
      {isDownloading ? (
        <Download className="mr-2 h-4 w-4 animate-pulse" />
      ) : (
        <FileText className="mr-2 h-4 w-4" />
      )}
      <span className="truncate">{isDownloading ? 'Preparing...' : file.filename}</span>
    </Button>
  );
}
