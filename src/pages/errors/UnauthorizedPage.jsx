/**
 * 403 Unauthorized Page
 * Displayed when user tries to access a page they don't have permission for
 */

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { getRoleLabel } from "@/utils/constants/roles";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* Unauthorized Icon */}
          <div className="mx-auto h-32 w-32 text-red-600 mb-4">
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          {/* Error Message */}
          <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4 px-4">
            You don't have permission to access this page.
          </p>

          {/* User Info */}
          {user && (
            <div className="mb-8 px-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                <span className="text-sm text-gray-600">Your role:</span>
                <span className="text-sm font-medium text-gray-900">
                  {getRoleLabel(user)}
                </span>
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 mx-4">
            <p className="text-sm text-yellow-800">
              If you believe you should have access to this page, please contact
              your administrator.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              ← Go Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
