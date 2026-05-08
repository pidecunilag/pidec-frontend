"use client";

import { useState } from "react";
import { Search, ShieldBan, ShieldCheck } from "lucide-react";

import {
  useAdminStudents,
  useSuspendStudent,
  useUnsuspendStudent,
} from "@/lib/hooks/use-admin";
import { DEPARTMENTS } from "@/lib/constants";
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { User } from "@/lib/types";

const STATUS_COLORS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  verified: "default",
  pending: "secondary",
  rejected: "destructive",
  flagged: "outline",
};

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [verStatus, setVerStatus] = useState("all");

  const params = {
    ...(search && { q: search }),
    ...(department !== "all" && { department }),
    ...(verStatus !== "all" && { verificationStatus: verStatus }),
  };

  const { data, isPending } = useAdminStudents(
    Object.keys(params).length > 0 ? params : undefined,
  );
  const suspend = useSuspendStudent();
  const unsuspend = useUnsuspendStudent();

  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [action, setAction] = useState<"suspend" | "unsuspend" | null>(null);
  const [suspendReason, setSuspendReason] = useState("");

  const students = data?.data ?? [];

  function handleAction() {
    if (!targetUser || !action) return;
    if (action === "suspend") {
      suspend.mutate(
        { userId: targetUser.id, data: { reason: suspendReason.trim() } },
        {
          onSettled: () => {
            setTargetUser(null);
            setAction(null);
            setSuspendReason("");
          },
        },
      );
    } else {
      unsuspend.mutate(targetUser.id, {
        onSettled: () => {
          setTargetUser(null);
          setAction(null);
        },
      });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Student Directory</h2>
        <p className="text-muted-foreground">
          Manage all registered students. Search, filter, and take action.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or matric..."
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
        <Select value={verStatus} onValueChange={setVerStatus}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold">No students found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Matric</th>
                  <th className="text-left px-4 py-3 font-medium">
                    Department
                  </th>
                  <th className="text-left px-4 py-3 font-medium">Level</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {students.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {s.matricNumber}
                    </td>
                    <td className="px-4 py-3">{s.department}</td>
                    <td className="px-4 py-3">{s.level}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          STATUS_COLORS[s.verificationStatus] ?? "secondary"
                        }
                      >
                        {s.verificationStatus}
                      </Badge>
                      {s.isSuspended && (
                        <Badge variant="destructive" className="ml-1">
                          Suspended
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {s.isSuspended ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setTargetUser(s);
                            setAction("unsuspend");
                          }}
                        >
                          <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                          Unsuspend
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setTargetUser(s);
                            setAction("suspend");
                          }}
                        >
                          <ShieldBan className="mr-1.5 h-3.5 w-3.5" />
                          Suspend
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmationDialog
        open={action === "suspend"}
        onOpenChange={(open) => !open && setAction(null)}
        title="Suspend Student"
        description={`Suspend ${targetUser?.name}? They will lose platform access.`}
        confirmLabel="Suspend"
        onConfirm={handleAction}
        isDestructive
        isLoading={suspend.isPending}
        confirmDisabled={!suspendReason.trim()}
      >
        <div className="space-y-2">
          <Label htmlFor="suspend-reason">Reason (logged to AdminLog)</Label>
          <Textarea
            id="suspend-reason"
            placeholder="e.g. Suspected duplicate account."
            value={suspendReason}
            onChange={(e) => setSuspendReason(e.target.value)}
            rows={3}
          />
        </div>
      </ConfirmationDialog>

      <ConfirmationDialog
        open={action === "unsuspend"}
        onOpenChange={(open) => !open && setAction(null)}
        title="Unsuspend Student"
        description={`Restore access for ${targetUser?.name}?`}
        confirmLabel="Unsuspend"
        onConfirm={handleAction}
        isLoading={unsuspend.isPending}
      />
    </div>
  );
}
