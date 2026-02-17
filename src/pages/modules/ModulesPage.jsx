/**
 * ModulesPage.jsx
 * Admin — Module Management
 *
 * Features:
 * - Stats bar (total, active, divisions used, inactive)
 * - Search + division filter + status tabs toolbar
 * - Module table (code, name, division, sub division, status, actions)
 * - Pagination (8 items/page via reusable Pagination component)
 * - Create module modal (division → sub division cascade)
 * - Edit module modal
 * - Delete confirmation dialog
 * - Toggle active/inactive
 */

import { useState, useCallback, useMemo } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Layers,
} from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  useModules,
  useCreateModule,
  useUpdateModule,
  useDeleteModule,
  useToggleModuleActive,
  useDivisions,
} from "@/hooks";

import { useDisclosure } from "@/hooks/shared/useDisclosure";
import { useConfirm } from "@/hooks/shared/useConfirm";
import { useDebounce } from "@/hooks/shared/useDebounce";

import { Modal, ModalFooter } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Skeleton } from "@/components/ui/Loading";
import { Pagination } from "@/components/ui/Pagination";
import { cn } from "@/utils/helpers/cn";

import {
  createModuleSchema,
  updateModuleSchema,
} from "@/utils/validation/moduleValidation";

// ─────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────

const PAGE_LIMIT = 8;

const DIVISION_COLORS = [
  "#6495ed",
  "#a78bfa",
  "#22d3a5",
  "#fb923c",
  "#f472b6",
  "#fbbf24",
  "#60a5fa",
  "#34d399",
];

const getDivisionColor = (index) =>
  DIVISION_COLORS[index % DIVISION_COLORS.length];

// ─────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────

