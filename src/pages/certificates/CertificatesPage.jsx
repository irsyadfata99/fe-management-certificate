/**
 * Certificates Page (Admin Only)
 * Main certificate management page
 *
 * ✅ FIXES:
 * - Stats cards calculation from stockData (flatten stock properly)
 * - Better error handling
 * - Loading states
 * - Search functionality
 * - Proper pagination
 * - Fixed console.log in JSX (removed)
 * - Fixed migrate validation
 *
 * FEATURES:
 * - Stats cards (Total, In Stock, Reserved, Printed) - REAL DATA
 * - List all certificates with filters
 * - Bulk create certificates (range input)
 * - Migrate certificates to another branch
 * - Filter by status (in_stock, reserved, printed, migrated)
 * - Filter by branch
 * - Search by certificate number
 * - View certificate details
 * - Pagination (8 items per page)
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  ArrowRightLeft,
  Download,
  Package,
  Clock,
  Printer,
  Archive,
  Search,
} from "lucide-react";
import { toast } from "sonner";

// Hooks
import {
  useCertificates,
  useCertificateStock,
  useBulkCreateCertificates,
  useMigrateCertificates,
  useBranches,
} from "@/hooks";

// UI Components
import {
  Button,
  Input,
  Select,
  Modal,
  ModalFooter,
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
  FormField,
  FormLabel,
} from "@/components/ui";

// Validation
import {
  bulkCreateCertificatesSchema,
  migrateCertificatesSchema,
} from "@/utils/validation/certificateValidation";

// Utils
import { cn } from "@/utils/helpers/cn";
import {
  formatCertificateNumber,
  getCertificateCount,
  formatCertificateRange,
} from "@/utils/format/certificateFormat";
import { formatDate } from "@/utils/format/dateFormat";
import { getCertificateStatusLabel } from "@/utils/constants/status";

// ============================================================================
// STATS CARDS COMPONENT
// ============================================================================
function StatsCards({ stats, isLoading }) {
  const statCards = [
    {
      label: "Total Certificates",
      value: stats.total,
      icon: Package,
      color: "blue",
      bgColor: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "In Stock",
      value: stats.in_stock,
      icon: Archive,
      color: "green",
      bgColor: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "Reserved",
      value: stats.reserved,
      icon: Clock,
      color: "yellow",
      bgColor: "bg-yellow-100 dark:bg-yellow-900",
      iconColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      label: "Printed",
      value: stats.printed,
      icon: Printer,
      color: "purple",
      bgColor: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="glass-card-auto overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      stat.bgColor,
                    )}
                  >
                    <Icon className={cn("w-6 h-6", stat.iconColor)} />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-neutral-600 dark:text-neutral-400 truncate">
                      {stat.label}
                    </dt>
                    <dd className="flex items-baseline">
                      {isLoading ? (
                        <div className="h-8 w-20 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                      ) : (
                        <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                          {stat.value.toLocaleString()}
                        </div>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// FILTERS COMPONENT
// ============================================================================
function CertificateFilters({
  filters,
  setFilters,
  branches,
  isLoadingBranches,
}) {
  return (
    <div className="glass-card-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <Input
          placeholder="Search certificate number..."
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value, page: 1 })
          }
          leftIcon={<Search className="w-4 h-4" />}
        />

        {/* Status Filter */}
        <Select
          value={filters.status}
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value, page: 1 })
          }
        >
          <option value="">All Status</option>
          <option value="in_stock">Available</option>
          <option value="reserved">Reserved</option>
          <option value="printed">Printed</option>
          <option value="migrated">Migrated</option>
        </Select>

        {/* Branch Filter */}
        <Select
          value={filters.currentBranchId}
          onChange={(e) =>
            setFilters({
              ...filters,
              currentBranchId: e.target.value,
              page: 1,
            })
          }
          disabled={isLoadingBranches}
        >
          <option value="">All Branches</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name} ({branch.code})
            </option>
          ))}
        </Select>

        {/* Clear Filters */}
        <Button
          variant="secondary"
          onClick={() =>
            setFilters({
              status: "",
              currentBranchId: "",
              search: "",
              page: 1,
              limit: 8,
            })
          }
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// BULK CREATE MODAL
// ============================================================================
function BulkCreateModal({ isOpen, onClose, onSubmit, isCreating }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(bulkCreateCertificatesSchema),
  });

  const startNumber = watch("startNumber");
  const endNumber = watch("endNumber");
  const previewCount =
    startNumber && endNumber ? getCertificateCount(startNumber, endNumber) : 0;

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Bulk Create Certificates"
      description="Create multiple certificates in a range"
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Start Number */}
        <FormField>
          <FormLabel required>Start Number</FormLabel>
          <Input
            type="number"
            {...register("startNumber", { valueAsNumber: true })}
            placeholder="e.g., 1"
            error={!!errors.startNumber}
            helperText={errors.startNumber?.message}
          />
        </FormField>

        {/* End Number */}
        <FormField>
          <FormLabel required>End Number</FormLabel>
          <Input
            type="number"
            {...register("endNumber", { valueAsNumber: true })}
            placeholder="e.g., 100"
            error={!!errors.endNumber}
            helperText={errors.endNumber?.message}
          />
        </FormField>

        {/* Preview */}
        {previewCount > 0 && (
          <div className="p-4 bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-lg">
            <p className="text-sm text-primary-900 dark:text-primary-100">
              <span className="font-semibold">Preview:</span> Will create{" "}
              <span className="font-bold">{previewCount}</span> certificates
            </p>
            <p className="text-xs text-primary-700 dark:text-primary-300 mt-1">
              Range: {formatCertificateRange(startNumber, endNumber)}
            </p>
          </div>
        )}

        {/* Footer */}
        <ModalFooter
          onCancel={handleClose}
          onConfirm={handleSubmit(handleFormSubmit)}
          cancelText="Cancel"
          confirmText="Create Certificates"
          confirmLoading={isCreating}
          confirmDisabled={isCreating || previewCount === 0}
        />
      </form>
    </Modal>
  );
}

