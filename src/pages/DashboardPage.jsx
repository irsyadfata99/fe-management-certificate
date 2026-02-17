/**
 * Enhanced Dashboard Page - Production Ready with Nivo Charts
 * Role-based dashboard with charts, analytics, and activity timeline
 * - SuperAdmin: System overview with charts
 * - Admin: Stock analytics with charts
 * - Teacher: Personal statistics with charts
 *
 * UPDATED: Activity timeline now uses real API data
 * - SuperAdmin & Admin → useCertificateLogs
 * - Teacher → useMyPrints
 */

import { useState, useMemo } from "react";
import { isSuperAdmin, isAdmin, isTeacher } from "@/utils/constants/roles";
import { useAuthStore } from "@/store/authStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Skeleton,
  Alert,
  Button,
  Modal,
} from "@/components/ui";
import {
  Building2,
  Users,
  AlertTriangle,
  Package,
  CheckCircle,
  Clock,
  FileText,
  UserCircle,
  Printer,
  TrendingUp,
  Plus,
  Download,
  BarChart3,
  Activity,
  Upload,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  MoveRight,
  Lock,
  Unlock,
  Layers,
} from "lucide-react";

// Nivo Charts
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";

// API Hooks
import { useBranches } from "@/hooks/branch/useBranches";
import { useTeachers } from "@/hooks/teacher/useTeachers";
import { useStockAlerts } from "@/hooks/certificate/useCertificates";
import { useCertificateStock } from "@/hooks/certificate/useCertificates";
import { useCertificateStatistics } from "@/hooks/certificate/useCertificates";
import {
  useMyReservations,
  useMyPrints,
} from "@/hooks/certificate/useTeacherCertificates";
import { useStudents } from "@/hooks/student/useStudents";
import { useCertificateLogs } from "@/hooks/certificate/useCertificateLogs";
import { formatRelative } from "@/utils/format/dateFormat";

// ─────────────────────────────────────────────────────────
// ACTION TYPE CONFIG — icon & color per action
// ─────────────────────────────────────────────────────────

const ACTION_CONFIG = {
  bulk_create: {
    icon: Layers,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    label: "Bulk Created",
  },
  migrate: {
    icon: MoveRight,
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    label: "Migrated",
  },
  reserve: {
    icon: Lock,
    iconColor: "text-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    label: "Reserved",
  },
  print: {
    icon: Printer,
    iconColor: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    label: "Printed",
  },
  release: {
    icon: Unlock,
    iconColor: "text-slate-500",
    bgColor: "bg-slate-100 dark:bg-slate-700/50",
    label: "Released",
  },
};

const DEFAULT_ACTION_CONFIG = {
  icon: Activity,
  iconColor: "text-blue-500",
  bgColor: "bg-blue-100 dark:bg-blue-900/30",
  label: "Activity",
};

// ─────────────────────────────────────────────────────────
// ACTIVITY TIMELINE — Real data
// ─────────────────────────────────────────────────────────

/**
 * Map a certificate log entry to activity item shape
 */
function mapLogToActivity(log) {
  const config = ACTION_CONFIG[log.action_type] || DEFAULT_ACTION_CONFIG;

  // Build message based on action type
  let message = "";
  const actor = log.actor?.full_name || log.actor?.username || "Unknown";
  const certNum = log.certificate_number || "";

  switch (log.action_type) {
    case "bulk_create":
      message = `${actor} bulk created certificates`;
      break;
    case "migrate":
      message = `${actor} migrated ${certNum} to ${log.to_branch?.name || "another branch"}`;
      break;
    case "reserve":
      message = `${actor} reserved ${certNum}`;
      break;
    case "print":
      message = `${actor} printed ${certNum}${log.student_name ? ` for ${log.student_name}` : ""}`;
      break;
    case "release":
      message = `${actor} released ${certNum}`;
      break;
    default:
      message = `${actor} performed ${log.action_type}`;
  }

  return {
    icon: config.icon,
    iconColor: config.iconColor,
    bgColor: config.bgColor,
    message,
    time: formatRelative(log.created_at || log.createdAt),
  };
}

/**
 * Map a print record (Teacher) to activity item shape
 */
