/**
 * Teacher Certificates Page
 * Reserve and print certificates
 *
 * FEATURES:
 * - View certificate availability per branch
 * - Reserve certificate (select branch)
 * - Print certificate (fill form):
 *   - Select reserved certificate
 *   - Student name (autocomplete)
 *   - Module selection (from teacher's divisions)
 *   - PTC date
 *   - Upload PDF proof
 * - View active reservations
 * - Release reservation
 * - Upload PDF for printed certificates
 *
 * COMPONENTS TO BUILD:
 * - Two-step process:
 *   Step 1: Reserve Certificate
 *   - Branch selection
 *   - Available count display
 *   - Reserve button
 *
 *   Step 2: Print Certificate
 *   - Reserved certificate dropdown
 *   - Student name input (with autocomplete)
 *   - Module dropdown
 *   - PTC date picker
 *   - PDF upload (optional during print, required later)
 *   - Print button
 *
 * - Active reservations sidebar
 * - Certificate availability widget
 *
 * LAYOUT:
 * - Two columns: Main form (left) + Reservations (right)
 * - Stepper/tabs for Reserve vs Print
 */

import { useState } from "react";

export default function TeacherCertificatesPage() {
  const [activeTab, setActiveTab] = useState("reserve"); // 'reserve' or 'print'

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Certificate Operations
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Reserve and print certificates for students
        </p>
      </div>

      {/* Process Steps Indicator */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-4">
            {/* Step 1 */}
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  activeTab === "reserve"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">
                Reserve Certificate
              </span>
            </div>

            {/* Arrow */}
            <span className="text-gray-400">→</span>

            {/* Step 2 */}
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  activeTab === "print"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">
                Print Certificate
              </span>
            </div>

            {/* Arrow */}
            <span className="text-gray-400">→</span>

            {/* Step 3 */}
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">
                Upload PDF
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Main Form */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab("reserve")}
                  className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                    activeTab === "reserve"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  1. Reserve Certificate
                </button>
                <button
                  onClick={() => setActiveTab("print")}
                  className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                    activeTab === "print"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  2. Print Certificate
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Reserve Form */}
              {activeTab === "reserve" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Reserve a Certificate
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Select a branch to reserve a certificate. You can reserve
                      up to 5 certificates at once. Reservations expire after 24
                      hours.
                    </p>
                  </div>

                  {/* Branch Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Branch
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Choose a branch...</option>
                      <option value="1">Head Branch (35 available)</option>
                      <option value="2">Branch A (10 available)</option>
                    </select>
                  </div>

                  {/* Availability Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <span className="text-blue-600 text-xl mr-3">ℹ️</span>
                      <div>
                        <h4 className="text-sm font-medium text-blue-900">
                          Certificate Availability
                        </h4>
                        <ul className="mt-2 text-sm text-blue-700 space-y-1">
                          <li>• Head Branch: 35 certificates available</li>
                          <li>• Branch A: 10 certificates available</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Reserve Button */}
                  <button className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
                    Reserve Certificate
                  </button>
                </div>
              )}

              {/* Print Form */}
              {activeTab === "print" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Print Certificate
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Fill in the student details to print the certificate.
                    </p>
                  </div>

                  {/* Reserved Certificate Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Reserved Certificate *
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Choose a reserved certificate...</option>
                      <option value="123">No. 000123 (Reserved 1h ago)</option>
                      <option value="124">No. 000124 (Reserved 30m ago)</option>
                      <option value="125">No. 000125 (Reserved 10m ago)</option>
                    </select>
                  </div>

                  {/* Student Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter student name (min 2 characters)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Start typing to search existing students or enter new name
                    </p>
                  </div>

                  {/* Module Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Module *
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Choose a module...</option>
                      <option value="1">KID-BEG - Kids Beginner</option>
                      <option value="2">KID-INT - Kids Intermediate</option>
                      <option value="3">TEEN-BEG - Teens Beginner</option>
                    </select>
                  </div>

                  {/* PTC Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PTC Date *
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Date cannot be in the future
                    </p>
                  </div>

                  {/* PDF Upload (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload PDF (Optional)
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      You can upload the PDF now or later from Print History
                    </p>
                  </div>

                  {/* Print Button */}
                  <button className="w-full px-4 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700">
                    Print Certificate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Active Reservations */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg sticky top-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Active Reservations (3/5)
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-3">
                {/* Reservation Item */}
                <div className="p-3 border border-gray-200 rounded">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-mono font-medium text-gray-900">
                      No. 000123
                    </p>
                    <button className="text-xs text-red-600 hover:text-red-700">
                      Release
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Reserved 1 hour ago</p>
                  <p className="text-xs text-orange-600 mt-1">
                    ⏰ Expires in 23 hours
                  </p>
                </div>

                <div className="p-3 border border-gray-200 rounded">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-mono font-medium text-gray-900">
                      No. 000124
                    </p>
                    <button className="text-xs text-red-600 hover:text-red-700">
                      Release
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Reserved 30 minutes ago
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    ⏰ Expires in 23.5 hours
                  </p>
                </div>

                <div className="p-3 border border-gray-200 rounded">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-mono font-medium text-gray-900">
                      No. 000125
                    </p>
                    <button className="text-xs text-red-600 hover:text-red-700">
                      Release
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Reserved 10 minutes ago
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    ⏰ Expires in 23.8 hours
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded text-center">
                <p className="text-xs text-gray-600">
                  You have <span className="font-medium">2 slots</span> left
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
