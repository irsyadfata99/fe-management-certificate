/**
 * Certificate Logs Page (Admin)
 * View all certificate-related activities
 *
 * FEATURES:
 * ✅ View all certificate logs with pagination
 * ✅ Filter by action type (bulk_create, migrate, reserve, print, release)
 * ✅ Filter by date range (with DateRangePicker)
 * ✅ Search by certificate number (with debounce)
 * ✅ Export logs to Excel
 * ✅ Pagination (20 items per page) - LIKE CertificatesPage
 * ✅ Responsive design (mobile-friendly)
 * ✅ Loading & empty states
 */

import { useState } from "react";
import { Download, Search, Filter } from "lucide-react";

// Hooks
import { useCertificateLogs, useExportCertificateLogs } from "@/hooks";
import { useDebounce } from "@/hooks/shared/useDebounce";

// UI Components
import {
  Button,
  Input,
  Select,
  Badge,
  Spinner,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
  Pagination,
} from "@/components/ui";
import {
  DateRangePicker,
  DateRangeDisplay,
} from "@/components/ui/DateRangePicker";

// Utils
import { cn } from "@/utils/helpers/cn";
import { formatDateTime } from "@/utils/format/dateFormat";
import { formatCertificateNumber } from "@/utils/format/certificateFormat";
import {
  ACTION_TYPE_LABELS,
  ACTION_TYPE_VARIANTS,
} from "@/utils/constants/status";

// ============================================================================
// ACTION BADGE COMPONENT
// ============================================================================
function ActionBadge({ actionType }) {
  const label = ACTION_TYPE_LABELS[actionType] || actionType;
  const variant =
    ACTION_TYPE_VARIANTS[actionType] || "bg-gray-100 text-gray-800";

  return (
    <Badge size="sm" className={cn("font-medium", variant)}>
      {label}
    </Badge>
  );
}