function mapPrintToActivity(print) {
  // Determine if it had a PDF upload recently
  const hasPdf = !!print.pdf_path;

  if (hasPdf) {
    return {
      icon: Upload,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      message: `Uploaded PDF for ${print.certificate_number || "certificate"}`,
      time: formatRelative(
        print.updated_at || print.printed_at || print.createdAt,
      ),
    };
  }

  return {
    icon: Printer,
    iconColor: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    message: `Printed certificate for ${print.student_name || "student"}${
      print.certificate_number ? ` (${print.certificate_number})` : ""
    }`,
    time: formatRelative(print.printed_at || print.createdAt),
  };
}

// ─────────────────────────────────────────────────────────
// ACTIVITY TIMELINE COMPONENT
// ─────────────────────────────────────────────────────────

function ActivityTimeline({ activities = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-2.5">
            <Skeleton className="w-7 h-7 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3.5 w-4/5 rounded" />
              <Skeleton className="h-3 w-1/3 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Activity className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No recent activity
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[240px] overflow-y-auto">
      {activities.map((activity, index) => (
        <div key={index} className="flex gap-2.5">
          <div className="flex-shrink-0">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center ${activity.bgColor}`}
            >
              <activity.icon className={`w-3.5 h-3.5 ${activity.iconColor}`} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-900 dark:text-white leading-tight">
              {activity.message}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {activity.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// ENHANCED STATS CARD
// ─────────────────────────────────────────────────────────

function EnhancedStatsCard({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  iconBg,
  trend,
  isLoading,
}) {
  const Icon = icon;
  const isPositive = trend > 0;
  const isNegative = trend < 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex-shrink-0 w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}
          >
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-14" />
              </div>
            ) : (
              <>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                  {title}
                </p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {value}
                  </p>
                  {trend !== undefined && (
                    <div
                      className={`flex items-center text-xs font-medium ${
                        isPositive
                          ? "text-green-600 dark:text-green-400"
                          : isNegative
                            ? "text-red-600 dark:text-red-400"
                            : "text-slate-500"
                      }`}
                    >
                      {isPositive && <ArrowUpRight className="w-3 h-3" />}
                      {isNegative && <ArrowDownRight className="w-3 h-3" />}
                      <span>{Math.abs(trend)}%</span>
                    </div>
                  )}
                </div>
                {subtitle && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {subtitle}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────
// CHART COMPONENTS
// ─────────────────────────────────────────────────────────

function LineChart({ data }) {
  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 10, right: 15, bottom: 40, left: 50 }}
      xScale={{ type: "point" }}
      yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
      curve="monotoneX"
      axisTop={null}
      axisRight={null}
      axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
      axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
      colors={["#6495ED", "#FF00FF"]}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      theme={{
        axis: { ticks: { text: { fill: "#94a3b8" } } },
        grid: { line: { stroke: "#334155", strokeWidth: 1 } },
        tooltip: {
          container: { background: "#1e293b", color: "#f1f5f9", fontSize: 12 },
        },
      }}
    />
  );
}

function BarChart({ data, keys = ["value"], indexBy = "label" }) {
  return (
    <ResponsiveBar
      data={data}
      keys={keys}
      indexBy={indexBy}
      margin={{ top: 10, right: 15, bottom: 40, left: 50 }}
      padding={0.3}
      colors={["#6495ED"]}
      borderRadius={4}
      axisTop={null}
      axisRight={null}
      axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
      axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor="#ffffff"
      theme={{
        axis: { ticks: { text: { fill: "#94a3b8" } } },
        grid: { line: { stroke: "#334155", strokeWidth: 1 } },
        tooltip: {
          container: { background: "#1e293b", color: "#f1f5f9", fontSize: 12 },
        },
      }}
    />
  );
}

function PieChart({ data }) {
  return (
    <ResponsivePie
      data={data}
      margin={{ top: 15, right: 15, bottom: 15, left: 15 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      colors={["#6495ED", "#22c55e", "#eab308"]}
      borderWidth={1}
      borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#94a3b8"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor="#ffffff"
      theme={{
        tooltip: {
          container: { background: "#1e293b", color: "#f1f5f9", fontSize: 12 },
        },
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────
// STATIC CHART DATA GENERATORS (charts still use mock data
// until dedicated statistics endpoints return time-series)
// ─────────────────────────────────────────────────────────

function generatePrintsTrendData() {
  return [
    {
      id: "Prints",
      data: [
        { x: "Sep", y: 45 },
        { x: "Oct", y: 52 },
        { x: "Nov", y: 61 },
        { x: "Dec", y: 58 },
        { x: "Jan", y: 67 },
        { x: "Feb", y: 73 },
      ],
    },
  ];
}

function generateStockPerBranchData(branchesArray) {
  if (!branchesArray || branchesArray.length === 0) {
    return [
      { label: "Branch A", value: 150 },
      { label: "Branch B", value: 120 },
      { label: "Branch C", value: 95 },
    ];
  }
  return branchesArray.slice(0, 5).map((branch) => ({
    label: branch.branch_name || branch.name,
    value: branch.total || 0,
  }));
}

function generateMonthlyPrintsData() {
  return [
    {
      id: "Prints",
      data: [
        { x: "Sep", y: 32 },
        { x: "Oct", y: 41 },
        { x: "Nov", y: 38 },
        { x: "Dec", y: 45 },
        { x: "Jan", y: 52 },
        { x: "Feb", y: 58 },
      ],
    },
  ];
}

function generateTeacherPrintsData() {
  return [
    { month: "Sep", prints: 12 },
    { month: "Oct", prints: 15 },
    { month: "Nov", prints: 18 },
    { month: "Dec", prints: 14 },
    { month: "Jan", prints: 21 },
    { month: "Feb", prints: 25 },
  ];
}

// ─────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  if (isTeacher(user)) return <TeacherDashboard />;
  if (isSuperAdmin(user)) return <SuperAdminDashboard />;
  if (isAdmin(user)) return <AdminDashboard />;
  return null;
}

// ─────────────────────────────────────────────────────────
// SUPERADMIN DASHBOARD
// ─────────────────────────────────────────────────────────

function SuperAdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);

  // Data
  const { data: branchesData, isLoading: loadingBranches } = useBranches();
  const { data: teachers, isLoading: loadingTeachers } = useTeachers();
  const { data: alerts, isLoading: loadingAlerts } = useStockAlerts({
    threshold: 10,
  });

  // Real activity: all log types, latest 5
  const { data: logsData, isLoading: loadingLogs } = useCertificateLogs({
    limit: 5,
    page: 1,
  });

  const branches = branchesData?.branches || [];
  const isLoading = loadingBranches || loadingTeachers || loadingAlerts;

  const totalBranches = branches.length;
  const activeBranches = branches.filter((b) => b.is_active).length;
  const totalTeachers = teachers?.teachers?.length || teachers?.length || 0;
  const activeTeachers =
    (teachers?.teachers || teachers || []).filter((t) => t.is_active)?.length ||
    0;
  const stockAlerts = alerts?.length || 0;

  // Map logs → activity items
  const activities = useMemo(() => {
    const logs = logsData?.logs || [];
    return logs.map(mapLogToActivity);
  }, [logsData]);

  const printsTrendData = generatePrintsTrendData();
  const stockPerBranchData = generateStockPerBranchData(branches);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Welcome back, {user?.full_name || user?.username}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <EnhancedStatsCard
          title="Total Branches"
          value={totalBranches}
          subtitle={`${activeBranches} active`}
          icon={Building2}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          isLoading={isLoading}
        />
        <EnhancedStatsCard
          title="Active Teachers"
          value={activeTeachers}
          subtitle={`${totalTeachers} total`}
          icon={Users}
          iconColor="text-green-600 dark:text-green-400"
          iconBg="bg-green-100 dark:bg-green-900/30"
          isLoading={isLoading}
        />
        <EnhancedStatsCard
          title="Stock Alerts"
          value={stockAlerts}
          subtitle="Low stock branches"
          icon={AlertTriangle}
          iconColor="text-yellow-600 dark:text-yellow-400"
          iconBg="bg-yellow-100 dark:bg-yellow-900/30"
          isLoading={isLoading}
        />
        <EnhancedStatsCard
          title="System Health"
          value="Good"
          subtitle="All systems operational"
          icon={TrendingUp}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-100 dark:bg-purple-900/30"
          isLoading={false}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Certificate Prints Trend</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Last 6 months
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <LineChart data={printsTrendData} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Distribution</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Across all branches
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <BarChart data={stockPerBranchData} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Activity className="w-5 h-5 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <ActivityTimeline activities={activities} isLoading={loadingLogs} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAlerts ? (
              <Skeleton className="h-20" />
            ) : stockAlerts > 0 ? (
              <div className="space-y-2">
                {alerts?.slice(0, 5).map((alert) => (
                  <div
                    key={alert.branch_id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {alert.branch_name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Only {alert.in_stock} certificates remaining
                        </p>
                      </div>
                    </div>
                    <Badge variant="warning" size="sm">
                      Low Stock
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <Alert variant="success">
                All branches have sufficient stock
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal
        open={showAddBranchModal}
        onClose={() => setShowAddBranchModal(false)}
        title="Add New Branch"
        size="md"
      >
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Add branch form will be implemented here
        </p>
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────

function AdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const [showAddStockModal, setShowAddStockModal] = useState(false);

  // Data
  const { data: stockData, isLoading: loadingStock } = useCertificateStock();
  const { data: statistics, isLoading: loadingStats } =
    useCertificateStatistics();

  // Real activity: focus on print, reserve, release — latest 5
  const { data: logsData, isLoading: loadingLogs } = useCertificateLogs({
    limit: 5,
    page: 1,
  });

  const isLoading = loadingStock || loadingStats;

  const totalStock =
    stockData?.reduce((sum, branch) => sum + (branch.total || 0), 0) || 0;
  const totalAvailable =
    stockData?.reduce((sum, branch) => sum + (branch.in_stock || 0), 0) || 0;
  const totalReserved =
    stockData?.reduce((sum, branch) => sum + (branch.reserved || 0), 0) || 0;
  const totalPrinted = statistics?.total_printed || 0;

  // Map logs → activity items
  const activities = useMemo(() => {
    const logs = logsData?.logs || [];
    return logs.map(mapLogToActivity);
  }, [logsData]);

  const monthlyPrintsData = generateMonthlyPrintsData();
  const stockStatusData = [
    { id: "Available", label: "Available", value: totalAvailable },
    { id: "Reserved", label: "Reserved", value: totalReserved },
    { id: "Printed", label: "Printed", value: totalPrinted },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Welcome back, {user?.full_name || user?.username}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <EnhancedStatsCard
          title="Total Stock"
          value={totalStock}
          subtitle="All certificates"
          icon={Package}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          isLoading={isLoading}
        />
        <EnhancedStatsCard
          title="Available"
          value={totalAvailable}
          subtitle="Ready to reserve"
          icon={CheckCircle}
          iconColor="text-green-600 dark:text-green-400"
          iconBg="bg-green-100 dark:bg-green-900/30"
          isLoading={isLoading}
        />
        <EnhancedStatsCard
          title="Reserved"
          value={totalReserved}
          subtitle="Pending print"
          icon={Clock}
          iconColor="text-yellow-600 dark:text-yellow-400"
          iconBg="bg-yellow-100 dark:bg-yellow-900/30"
          isLoading={isLoading}
        />
        <EnhancedStatsCard
          title="Printed"
          value={totalPrinted}
          subtitle="Total printed"
          icon={FileText}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-100 dark:bg-purple-900/30"
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Print Statistics</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Last 6 months
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <LineChart data={monthlyPrintsData} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Status Distribution</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Current status breakdown
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <PieChart data={stockStatusData} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock per Branch & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Stock per Branch</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStock ? (
              <div className="space-y-3">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            ) : stockData && stockData.length > 0 ? (
              <div className="space-y-2 max-h-[240px] overflow-y-auto">
                {stockData.map((branch) => (
                  <div
                    key={branch.branch_id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {branch.branch_name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Total: {branch.total || 0}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">
                          {branch.in_stock || 0}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Available
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                          {branch.reserved || 0}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Reserved
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Alert variant="info">No stock data available</Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Activity className="w-5 h-5 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <ActivityTimeline activities={activities} isLoading={loadingLogs} />
          </CardContent>
        </Card>
      </div>

      <Modal
        open={showAddStockModal}
        onClose={() => setShowAddStockModal(false)}
        title="Add Stock"
        size="md"
      >
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Add stock form will be implemented here
        </p>
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// TEACHER DASHBOARD
// ─────────────────────────────────────────────────────────

function TeacherDashboard() {
  const user = useAuthStore((state) => state.user);
  const [showReserveModal, setShowReserveModal] = useState(false);

  // Data
  const { data: reservations, isLoading: loadingReservations } =
    useMyReservations();
  const { data: printsData, isLoading: loadingPrints } = useMyPrints();
  const { data: studentsData, isLoading: loadingStudents } = useStudents();

  const isLoading = loadingReservations || loadingPrints || loadingStudents;

  // Stats
  const activeReservations = reservations?.length || 0;
  const prints = printsData?.prints || [];
  const totalPrints = prints.length;
  const totalStudents = studentsData?.students?.length || 0;

  const now = new Date();
  const thisMonth = prints.filter((p) => {
    const d = new Date(p.printed_at || p.createdAt);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;

  const pendingUploads = prints.filter((p) => !p.pdf_path).length;

  // Map prints → activity items (latest 5, sorted newest first)
  const activities = useMemo(() => {
    return [...prints]
      .sort((a, b) => {
        const dateA = new Date(a.updated_at || a.printed_at || a.createdAt);
        const dateB = new Date(b.updated_at || b.printed_at || b.createdAt);
        return dateB - dateA;
      })
      .slice(0, 5)
      .map(mapPrintToActivity);
  }, [prints]);

  const myPrintsData = generateTeacherPrintsData();
  const uploadStatusData = [
    {
      id: "Uploaded",
      label: "PDF Uploaded",
      value: totalPrints - pendingUploads,
    },
    { id: "Pending", label: "Pending Upload", value: pendingUploads },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Welcome back, {user?.full_name || user?.username}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <EnhancedStatsCard
          title="Active Reservations"
          value={activeReservations}
          subtitle="Reserved certificates"
          icon={Clock}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          isLoading={isLoading}
        />
        <EnhancedStatsCard
          title="Prints This Month"
          value={thisMonth}
          subtitle={`${totalPrints} total`}
          icon={Printer}
          iconColor="text-green-600 dark:text-green-400"
          iconBg="bg-green-100 dark:bg-green-900/30"
          isLoading={isLoading}
        />
        <EnhancedStatsCard
          title="Total Students"
          value={totalStudents}
          subtitle="Student records"
          icon={UserCircle}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-100 dark:bg-purple-900/30"
          isLoading={isLoading}
        />
        <EnhancedStatsCard
          title="Pending Uploads"
          value={pendingUploads}
          subtitle="PDFs to upload"
          icon={FileText}
          iconColor="text-yellow-600 dark:text-yellow-400"
          iconBg="bg-yellow-100 dark:bg-yellow-900/30"
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>My Print Statistics</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Last 6 months
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <BarChart data={myPrintsData} keys={["prints"]} indexBy="month" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>PDF Upload Status</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Upload completion rate
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <PieChart data={uploadStatusData} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reservations & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Reservations or Recent Prints */}
        {activeReservations > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Active Reservations</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingReservations ? (
                <Skeleton className="h-20" />
              ) : (
                <div className="space-y-2 max-h-[240px] overflow-y-auto">
                  {reservations?.slice(0, 5).map((reservation) => (
                    <div
                      key={reservation.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {reservation.certificate_number}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Reserved{" "}
                          {new Date(
                            reservation.created_at,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="warning" size="sm">
                        Reserved
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Recent Prints</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPrints ? (
                <div className="space-y-3">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                </div>
              ) : prints.length > 0 ? (
                <div className="space-y-2 max-h-[240px] overflow-y-auto">
                  {prints.slice(0, 5).map((print) => (
                    <div
                      key={print.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {print.student_name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {print.certificate_number} ·{" "}
                          {new Date(print.printed_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={print.pdf_path ? "success" : "warning"}
                        size="sm"
                      >
                        {print.pdf_path ? "PDF Uploaded" : "Pending PDF"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert variant="info">No print history yet</Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Activity — from real prints data */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Activity className="w-5 h-5 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <ActivityTimeline
              activities={activities}
              isLoading={loadingPrints}
            />
          </CardContent>
        </Card>
      </div>

      <Modal
        open={showReserveModal}
        onClose={() => setShowReserveModal(false)}
        title="Reserve Certificate"
        size="md"
      >
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Reserve certificate form will be implemented here
        </p>
      </Modal>
    </div>
  );
}
