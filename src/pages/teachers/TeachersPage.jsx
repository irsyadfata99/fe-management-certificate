/**
 * Teachers Page (Admin Only)
 * Complete teacher management with CRUD operations
 *
 * ✅ FIXED BUGS:
 * 1. Removed onSuccess override → Cache invalidation now works properly
 * 2. Properly handle mutation response for password display
 * 3. Fixed loading states for all buttons
 * 4. ✅ NEW FIX: Correct response path for password (response.data.temporaryPassword)
 *
 * ✅ FEATURES:
 * - Branch & Division filters with pagination (8 items/page)
 * - Search by name or username
 * - Show inactive toggle
 * - Create teacher with auto-generated password
 * - Edit teacher (username, full_name, branch_ids, division_ids)
 * - Reset teacher password
 * - Toggle active/inactive
 * - View teacher details
 */

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit2, Power, Key, Eye, Search, X } from "lucide-react";

// Hooks
import {
  useTeachers,
  useBranches,
  useDivisions,
  useCreateTeacher,
  useUpdateTeacher,
  useResetTeacherPassword,
  useToggleTeacherActive,
} from "@/hooks";

// UI Components
import {
  Button,
  Input,
  Select,
  MultiSelect,
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

// Shared Components
import PasswordDisplayModal from "@/components/shared/PasswordDisplayModal";

// Validation
import {
  createTeacherSchema,
  updateTeacherSchema,
} from "@/utils/validation/teacherValidation";

export default function TeachersPage() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [filters, setFilters] = useState({
    includeInactive: false,
    search: "",
    branchId: "",
    divisionId: "",
    page: 1,
    limit: 8,
  });

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  // Selected teacher for actions
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState(null);

  // ============================================================================
  // API HOOKS
  // ============================================================================
  const { data: teachersData, isLoading } = useTeachers(filters);
  const { data: branchesData } = useBranches({ includeInactive: false });
  const { data: divisionsData } = useDivisions({ includeInactive: false });

  // ✅ FIX: Don't override onSuccess, let mutation hooks handle cache invalidation
  const createTeacherMutation = useCreateTeacher();
  const updateTeacherMutation = useUpdateTeacher();
  const resetPasswordMutation = useResetTeacherPassword();
  const toggleActiveMutation = useToggleTeacherActive();

  // Extract data properly
  const teachers = teachersData?.teachers || [];
  const pagination = teachersData?.pagination || {
    total: 0,
    page: 1,
    limit: 8,
    totalPages: 1,
  };

  const branches = branchesData?.branches || [];
  const divisions = divisionsData || [];

  // ============================================================================
  // PREPARE OPTIONS FOR MULTI-SELECT
  // ============================================================================
  const branchOptions =
    branches?.map((b) => ({
      value: b.id,
      label: `${b.name} (${b.code})`,
    })) || [];

  const divisionOptions =
    divisions?.map((d) => ({
      value: d.id,
      label: d.name,
    })) || [];

  // ============================================================================
  // CREATE TEACHER MODAL
  // ============================================================================
  const CreateTeacherModal = () => {
    const {
      register,
      handleSubmit,
      control,
      formState: { errors },
      reset,
    } = useForm({
      resolver: zodResolver(createTeacherSchema),
      defaultValues: {
        branch_ids: [],
        division_ids: [],
      },
    });

    const onSubmit = (data) => {
      // ✅ FIX: Access password from response.data.temporaryPassword
      createTeacherMutation.mutate(data, {
        onSuccess: (response) => {
          console.log("Create teacher response:", response); // Debug log

          // ✅ FIX: Backend returns { data: { teacher, temporaryPassword } }
          const password =
            response?.data?.temporaryPassword || response?.temporaryPassword;

          if (password) {
            setGeneratedPassword({
              password: password,
              username: data.username,
            });
            setPasswordModalOpen(true);
          } else {
            console.warn("No password found in response:", response);
          }

          setCreateModalOpen(false);
          reset();
        },
        onError: (error) => {
          console.error("Create teacher error:", error);
        },
      });
    };

    const handleClose = () => {
      setCreateModalOpen(false);
      reset();
    };

    return (
      <Modal
        open={createModalOpen}
        onClose={handleClose}
        title="Create New Teacher"
        description="Add a new teacher to the system"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <FormField>
            <FormLabel required>Username</FormLabel>
            <Input
              {...register("username")}
              placeholder="e.g., teacher_john"
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          </FormField>

          {/* Full Name */}
          <FormField>
            <FormLabel required>Full Name</FormLabel>
            <Input
              {...register("full_name")}
              placeholder="e.g., John Doe"
              error={!!errors.full_name}
              helperText={errors.full_name?.message}
            />
          </FormField>

          {/* Branch Assignment */}
          <FormField>
            <FormLabel required>Assigned Branches (Max 10)</FormLabel>
            <Controller
              name="branch_ids"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={branchOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select branches..."
                  error={!!errors.branch_ids}
                  helperText={errors.branch_ids?.message}
                  fullWidth
                />
              )}
            />
          </FormField>

          {/* Division Assignment */}
          <FormField>
            <FormLabel required>Assigned Divisions (Max 20)</FormLabel>
            <Controller
              name="division_ids"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={divisionOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select divisions..."
                  error={!!errors.division_ids}
                  helperText={errors.division_ids?.message}
                  fullWidth
                />
              )}
            />
          </FormField>

          {/* Footer */}
          <ModalFooter
            onCancel={handleClose}
            onConfirm={handleSubmit(onSubmit)}
            cancelText="Cancel"
            confirmText="Create Teacher"
            confirmLoading={createTeacherMutation.isPending}
            confirmDisabled={createTeacherMutation.isPending}
          />
        </form>
      </Modal>
    );
  };

  // ============================================================================
  // EDIT TEACHER MODAL
  // ============================================================================
  const EditTeacherModal = () => {
    const {
      register,
      handleSubmit,
      control,
      formState: { errors },
      reset,
    } = useForm({
      resolver: zodResolver(updateTeacherSchema),
      defaultValues: selectedTeacher
        ? {
            username: selectedTeacher.username,
            full_name: selectedTeacher.full_name,
            branch_ids: selectedTeacher.branch_ids || [],
            division_ids: selectedTeacher.division_ids || [],
          }
        : {},
    });

    const onSubmit = (data) => {
      // ✅ FIX: Don't override onSuccess
      updateTeacherMutation.mutate(
        { id: selectedTeacher.id, data },
        {
          onSuccess: () => {
            setEditModalOpen(false);
            setSelectedTeacher(null);
            reset();
          },
        },
      );
    };

    const handleClose = () => {
      setEditModalOpen(false);
      setSelectedTeacher(null);
      reset();
    };

    if (!selectedTeacher) return null;

    return (
      <Modal
        open={editModalOpen}
        onClose={handleClose}
        title="Edit Teacher"
        description={`Update details for ${selectedTeacher.full_name}`}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <FormField>
            <FormLabel required>Username</FormLabel>
            <Input
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          </FormField>

          {/* Full Name */}
          <FormField>
            <FormLabel required>Full Name</FormLabel>
            <Input
              {...register("full_name")}
              error={!!errors.full_name}
              helperText={errors.full_name?.message}
            />
          </FormField>

          {/* Branch Assignment */}
          <FormField>
            <FormLabel required>Assigned Branches (Max 10)</FormLabel>
            <Controller
              name="branch_ids"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={branchOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select branches..."
                  error={!!errors.branch_ids}
                  helperText={errors.branch_ids?.message}
                  fullWidth
                />
              )}
            />
          </FormField>

          {/* Division Assignment */}
          <FormField>
            <FormLabel required>Assigned Divisions (Max 20)</FormLabel>
            <Controller
              name="division_ids"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={divisionOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select divisions..."
                  error={!!errors.division_ids}
                  helperText={errors.division_ids?.message}
                  fullWidth
                />
              )}
            />
          </FormField>

          {/* Footer */}
          <ModalFooter
            onCancel={handleClose}
            onConfirm={handleSubmit(onSubmit)}
            cancelText="Cancel"
            confirmText="Update Teacher"
            confirmLoading={updateTeacherMutation.isPending}
            confirmDisabled={updateTeacherMutation.isPending}
          />
        </form>
      </Modal>
    );
  };

  // ============================================================================
  // TEACHER DETAIL DRAWER/MODAL
  // ============================================================================
  const TeacherDetailDrawer = () => {
    if (!selectedTeacher) return null;

    const teacherBranches = branches?.filter((b) =>
      selectedTeacher.branch_ids?.includes(b.id),
    );

    const teacherDivisions = divisions?.filter((d) =>
      selectedTeacher.division_ids?.includes(d.id),
    );

    return (
      <Modal
        open={detailDrawerOpen}
        onClose={() => {
          setDetailDrawerOpen(false);
          setSelectedTeacher(null);
        }}
        title="Teacher Details"
        description={selectedTeacher.full_name}
        size="md"
      >
        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Basic Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Username:
                </span>
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {selectedTeacher.username}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Status:
                </span>
                <Badge
                  variant={selectedTeacher.is_active ? "success" : "danger"}
                  size="sm"
                >
                  {selectedTeacher.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Assigned Branches */}
          <div>
            <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Assigned Branches ({teacherBranches?.length || 0})
            </h3>
            <div className="flex flex-wrap gap-2">
              {teacherBranches?.length > 0 ? (
                teacherBranches.map((branch) => (
                  <Badge key={branch.id} variant="primary" size="sm">
                    {branch.name} ({branch.code})
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  No branches assigned
                </p>
              )}
            </div>
          </div>

          {/* Assigned Divisions */}
          <div>
            <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Assigned Divisions ({teacherDivisions?.length || 0})
            </h3>
            <div className="flex flex-wrap gap-2">
              {teacherDivisions?.length > 0 ? (
                teacherDivisions.map((division) => (
                  <Badge key={division.id} variant="info" size="sm">
                    {division.name}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  No divisions assigned
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="secondary"
            onClick={() => {
              setDetailDrawerOpen(false);
              setSelectedTeacher(null);
            }}
          >
            Close
          </Button>
        </div>
      </Modal>
    );
  };

  // ============================================================================
  // ACTION HANDLERS
  // ============================================================================
  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setEditModalOpen(true);
  };

  const handleViewDetails = (teacher) => {
    setSelectedTeacher(teacher);
    setDetailDrawerOpen(true);
  };

  const handleToggleActive = (teacher) => {
    toggleActiveMutation.mutate(teacher.id);
  };

  const handleResetPassword = (teacher) => {
    // ✅ FIX: Access password from response.data.temporaryPassword
    resetPasswordMutation.mutate(teacher.id, {
      onSuccess: (response) => {
        console.log("Reset password response:", response); // Debug log

        // ✅ FIX: Backend returns { data: { temporaryPassword } }
        const password =
          response?.data?.temporaryPassword || response?.temporaryPassword;

        if (password) {
          setGeneratedPassword({
            password: password,
            username: teacher.username,
          });
          setPasswordModalOpen(true);
        } else {
          console.warn("No password found in response:", response);
        }
      },
      onError: (error) => {
        console.error("Reset password error:", error);
      },
    });
  };

  const handleClearFilters = () => {
    setFilters({
      includeInactive: false,
      search: "",
      branchId: "",
      divisionId: "",
      page: 1,
      limit: 8,
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
            Teacher Management
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Manage teachers and their assignments
          </p>
        </div>
        <Button
          onClick={() => setCreateModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Teacher
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <Input
              placeholder="Search by username or name..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value, page: 1 })
              }
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Branch Filter */}
          <Select
            value={filters.branchId}
            onChange={(e) =>
              setFilters({ ...filters, branchId: e.target.value, page: 1 })
            }
          >
            <option value="">All Branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name} ({branch.code})
              </option>
            ))}
          </Select>

          {/* Division Filter */}
          <Select
            value={filters.divisionId}
            onChange={(e) =>
              setFilters({ ...filters, divisionId: e.target.value, page: 1 })
            }
          >
            <option value="">All Divisions</option>
            {divisions.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name}
              </option>
            ))}
          </Select>

          {/* Clear Filters */}
          <Button
            variant="secondary"
            onClick={handleClearFilters}
            leftIcon={<X className="w-4 h-4" />}
          >
            Clear
          </Button>
        </div>

        {/* Show Inactive Checkbox */}
        <div className="mt-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.includeInactive}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  includeInactive: e.target.checked,
                  page: 1,
                })
              }
              className="w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-2 focus:ring-primary-500"
            />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Show inactive teachers
            </span>
          </label>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="glass-card-auto overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead align="center">Branches</TableHead>
              <TableHead align="center">Divisions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead align="right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <div className="py-8">
                    <Spinner size="lg" className="mx-auto" />
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                      Loading teachers...
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : teachers?.length === 0 ? (
              <TableEmpty
                message="No teachers found. Try adjusting your filters."
                colSpan={6}
              />
            ) : (
              teachers?.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {teacher.username}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-neutral-900 dark:text-neutral-100">
                      {teacher.full_name}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <button
                      onClick={() => handleViewDetails(teacher)}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                    >
                      {teacher.branch_ids?.length || 0} branches
                    </button>
                  </TableCell>
                  <TableCell align="center">
                    <button
                      onClick={() => handleViewDetails(teacher)}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                    >
                      {teacher.division_ids?.length || 0} divisions
                    </button>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={teacher.is_active ? "success" : "danger"}
                      size="sm"
                    >
                      {teacher.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(teacher)}
                        leftIcon={<Eye className="w-4 h-4" />}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(teacher)}
                        leftIcon={<Edit2 className="w-4 h-4" />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleResetPassword(teacher)}
                        leftIcon={<Key className="w-4 h-4" />}
                        loading={resetPasswordMutation.isPending}
                        disabled={resetPasswordMutation.isPending}
                      >
                        Reset
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(teacher)}
                        leftIcon={<Power className="w-4 h-4" />}
                        loading={toggleActiveMutation.isPending}
                        disabled={toggleActiveMutation.isPending}
                      >
                        Toggle
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {!isLoading && teachers.length > 0 && pagination && (
          <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages || 1}
              onPageChange={(page) => setFilters({ ...filters, page })}
              totalItems={pagination.total}
              itemsPerPage={filters.limit}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateTeacherModal />
      <EditTeacherModal />
      <TeacherDetailDrawer />

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
          title="Teacher Password Generated"
        />
      )}
    </div>
  );
}
