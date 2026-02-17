/**
 * DivisionsPage.jsx
 * Admin — Division & Sub Division Management
 *
 * Features:
 * - Stats bar (total, active, sub divisions, inactive)
 * - Search + filter toolbar
 * - Division cards grid (color-coded, expandable sub divisions)
 * - Create division modal (with dynamic sub division rows)
 * - Edit division name modal
 * - Add / Edit sub division modal
 * - Delete confirmation dialogs (division & sub division)
 * - Toggle active/inactive (division & sub division)
 */

import { useState, useCallback } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  Layers,
  CheckCircle,
  AlertCircle,
  Grid3X3,
  List,
} from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  useDivisions,
  useCreateDivision,
  useUpdateDivision,
  useDeleteDivision,
  useToggleDivisionActive,
  useCreateSubDivision,
  useUpdateSubDivision,
  useDeleteSubDivision,
  useToggleSubDivisionActive,
} from "@/hooks";

import { useDisclosure } from "@/hooks/shared/useDisclosure";
import { useConfirm } from "@/hooks/shared/useConfirm";
import { useDebounce } from "@/hooks/shared/useDebounce";

import { Modal, ModalFooter } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Skeleton } from "@/components/ui/Loading";
import { cn } from "@/utils/helpers/cn";

import {
  createDivisionSchema,
  updateDivisionSchema,
  createSubDivisionSchema,
  updateSubDivisionSchema,
} from "@/utils/validation/divisionValidation";

// ─────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────

/** Warna unik per division berdasarkan index */
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

/**
 * Stats Bar — ringkasan angka di atas halaman
 */
function StatsBar({ divisions = [] }) {
  const total = divisions.length;
  const active = divisions.filter((d) => d.is_active).length;
  const inactive = total - active;
  const totalSubs = divisions.reduce(
    (acc, d) => acc + (d.sub_divisions?.length || 0),
    0,
  );

  const stats = [
    {
      label: "Total Divisions",
      value: total,
      color: "#6495ed",
      bg: "rgba(100,149,237,0.1)",
      icon: <Layers className="w-4 h-4" />,
    },
    {
      label: "Active",
      value: active,
      color: "#22d3a5",
      bg: "rgba(34,211,165,0.1)",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      label: "Sub Divisions",
      value: totalSubs,
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.1)",
      icon: <Grid3X3 className="w-4 h-4" />,
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

/**
 * Sub Division Item — baris di dalam division card
 */
function SubDivisionItem({ sub, onEdit, onDelete, onToggle }) {
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors group">
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-medium truncate",
            !sub.is_active && "line-through opacity-50",
          )}
        >
          {sub.name}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
          Age: {sub.age_min} – {sub.age_max} yrs
        </p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => onToggle(sub)}
          className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
          title={sub.is_active ? "Deactivate" : "Activate"}
        >
          {sub.is_active ? (
            <ToggleRight className="w-3.5 h-3.5" />
          ) : (
            <ToggleLeft className="w-3.5 h-3.5" />
          )}
        </button>
        <button
          onClick={() => onEdit(sub)}
          className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          title="Edit"
        >
          <Edit2 className="w-3 h-3" />
        </button>
        <button
          onClick={() => onDelete(sub)}
          className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

/**
 * Division Card
 */
