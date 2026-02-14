/**
 * API Index - Barrel Export
 * Central export untuk semua API modules
 */

// Export axios client
export { default as api, BASE_URL } from "./client";

// Auth API
export * as authApi from "./auth.api";

// Branch API
export * as branchApi from "./branch.api";

// Division API
export * as divisionApi from "./division.api";

// Module API
export * as moduleApi from "./module.api";

// Teacher API
export * as teacherApi from "./teacher.api";

// Teacher Profile API
export * as teacherProfileApi from "./teacherProfile.api";

// Certificate API (Admin)
export * as certificateApi from "./certificate.api";

// Certificate Teacher API
export * as certificateTeacherApi from "./certificateTeacher.api";

// Certificate Log API
export * as certificateLogApi from "./certificateLog.api";

// Certificate PDF API
export * as certificatePdfApi from "./certificatePdf.api";

// Student API
export * as studentApi from "./student.api";

// Backup API
export * as backupApi from "./backup.api";
