import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { BarChart3, Loader2, ArrowLeft, TrendingUp, Activity } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function Analytics() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const devices = useQuery(api.devices.list, {});
  const alerts = useQuery(api.alerts.list, {});
  const metrics = useQuery(api.metrics.list, { limit: 100 });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const activeDevices = devices?.filter(d => d.status === "online").length || 0;
  const totalDevices = devices?.length || 0;
  const uptime = totalDevices > 0 ? ((activeDevices / totalDevices) * 100).toFixed(2) : "0";
  
  const activeAlerts = alerts?.filter(a => a.status === "active").length || 0;
  const resolvedAlerts = alerts?.filter(a => a.status === "resolved").length || 0;
  const totalAlerts = alerts?.length || 0;

  // Group metrics by type
  const metricsByType = metrics?.reduce((acc, metric) => {
    if (!acc[metric.metricType]) {
      acc[metric.metricType] = [];
    }
    acc[metric.metricType].push(metric);
    return acc;
  }, {} as Record<string, typeof metrics>) || {};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
              <p className="text-sm text-muted-foreground">Beautiful, customizable observability dashboards with historical data analysis</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Network Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <span className="text-3xl font-bold">{uptime}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{activeDevices} of {totalDevices} devices online</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Alert Resolution Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                  <span className="text-3xl font-bold">
                    {totalAlerts > 0 ? ((resolvedAlerts / totalAlerts) * 100).toFixed(1) : "0"}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{resolvedAlerts} of {totalAlerts} alerts resolved</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Incidents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Activity className="h-8 w-8 text-orange-500" />
                  <span className="text-3xl font-bold">{activeAlerts}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Requiring attention</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                  <span className="text-3xl font-bold">{metrics?.length || 0}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Data points collected</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Metrics by Type */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Metrics Overview</CardTitle>
            <CardDescription>Telemetry data grouped by metric type</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(metricsByType).length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No metrics data available yet</p>
                <p className="text-sm mt-2">Data will appear as devices report telemetry</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(metricsByType).map(([type, typeMetrics], index) => {
                  const avgValue = typeMetrics.reduce((sum, m) => sum + m.value, 0) / typeMetrics.length;
                  const unit = typeMetrics[0]?.unit || "";
                  
                  return (
                    <motion.div
                      key={type}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">{type}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-baseline">
                              <span className="text-xs text-muted-foreground">Average:</span>
                              <span className="text-2xl font-bold">{avgValue.toFixed(2)} {unit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-muted-foreground">Data Points:</span>
                              <span className="text-sm font-medium">{typeMetrics.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-muted-foreground">Latest:</span>
                              <span className="text-sm">{typeMetrics[0]?.value} {unit}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Device Performance Summary</CardTitle>
            <CardDescription>Overview of all monitored devices</CardDescription>
          </CardHeader>
          <CardContent>
            {!devices || devices.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No devices to display
              </div>
            ) : (
              <div className="space-y-3">
                {devices.map((device, index) => (
                  <motion.div
                    key={device._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{device.name}</p>
                      <p className="text-sm text-muted-foreground">{device.type} • {device.location}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        device.status === "online" 
                          ? "bg-green-500/10 text-green-500" 
                          : "bg-red-500/10 text-red-500"
                      }`}>
                        <div className={`h-2 w-2 rounded-full ${
                          device.status === "online" ? "bg-green-500" : "bg-red-500"
                        }`} />
                        {device.status.toUpperCase()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </motion.div>
  );
}