function DivisionCard({
  division,
  colorIndex,
  onEdit,
  onDelete,
  onToggle,
  onAddSub,
  onEditSub,
  onDeleteSub,
  onToggleSub,
}) {
  const [subOpen, setSubOpen] = useState(true);
  const color = getDivisionColor(colorIndex);
  const subCount = division.sub_divisions?.length || 0;

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden transition-all duration-200",
        "hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg dark:hover:shadow-slate-900/50",
        !division.is_active && "opacity-60",
      )}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            {/* Color dot */}
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ring-2 ring-offset-2 dark:ring-offset-slate-800"
              style={{ background: color, ringColor: color }}
            />
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug truncate">
                {division.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {subCount} sub division{subCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Badge variant={division.is_active ? "success" : "danger"} size="sm">
            {division.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      {/* Sub Divisions Toggle */}
      {subCount > 0 && (
        <button
          onClick={() => setSubOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-2 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          <span className="font-medium">Sub Divisions</span>
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 transition-transform duration-200",
              subOpen && "rotate-180",
            )}
          />
        </button>
      )}

      {/* Sub Divisions List */}
      {(subOpen || subCount === 0) && (
        <div className="px-3 pb-2">
          {subCount === 0 ? (
            <div className="py-5 text-center border border-dashed border-slate-200 dark:border-slate-700 rounded-lg my-2">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                No sub divisions yet
              </p>
            </div>
          ) : (
            <div className="space-y-1.5 pt-1 pb-1">
              {division.sub_divisions.map((sub) => (
                <SubDivisionItem
                  key={sub.id}
                  sub={sub}
                  onEdit={onEditSub}
                  onDelete={onDeleteSub}
                  onToggle={onToggleSub}
                />
              ))}
            </div>
          )}

          <button
            onClick={() => onAddSub(division)}
            className="mt-2 w-full py-2 text-xs font-medium text-blue-600 dark:text-blue-400 border border-dashed border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-600 transition-all"
          >
            <Plus className="w-3 h-3 inline mr-1" />
            Add Sub Division
          </button>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700">
        <span className="text-[10px] text-slate-400 dark:text-slate-600 font-mono">
          ID #{division.id}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(division)}
            className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
          >
            Edit
          </button>
          <button
            onClick={() => onToggle(division)}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-medium border transition-all",
              division.is_active
                ? "text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-yellow-300 dark:hover:border-yellow-700 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                : "text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-700 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20",
            )}
          >
            {division.is_active ? "Deactivate" : "Activate"}
          </button>
          <button
            onClick={() => onDelete(division)}
            className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 hover:text-red-500 dark:hover:text-red-400 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Loading skeleton untuk division card
 */
function DivisionCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-start gap-3">
          <Skeleton className="w-2.5 h-2.5 rounded-full mt-1.5" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
      <div className="px-3 py-3 space-y-2">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
        <Skeleton className="h-8 w-full rounded-lg" />
      </div>
      <div className="px-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-1">
        <Skeleton className="h-6 w-10 rounded-md" />
        <Skeleton className="h-6 w-16 rounded-md" />
        <Skeleton className="h-6 w-12 rounded-md" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MODALS
// ─────────────────────────────────────────────────────────

/**
 * Create Division Modal — nama + dynamic sub division rows
 */
function CreateDivisionModal({ open, onClose, onCreate }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createDivisionSchema),
    defaultValues: { name: "", sub_divisions: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sub_divisions",
  });

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const onSubmit = async (data) => {
    try {
      await onCreate(data);
      handleClose();
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong";
      setError("root", { type: "server", message: serverMessage });
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create New Division"
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Server error banner */}
        {errors.root && (
          <div className="flex items-start gap-2.5 px-3 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <span className="text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0 text-sm">
              ⚠
            </span>
            <p className="text-sm text-red-700 dark:text-red-300">
              {errors.root.message}
            </p>
          </div>
        )}

        {/* Division Name */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Division Name <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("name")}
            placeholder="e.g. Kids Program"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </div>

        {/* Sub Divisions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Sub Divisions{" "}
              <span className="text-xs font-normal text-slate-400">
                (optional)
              </span>
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => append({ name: "", age_min: "", age_max: "" })}
            >
              Add Row
            </Button>
          </div>

          {fields.length > 0 && (
            <div className="space-y-2">
              {/* Column headers */}
              <div className="grid grid-cols-[1fr_80px_80px_28px] gap-2 px-1">
                {["Name", "Min Age", "Max Age", ""].map((h) => (
                  <span
                    key={h}
                    className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide"
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[1fr_80px_80px_28px] gap-2 items-start"
                >
                  <Input
                    {...register(`sub_divisions.${index}.name`)}
                    placeholder="Beginner"
                    size="sm"
                    error={!!errors.sub_divisions?.[index]?.name}
                    helperText={errors.sub_divisions?.[index]?.name?.message}
                  />
                  <Input
                    {...register(`sub_divisions.${index}.age_min`, {
                      valueAsNumber: true,
                    })}
                    type="number"
                    placeholder="5"
                    size="sm"
                    min={1}
                    max={100}
                    error={!!errors.sub_divisions?.[index]?.age_min}
                  />
                  <Input
                    {...register(`sub_divisions.${index}.age_max`, {
                      valueAsNumber: true,
                    })}
                    type="number"
                    placeholder="7"
                    size="sm"
                    min={1}
                    max={100}
                    error={!!errors.sub_divisions?.[index]?.age_max}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="w-7 h-7 mt-0.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 hover:text-red-500 transition-all flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {fields.length === 0 && (
            <div className="py-4 text-center border border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
              <p className="text-xs text-slate-400">
                No sub divisions — add rows above, or skip
              </p>
            </div>
          )}
        </div>

        <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
          <ModalFooter
            onCancel={handleClose}
            confirmText="Create Division"
            confirmLoading={isSubmitting}
            confirmType="submit"
          />
        </div>
      </form>
    </Modal>
  );
}

/**
 * Edit Division Modal — nama saja
 */
function EditDivisionModal({ open, onClose, division, onUpdate }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateDivisionSchema),
    values: { name: division?.name || "" },
  });

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const onSubmit = async (data) => {
    try {
      await onUpdate(division.id, data);
      handleClose();
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong";

      if (
        serverMessage.toLowerCase().includes("name") ||
        serverMessage.toLowerCase().includes("already")
      ) {
        setError("name", { type: "server", message: serverMessage });
      } else {
        setError("root", { type: "server", message: serverMessage });
      }
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Edit Division" size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <div className="flex items-start gap-2.5 px-3 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <span className="text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0 text-sm">
              ⚠
            </span>
            <p className="text-sm text-red-700 dark:text-red-300">
              {errors.root.message}
            </p>
          </div>
        )}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Division Name <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("name")}
            placeholder="e.g. Kids Program"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </div>
        <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
          <ModalFooter
            onCancel={handleClose}
            confirmText="Save Changes"
            confirmLoading={isSubmitting}
            confirmType="submit"
          />
        </div>
      </form>
    </Modal>
  );
}