function StatsBar({ modules = [] }) {
  const total = modules.length;
  const active = modules.filter((m) => m.is_active).length;
  const inactive = total - active;
  const divisionsUsed = new Set(modules.map((m) => m.division_id)).size;

  const stats = [
    {
      label: "Total Modules",
      value: total,
      color: "#6495ed",
      bg: "rgba(100,149,237,0.1)",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      label: "Active",
      value: active,
      color: "#22d3a5",
      bg: "rgba(34,211,165,0.1)",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      label: "Divisions Used",
      value: divisionsUsed,
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.1)",
      icon: <Layers className="w-4 h-4" />,
    },
    {
      label: "Inactive",
      value: inactive,
      color: "#fbbf24",
      bg: "rgba(251,191,36,0.1)",
      icon: <AlertCircle className="w-4 h-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center gap-3 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: s.bg, color: s.color }}
          >
            {s.icon}
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-none">
              {s.value}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {s.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-[72px] rounded-xl" />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MODULE FORM (shared Create / Edit)
// ─────────────────────────────────────────────────────────

function ModuleForm({
  schema,
  defaultValues,
  onSubmit,
  onCancel,
  confirmText,
  divisions = [],
}) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues });

  const watchedDivisionId = useWatch({ control, name: "division_id" });

  // Sub divisions filtered by selected division
  const subDivisions = useMemo(() => {
    if (!watchedDivisionId) return [];
    const found = divisions.find((d) => d.id === Number(watchedDivisionId));
    return found?.sub_divisions || [];
  }, [watchedDivisionId, divisions]);

  // Reset sub_div_id when division changes
  const handleDivisionChange = (e) => {
    setValue("division_id", Number(e.target.value) || "");
    setValue("sub_div_id", null);
  };

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong";

      if (
        serverMessage.toLowerCase().includes("code") ||
        serverMessage.toLowerCase().includes("already")
      ) {
        setError("module_code", { type: "server", message: serverMessage });
      } else {
        setError("root", { type: "server", message: serverMessage });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Server error banner */}
      {errors.root && (
        <div className="flex items-start gap-2.5 px-3 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <span className="text-red-500 mt-0.5 flex-shrink-0 text-sm">⚠</span>
          <p className="text-sm text-red-700 dark:text-red-300">
            {errors.root.message}
          </p>
        </div>
      )}

      {/* Module Code */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Module Code <span className="text-red-500">*</span>
        </label>
        <Input
          {...register("module_code")}
          placeholder="e.g. KIDS-BEG"
          className="uppercase"
          error={!!errors.module_code}
          helperText={errors.module_code?.message}
          onChange={(e) => {
            e.target.value = e.target.value.toUpperCase();
            register("module_code").onChange(e);
          }}
        />
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Alphanumeric, dash & underscore only · auto-uppercase
        </p>
      </div>

      {/* Module Name */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Module Name <span className="text-red-500">*</span>
        </label>
        <Input
          {...register("name")}
          placeholder="e.g. Kids Beginner Course"
          error={!!errors.name}
          helperText={errors.name?.message}
        />
      </div>

      {/* Division */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Division <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            {...register("division_id", { valueAsNumber: true })}
            onChange={handleDivisionChange}
            className={cn(
              "w-full appearance-none rounded-lg border px-3 py-2 pr-8 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "bg-white dark:bg-neutral-800 text-slate-900 dark:text-slate-100",
              errors.division_id
                ? "border-red-500 dark:border-red-600"
                : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500",
            )}
          >
            <option value="">— Select Division —</option>
            {divisions
              .filter((d) => d.is_active)
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
          </select>
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
        {errors.division_id && (
          <p className="text-xs text-red-600 dark:text-red-400">
            {errors.division_id.message}
          </p>
        )}
      </div>

      {/* Sub Division (conditional) */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Sub Division{" "}
          <span className="text-xs font-normal text-slate-400">(optional)</span>
        </label>
        <div className="relative">
          <select
            {...register("sub_div_id", { valueAsNumber: true })}
            disabled={!watchedDivisionId || subDivisions.length === 0}
            className={cn(
              "w-full appearance-none rounded-lg border px-3 py-2 pr-8 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "bg-white dark:bg-neutral-800 text-slate-900 dark:text-slate-100",
              "border-slate-300 dark:border-slate-600",
              (!watchedDivisionId || subDivisions.length === 0) &&
                "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900",
            )}
          >
            <option value="">— No Sub Division —</option>
            {subDivisions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.age_min}–{s.age_max} yrs)
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
        {!watchedDivisionId && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Select a division first
          </p>
        )}
        {watchedDivisionId && subDivisions.length === 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            This division has no sub divisions
          </p>
        )}
      </div>

      {/* Footer inside form */}
      <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
        <ModalFooter
          onCancel={onCancel}
          confirmText={confirmText}
          confirmLoading={isSubmitting}
          confirmType="submit"
        />
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────────────────
// MODALS
// ─────────────────────────────────────────────────────────

function CreateModuleModal({ open, onClose, onCreate, divisions }) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create New Module"
      size="md"
    >
      <ModuleForm
        schema={createModuleSchema}
        defaultValues={{
          module_code: "",
          name: "",
          division_id: "",
          sub_div_id: null,
        }}
        onSubmit={async (data) => {
          await onCreate(data);
          handleClose();
        }}
        onCancel={handleClose}
        confirmText="Create Module"
        divisions={divisions}
      />
    </Modal>
  );
}

function EditModuleModal({ open, onClose, module, onUpdate, divisions }) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!module) return null;

  return (
    <Modal open={open} onClose={handleClose} title="Edit Module" size="md">
      <ModuleForm
        schema={updateModuleSchema}
        defaultValues={{
          module_code: module.module_code || "",
          name: module.name || "",
          division_id: module.division_id || "",
          sub_div_id: module.sub_div_id || null,
        }}
        onSubmit={async (data) => {
          await onUpdate(module.id, data);
          handleClose();
        }}
        onCancel={handleClose}
        confirmText="Save Changes"
        divisions={divisions}
      />
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────
// TABLE ROW SKELETON
// ─────────────────────────────────────────────────────────

function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-4 py-3">
        <Skeleton className="h-6 w-20 rounded-md" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-48" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-28" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-5 w-36 rounded-full" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-5 w-14 rounded-full" />
      </td>
      <td className="px-4 py-3 text-right">
        <Skeleton className="h-6 w-20 ml-auto rounded-md" />
      </td>
    </tr>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────

export default function ModulesPage() {
  // ── Filters ──
  const [search, setSearch] = useState("");
  const [includeInactive, setIncludeInactive] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [divisionFilter, setDivisionFilter] = useState("");

  // ── Pagination ──
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  // ── Data ──
  // NOTE: params sent to backend — page & limit drive server-side pagination.
  // Search, status, and division filters are applied client-side on the current
  // page slice so the UX remains snappy without extra round-trips.
  const { data: modulesData, isLoading: isLoadingModules } = useModules({
    includeInactive,
    page,
    limit: PAGE_LIMIT,
  });

  const { data: divisions = [], isLoading: isLoadingDivisions } = useDivisions({
    includeInactive: false,
  });

  // Destructure the shape returned by the updated useModules select
  const modules = modulesData?.modules ?? [];
  const pagination = modulesData?.pagination ?? null;

  // ── Mutations ──
  const { mutateAsync: createModule } = useCreateModule();
  const { mutateAsync: updateModule } = useUpdateModule();
  const { mutateAsync: deleteModule, isPending: isDeleting } =
    useDeleteModule();
  const { mutateAsync: toggleModule } = useToggleModuleActive();

  // ── Modal states ──
  const createModal = useDisclosure();
  const editModal = useDisclosure();
  const deleteConfirm = useConfirm();

  // ── Selected ──
  const [selectedModule, setSelectedModule] = useState(null);

  // ── Division color map ──
  const divisionColorMap = useMemo(() => {
    const map = {};
    divisions.forEach((d, i) => {
      map[d.id] = getDivisionColor(i);
    });
    return map;
  }, [divisions]);

  // ── Client-side filter on current page slice ──
  // Search / status / division filters apply to the page already returned by
  // the server. If a filter is active the user sees a subset of the 8 items.
  const filteredModules = useMemo(() => {
    return modules.filter((m) => {
      const matchSearch =
        !debouncedSearch ||
        m.module_code.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.division_name?.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && m.is_active) ||
        (statusFilter === "inactive" && !m.is_active);

      const matchDivision =
        !divisionFilter || String(m.division_id) === divisionFilter;

      return matchSearch && matchStatus && matchDivision;
    });
  }, [modules, debouncedSearch, statusFilter, divisionFilter]);

  // Reset to page 1 whenever a filter changes so the user doesn't land on an
  // empty page after narrowing results.
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDivisionFilterChange = (e) => {
    setDivisionFilter(e.target.value);
    setPage(1);
  };

  const handleStatusFilterChange = (key) => {
    setStatusFilter(key);
    setPage(1);
  };

  const handleIncludeInactiveChange = () => {
    setIncludeInactive((v) => !v);
    setPage(1);
  };

  // ─── Handlers ───

  const handleCreate = useCallback(
    async (data) => {
      await createModule({
        module_code: data.module_code,
        name: data.name,
        division_id: Number(data.division_id),
        sub_div_id: data.sub_div_id ? Number(data.sub_div_id) : null,
      });
    },
    [createModule],
  );

  const handleEdit = useCallback(
    (module) => {
      setSelectedModule(module);
      editModal.onOpen();
    },
    [editModal],
  );

  const handleUpdate = useCallback(
    async (id, data) => {
      await updateModule({
        id,
        data: {
          module_code: data.module_code,
          name: data.name,
          division_id: Number(data.division_id),
          sub_div_id: data.sub_div_id ? Number(data.sub_div_id) : null,
        },
      });
    },
    [updateModule],
  );

  const handleDeleteClick = useCallback(
    (module) => {
      deleteConfirm.onConfirm({ module });
    },
    [deleteConfirm],
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteConfirm.confirmData?.module) return;
    await deleteModule(deleteConfirm.confirmData.module.id);
    deleteConfirm.handleCancel();
    // If we just deleted the last item on this page, go back one page
    if (filteredModules.length === 1 && page > 1) {
      setPage((p) => p - 1);
    }
  }, [deleteConfirm, deleteModule, filteredModules.length, page]);

  const handleToggle = useCallback(
    async (module) => {
      await toggleModule(module.id);
    },
    [toggleModule],
  );

  const isLoading = isLoadingModules || isLoadingDivisions;

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Module Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage course modules linked to divisions and sub divisions
          </p>
        </div>
        <button
          onClick={createModal.onOpen}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Module
        </button>
      </div>

      {/* ── Stats Bar ── */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <StatsBar modules={modules} divisions={divisions} />
      )}

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 flex-wrap">
        {/* Left */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <Input
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by code or name…"
            leftIcon={<Search className="w-4 h-4" />}
            className="w-52"
          />

          {/* Division filter */}
          <div className="relative">
            <select
              value={divisionFilter}
              onChange={handleDivisionFilterChange}
              className="appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 pr-8 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All Divisions</option>
              {divisions.map((d) => (
                <option key={d.id} value={String(d.id)}>
                  {d.name}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Show inactive toggle */}
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none">
            <div
              onClick={handleIncludeInactiveChange}
              className={cn(
                "w-8 rounded-full relative transition-colors cursor-pointer border",
                includeInactive
                  ? "bg-blue-500 border-blue-500"
                  : "bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600",
              )}
              style={{ height: "18px" }}
            >
              <div
                className={cn(
                  "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all",
                  includeInactive ? "left-[calc(100%-14px)]" : "left-0.5",
                )}
              />
            </div>
            Show inactive
          </label>
        </div>

        {/* Right: Status tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
          {[
            { key: "all", label: "All" },
            { key: "active", label: "Active" },
            { key: "inactive", label: "Inactive" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleStatusFilterChange(key)}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-all",
                statusFilter === key
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              {[
                "Code",
                "Module Name",
                "Division",
                "Sub Division",
                "Status",
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
              Array.from({ length: PAGE_LIMIT }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))
            ) : filteredModules.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center">
                  <BookOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {search || divisionFilter
                      ? "No modules match the current filters"
                      : "No modules found"}
                  </p>
                  {!search && !divisionFilter && (
                    <button
                      onClick={createModal.onOpen}
                      className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Create your first module
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              filteredModules.map((module) => {
                const color = divisionColorMap[module.division_id] || "#6495ed";
                return (
                  <tr
                    key={module.id}
                    className={cn(
                      "group transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30",
                      !module.is_active && "opacity-60",
                    )}
                  >
                    {/* Code */}
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-950/50 border border-cyan-300 dark:border-cyan-800/30 px-2 py-1 rounded-md">
                        {module.module_code}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "text-sm font-medium text-slate-900 dark:text-slate-100",
                          !module.is_active && "line-through",
                        )}
                      >
                        {module.name}
                      </span>
                    </td>

                    {/* Division */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: color }}
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-[140px]">
                          {module.division_name || "—"}
                        </span>
                      </div>
                    </td>

                    {/* Sub Division */}
                    <td className="px-4 py-3">
                      {module.sub_division_name ? (
                        <span className="inline-flex items-center text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 px-2 py-0.5 rounded-full">
                          {module.sub_division_name}
                          {module.age_min && module.age_max && (
                            <span className="ml-1 opacity-60">
                              ({module.age_min}–{module.age_max} yrs)
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-600">
                          —
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <Badge
                        variant={module.is_active ? "success" : "danger"}
                        size="sm"
                      >
                        {module.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Edit */}
                        <button
                          onClick={() => handleEdit(module)}
                          className="w-7 h-7 rounded-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 dark:hover:text-blue-400 transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Toggle */}
                        <button
                          onClick={() => handleToggle(module)}
                          className="w-7 h-7 rounded-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:border-yellow-300 dark:hover:border-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-500 dark:hover:text-yellow-400 transition-all"
                          title={module.is_active ? "Deactivate" : "Activate"}
                        >
                          {module.is_active ? (
                            <ToggleRight className="w-3.5 h-3.5" />
                          ) : (
                            <ToggleLeft className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteClick(module)}
                          className="w-7 h-7 rounded-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* ── Pagination ── */}
        {!isLoading && pagination && pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
              showInfo
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
            />
          </div>
        )}
      </div>

      {/* ── Modals ── */}

      <CreateModuleModal
        open={createModal.isOpen}
        onClose={createModal.onClose}
        onCreate={handleCreate}
        divisions={divisions}
      />

      <EditModuleModal
        open={editModal.isOpen}
        onClose={editModal.onClose}
        module={selectedModule}
        onUpdate={handleUpdate}
        divisions={divisions}
      />

      <ConfirmDialog
        open={deleteConfirm.isOpen}
        onClose={deleteConfirm.handleCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Module"
        message={`Are you sure you want to delete "${deleteConfirm.confirmData?.module?.module_code} — ${deleteConfirm.confirmData?.module?.name}"? This action cannot be undone.`}
        confirmText="Delete Module"
        loading={isDeleting}
        variant="danger"
      />
    </div>
  );
}
