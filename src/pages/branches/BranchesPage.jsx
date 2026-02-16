/**
 * Branches Page (SuperAdmin Only) - WITH PAGINATION
 * Complete branch management with better UI/UX + Pagination
 *
 * IMPROVEMENTS:
 * ✅ Better visual hierarchy (head vs sub branches)
 * ✅ Simplified actions (dropdown menu)
 * ✅ Cleaner badge layout
 * ✅ Collapsible sub-branches
 * ✅ PAGINATION - 5 items per page
 */

import { useState, Fragment } from "react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit2, Trash2, Power, Key, ArrowLeftRight, ChevronDown, ChevronRight, MoreVertical } from "lucide-react";
import { toast } from "sonner";

// Hooks
import { useBranches, useHeadBranches, useCreateBranch, useUpdateBranch, useDeleteBranch, useToggleBranchActive, useToggleBranchHead, useResetBranchAdminPassword } from "@/hooks";

// UI Components
import { Button, Input, Select, Checkbox, Modal, Badge, Spinner, FormField, FormLabel, Pagination } from "@/components/ui";

// Shared Components
import PasswordDisplayModal from "@/components/shared/PasswordDisplayModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

// Validation
import { createHeadBranchSchema, createSubBranchSchema, updateBranchSchema, toggleHeadBranchSchema } from "@/utils/validation/branchValidation";

