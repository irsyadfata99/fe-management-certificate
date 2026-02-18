/**
 * Hooks Index - Barrel Export
 * Central export untuk semua custom hooks
 */

// =============================================================================
// AUTH HOOKS
// =============================================================================
export * from "./auth/useAuth";
export * from "./auth/useProfile";

// =============================================================================
// BACKUP HOOKS
// =============================================================================
export * from "./backup/useBackup";

// =============================================================================
// BRANCH HOOKS
// =============================================================================
export * from "./branch/useBranches";
export * from "./branch/useBranchMutations";

// =============================================================================
// CERTIFICATE HOOKS
// =============================================================================
export * from "./certificate/useCertificates";
export * from "./certificate/useCertificateStock";
export * from "./certificate/useTeacherCertificates";
export * from "./certificate/useCertificateLogs";
export * from "./certificate/useCertificatePdf";
export * from "./certificate/useExportPrints";

// =============================================================================
// DIVISION HOOKS
// =============================================================================
export * from "./division/useDivisions";
export * from "./division/useDivisionMutations";

// =============================================================================
// MODULE HOOKS
// =============================================================================
export * from "./module/useModules";
export * from "./module/useModuleMutations";

// =============================================================================
// TEACHER HOOKS
// =============================================================================
export * from "./teacher/useTeachers";
export * from "./teacher/useTeacherMutations";
export * from "./teacher/useTeacherProfile";

// =============================================================================
// STUDENT HOOKS
// =============================================================================
export * from "./student/useStudents";
export * from "./student/useStudentSearch";

// =============================================================================
// SHARED HOOKS
// =============================================================================
export * from "./shared/useDebounce";
export * from "./shared/usePagination";
export * from "./shared/useFilters";
export * from "./shared/useLocalStorage";
export * from "./shared/useToggle";
export * from "./shared/useDisclosure";
export * from "./shared/useConfirm";
export * from "./shared/useTable";
export * from "./shared/useClipboard";
export { useRoleGuard } from "./useRoleGuard";