// ============================================================================
// MIGRATE MODAL
// ============================================================================
function MigrateModal({
  isOpen,
  onClose,
  onSubmit,
  isMigrating,
  branches,
  isLoadingBranches,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(migrateCertificatesSchema),
  });

  const startNumber = watch("startNumber");
  const endNumber = watch("endNumber");
  const toBranchId = watch("toBranchId");
  const previewCount =
    startNumber && endNumber ? getCertificateCount(startNumber, endNumber) : 0;

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Migrate Certificates"
      description="Move certificates to another branch"
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Start Number */}
        <FormField>
          <FormLabel required>Start Number</FormLabel>
          <Input
            type="number"
            {...register("startNumber", { valueAsNumber: true })}
            placeholder="e.g., 1"
            error={!!errors.startNumber}
            helperText={errors.startNumber?.message}
          />
        </FormField>

        {/* End Number */}
        <FormField>
          <FormLabel required>End Number</FormLabel>
          <Input
            type="number"
            {...register("endNumber", { valueAsNumber: true })}
            placeholder="e.g., 50"
            error={!!errors.endNumber}
            helperText={errors.endNumber?.message}
          />
        </FormField>

        {/* Target Branch */}
        <FormField>
          <FormLabel required>Target Branch</FormLabel>
          <Select
            {...register("toBranchId", { valueAsNumber: true })}
            defaultValue=""
            error={!!errors.toBranchId}
            helperText={errors.toBranchId?.message}
            disabled={isLoadingBranches}
          >
            <option value="">Select target branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name} ({branch.code})
              </option>
            ))}
          </Select>
        </FormField>

        {/* Preview */}
        {previewCount > 0 && (
          <div className="p-4 bg-warning-50 dark:bg-warning-950 border border-warning-200 dark:border-warning-800 rounded-lg">
            <p className="text-sm text-warning-900 dark:text-warning-100">
              <span className="font-semibold">Preview:</span> Will migrate{" "}
              <span className="font-bold">{previewCount}</span> certificates
            </p>
            <p className="text-xs text-warning-700 dark:text-warning-300 mt-1">
              Range: {formatCertificateRange(startNumber, endNumber)}
            </p>
          </div>
        )}

        {/* Footer */}
        <ModalFooter
          onCancel={handleClose}
          onConfirm={handleSubmit(handleFormSubmit)}
          cancelText="Cancel"
          confirmText="Migrate Certificates"
          confirmLoading={isMigrating}
          confirmDisabled={isMigrating || previewCount === 0 || !toBranchId}
          confirmVariant="primary"
        />
      </form>
    </Modal>
  );
}

