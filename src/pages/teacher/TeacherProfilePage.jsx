/**
 * Teacher Profile Page
 * Teacher's own profile and settings
 *
 * FEATURES:
 * - View profile information
 * - Edit full name (only field teacher can edit)
 * - Change password
 * - View assigned branches (read-only)
 * - View assigned divisions (read-only)
 * - View available modules (read-only)
 *
 * COMPONENTS TO BUILD:
 * - Profile card:
 *   - Username (read-only)
 *   - Full name (editable)
 *   - Role badge
 *   - Edit button
 * - Change password section
 * - Assigned branches card (list with badges)
 * - Assigned divisions card (list with badges)
 * - Available modules card (grouped by division)
 *
 * LAYOUT:
 * - Two columns: Profile info (left) + Assignments (right)
 * - Change password section at bottom
 */

export default function TeacherProfilePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your profile and view your assignments
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-600">JD</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">John Doe</h2>
                <p className="text-sm text-gray-500">@johndoe</p>
                <span className="inline-flex mt-2 px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  Teacher
                </span>
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Username</span>
                  <span className="text-sm font-medium text-gray-900">
                    johndoe
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Full Name</span>
                  <span className="text-sm font-medium text-gray-900">
                    John Doe
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className="text-sm px-2 py-1 rounded bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Prints</span>
                <span className="text-lg font-bold text-gray-900">124</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="text-lg font-bold text-gray-900">28</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Active Reservations
                </span>
                <span className="text-lg font-bold text-gray-900">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Assignments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assigned Branches */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Assigned Branches
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                You can reserve certificates from these branches
              </p>
            </div>
            <div className="px-6 py-4">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-2 rounded-md bg-blue-100 text-blue-800 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
                  Head Branch (HQ)
                </span>
                <span className="inline-flex items-center px-3 py-2 rounded-md bg-blue-100 text-blue-800 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
                  Branch A
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Divisions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Assigned Divisions
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                You can print certificates for students in these divisions
              </p>
            </div>
            <div className="px-6 py-4">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-2 rounded-md bg-purple-100 text-purple-800 text-sm font-medium">
                  Kids
                </span>
                <span className="inline-flex items-center px-3 py-2 rounded-md bg-purple-100 text-purple-800 text-sm font-medium">
                  Teens
                </span>
                <span className="inline-flex items-center px-3 py-2 rounded-md bg-purple-100 text-purple-800 text-sm font-medium">
                  Adults
                </span>
              </div>
            </div>
          </div>

          {/* Available Modules */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Available Modules
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Modules you can select when printing certificates
              </p>
            </div>
            <div className="px-6 py-4">
              {/* Kids Modules */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Kids Division
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-800 text-sm">
                    KID-BEG
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-800 text-sm">
                    KID-INT
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-800 text-sm">
                    KID-ADV
                  </span>
                </div>
              </div>

              {/* Teens Modules */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Teens Division
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-800 text-sm">
                    TEEN-BEG
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-800 text-sm">
                    TEEN-INT
                  </span>
                </div>
              </div>

              {/* Adults Modules */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Adults Division
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-800 text-sm">
                    ADULT-BASIC
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-800 text-sm">
                    ADULT-CONV
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Change Password
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Update your password to keep your account secure
              </p>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Min 8 characters, 1 uppercase, 1 special character
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm new password"
                  />
                </div>
                <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TODO: Modals */}
      {/* - Edit Profile Modal (full name only) */}
    </div>
  );
}
