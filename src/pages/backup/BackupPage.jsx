/**
 * BackupPage.jsx
 * Admin — Database Backup & Restore (Head Branch only)
 *
 * Endpoints used:
 *  GET    /backup/list          → useBackups()
 *  POST   /backup/create        → useCreateBackup()
 *  POST   /backup/restore       → useRestoreBackup()
 *  DELETE /backup/:id           → useDeleteBackup()
 *  GET    /backup/download/:id  → useDownloadBackup()
 */

import { useState, useCallback } from "react";
import {
  HardDrive,
  Plus,
  Download,
  RotateCcw,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Shield,
  FileText,
  X,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";

import {
  useBackups,
  useCreateBackup,
  useDeleteBackup,
  useRestoreBackup,
  useDownloadBackup,
} from "@/hooks/backup/useBackup";

import { useConfirm } from "@/hooks/shared/useConfirm";
import { useDisclosure } from "@/hooks/shared/useDisclosure";

import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Loading";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { cn } from "@/utils/helpers/cn";
import { formatDateTime, formatRelative } from "@/utils/format/dateFormat";
import { formatFileSize } from "@/utils/format/numberFormat";

// ─────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────

function StatCard({ icon, label, value, color, bg }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center gap-3 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: bg, color }}
      >
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-none">
          {value}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {label}
        </p>
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-[72px] rounded-xl" />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// STATS BAR — derived from real backup list
// ─────────────────────────────────────────────────────────