/**
 * Add / Edit Sub Division Modal
 *
 * Error handling:
 * - Zod: client-side (min < max, required)
 * - Server 400: overlap / name conflict → ditampilkan sebagai field error atau banner
 */
function SubDivisionModal({ open, onClose, divisionId, sub, onSave }) {
  const isEdit = !!sub;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(
      isEdit ? updateSubDivisionSchema : createSubDivisionSchema,
    ),
    values: sub
      ? { name: sub.name, age_min: sub.age_min, age_max: sub.age_max }
      : { name: "", age_min: "", age_max: "" },
  });

  const handleClose = useCallback(() => {
    reset();
    clearErrors();
    onClose();
  }, [reset, clearErrors, onClose]);

  const onSubmit = async (data) => {
    try {
      await onSave(isEdit ? sub.id : divisionId, data);
      handleClose();
    } catch (err) {
      // Ambil pesan error dari server (Axios wraps di err.response.data)
      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong";

      // Deteksi overlap error → highlight kedua field age
      const isOverlapError =
        serverMessage.toLowerCase().includes("overlap") ||
        serverMessage.toLowerCase().includes("age range");

      if (isOverlapError) {
        setError("age_min", { type: "server", message: serverMessage });
        setError("age_max", { type: "server", message: " " }); // space agar field merah tapi tidak double text
      } else if (
        serverMessage.toLowerCase().includes("name") ||
        serverMessage.toLowerCase().includes("already")
      ) {
        setError("name", { type: "server", message: serverMessage });
      } else {
        // Fallback: tampilkan sebagai root error (banner di atas form)
        setError("root", { type: "server", message: serverMessage });
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? "Edit Sub Division" : "Add Sub Division"}
      size="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Server error banner (fallback jika bukan field-specific) */}
        {errors.root && (
          <div className="flex items-start gap-2.5 px-3 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <span className="text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0 text-sm">
              ⚠
            </span>
            <p className="text-sm text-red-700 dark:text-red-300">
              {errors.root.message}
            </p>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("name")}
            placeholder="e.g. Beginner"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Min Age <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("age_min", { valueAsNumber: true })}
              type="number"
              placeholder="5"
              min={1}
              max={100}
              error={!!errors.age_min}
              helperText={errors.age_min?.message}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Max Age <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("age_max", { valueAsNumber: true })}
              type="number"
              placeholder="7"
              min={1}
              max={100}
              error={!!errors.age_max}
              helperText={
                errors.age_max?.message && errors.age_max.message.trim()
                  ? errors.age_max.message
                  : undefined
              }
            />
          </div>
        </div>

        {/* Overlap hint — tampilkan jika ada error di kedua age field dari server */}
        {errors.age_min?.type === "server" && (
          <div className="flex items-start gap-2.5 px-3 py-2.5 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <span className="text-orange-500 dark:text-orange-400 mt-0.5 flex-shrink-0 text-sm">
              ⚡
            </span>
            <div>
              <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Age range conflict
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">
                {errors.age_min.message} — please choose a range that doesn't
                overlap with existing sub divisions.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
          <ModalFooter
            onCancel={handleClose}
            confirmText={isEdit ? "Save Changes" : "Add Sub Division"}
            confirmLoading={isSubmitting}
            confirmType="submit"
          />
        </div>
      </form>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────

export default function DivisionsPage() {
  // ── Filters ──
  const [search, setSearch] = useState("");
  const [includeInactive, setIncludeInactive] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "active" | "inactive"

  const debouncedSearch = useDebounce(search, 300);

  // ── Data ──
  const { data: divisions = [], isLoading } = useDivisions({ includeInactive });

  // ── Mutations ──
  const { mutateAsync: createDivision } = useCreateDivision();
  const { mutateAsync: updateDivision } = useUpdateDivision();
  const { mutateAsync: deleteDivision, isPending: isDeleting } =
    useDeleteDivision();
  const { mutateAsync: toggleDivision } = useToggleDivisionActive();
  const { mutateAsync: createSubDivision } = useCreateSubDivision();
  const { mutateAsync: updateSubDivision } = useUpdateSubDivision();
  const { mutateAsync: deleteSubDivision, isPending: isDeletingSub } =
    useDeleteSubDivision();
  const { mutateAsync: toggleSubDivision } = useToggleSubDivisionActive();

  // ── Modal states ──
  const createModal = useDisclosure();
  const editModal = useDisclosure();
  const subModal = useDisclosure();

  // ── Confirm states ──
  const divConfirm = useConfirm();
  const subConfirm = useConfirm();

  // ── Selected items ──
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedParentDivision, setSelectedParentDivision] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  // ─── Filtered divisions ───
  const filteredDivisions = (divisions || []).filter((d) => {
    const matchSearch =
      !debouncedSearch ||
      d.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      d.sub_divisions?.some((s) =>
        s.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
      );

    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && d.is_active) ||
      (statusFilter === "inactive" && !d.is_active);

    return matchSearch && matchStatus;
  });

  // ─── Handlers ───

  // Division
  const handleCreate = useCallback(
    async (data) => {
      // Rethrow agar modal bisa catch dan set error di form
      await createDivision(data);
    },
    [createDivision],
  );

  const handleEdit = useCallback(
    (division) => {
      setSelectedDivision(division);
      editModal.onOpen();
    },
    [editModal],
  );

  const handleUpdate = useCallback(
    async (id, data) => {
      await updateDivision({ id, data });
    },
    [updateDivision],
  );

  const handleDeleteClick = useCallback(
    (division) => {
      divConfirm.onConfirm({ division });
    },
    [divConfirm],
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!divConfirm.confirmData?.division) return;
    await deleteDivision(divConfirm.confirmData.division.id);
    divConfirm.handleCancel();
  }, [divConfirm, deleteDivision]);

  const handleToggle = useCallback(
    async (division) => {
      await toggleDivision(division.id);
    },
    [toggleDivision],
  );

  // Sub Division
  const handleAddSub = useCallback(
    (division) => {
      setSelectedParentDivision(division);
      setSelectedSub(null);
      subModal.onOpen();
    },
    [subModal],
  );

  const handleEditSub = useCallback(
    (sub) => {
      setSelectedSub(sub);
      subModal.onOpen();
    },
    [subModal],
  );

  const handleSubSave = useCallback(
    async (idOrDivisionId, data) => {
      // Rethrow error agar SubDivisionModal bisa catch dan set field error
      if (selectedSub) {
        // edit: idOrDivisionId = sub.id
        await updateSubDivision({ subId: idOrDivisionId, data });
      } else {
        // create: idOrDivisionId = divisionId
        await createSubDivision({ divisionId: idOrDivisionId, data });
      }
    },
    [selectedSub, updateSubDivision, createSubDivision],
  );

  const handleSubModalClose = useCallback(() => {
    setSelectedSub(null);
    setSelectedParentDivision(null);
    subModal.onClose();
  }, [subModal]);

  const handleDeleteSubClick = useCallback(
    (sub) => {
      subConfirm.onConfirm({ sub });
    },
    [subConfirm],
  );

  const handleDeleteSubConfirm = useCallback(async () => {
    if (!subConfirm.confirmData?.sub) return;
    await deleteSubDivision(subConfirm.confirmData.sub.id);
    subConfirm.handleCancel();
  }, [subConfirm, deleteSubDivision]);

  const handleToggleSub = useCallback(
    async (sub) => {
      await toggleSubDivision(sub.id);
    },
    [toggleSubDivision],
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
            Division Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage age divisions and sub-division structures for your curriculum
          </p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={createModal.onOpen}
        >
          Create Division
        </Button>
      </div>

      {/* ── Stats Bar ── */}
      {!isLoading && <StatsBar divisions={divisions} />}
      {isLoading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[72px] rounded-xl" />
          ))}
        </div>
      )}

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 flex-wrap">
        {/* Left: search + toggle */}
        <div className="flex items-center gap-3 flex-wrap">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search divisions..."
            leftIcon={<Search className="w-4 h-4" />}
            className="w-52"
          />
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none">
            <div
              onClick={() => setIncludeInactive((v) => !v)}
              className={cn(
                "w-8 h-4.5 rounded-full relative transition-colors cursor-pointer border",
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

        {/* Right: tabs + view toggle */}
        <div className="flex items-center gap-2">
          {/* Status tabs */}
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
            {[
              { key: "all", label: "All" },
              { key: "active", label: "Active" },
              { key: "inactive", label: "Inactive" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
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

          {/* View toggle */}
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === "grid"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
              )}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === "list"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
              )}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "grid grid-cols-1 gap-3",
          )}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <DivisionCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredDivisions.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <Layers className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {search
              ? `No divisions matching "${search}"`
              : "No divisions found"}
          </p>
          {!search && (
            <button
              onClick={createModal.onOpen}
              className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Create your first division
            </button>
          )}
        </div>
      ) : (
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "grid grid-cols-1 gap-3",
          )}
        >
          {filteredDivisions.map((division, index) => (
            <DivisionCard
              key={division.id}
              division={division}
              colorIndex={index}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onToggle={handleToggle}
              onAddSub={handleAddSub}
              onEditSub={handleEditSub}
              onDeleteSub={handleDeleteSubClick}
              onToggleSub={handleToggleSub}
            />
          ))}
        </div>
      )}

      {/* ── Modals ── */}

      {/* Create Division */}
      <CreateDivisionModal
        open={createModal.isOpen}
        onClose={createModal.onClose}
        onCreate={handleCreate}
      />

      {/* Edit Division */}
      <EditDivisionModal
        open={editModal.isOpen}
        onClose={editModal.onClose}
        division={selectedDivision}
        onUpdate={handleUpdate}
      />

      {/* Add / Edit Sub Division */}
      <SubDivisionModal
        open={subModal.isOpen}
        onClose={handleSubModalClose}
        divisionId={selectedParentDivision?.id}
        sub={selectedSub}
        onSave={handleSubSave}
      />

      {/* Confirm Delete Division */}
      <ConfirmDialog
        open={divConfirm.isOpen}
        onClose={divConfirm.handleCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Division"
        message={`Are you sure you want to delete "${divConfirm.confirmData?.division?.name}"? All sub divisions will also be deleted. This action cannot be undone.`}
        confirmText="Delete Division"
        loading={isDeleting}
        variant="danger"
      />

      {/* Confirm Delete Sub Division */}
      <ConfirmDialog
        open={subConfirm.isOpen}
        onClose={subConfirm.handleCancel}
        onConfirm={handleDeleteSubConfirm}
        title="Delete Sub Division"
        message={`Are you sure you want to delete "${subConfirm.confirmData?.sub?.name}"? This action cannot be undone.`}
        confirmText="Delete Sub Division"
        loading={isDeletingSub}
        variant="danger"
      />
    </div>
  );
}
