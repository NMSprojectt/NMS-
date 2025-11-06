import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { BarChart3, Loader2, ArrowLeft, Activity } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function PerformanceMetrics() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const metrics = useQuery(api.metrics.list, { limit: 100 });
  const devices = useQuery(api.devices.list, {});

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
              <h1 className="text-2xl font-bold tracking-tight">Performance Metrics</h1>
              <p className="text-sm text-muted-foreground">Track CPU usage, memory consumption, network latency, and device uptime with historical data and trend analysis.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-purple-500" />
                <span className="text-3xl font-bold">{metrics?.length || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Metric Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-blue-500" />
                <span className="text-3xl font-bold">{Object.keys(metricsByType).length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monitored Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-green-500" />
                <span className="text-3xl font-bold">{devices?.length || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-Time Metrics Analysis */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold tracking-tight mb-2">Real-Time Metrics Analysis</h2>
            <p className="text-lg text-muted-foreground">
              Monitor device performance with interactive visualizations and historical trends
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Device Uptime Trend</CardTitle>
                  <CardDescription>7-day uptime percentage</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[
                      { day: "Mon", uptime: 99.2 },
                      { day: "Tue", uptime: 99.5 },
                      { day: "Wed", uptime: 98.8 },
                      { day: "Thu", uptime: 99.7 },
                      { day: "Fri", uptime: 99.1 },
                      { day: "Sat", uptime: 99.9 },
                      { day: "Sun", uptime: 99.4 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis domain={[98, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="uptime" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Alert Distribution</CardTitle>
                  <CardDescription>Alerts by severity level</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { severity: "Critical", count: 2 },
                      { severity: "High", count: 5 },
                      { severity: "Medium", count: 12 },
                      { severity: "Low", count: 8 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="severity" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle>CPU & Memory Usage</CardTitle>
                <CardDescription>Average device resource consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { device: "MRI Scanner", cpu: 45, memory: 62 },
                    { device: "Patient Monitor", cpu: 28, memory: 35 },
                    { device: "Infusion Pump", cpu: 15, memory: 22 },
                    { device: "Ventilator", cpu: 52, memory: 68 },
                    { device: "CT Scanner", cpu: 58, memory: 75 },
                    { device: "Ultrasound", cpu: 32, memory: 41 },
                    { device: "ECG Monitor", cpu: 18, memory: 25 },
                    { device: "Defibrillator", cpu: 12, memory: 18 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="device" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cpu" fill="hsl(var(--chart-1))" />
                    <Bar dataKey="memory" fill="hsl(var(--chart-2))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Metrics by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Metrics by Type</CardTitle>
            <CardDescription>Performance data grouped by metric type</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(metricsByType).length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No metrics data available yet</p>
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
      </main>
    </motion.div>
  );
}