function StatsBar({ backups = [] }) {
  const total = backups.length;

  // Total size in bytes (file_size from backend is bytes)
  const totalBytes = backups.reduce((sum, b) => sum + (b.file_size || 0), 0);

  // Latest backup
  const latest = backups[0]; // list is ORDER BY created_at DESC

  const stats = [
    {
      label: "Total Backups",
      value: total,
      color: "#6495ed",
      bg: "rgba(100,149,237,0.1)",
      icon: <Database className="w-4 h-4" />,
    },
    {
      label: "Total Size",
      value: totalBytes > 0 ? formatFileSize(totalBytes) : "—",
      color: "#22d3a5",
      bg: "rgba(34,211,165,0.1)",
      icon: <HardDrive className="w-4 h-4" />,
    },
    {
      label: "Last Backup",
      value: latest ? formatRelative(latest.createdAt) : "—",
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.1)",
      icon: <Clock className="w-4 h-4" />,
    },
    {
      label: "Status",
      value: total > 0 ? "Healthy" : "No backups",
      color: total > 0 ? "#22d3a5" : "#fbbf24",
      bg: total > 0 ? "rgba(34,211,165,0.1)" : "rgba(251,191,36,0.1)",
      icon: <CheckCircle className="w-4 h-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// CREATE BACKUP MODAL
// ─────────────────────────────────────────────────────────

function CreateBackupModal({ open, onClose }) {
  const [description, setDescription] = useState("");

  const { mutateAsync: createBackup, isPending } = useCreateBackup();

  const handleSubmit = async () => {
    await createBackup({ description: description.trim() || undefined });
    setDescription("");
    onClose();
  };

  const handleClose = () => {
    if (isPending) return;
    setDescription("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <HardDrive className="w-4 h-4 text-blue-500" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Create Database Backup
            </h3>
          </div>
          <button
            onClick={handleClose}
            disabled={isPending}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A snapshot of the current database will be saved securely on the
            server.
          </p>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description{" "}
              <span className="text-xs font-normal text-slate-400">
                (optional)
              </span>
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Before major update"
              disabled={isPending}
              maxLength={500}
            />
          </div>

          {/* Info box */}
          <div className="flex items-start gap-2.5 px-3 py-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-lg">
            <Shield className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Backup will include all tables, data, and schema. The process may
              take a few seconds.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleClose}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            {isPending ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Creating…
              </>
            ) : (
              <>
                <HardDrive className="w-3.5 h-3.5" />
                Create Backup
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// RESTORE MODAL
// ─────────────────────────────────────────────────────────

function RestoreModal({ open, onClose, backup }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const { mutateAsync: restoreBackup, isPending } = useRestoreBackup();

  const handleRestore = async () => {
    await restoreBackup({
      backupId: backup.id,
      confirmPassword: password,
    });
    handleClose();
  };

  const handleClose = () => {
    if (isPending) return;
    setPassword("");
    setShowPassword(false);
    setConfirmed(false);
    onClose();
  };

  if (!open || !backup) return null;

  const canSubmit = password.length > 0 && confirmed && !isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/50 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Restore Database
            </h3>
          </div>
          <button
            onClick={handleClose}
            disabled={isPending}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Warning */}
          <div className="flex items-start gap-2.5 px-3 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-red-700 dark:text-red-300">
                This action is irreversible
              </p>
              <p className="text-xs text-red-600 dark:text-red-400">
                All current data will be permanently replaced with this backup.
                Make sure to create a new backup before proceeding.
              </p>
            </div>
          </div>

          {/* Backup info */}
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 space-y-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Restoring from
            </p>
            <p className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 truncate">
              {backup.filename}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatDateTime(backup.createdAt)} ·{" "}
              {backup.file_size_mb
                ? `${backup.file_size_mb} MB`
                : formatFileSize(backup.file_size)}
            </p>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Admin Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
                placeholder="Enter your admin password"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-neutral-800 text-slate-900 dark:text-slate-100 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder:text-slate-400 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer">
            <div className="relative mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                className="sr-only"
                checked={confirmed}
                disabled={isPending}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              <div
                onClick={() => !isPending && setConfirmed((v) => !v)}
                className={cn(
                  "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors cursor-pointer",
                  confirmed
                    ? "bg-red-500 border-red-500"
                    : "border-slate-300 dark:border-slate-600",
                )}
              >
                {confirmed && (
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400">
              I understand this will permanently replace all current data and
              cannot be undone.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleClose}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleRestore}
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            {isPending ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Restoring…
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                Restore Database
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// TABLE ROW SKELETON
// ─────────────────────────────────────────────────────────

function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-52 rounded" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-32 rounded" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-16 rounded" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-3 w-16 rounded mt-1" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-24 rounded" />
      </td>
      <td className="px-4 py-3 text-right">
        <Skeleton className="h-7 w-20 rounded ml-auto" />
      </td>
    </tr>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────

export default function BackupPage() {
  // ── Data ──
  const { data: backups = [], isLoading, isError, refetch } = useBackups();

  // ── Mutations ──
  const { mutateAsync: deleteBackup, isPending: isDeleting } =
    useDeleteBackup();
  const { mutate: downloadBackup } = useDownloadBackup();

  // ── Modal state ──
  const createModal = useDisclosure();
  const deleteConfirm = useConfirm();

  // ── Restore target ──
  const [restoreTarget, setRestoreTarget] = useState(null);

  // ── Downloading state per-row ──
  const [downloadingId, setDownloadingId] = useState(null);

  // ── Handlers ──

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteConfirm.confirmData?.backup) return;
    await deleteBackup(deleteConfirm.confirmData.backup.id);
    deleteConfirm.handleCancel();
  }, [deleteConfirm, deleteBackup]);

  const handleDownload = useCallback(
    (backup) => {
      setDownloadingId(backup.id);
      downloadBackup(backup.id, {
        onSettled: () => setDownloadingId(null),
      });
    },
    [downloadBackup],
  );

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Database Backup
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage backups and restore points · Head Branch only
          </p>
        </div>
        <button
          onClick={createModal.onOpen}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Backup
        </button>
      </div>

      {/* ── Stats Bar ── */}
      {isLoading ? <StatsSkeleton /> : <StatsBar backups={backups} />}

      {/* ── Warning Banner ── */}
      <div className="flex items-start gap-3 px-4 py-3.5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-xl">
        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
            Important
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Restoring a backup will{" "}
            <strong>permanently replace all current data</strong>. Always create
            a fresh backup before restoring. Only head branch admins can perform
            these operations.
          </p>
        </div>
      </div>

      {/* ── Backup Table ── */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Available Backups
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {isLoading ? "…" : `${backups.length} backups`}
            </span>
            <button
              onClick={() => refetch()}
              className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Error state */}
        {isError && !isLoading && (
          <div className="px-4 py-10 text-center">
            <AlertTriangle className="w-8 h-8 mx-auto text-red-400 mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Failed to load backups
            </p>
            <button
              onClick={() => refetch()}
              className="mt-2 text-sm text-blue-500 hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Table */}
        {!isError && (
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                {[
                  "Filename",
                  "Description",
                  "Size",
                  "Created",
                  "Created By",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className={cn(
                      "px-4 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider",
                      h === "" ? "text-right" : "text-left",
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRowSkeleton key={i} />
                ))
              ) : backups.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <HardDrive className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      No backups found
                    </p>
                    <button
                      onClick={createModal.onOpen}
                      className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Create your first backup
                    </button>
                  </td>
                </tr>
              ) : (
                backups.map((backup, index) => (
                  <tr
                    key={backup.id}
                    className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30"
                  >
                    {/* Filename */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="font-mono text-xs text-slate-700 dark:text-slate-300 truncate max-w-[220px]">
                          {backup.filename}
                        </span>
                        {index === 0 && (
                          <span className="inline-flex items-center text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-1.5 py-0.5 rounded-full flex-shrink-0">
                            Latest
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {backup.description || (
                          <span className="text-slate-400 dark:text-slate-600">
                            —
                          </span>
                        )}
                      </span>
                    </td>

                    {/* Size */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {backup.file_size_mb
                          ? `${backup.file_size_mb} MB`
                          : formatFileSize(backup.file_size)}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-slate-700 dark:text-slate-300">
                        {formatDateTime(backup.createdAt)}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">
                        {formatRelative(backup.createdAt)}
                      </div>
                    </td>

                    {/* Created By */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {backup.created_by?.name ||
                          backup.created_by?.username ||
                          "—"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Download */}
                        <button
                          onClick={() => handleDownload(backup)}
                          disabled={downloadingId === backup.id}
                          className="w-7 h-7 rounded-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 dark:hover:text-blue-400 transition-all disabled:opacity-50"
                          title="Download"
                        >
                          {downloadingId === backup.id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Restore */}
                        <button
                          onClick={() => setRestoreTarget(backup)}
                          className="w-7 h-7 rounded-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-500 dark:hover:text-amber-400 transition-all"
                          title="Restore"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => deleteConfirm.onConfirm({ backup })}
                          className="w-7 h-7 rounded-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modals ── */}

      <CreateBackupModal
        open={createModal.isOpen}
        onClose={createModal.onClose}
      />

      <RestoreModal
        open={!!restoreTarget}
        backup={restoreTarget}
        onClose={() => setRestoreTarget(null)}
      />

      <ConfirmDialog
        open={deleteConfirm.isOpen}
        onClose={deleteConfirm.handleCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Backup"
        message={`Are you sure you want to delete "${deleteConfirm.confirmData?.backup?.filename}"? The file will be permanently removed from the server.`}
        confirmText="Delete Backup"
        loading={isDeleting}
        variant="danger"
      />
    </div>
  );
}