export default function BranchesPage() {
  // ============================================================================
  // SIMPLE DROPDOWN COMPONENT (INLINE)
  // ============================================================================
  const DropdownMenu = ({ children }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className="relative" ref={dropdownRef}>
        {React.Children.map(children, (child) => React.cloneElement(child, { isOpen, setIsOpen }))}
      </div>
    );
  };

  const DropdownMenuTrigger = ({ children, isOpen, setIsOpen }) => <div onClick={() => setIsOpen(!isOpen)}>{children}</div>;

  const DropdownMenuContent = ({ children, isOpen }) => {
    if (!isOpen) return null;
    return <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-50">{children}</div>;
  };

  const DropdownMenuItem = ({ children, onClick, className = "" }) => (
    <button onClick={onClick} className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center ${className}`}>
      {children}
    </button>
  );

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [filters, setFilters] = useState({
    includeInactive: false,
  });

  // PAGINATION STATE - FIXED 5 ITEMS PER PAGE
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // Fixed 5 items per page

  // Collapse state for head branches
  const [collapsedBranches, setCollapsedBranches] = useState(new Set());

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
  // API HOOKS - WITH PAGINATION
  // ============================================================================
  const { data: branchesData, isLoading } = useBranches({
    ...filters,
    page,
    limit,
  });
  const { data: headBranches } = useHeadBranches();

  // Extract branches and pagination from response
  const branches = branchesData?.branches || [];
  const pagination = branchesData?.pagination;

  const { mutate: createBranch, isPending: isCreating } = useCreateBranch();
  const { mutate: updateBranch, isPending: isUpdating } = useUpdateBranch();
  const { mutate: deleteBranch, isPending: isDeleting } = useDeleteBranch();
  const { mutate: toggleActive } = useToggleBranchActive();
  const { mutate: toggleHead, isPending: isTogglingHead } = useToggleBranchHead();
  const { mutate: resetPassword } = useResetBranchAdminPassword();

  // ============================================================================
  // COLLAPSE HANDLERS
  // ============================================================================
  const toggleCollapse = (branchId) => {
    setCollapsedBranches((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(branchId)) {
        newSet.delete(branchId);
      } else {
        newSet.add(branchId);
      }
      return newSet;
    });
  };

  // ============================================================================
  // PAGINATION HANDLER
  // ============================================================================
  const handlePageChange = (newPage) => {
    setPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ============================================================================
  // CREATE BRANCH MODAL
  // ============================================================================
  const CreateBranchModal = () => {
    const [isHeadBranch, setIsHeadBranch] = useState(true);
    const { data: headBranchesForCreate } = useHeadBranches();

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      setValue,
    } = useForm({
      resolver: zodResolver(isHeadBranch ? createHeadBranchSchema : createSubBranchSchema),
      defaultValues: {
        is_head_branch: true,
      },
    });

    const handleBranchTypeChange = (isHead) => {
      setIsHeadBranch(isHead);
      setValue("is_head_branch", isHead);
    };

    const onSubmit = (data) => {
      createBranch(data, {
        onSuccess: (response) => {
          toast.success("Branch created successfully");

          if (response.admin && response.admin.temporaryPassword) {
            setGeneratedPassword({
              password: response.admin.temporaryPassword,
              username: response.admin.username,
            });
            setPasswordModalOpen(true);
          }

          setCreateModalOpen(false);
          reset();
          // Reset to page 1 after creating new branch
          setPage(1);
        },
      });
    };

    const handleClose = () => {
      setCreateModalOpen(false);
      reset();
      setIsHeadBranch(true);
    };

    return (
      <Modal open={createModalOpen} onClose={handleClose} title="Create New Branch" description="Add a new branch to the system" size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={isHeadBranch} onChange={() => handleBranchTypeChange(true)} className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Head Branch</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={!isHeadBranch} onChange={() => handleBranchTypeChange(false)} className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Sub Branch</span>
              </label>
            </div>
          </FormField>

          <FormField>
            <FormLabel required>Branch Code</FormLabel>
            <Input {...register("code")} placeholder="e.g., HQ, SUB1" error={!!errors.code} helperText={errors.code?.message} />
          </FormField>

          <FormField>
            <FormLabel required>Branch Name</FormLabel>
            <Input {...register("name")} placeholder="e.g., Head Quarter" error={!!errors.name} helperText={errors.name?.message} />
          </FormField>

          {!isHeadBranch && (
            <FormField>
              <FormLabel required>Parent Branch</FormLabel>
              <Select {...register("parent_id", { valueAsNumber: true })} error={!!errors.parent_id} helperText={errors.parent_id?.message}>
                <option value="">Select parent branch</option>
                {headBranchesForCreate?.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} ({branch.code})
                  </option>
                ))}
              </Select>
            </FormField>
          )}

          {isHeadBranch && (
            <FormField>
              <FormLabel>Admin Username (Optional)</FormLabel>
              <Input {...register("admin_username")} placeholder="e.g., admin_hq" error={!!errors.admin_username} helperText={errors.admin_username?.message || "Leave empty to auto-generate"} />
            </FormField>
          )}

          <input type="hidden" {...register("is_head_branch")} value={isHeadBranch} />

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
              {isCreating ? "Creating..." : "Create Branch"}
            </button>
          </div>
        </form>
      </Modal>
    );
  };

  // ============================================================================
  // EDIT BRANCH MODAL
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
            parent_id: selectedBranch.parent_id || undefined,
          }
        : {},
    });

    const onSubmit = (data) => {
      const cleanedData = {
        code: data.code,
        name: data.name,
      };

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
      <Modal open={editModalOpen} onClose={handleClose} title="Edit Branch" description={`Update details for ${selectedBranch.name}`} size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField>
            <FormLabel required>Branch Code</FormLabel>
            <Input {...register("code")} error={!!errors.code} helperText={errors.code?.message} />
          </FormField>

          <FormField>
            <FormLabel required>Branch Name</FormLabel>
            <Input {...register("name")} error={!!errors.name} helperText={errors.name?.message} />
          </FormField>

          {!selectedBranch.is_head_branch && (
            <FormField>
              <FormLabel>Parent Branch</FormLabel>
              <Select {...register("parent_id", { valueAsNumber: true })} error={!!errors.parent_id} helperText={errors.parent_id?.message}>
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
              {isUpdating ? "Updating..." : "Update Branch"}
            </button>
          </div>
        </form>
      </Modal>
    );
  };

  // ============================================================================
  // TOGGLE HEAD/SUB MODAL
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
            toast.success(`Branch converted to ${willBeHead ? "head" : "sub"} branch`);

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
      <Modal open={toggleHeadModalOpen} onClose={handleClose} title={`Convert to ${willBeHead ? "Head" : "Sub"} Branch`} description={`Change ${selectedBranch.name} to a ${willBeHead ? "head" : "sub"} branch`} size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {willBeHead ? (
            <FormField>
              <FormLabel>Admin Username</FormLabel>
              <Input {...register("admin_username")} placeholder="e.g., admin_branch" error={!!errors.admin_username} helperText={errors.admin_username?.message || "Leave empty to auto-generate"} />
            </FormField>
          ) : (
            <FormField>
              <FormLabel required>Parent Branch</FormLabel>
              <Select {...register("parent_id", { valueAsNumber: true })} error={!!errors.parent_id} helperText={errors.parent_id?.message}>
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

          <input type="hidden" {...register("is_head_branch")} value={willBeHead} />

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
              {isTogglingHead ? "Converting..." : `Convert to ${willBeHead ? "Head" : "Sub"}`}
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
        toast.success(`Branch ${branch.is_active ? "deactivated" : "activated"}`);
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
        console.log("🔍 Full Reset Password Response:", data);
        console.log("🔍 data.password:", data.password);
        console.log("🔍 data.temporaryPassword:", data.temporaryPassword);
        console.log("🔍 data.newPassword:", data.newPassword);

        // Try different possible field names
        const pwd = data.password || data.temporaryPassword || data.newPassword || data.temp_password;
        const usr = data.username || data.admin?.username || `admin_${branch.code.toLowerCase()}`;

        console.log("🔍 Final values - password:", pwd, "username:", usr);

        setGeneratedPassword({
          password: pwd,
          username: usr,
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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Branch Management</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Manage all branches and their hierarchy</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Create Branch
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card-auto p-4">
        <Checkbox label="Show inactive branches" checked={filters.includeInactive} onChange={(e) => setFilters({ ...filters, includeInactive: e.target.checked })} />
      </div>

      {/* Branches List - WITH PAGINATION */}
      <div className="glass-card-auto">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              All Branches
              {pagination && (
                <span className="ml-2 text-sm font-normal text-neutral-600 dark:text-neutral-400">
                  (Showing {(page - 1) * limit + 1}-{Math.min(page * limit, pagination.total)} of {pagination.total})
                </span>
              )}
            </h2>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">{limit} items per page</span>
          </div>
        </div>

        <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {isLoading ? (
            <div className="px-6 py-12 text-center">
              <Spinner size="lg" className="mx-auto" />
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Loading branches...</p>
            </div>
          ) : branches?.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-neutral-600 dark:text-neutral-400">No branches found</p>
            </div>
          ) : (
            <>
              {branches?.map((branch) => (
                <Fragment key={branch.id}>
                  {/* ========================================== */}
                  {/* HEAD BRANCH - IMPROVED DESIGN */}
                  {/* ========================================== */}
                  <div className="relative bg-primary-50/30 dark:bg-primary-900/10 border-l-4 border-primary-500">
                    <div className="px-6 py-4 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition">
                      <div className="flex items-start justify-between gap-4">
                        {/* Left: Branch Info */}
                        <div className="flex-1 flex items-start gap-3">
                          {/* Collapse Toggle (only if has sub branches) */}
                          {branch.sub_branches && branch.sub_branches.length > 0 && (
                            <button onClick={() => toggleCollapse(branch.id)} className="mt-1 p-1 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded transition">
                              {collapsedBranches.has(branch.id) ? <ChevronRight className="w-4 h-4 text-neutral-600 dark:text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />}
                            </button>
                          )}

                          <div className="flex-1 min-w-0">
                            {/* Branch Name + Code */}
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{branch.name}</h3>
                              <Badge variant="default" size="sm" className="font-mono">
                                {branch.code}
                              </Badge>
                            </div>

                            {/* Status Badges - Horizontal */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="primary" size="sm">
                                Head Branch
                              </Badge>
                              <Badge variant={branch.is_active ? "success" : "danger"} size="sm">
                                {branch.is_active ? "Active" : "Inactive"}
                              </Badge>
                              {branch.sub_branches && branch.sub_branches.length > 0 && (
                                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                                  {branch.sub_branches.length} sub branch
                                  {branch.sub_branches.length > 1 ? "es" : ""}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions - SIMPLIFIED */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Primary Actions */}
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(branch)} leftIcon={<Edit2 className="w-4 h-4" />}>
                            Edit
                          </Button>

                          {/* More Actions Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleToggleActive(branch)}>
                                <Power className="w-4 h-4 mr-2" />
                                {branch.is_active ? "Deactivate" : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleHead(branch)}>
                                <ArrowLeftRight className="w-4 h-4 mr-2" />
                                Convert to Sub
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleResetPassword(branch)}>
                                <Key className="w-4 h-4 mr-2" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(branch)} className="text-danger-600 dark:text-danger-400">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ========================================== */}
                  {/* SUB BRANCHES - IMPROVED DESIGN */}
                  {/* ========================================== */}
                  {branch.sub_branches &&
                    branch.sub_branches.length > 0 &&
                    !collapsedBranches.has(branch.id) &&
                    branch.sub_branches.map((subBranch) => (
                      <div key={subBranch.id} className="relative bg-neutral-50/50 dark:bg-neutral-800/30">
                        {/* Vertical Line */}
                        <div className="absolute left-6 top-0 bottom-0 w-px bg-neutral-300 dark:bg-neutral-600" />

                        <div className="px-6 py-4 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 transition">
                          <div className="flex items-start justify-between gap-4 ml-8">
                            {/* Left: Branch Info */}
                            <div className="flex-1 flex items-start gap-3">
                              {/* Branch Connector */}
                              <div className="relative flex-shrink-0 mt-2">
                                <div className="w-6 h-px bg-neutral-300 dark:bg-neutral-600" />
                              </div>

                              <div className="flex-1 min-w-0">
                                {/* Branch Name + Code */}
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                  <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{subBranch.name}</h4>
                                  <Badge variant="default" size="sm" className="font-mono text-xs">
                                    {subBranch.code}
                                  </Badge>
                                </div>

                                {/* Status + Parent Info */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant={subBranch.is_active ? "success" : "danger"} size="sm">
                                    {subBranch.is_active ? "Active" : "Inactive"}
                                  </Badge>
                                  <span className="text-xs text-neutral-500 dark:text-neutral-400">under {branch.name}</span>
                                </div>
                              </div>
                            </div>

                            {/* Right: Actions - SIMPLIFIED */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {/* Primary Actions */}
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(subBranch)} leftIcon={<Edit2 className="w-4 h-4" />}>
                                Edit
                              </Button>

                              {/* More Actions Dropdown */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleToggleActive(subBranch)}>
                                    <Power className="w-4 h-4 mr-2" />
                                    {subBranch.is_active ? "Deactivate" : "Activate"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleToggleHead(subBranch)}>
                                    <ArrowLeftRight className="w-4 h-4 mr-2" />
                                    Convert to Head
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDelete(subBranch)} className="text-danger-600 dark:text-danger-400">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </Fragment>
              ))}
            </>
          )}
        </div>

        {/* PAGINATION COMPONENT - ADDED HERE */}
        {!isLoading && branches?.length > 0 && pagination && (
          <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700">
            <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
          </div>
        )}
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