// ============================================================================
// CERTIFICATE TABLE
// ============================================================================
function CertificateTable({
  certificates,
  isLoading,
  pagination,
  filters,
  setFilters,
}) {
  // Status badge variant mapping
  const getStatusBadge = (status) => {
    const variants = {
      in_stock: "success",
      reserved: "warning",
      printed: "info",
      migrated: "default",
    };

    return (
      <Badge variant={variants[status] || "default"} size="sm">
        {getCertificateStatusLabel(status)}
      </Badge>
    );
  };

  return (
    <div className="glass-card-auto overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Certificate Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Current Branch</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <div className="py-8">
                  <Spinner size="lg" className="mx-auto" />
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    Loading certificates...
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : certificates.length === 0 ? (
            <TableEmpty
              message="No certificates found. Try adjusting your filters."
              colSpan={5}
            />
          ) : (
            certificates.map((cert) => (
              <TableRow key={cert.id}>
                <TableCell>
                  <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
                    {formatCertificateNumber(cert.certificate_number)}
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(cert.status)}</TableCell>
                <TableCell>
                  <span className="text-neutral-900 dark:text-neutral-100">
                    {cert.current_branch_name || "-"}
                  </span>
                </TableCell>
                <TableCell>
                  {cert.status === "reserved" && cert.reserved_by && (
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Reserved by: {cert.reserved_by}
                    </span>
                  )}
                  {cert.status === "printed" && cert.student_name && (
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Student: {cert.student_name}
                    </span>
                  )}
                  {cert.status === "migrated" && cert.migrated_to && (
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Migrated to: {cert.migrated_to}
                    </span>
                  )}
                  {cert.status === "in_stock" && (
                    <span className="text-sm text-neutral-500 dark:text-neutral-500">
                      -
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {formatDate(cert.updatedAt)}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination - Always show if there's data */}
      {!isLoading && certificates.length > 0 && pagination && (
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
export default function CertificatesPage() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [filters, setFilters] = useState({
    status: "",
    currentBranchId: "",
    search: "",
    page: 1,
    limit: 8,
  });

  // Modal states
  const [bulkCreateModalOpen, setBulkCreateModalOpen] = useState(false);
  const [migrateModalOpen, setMigrateModalOpen] = useState(false);

  // ============================================================================
  // API HOOKS - FETCH DATA
  // ============================================================================
  const { data: certificatesData, isLoading } = useCertificates(filters);
  const { data: stockData, isLoading: isLoadingStock } = useCertificateStock();
  const { data: branchesData, isLoading: isLoadingBranches } = useBranches({
    includeInactive: false,
  });

  // ✅ Extract data properly
  const branches = branchesData?.branches || [];
  const certificates = certificatesData?.certificates || [];
  const pagination = certificatesData?.pagination || {
    total: 0,
    totalPages: 1,
    page: 1,
  };

  // ✅ FIX: Calculate stats from REAL stock data (flatten properly)
  const stats = {
    total: stockData?.reduce((sum, s) => sum + (s.total || 0), 0) || 0,
    in_stock: stockData?.reduce((sum, s) => sum + (s.in_stock || 0), 0) || 0,
    reserved: stockData?.reduce((sum, s) => sum + (s.reserved || 0), 0) || 0,
    printed: stockData?.reduce((sum, s) => sum + (s.printed || 0), 0) || 0,
  };

  // ============================================================================
  // API HOOKS - MUTATIONS
  // ============================================================================
  const { mutate: bulkCreate, isPending: isCreating } =
    useBulkCreateCertificates();
  const { mutate: migrate, isPending: isMigrating } = useMigrateCertificates();

  // ============================================================================
  // HANDLERS
  // ============================================================================
  const handleBulkCreate = (data) => {
    bulkCreate(data, {
      onSuccess: (response) => {
        toast.success(`${response.count} certificates created successfully`);
        setBulkCreateModalOpen(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create certificates");
      },
    });
  };

  const handleMigrate = (data) => {
    migrate(data, {
      onSuccess: (response) => {
        toast.success(
          `${response.migratedCount} certificates migrated successfully`,
        );
        setMigrateModalOpen(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to migrate certificates");
      },
    });
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Certificate Management
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Manage all certificates across branches
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setBulkCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Bulk Create
          </Button>
          <Button
            variant="secondary"
            onClick={() => setMigrateModalOpen(true)}
            leftIcon={<ArrowRightLeft className="w-4 h-4" />}
          >
            Migrate
          </Button>
          <Button
            variant="outline"
            leftIcon={<Download className="w-4 h-4" />}
            disabled
          >
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards - REAL DATA */}
      <StatsCards stats={stats} isLoading={isLoadingStock} />

      {/* Filters */}
      <CertificateFilters
        filters={filters}
        setFilters={setFilters}
        branches={branches}
        isLoadingBranches={isLoadingBranches}
      />

      {/* Certificates Table - REAL DATA */}
      <CertificateTable
        certificates={certificates}
        isLoading={isLoading}
        pagination={pagination}
        filters={filters}
        setFilters={setFilters}
      />

      {/* Modals */}
      <BulkCreateModal
        isOpen={bulkCreateModalOpen}
        onClose={() => setBulkCreateModalOpen(false)}
        onSubmit={handleBulkCreate}
        isCreating={isCreating}
      />

      <MigrateModal
        isOpen={migrateModalOpen}
        onClose={() => setMigrateModalOpen(false)}
        onSubmit={handleMigrate}
        isMigrating={isMigrating}
        branches={branches}
        isLoadingBranches={isLoadingBranches}
      />
    </div>
  );
}
