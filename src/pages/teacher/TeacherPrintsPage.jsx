/**
 * Teacher Prints Page
 * View print history and manage PDFs
 *
 * FEATURES:
 * - Stats cards (total prints, this month, PDFs uploaded)
 * - Filters: search, date range, module filter
 * - Print history table with pagination
 * - Upload PDF modal
 * - Download/Delete PDF actions
 * - Export to Excel
 */

import { useState, useMemo, useCallback } from "react";
import { FileText, Download, Trash2, Upload, Calendar, Search, X, CheckCircle, AlertCircle, FileUp } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useMyPrints, useUploadCertificatePdf, useDownloadCertificatePdf, useDeleteCertificatePdf, useTeacherModules } from "@/hooks";

import { useExportMyPrints } from "@/hooks/certificate/useExportPrints";
import { useDisclosure } from "@/hooks/shared/useDisclosure";
import { useConfirm } from "@/hooks/shared/useConfirm";
import { useDebounce } from "@/hooks/shared/useDebounce";

import { Modal, ModalFooter } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Skeleton } from "@/components/ui/Loading";
import { Pagination } from "@/components/ui/Pagination";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { cn } from "@/utils/helpers/cn";
import { formatDate, formatDateTime } from "@/utils/format/dateFormat";
import { formatCertificateNumber } from "@/utils/format/certificateFormat";

// ─────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────

const PAGE_LIMIT = 20;

const uploadPdfSchema = z.object({
  pdf: z
    .custom((val) => val instanceof FileList && val.length > 0, {
      message: "Please select a file",
    })
    .refine((val) => val[0]?.type === "application/pdf", {
      message: "File must be PDF",
    })
    .refine((val) => val[0]?.size <= 10 * 1024 * 1024, {
      message: "File size must not exceed 10MB",
    }),
});

// ─────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────

