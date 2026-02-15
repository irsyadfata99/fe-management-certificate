/**
 * Branches Page (SuperAdmin Only)
 * Complete branch management with CRUD operations
 *
 * FEATURES:
 * - List all branches (tree view: head → sub branches)
 * - Create new branch (head or sub)
 * - Edit branch details
 * - Toggle active/inactive status
 * - Convert head ↔ sub branch
 * - Reset admin password for head branches
 * - Delete branch (with confirmation)
 * - Search/filter branches
 */

import { useState, Fragment } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit2, Trash2, Power, Key, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";

// Hooks
import {
  useBranches,
  useHeadBranches,
  useCreateBranch,
  useUpdateBranch,
  useDeleteBranch,
  useToggleBranchActive,
  useToggleBranchHead,
  useResetBranchAdminPassword,
} from "@/hooks";

// UI Components
import {
  Button,
  Input,
  Select,
  Checkbox,
  Modal,
  Badge,
  Spinner,
  FormField,
  FormLabel,
} from "@/components/ui";

// Shared Components
import PasswordDisplayModal from "@/components/shared/PasswordDisplayModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

// Validation
import {
  createHeadBranchSchema,
  createSubBranchSchema,
  updateBranchSchema,
  toggleHeadBranchSchema,
} from "@/utils/validation/branchValidation";

