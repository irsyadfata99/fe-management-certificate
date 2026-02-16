/**
 * Certificate Stock Page (Admin Only)
 * Stock monitoring dashboard with visual indicators and alerts
 *
 * FEATURES:
 * - Overall stock statistics
 * - Branch stock cards with progress bars
 * - Low stock alerts banner
 * - Stock threshold configuration
 * - Quick migrate action from alerts
 * - Visual color indicators (green/yellow/red)
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, Archive, Clock, Printer, TrendingDown, AlertTriangle, ArrowRightLeft, Settings, ExternalLink } from "lucide-react";

// Hooks
import { useCertificateStock, useStockAlerts } from "@/hooks";

// UI Components
import { Button, Badge, Spinner, Alert, Slider } from "@/components/ui";

// Utils
import { cn } from "@/utils/helpers/cn";
import { formatNumber } from "@/utils/format/numberFormat";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function getStockLevel(inStock, threshold) {
  if (inStock === 0) {
    return {
      severity: "critical",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      borderColor: "border-red-300 dark:border-red-700",
      progressColor: "bg-red-500",
    };
  } else if (inStock <= 5) {
    return {
      severity: "high",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      borderColor: "border-orange-300 dark:border-orange-700",
      progressColor: "bg-orange-500",
    };
  } else if (inStock <= threshold) {
    return {
      severity: "medium",
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      borderColor: "border-yellow-300 dark:border-yellow-700",
      progressColor: "bg-yellow-500",
    };
  } else {
    return {
      severity: "good",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      borderColor: "border-green-300 dark:border-green-700",
      progressColor: "bg-green-500",
    };
  }
}

function getProgressPercentage(inStock, total) {
  if (total === 0) return 0;
  return Math.round((inStock / total) * 100);
}

// ============================================================================
// STATS CARDS COMPONENT
// ============================================================================
function GlobalStatsCards({ globalStats }) {
  const statCards = [
    {
      label: "Total Certificates",
      value: globalStats.total,
      icon: Package,
      bgColor: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Available Stock",
      value: globalStats.in_stock,
      icon: Archive,
      bgColor: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "Reserved",
      value: globalStats.reserved,
      icon: Clock,
      bgColor: "bg-yellow-100 dark:bg-yellow-900",
      iconColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      label: "Printed",
      value: globalStats.printed,
      icon: Printer,
      bgColor: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="glass-card-auto overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", stat.bgColor)}>
                    <Icon className={cn("w-6 h-6", stat.iconColor)} />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-neutral-600 dark:text-neutral-400 truncate">{stat.label}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{formatNumber(stat.value)}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// LOW STOCK ALERTS COMPONENT
// ============================================================================
function LowStockAlerts({ alerts, alertsLoading, threshold }) {
  if (alertsLoading) return null;
  if (!alerts || alerts.length === 0) return null;

  // Group by severity
  const critical = alerts.filter((a) => a.in_stock === 0);
  const high = alerts.filter((a) => a.in_stock > 0 && a.in_stock <= 5);
  const medium = alerts.filter((a) => a.in_stock > 5 && a.in_stock <= threshold);

  return (
    <div className="space-y-3">
      {/* Critical Alerts */}
      {critical.length > 0 && (
        <Alert variant="error" className="border-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-base mb-2">
                  Critical: Out of Stock ({critical.length} {critical.length === 1 ? "branch" : "branches"})
                </h3>
                <div className="space-y-2">
                  {critical.map((alert) => (
                    <div key={alert.branch_id} className="flex items-center justify-between gap-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{alert.branch_name}</p>
                        <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">No certificates available</p>
                      </div>
                      <Button size="sm" variant="primary" leftIcon={<ArrowRightLeft className="w-3 h-3" />} as={Link} to={`/certificates?migrate=true&toBranchId=${alert.branch_id}`}>
                        Migrate Here
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Alert>
      )}

      {/* High Priority Alerts */}
      {high.length > 0 && (
        <Alert variant="warning" className="border-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <TrendingDown className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-base mb-2">
                  High Priority: Very Low Stock ({high.length} {high.length === 1 ? "branch" : "branches"})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {high.map((alert) => (
                    <div key={alert.branch_id} className="flex items-center justify-between gap-3 p-2.5 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{alert.branch_name}</p>
                        <p className="text-xs text-orange-700 dark:text-orange-300">Only {alert.in_stock} left</p>
                      </div>
                      <Button size="sm" variant="outline" leftIcon={<ArrowRightLeft className="w-3 h-3" />} as={Link} to={`/certificates?migrate=true&toBranchId=${alert.branch_id}`}>
                        Migrate
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Alert>
      )}

      {/* Medium Priority Alerts */}
      {medium.length > 0 && (
        <Alert variant="info">
          <div className="flex items-start gap-3">
            <TrendingDown className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-base mb-1">
                Low Stock Warning ({medium.length} {medium.length === 1 ? "branch" : "branches"})
              </h3>
              <p className="text-sm opacity-90">
                {medium.map((a) => a.branch_name).join(", ")} {medium.length === 1 ? "has" : "have"} stock below threshold ({threshold} certificates)
              </p>
            </div>
          </div>
        </Alert>
      )}
    </div>
  );
}

// ============================================================================
// THRESHOLD CONFIG COMPONENT
// ============================================================================
function ThresholdConfig({ threshold, setThreshold }) {
  return (
    <div className="glass-card-auto p-5">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
          <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Low Stock Threshold</h3>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{threshold}</span>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Branches with stock at or below this level will trigger alerts</p>
          <Slider value={threshold} onChange={setThreshold} min={5} max={50} step={5} className="mb-2" />
          <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-500">
            <span>5</span>
            <span>50</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BRANCH STOCK CARDS COMPONENT
// ============================================================================
function BranchStockCards({ stock, stockLoading, threshold }) {
  if (stockLoading) {
    return (
      <div className="glass-card-auto p-8">
        <div className="flex flex-col items-center justify-center">
          <Spinner size="lg" />
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">Loading branch stock data...</p>
        </div>
      </div>
    );
  }

  if (stock.length === 0) {
    return (
      <div className="glass-card-auto p-8">
        <div className="text-center">
          <Package className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-600 dark:text-neutral-400">No stock data available</p>
        </div>
      </div>
    );
  }

  // Sort: Critical first, then by stock level ascending
  const sortedStock = [...stock].sort((a, b) => {
    if (a.in_stock === 0 && b.in_stock !== 0) return -1;
    if (b.in_stock === 0 && a.in_stock !== 0) return 1;
    return a.in_stock - b.in_stock;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {sortedStock.map((branch) => {
        const level = getStockLevel(branch.in_stock, threshold);
        const progressPercentage = getProgressPercentage(branch.in_stock, branch.total);

        return (
          <div key={branch.branch_id} className={cn("glass-card-auto overflow-hidden border-2 transition-all hover:shadow-lg", level.borderColor)}>
            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">{branch.branch_name}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">{branch.branch_code || "N/A"}</p>
                </div>
                <div className={cn("p-2 rounded-lg", level.bgColor)}>
                  <Archive className={cn("w-5 h-5", level.color)} />
                </div>
              </div>

              {/* Stock Count */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className={cn("text-3xl font-bold", level.color)}>{formatNumber(branch.in_stock)}</span>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">/ {formatNumber(branch.total)} total</span>
                </div>
                {level.severity !== "good" && (
                  <Badge variant={level.severity === "critical" ? "error" : level.severity === "high" ? "warning" : "default"} size="sm" className="mt-2">
                    {level.severity === "critical" ? "Out of Stock" : level.severity === "high" ? "Very Low" : "Low Stock"}
                  </Badge>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                  <span>Stock Level</span>
                  <span className="font-medium">{progressPercentage}%</span>
                </div>
                <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div className={cn("h-full transition-all duration-500", level.progressColor)} style={{ width: `${progressPercentage}%` }} />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Reserved</p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{formatNumber(branch.reserved)}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Printed</p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{formatNumber(branch.printed)}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Total</p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{formatNumber(branch.total)}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function CertificateStockPage() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [threshold, setThreshold] = useState(10); // Default threshold: 10

  // ============================================================================
  // API HOOKS
  // ============================================================================
  const { data: stockData, isLoading: stockLoading } = useCertificateStock();
  const { data: alerts, isLoading: alertsLoading } = useStockAlerts({
    threshold,
  });

  const stock = stockData || [];

  // Calculate global stats
  const globalStats = {
    total: stock.reduce((sum, s) => sum + s.total, 0) || 0,
    in_stock: stock.reduce((sum, s) => sum + s.in_stock, 0) || 0,
    reserved: stock.reduce((sum, s) => sum + s.reserved, 0) || 0,
    printed: stock.reduce((sum, s) => sum + s.printed, 0) || 0,
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Certificate Stock Monitor</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Real-time stock levels across all branches</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" leftIcon={<ExternalLink className="w-4 h-4" />} as={Link} to="/certificates">
            Manage Certificates
          </Button>
          <Button variant="outline" leftIcon={<ExternalLink className="w-4 h-4" />} as={Link} to="/certificates/logs">
            View Logs
          </Button>
        </div>
      </div>

      {/* Global Stats */}
      <GlobalStatsCards globalStats={globalStats} />

      {/* Low Stock Alerts */}
      <LowStockAlerts alerts={alerts} alertsLoading={alertsLoading} threshold={threshold} />

      {/* Threshold Configuration */}
      <ThresholdConfig threshold={threshold} setThreshold={setThreshold} />

      {/* Branch Stock Cards */}
      <BranchStockCards stock={stock} stockLoading={stockLoading} threshold={threshold} />
    </div>
  );
}
