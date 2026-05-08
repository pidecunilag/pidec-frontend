"use client";

import { useState } from "react";
import { ShieldCheck, ShieldX, RotateCcw, Search } from "lucide-react";

import {
  useAdminVerifications,
  useVerificationDecision,
} from "@/lib/hooks/use-admin";
import { DEPARTMENTS } from "@/lib/constants";
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import type {
  VerificationDecisionRequest,
  VerificationQueueItem,
} from "@/lib/types";

export default function VerificationsPage() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const params = {
    ...(search && { q: search }),
    ...(department !== "all" && { department }),
    ...(statusFilter !== "all" && {
      status: statusFilter as "pending" | "flagged",
    }),
  };

  const { data, isPending } = useAdminVerifications(
    Object.keys(params).length > 0 ? params : undefined,
  );
  const decision = useVerificationDecision();

  const [activeItem, setActiveItem] = useState<VerificationQueueItem | null>(
    null,
  );
  const [dialogType, setDialogType] = useState<
    "approve" | "reject" | "resubmit" | null
  >(null);
  const [rejectReason, setRejectReason] = useState("");

  const items = data?.data ?? [];

  function handleDecision() {
    if (!activeItem || !dialogType) return;

    let payload: VerificationDecisionRequest;
    if (dialogType === "approve") {
      payload = { decision: "approve" };
    } else if (dialogType === "reject") {
      payload = { decision: "reject", reason: rejectReason.trim() };
    } else {
      payload = { decision: "request_resubmission" };
    }

    decision.mutate(
      { userId: activeItem.id, data: payload },
      {
        onSettled: () => {
          setActiveItem(null);
          setDialogType(null);
          setRejectReason("");
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Verification Queue
        </h2>
        <p className="text-muted-foreground">
          Review pending and flagged student verifications.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or matric..."
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Queue List */}
      {isPending ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShieldCheck className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Queue is clear</h3>
          <p className="text-sm text-muted-foreground mt-1">
            No pending verifications to review right now.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border bg-card p-5 shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-base">{item.name}</h4>
                    <Badge
                      variant={
                        item.verificationStatus === "flagged"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {item.verificationStatus}
                    </Badge>
                    {item.verificationMethod && (
                      <Badge variant="outline" className="text-xs">
                        {item.verificationMethod}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.email}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mt-2">
                    <span>
                      <strong>Matric:</strong> {item.matricNumber}
                    </span>
                    <span>
                      <strong>Dept:</strong> {item.department}
                    </span>
                    <span>
                      <strong>Level:</strong> {item.level}
                    </span>
                    <span>
                      <strong>Attempts:</strong> {item.verificationAttempts}/3
                    </span>
                    {item.lastVerificationAttemptAt && (
                      <span>
                        <strong>Last attempt:</strong>{" "}
                        {new Date(
                          item.lastVerificationAttemptAt,
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => {
                      setActiveItem(item);
                      setDialogType("approve");
                    }}
                  >
                    <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setActiveItem(item);
                      setDialogType("reject");
                    }}
                  >
                    <ShieldX className="mr-1.5 h-3.5 w-3.5" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setActiveItem(item);
                      setDialogType("resubmit");
                    }}
                  >
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                    Re-upload
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Decision dialogs */}
      <ConfirmationDialog
        open={dialogType === "approve"}
        onOpenChange={(open) => !open && setDialogType(null)}
        title="Approve Verification"
        description={`Approve ${activeItem?.name}'s student verification? This grants full platform access.`}
        confirmLabel="Approve"
        onConfirm={handleDecision}
        isLoading={decision.isPending}
      />

      <ConfirmationDialog
        open={dialogType === "reject"}
        onOpenChange={(open) => !open && setDialogType(null)}
        title="Reject Verification"
        description={`Reject ${activeItem?.name}'s verification? They will need to re-upload their document.`}
        confirmLabel="Reject"
        onConfirm={handleDecision}
        isDestructive
        isLoading={decision.isPending}
        confirmDisabled={!rejectReason.trim()}
      >
        <div className="space-y-2">
          <Label htmlFor="reject-reason">Reason (visible to the student)</Label>
          <Textarea
            id="reject-reason"
            placeholder="e.g. Document was not a valid course form or exam docket."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
          />
        </div>
      </ConfirmationDialog>

      <ConfirmationDialog
        open={dialogType === "resubmit"}
        onOpenChange={(open) => !open && setDialogType(null)}
        title="Request Resubmission"
        description={`Ask ${activeItem?.name} to re-upload their verification document?`}
        confirmLabel="Request"
        onConfirm={handleDecision}
        isLoading={decision.isPending}
      />
    </div>
  );
}