export default function BranchesPage() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [filters, setFilters] = useState({
    includeInactive: false,
  });

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [toggleHeadModalOpen, setToggleHeadModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  // Selected branch for actions
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState(null);

  // ============================================================================
  // API HOOKS
  // ============================================================================
  const { data: branches, isLoading } = useBranches(filters);
  const { data: headBranches } = useHeadBranches();

  const { mutate: createBranch, isPending: isCreating } = useCreateBranch();
  const { mutate: updateBranch, isPending: isUpdating } = useUpdateBranch();
  const { mutate: deleteBranch, isPending: isDeleting } = useDeleteBranch();
  const { mutate: toggleActive, isPending: isToggling } =
    useToggleBranchActive();
  const { mutate: toggleHead, isPending: isTogglingHead } =
    useToggleBranchHead();
  const { mutate: resetPassword, isPending: isResetting } =
    useResetBranchAdminPassword();

  // ============================================================================
  // CREATE BRANCH MODAL - FIXED
  // ============================================================================
  const CreateBranchModal = () => {
    const [isHeadBranch, setIsHeadBranch] = useState(true);

    // ✅ FIX: Fetch head branches inside modal component
    const { data: headBranchesForCreate } = useHeadBranches();

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      setValue, // ✅ ADD: setValue for programmatic updates
    } = useForm({
      resolver: zodResolver(
        isHeadBranch ? createHeadBranchSchema : createSubBranchSchema,
      ),
      defaultValues: {
        is_head_branch: true,
      },
    });

    // ✅ FIX: Update form value when radio changes
    const handleBranchTypeChange = (isHead) => {
      setIsHeadBranch(isHead);
      setValue("is_head_branch", isHead);
    };

    const onSubmit = (data) => {
      console.log("✅ CREATE BRANCH SUBMIT:", data); // Debug

      createBranch(data, {
        onSuccess: (response) => {
          toast.success("Branch created successfully");

          // ✅ FIX: Check temporaryPassword, not password
          if (response.admin && response.admin.temporaryPassword) {
            setGeneratedPassword({
              password: response.admin.temporaryPassword,
              username: response.admin.username,
            });
            setPasswordModalOpen(true);
          }

          setCreateModalOpen(false);
          reset();
        },
      });
    };

    const handleClose = () => {
      setCreateModalOpen(false);
      reset();
      setIsHeadBranch(true);
    };

    return (
      <Modal
        open={createModalOpen}
        onClose={handleClose}
        title="Create New Branch"
        description="Add a new branch to the system"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Branch Type Selection */}
          <FormField>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={isHeadBranch}
                  onChange={() => handleBranchTypeChange(true)}
                  className="w-4 h-4 text-primary-500"
                />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Head Branch
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!isHeadBranch}
                  onChange={() => handleBranchTypeChange(false)}
                  className="w-4 h-4 text-primary-500"
                />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Sub Branch
                </span>
              </label>
            </div>
          </FormField>

          {/* Branch Code */}
          <FormField>
            <FormLabel required>Branch Code</FormLabel>
            <Input
              {...register("code")}
              placeholder="e.g., HQ, SUB1"
              error={!!errors.code}
              helperText={errors.code?.message}
            />
          </FormField>

          {/* Branch Name */}
          <FormField>
            <FormLabel required>Branch Name</FormLabel>
            <Input
              {...register("name")}
              placeholder="e.g., Head Quarter"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </FormField>

          {/* Parent Branch (Sub Branch Only) */}
          {!isHeadBranch && (
            <FormField>
              <FormLabel required>Parent Branch</FormLabel>
              <Select
                {...register("parent_id", { valueAsNumber: true })}
                error={!!errors.parent_id}
                helperText={errors.parent_id?.message}
              >
                <option value="">Select parent branch</option>
                {headBranchesForCreate?.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} ({branch.code})
                  </option>
                ))}
              </Select>
            </FormField>
          )}

          {/* Admin Username (Head Branch Only) */}
          {isHeadBranch && (
            <FormField>
              <FormLabel>Admin Username (Optional)</FormLabel>
              <Input
                {...register("admin_username")}
                placeholder="e.g., admin_hq"
                error={!!errors.admin_username}
                helperText={
                  errors.admin_username?.message ||
                  "Leave empty to auto-generate"
                }
              />
            </FormField>
          )}

          {/* Hidden field for is_head_branch */}
          <input
            type="hidden"
            {...register("is_head_branch")}
            value={isHeadBranch}
          />

          {/* Footer - Manual buttons inside form */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 dark:bg-neutral-700 dark:text-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Branch"
              )}
            </button>
          </div>
        </form>
      </Modal>
    );
  };

  // ============================================================================
  // EDIT BRANCH MODAL - FIXED VERSION
  // ============================================================================
  const EditBranchModal = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm({
      resolver: zodResolver(updateBranchSchema),
      defaultValues: selectedBranch
        ? {
            code: selectedBranch.code,
            name: selectedBranch.name,
            // ✅ FIX: Convert null to undefined, not empty string
            parent_id: selectedBranch.parent_id || undefined,
          }
        : {},
    });

    const onSubmit = (data) => {
      console.log("✅ FORM SUBMITTED!");
      console.log("Data:", data);
      console.log("Branch ID:", selectedBranch.id);

      // ✅ FIX: Clean up data before sending to API
      const cleanedData = {
        code: data.code,
        name: data.name,
      };

      // ✅ CRITICAL FIX: Only include parent_id for SUB branches
      // Head branches should NOT have parent_id in the payload at all
      if (!selectedBranch.is_head_branch) {
        cleanedData.parent_id = data.parent_id === "" ? null : data.parent_id;
      }

      updateBranch(
        { id: selectedBranch.id, data: cleanedData },
        {
          onSuccess: () => {
            toast.success("Branch updated successfully");
            setEditModalOpen(false);
            setSelectedBranch(null);
            reset();
          },
        },
      );
    };

    const handleClose = () => {
      setEditModalOpen(false);
      setSelectedBranch(null);
      reset();
    };

    if (!selectedBranch) return null;

    return (
      <Modal
        open={editModalOpen}
        onClose={handleClose}
        title="Edit Branch"
        description={`Update details for ${selectedBranch.name}`}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Branch Code */}
          <FormField>
            <FormLabel required>Branch Code</FormLabel>
            <Input
              {...register("code")}
              error={!!errors.code}
              helperText={errors.code?.message}
            />
          </FormField>

          {/* Branch Name */}
          <FormField>
            <FormLabel required>Branch Name</FormLabel>
            <Input
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </FormField>

          {/* Parent Branch (Sub Branch Only) */}
          {!selectedBranch.is_head_branch && (
            <FormField>
              <FormLabel>Parent Branch</FormLabel>
              <Select
                {...register("parent_id", { valueAsNumber: true })}
                error={!!errors.parent_id}
                helperText={errors.parent_id?.message}
              >
                <option value="">Select parent branch</option>
                {headBranches
                  ?.filter((b) => b.id !== selectedBranch.id)
                  .map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} ({branch.code})
                    </option>
                  ))}
              </Select>
            </FormField>
          )}

          {/* Footer - FIXED: Manual buttons inside form */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 dark:bg-neutral-700 dark:text-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update Branch"
              )}
            </button>
          </div>
        </form>
      </Modal>
    );
  };

  // ============================================================================
  // TOGGLE HEAD/SUB MODAL - FIXED VERSION
  // ============================================================================
  const ToggleHeadModal = () => {
    const willBeHead = selectedBranch && !selectedBranch.is_head_branch;

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm({
      resolver: zodResolver(toggleHeadBranchSchema),
      defaultValues: {
        is_head_branch: willBeHead,
      },
    });

    const onSubmit = (data) => {
      toggleHead(
        { id: selectedBranch.id, payload: data },
        {
          onSuccess: (response) => {
            toast.success(
              `Branch converted to ${willBeHead ? "head" : "sub"} branch`,
            );

            // Show password if converted to head and password was generated
            if (willBeHead && response.admin && response.admin.password) {
              setGeneratedPassword({
                password: response.admin.password,
                username: data.admin_username,
              });
              setPasswordModalOpen(true);
            }

            setToggleHeadModalOpen(false);
            setSelectedBranch(null);
            reset();
          },
        },
      );
    };

    const handleClose = () => {
      setToggleHeadModalOpen(false);
      setSelectedBranch(null);
      reset();
    };

    if (!selectedBranch) return null;

    return (
      <Modal
        open={toggleHeadModalOpen}
        onClose={handleClose}
        title={`Convert to ${willBeHead ? "Head" : "Sub"} Branch`}
        description={`Change ${selectedBranch.name} to a ${willBeHead ? "head" : "sub"} branch`}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {willBeHead ? (
            <>
              {/* Admin Username (converting to head) */}
              <FormField>
                <FormLabel>Admin Username</FormLabel>
                <Input
                  {...register("admin_username")}
                  placeholder="e.g., admin_branch"
                  error={!!errors.admin_username}
                  helperText={
                    errors.admin_username?.message ||
                    "Leave empty to auto-generate"
                  }
                />
              </FormField>
            </>
          ) : (
            <>
              {/* Parent Branch (converting to sub) */}
              <FormField>
                <FormLabel required>Parent Branch</FormLabel>
                <Select
                  {...register("parent_id", { valueAsNumber: true })}
                  error={!!errors.parent_id}
                  helperText={errors.parent_id?.message}
                >
                  <option value="">Select parent branch</option>
                  {headBranches
                    ?.filter((b) => b.id !== selectedBranch.id)
                    .map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name} ({branch.code})
                      </option>
                    ))}
                </Select>
              </FormField>
            </>
          )}

          {/* Hidden field */}
          <input
            type="hidden"
            {...register("is_head_branch")}
            value={willBeHead}
          />

          {/* Footer - FIXED: Manual buttons inside form */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 dark:bg-neutral-700 dark:text-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isTogglingHead}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTogglingHead ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Converting...
                </span>
              ) : (
                `Convert to ${willBeHead ? "Head" : "Sub"}`
              )}
            </button>
          </div>
        </form>
      </Modal>
    );
  };

  // ============================================================================
  // ACTION HANDLERS
  // ============================================================================
  const handleEdit = (branch) => {
    setSelectedBranch(branch);
    setEditModalOpen(true);
  };

  const handleToggleActive = (branch) => {
    toggleActive(branch.id, {
      onSuccess: () => {
        toast.success(
          `Branch ${branch.is_active ? "deactivated" : "activated"}`,
        );
      },
    });
  };

  const handleToggleHead = (branch) => {
    setSelectedBranch(branch);
    setToggleHeadModalOpen(true);
  };

  const handleResetPassword = (branch) => {
    resetPassword(branch.id, {
      onSuccess: (data) => {
        setGeneratedPassword({
          password: data.password,
          username: `admin_${branch.code.toLowerCase()}`,
        });
        setPasswordModalOpen(true);
      },
    });
  };

  const handleDelete = (branch) => {
    setSelectedBranch(branch);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteBranch(selectedBranch.id, {
      onSuccess: () => {
        toast.success("Branch deleted successfully");
        setDeleteDialogOpen(false);
        setSelectedBranch(null);
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
            Branch Management
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Manage all branches and their hierarchy
          </p>
        </div>
        <Button
          onClick={() => setCreateModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Branch
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card-auto p-4">
        <Checkbox
          label="Show inactive branches"
          checked={filters.includeInactive}
          onChange={(e) =>
            setFilters({ ...filters, includeInactive: e.target.checked })
          }
        />
      </div>

      {/* Branches List */}
      <div className="glass-card-auto">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
            All Branches (
            {branches?.reduce(
              (total, branch) => total + 1 + (branch.sub_branches?.length || 0),
              0,
            ) || 0}
            )
          </h2>
        </div>

        <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {isLoading ? (
            <div className="px-6 py-12 text-center">
              <Spinner size="lg" className="mx-auto" />
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Loading branches...
              </p>
            </div>
          ) : branches?.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-neutral-600 dark:text-neutral-400">
                No branches found
              </p>
            </div>
          ) : (
            <>
              {branches?.map((branch) => (
                <Fragment key={branch.id}>
                  {/* ========================================== */}
                  {/* HEAD BRANCH */}
                  {/* ========================================== */}
                  <div className="px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-neutral-900 dark:text-neutral-100">
                              {branch.name}
                            </span>
                            <Badge
                              variant="default"
                              size="sm"
                              className="font-mono"
                            >
                              {branch.code}
                            </Badge>

                            {/* Head/Sub Badge */}
                            <Badge
                              variant={
                                branch.is_head_branch ? "primary" : "default"
                              }
                              size="sm"
                            >
                              {branch.is_head_branch ? "Head" : "Sub"}
                            </Badge>

                            {/* Active/Inactive Badge */}
                            <Badge
                              variant={branch.is_active ? "success" : "danger"}
                              size="sm"
                            >
                              {branch.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(branch)}
                          leftIcon={<Edit2 className="w-4 h-4" />}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(branch)}
                          leftIcon={<Power className="w-4 h-4" />}
                          loading={isToggling}
                        >
                          Toggle
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleHead(branch)}
                          leftIcon={<ArrowLeftRight className="w-4 h-4" />}
                        >
                          Convert
                        </Button>

                        {branch.is_head_branch && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResetPassword(branch)}
                            leftIcon={<Key className="w-4 h-4" />}
                            loading={isResetting}
                          >
                            Reset Password
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(branch)}
                          leftIcon={<Trash2 className="w-4 h-4" />}
                          className="text-danger-600 hover:text-danger-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* ========================================== */}
                  {/* SUB BRANCHES (NESTED) */}
                  {/* ========================================== */}
                  {branch.sub_branches?.map((subBranch) => (
                    <div
                      key={subBranch.id}
                      className="px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 flex items-center gap-3">
                          {/* Indent indicator */}
                          <span className="text-neutral-400 dark:text-neutral-600 ml-4">
                            └─
                          </span>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                                {subBranch.name}
                              </span>
                              <Badge
                                variant="default"
                                size="sm"
                                className="font-mono"
                              >
                                {subBranch.code}
                              </Badge>

                              {/* Sub Badge */}
                              <Badge variant="default" size="sm">
                                Sub
                              </Badge>

                              {/* Active/Inactive Badge */}
                              <Badge
                                variant={
                                  subBranch.is_active ? "success" : "danger"
                                }
                                size="sm"
                              >
                                {subBranch.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </div>

                            {/* Parent info */}
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                              Parent: {branch.name}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(subBranch)}
                            leftIcon={<Edit2 className="w-4 h-4" />}
                          >
                            Edit
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(subBranch)}
                            leftIcon={<Power className="w-4 h-4" />}
                            loading={isToggling}
                          >
                            Toggle
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleHead(subBranch)}
                            leftIcon={<ArrowLeftRight className="w-4 h-4" />}
                          >
                            Convert
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(subBranch)}
                            leftIcon={<Trash2 className="w-4 h-4" />}
                            className="text-danger-600 hover:text-danger-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </Fragment>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateBranchModal />
      <EditBranchModal />
      <ToggleHeadModal />

      {/* Password Display Modal */}
      {generatedPassword && (
        <PasswordDisplayModal
          open={passwordModalOpen}
          onClose={() => {
            setPasswordModalOpen(false);
            setGeneratedPassword(null);
          }}
          password={generatedPassword.password}
          username={generatedPassword.username}
          title="Admin Password Generated"
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedBranch && (
        <ConfirmDialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setSelectedBranch(null);
          }}
          onConfirm={confirmDelete}
          title="Delete Branch"
          message={`Are you sure you want to delete "${selectedBranch.name}"? This action cannot be undone.`}
          confirmText="Delete Branch"
          loading={isDeleting}
        />
      )}
    </div>
  );
}