// ============================================================================
// FILTERS COMPONENT
// ============================================================================
function LogFilters({ filters, setFilters }) {
  const [localStartDate, setLocalStartDate] = useState(filters.startDate || "");
  const [localEndDate, setLocalEndDate] = useState(filters.endDate || "");

  const handleApplyDateRange = () => {
    setFilters({
      ...filters,
      startDate: localStartDate,
      endDate: localEndDate,
      page: 1,
    });
  };

  const handleClearDateRange = () => {
    setLocalStartDate("");
    setLocalEndDate("");
    setFilters({
      ...filters,
      startDate: "",
      endDate: "",
      page: 1,
    });
  };

  return (
    <div className="glass-card-auto p-4 space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            Filters
          </h3>
        </div>
        {(filters.actionType ||
          filters.startDate ||
          filters.endDate ||
          filters.certificateNumber) && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              setFilters({
                actionType: "",
                startDate: "",
                endDate: "",
                certificateNumber: "",
                page: 1,
                limit: 8,
              })
            }
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Action Type Filter */}
        <Select
          value={filters.actionType}
          onChange={(e) =>
            setFilters({
              ...filters,
              actionType: e.target.value,
              page: 1,
            })
          }
        >
          <option value="">All Actions</option>
          <option value="bulk_create">Bulk Create</option>
          <option value="migrate">Migrate</option>
          <option value="reserve">Reserve</option>
          <option value="print">Print</option>
          <option value="release">Release</option>
        </Select>

        {/* Date Range Picker */}
        <div className="md:col-span-2">
          <DateRangePicker
            startDate={localStartDate}
            endDate={localEndDate}
            onStartDateChange={setLocalStartDate}
            onEndDateChange={setLocalEndDate}
            onClear={handleClearDateRange}
            onApply={handleApplyDateRange}
          />
        </div>

        {/* Search by Certificate Number */}
        <Input
          placeholder="Search certificate..."
          value={filters.certificateNumber}
          onChange={(e) =>
            setFilters({
              ...filters,
              certificateNumber: e.target.value,
              page: 1,
            })
          }
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Active Filters Display */}
      {(filters.startDate || filters.endDate) && (
        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
          <DateRangeDisplay
            startDate={filters.startDate}
            endDate={filters.endDate}
          />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// LOGS TABLE COMPONENT - ✅ PAGINATION LIKE CertificatesPage
// ============================================================================
function LogsTable({ filters, setFilters }) {
  const debouncedSearch = useDebounce(filters.certificateNumber, 300);
  const { data, isLoading } = useCertificateLogs({
    ...filters,
    certificateNumber: debouncedSearch,
  });

  const logs = data?.logs || [];
  const pagination = data?.pagination || {
    total: 0,
    totalPages: 1,
    page: 1,
  };

  return (
    <div className="glass-card-auto overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Actor</TableHead>
            <TableHead>Certificate</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <div className="py-8">
                  <Spinner size="lg" className="mx-auto" />
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    Loading logs...
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : logs.length === 0 ? (
            <TableEmpty
              message="No logs found. Try adjusting your filters."
              colSpan={5}
            />
          ) : (
            logs.map((log) => (
              <TableRow key={log.id}>
                {/* Date & Time */}
                <TableCell>
                  <span className="text-sm text-neutral-900 dark:text-neutral-100">
                    {formatDateTime(log.createdAt)}
                  </span>
                </TableCell>

                {/* Action */}
                <TableCell>
                  <ActionBadge actionType={log.action_type} />
                </TableCell>

                {/* Actor */}
                <TableCell>
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {log.actor_name || log.actor_username || "-"}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 capitalize">
                      {log.actor_role}
                    </p>
                  </div>
                </TableCell>

                {/* Certificate */}
                <TableCell>
                  <span className="font-mono text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {log.certificate_number
                      ? formatCertificateNumber(log.certificate_number)
                      : "-"}
                  </span>
                </TableCell>

                {/* Details */}
                <TableCell>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    {/* Print Details */}
                    {log.action_type === "print" && log.metadata && (
                      <div>
                        <p>Student: {log.metadata.student_name || "-"}</p>
                        <p className="text-xs">
                          Module: {log.metadata.module_name || "-"}
                        </p>
                      </div>
                    )}

                    {/* Bulk Create Details */}
                    {log.action_type === "bulk_create" && log.metadata && (
                      <p>Created {log.metadata.count || 0} certificates</p>
                    )}

                    {/* Migrate Details */}
                    {log.action_type === "migrate" && (
                      <div>
                        <p>
                          From:{" "}
                          {log.from_branch_name
                            ? `${log.from_branch_code} - ${log.from_branch_name}`
                            : "-"}
                        </p>
                        <p>
                          To:{" "}
                          {log.to_branch_name
                            ? `${log.to_branch_code} - ${log.to_branch_name}`
                            : "-"}
                        </p>
                      </div>
                    )}

                    {/* Default */}
                    {!["print", "bulk_create", "migrate"].includes(
                      log.action_type,
                    ) && <span>-</span>}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* ✅ PAGINATION - ALWAYS SHOW IF THERE'S DATA (Like CertificatesPage) */}
      {!isLoading && logs.length > 0 && pagination && (
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700">
          <Pagination
            currentPage={pagination.page}
            totalPages={
              pagination.totalPages ||
              Math.ceil(pagination.total / filters.limit) ||
              1
            }
            onPageChange={(page) => setFilters({ ...filters, page })}
            totalItems={pagination.total}
            itemsPerPage={filters.limit}
          />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function CertificateLogsPage() {
  const [filters, setFilters] = useState({
    actionType: "",
    startDate: "",
    endDate: "",
    certificateNumber: "",
    page: 1,
    limit: 8,
  });

  const { mutate: exportLogs, isPending: isExporting } =
    useExportCertificateLogs();

  const handleExport = () => {
    exportLogs({
      actionType: filters.actionType,
      startDate: filters.startDate,
      endDate: filters.endDate,
      certificateNumber: filters.certificateNumber,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Certificate Logs & History
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Track all certificate activities and migrations
          </p>
        </div>
        <Button
          onClick={handleExport}
          leftIcon={<Download className="w-4 h-4" />}
          disabled={isExporting}
          loading={isExporting}
        >
          {isExporting ? "Exporting..." : "Export Logs"}
        </Button>
      </div>

      {/* Filters */}
      <LogFilters filters={filters} setFilters={setFilters} />

      {/* Logs Table */}
      <LogsTable filters={filters} setFilters={setFilters} />
    </div>
  );
}