function StatsBar({ prints = [], currentMonth = 0, pdfsUploaded = 0 }) {
  const total = prints.length;

  const stats = [
    {
      label: "Total Prints",
      value: total,
      color: "#6495ed",
      bg: "rgba(100,149,237,0.1)",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      label: "This Month",
      value: currentMonth,
      color: "#22d3a5",
      bg: "rgba(34,211,165,0.1)",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      label: "PDFs Uploaded",
      value: `${pdfsUploaded} / ${total}`,
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.1)",
      icon: <CheckCircle className="w-4 h-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
      {stats.map((s) => (
        <div key={s.label} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg, color: s.color }}>
            {s.icon}
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-none">{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-[72px] rounded-xl" />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// UPLOAD PDF MODAL
// ─────────────────────────────────────────────────────────

function UploadPdfModal({ open, onClose, printRecord, onUpload }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(uploadPdfSchema),
  });

  const selectedFile = useWatch({ control, name: "pdf" });

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const onSubmit = async (data) => {
    try {
      await onUpload(printRecord.id, data.pdf[0]);
      handleClose();
    } catch {
      // Error handled by mutation
    }
  };

  if (!printRecord) return null;

  return (
    <Modal open={open} onClose={handleClose} title="Upload Certificate PDF" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Certificate Info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Certificate:</span>
              <p className="font-mono font-semibold text-cyan-700 dark:text-cyan-300">{formatCertificateNumber(printRecord.certificate_number)}</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Student:</span>
              <p className="font-medium text-slate-900 dark:text-slate-100">{printRecord.student_name}</p>
            </div>
          </div>
        </div>

        {/* File Input */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            PDF File <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              {...register("pdf")}
              type="file"
              accept="application/pdf"
              className={cn(
                "block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-950 dark:file:text-blue-300 dark:hover:file:bg-blue-900 cursor-pointer",
                errors.pdf && "border-red-500",
              )}
            />
          </div>
          {errors.pdf && <p className="text-xs text-red-600 dark:text-red-400">{errors.pdf.message}</p>}
          {selectedFile && selectedFile[0] && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Selected: {selectedFile[0].name} ({(selectedFile[0].size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
          <p className="text-xs text-slate-400 dark:text-slate-500">Maximum file size: 10MB</p>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
          <ModalFooter onCancel={handleClose} confirmText="Upload PDF" confirmLoading={isSubmitting} confirmType="submit" />
        </div>
      </form>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────
// TABLE ROW SKELETON
// ─────────────────────────────────────────────────────────

function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-6 py-4">
        <Skeleton className="h-5 w-20" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-32" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-5 w-20" />
      </td>
      <td className="px-6 py-4 text-right">
        <Skeleton className="h-6 w-24 ml-auto" />
      </td>
    </tr>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────

export default function TeacherPrintsPage() {
  // ── Filters ──
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [moduleId, setModuleId] = useState("");

  // ── Pagination ──
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  // ── Data ──
  const { data: printsData, isLoading: isLoadingPrints } = useMyPrints({
    search: debouncedSearch,
    startDate,
    endDate,
    moduleId: moduleId ? Number(moduleId) : undefined,
    page,
    limit: PAGE_LIMIT,
  });

  const { data: modules = [], isLoading: isLoadingModules } = useTeacherModules();

  // FIX: wrap prints dalam useMemo agar referensi stabil
  const prints = useMemo(() => printsData?.prints || [], [printsData]);
  const pagination = printsData?.pagination || null;

  // ── Mutations ──
  const { mutateAsync: uploadPdf } = useUploadCertificatePdf();
  const { mutateAsync: downloadPdf, isPending: isDownloading } = useDownloadCertificatePdf();
  const { mutateAsync: deletePdf, isPending: isDeleting } = useDeleteCertificatePdf();
  const { mutate: exportPrints, isPending: isExporting } = useExportMyPrints();

  // ── Modal states ──
  const uploadModal = useDisclosure();
  const deleteConfirm = useConfirm();

  // ── Selected ──
  const [selectedPrint, setSelectedPrint] = useState(null);

  // ── Stats calculation ──
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = prints.filter((p) => {
      const printDate = new Date(p.created_at);
      return printDate.getMonth() === now.getMonth() && printDate.getFullYear() === now.getFullYear();
    }).length;

    const pdfsUploaded = prints.filter((p) => p.pdf_path).length;

    return { currentMonth, pdfsUploaded };
  }, [prints]);

  // ─── Handlers ───

  const handleUploadClick = useCallback(
    (print) => {
      setSelectedPrint(print);
      uploadModal.onOpen();
    },
    [uploadModal],
  );

  const handleUpload = useCallback(
    async (printId, file) => {
      await uploadPdf({ printId, file });
    },
    [uploadPdf],
  );

  const handleDownload = useCallback(
    async (printId) => {
      await downloadPdf(printId);
    },
    [downloadPdf],
  );

  const handleDeleteClick = useCallback(
    (print) => {
      deleteConfirm.onConfirm({ print });
    },
    [deleteConfirm],
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteConfirm.confirmData?.print) return;
    await deletePdf(deleteConfirm.confirmData.print.id);
    deleteConfirm.handleCancel();
  }, [deleteConfirm, deletePdf]);

  const handleExport = useCallback(() => {
    exportPrints({
      search: debouncedSearch,
      startDate,
      endDate,
      moduleId: moduleId ? Number(moduleId) : undefined,
    });
  }, [exportPrints, debouncedSearch, startDate, endDate, moduleId]);

  const handleClearFilters = useCallback(() => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setModuleId("");
    setPage(1);
  }, []);

  const hasActiveFilters = search || startDate || endDate || moduleId;
  const isLoading = isLoadingPrints || isLoadingModules;

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Print History</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View your certificate print history and manage PDFs</p>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting || prints.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          {isExporting ? "Exporting..." : "Export"}
        </button>
      </div>

      {/* ── Stats Bar ── */}
      {isLoading ? <StatsSkeleton /> : <StatsBar prints={prints} currentMonth={stats.currentMonth} pdfsUploaded={stats.pdfsUploaded} />}

      {/* ── Filters ── */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Search */}
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search student or certificate..."
            leftIcon={<Search className="w-4 h-4" />}
          />

          {/* Module Filter */}
          <div className="relative">
            <select
              value={moduleId}
              onChange={(e) => {
                setModuleId(e.target.value);
                setPage(1);
              }}
              className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 pr-8 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Modules</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.module_code} - {m.name}
                </option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {/* Date Range */}
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={(date) => {
            setStartDate(date);
            setPage(1);
          }}
          onEndDateChange={(date) => {
            setEndDate(date);
            setPage(1);
          }}
          onClear={handleClearFilters}
        />

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-3 h-3" />
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                {["Certificate", "Student", "Module", "PTC Date", "Printed", "PDF", ""].map((h) => (
                  <th key={h} className={cn("px-6 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider", h === "" ? "text-right" : "text-left")}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {isLoading ? (
                Array.from({ length: PAGE_LIMIT }).map((_, i) => <TableRowSkeleton key={i} />)
              ) : prints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <FileText className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{hasActiveFilters ? "No prints match the current filters" : "No print history found"}</p>
                  </td>
                </tr>
              ) : (
                prints.map((print) => (
                  <tr key={print.id} className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    {/* Certificate Number */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-950/50 border border-cyan-300 dark:border-cyan-800/30 px-2 py-1 rounded-md">
                        {formatCertificateNumber(print.certificate_number)}
                      </span>
                    </td>

                    {/* Student Name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{print.student_name}</span>
                    </td>

                    {/* Module */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{print.module_code || "-"}</span>
                    </td>

                    {/* PTC Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{formatDate(print.ptc_date)}</span>
                    </td>

                    {/* Print Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs text-slate-500 dark:text-slate-400">{formatDateTime(print.created_at)}</span>
                    </td>

                    {/* PDF Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {print.pdf_path ? (
                        <Badge variant="success" size="sm">
                          <CheckCircle className="w-3 h-3" />
                          Uploaded
                        </Badge>
                      ) : (
                        <Badge variant="warning" size="sm">
                          <AlertCircle className="w-3 h-3" />
                          Not Uploaded
                        </Badge>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {print.pdf_path ? (
                          <>
                            {/* Download */}
                            <button
                              onClick={() => handleDownload(print.id)}
                              disabled={isDownloading}
                              className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors disabled:opacity-50"
                              title="Download PDF"
                            >
                              Download
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteClick(print)}
                              disabled={isDeleting}
                              className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors disabled:opacity-50"
                              title="Delete PDF"
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          /* Upload */
                          <button
                            onClick={() => handleUploadClick(print)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                          >
                            <Upload className="w-3 h-3" />
                            Upload PDF
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {!isLoading && pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700">
            <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} showInfo totalItems={pagination.total} itemsPerPage={pagination.limit} />
          </div>
        )}
      </div>

      {/* ── Modals ── */}

      <UploadPdfModal open={uploadModal.isOpen} onClose={uploadModal.onClose} printRecord={selectedPrint} onUpload={handleUpload} />

      <ConfirmDialog
        open={deleteConfirm.isOpen}
        onClose={deleteConfirm.handleCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete PDF"
        message={`Are you sure you want to delete the PDF for certificate "${formatCertificateNumber(deleteConfirm.confirmData?.print?.certificate_number)}"? This action cannot be undone.`}
        confirmText="Delete PDF"
        loading={isDeleting}
        variant="danger"
      />
    </div>
  );
}
