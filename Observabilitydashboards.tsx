import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Gauge, Loader2, ArrowLeft, BarChart3, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function ObservabilityDashboards() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const devices = useQuery(api.devices.list, {});
  const metrics = useQuery(api.metrics.list, { limit: 50 });
  const alerts = useQuery(api.alerts.list, {});

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
  const uptime = totalDevices > 0 ? ((activeDevices / totalDevices) * 100).toFixed(1) : "0";
  const activeAlerts = alerts?.filter(a => a.status === "active").length || 0;

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
              <h1 className="text-2xl font-bold tracking-tight">Observability Dashboards</h1>
              <p className="text-sm text-muted-foreground">Grafana-powered visualizations with customizable dashboards, real-time graphs, and exportable reports.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">System Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <span className="text-3xl font-bold">{uptime}%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Gauge className="h-8 w-8 text-blue-500" />
                  <span className="text-3xl font-bold">{activeDevices}/{totalDevices}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Data Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                  <span className="text-3xl font-bold">{metrics?.length || 0}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-orange-500" />
                  <span className="text-3xl font-bold">{activeAlerts}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Visualization Panels */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Device Status Overview</CardTitle>
              <CardDescription>Real-time device health monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {devices?.slice(0, 5).map((device, index) => (
                  <motion.div
                    key={device._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{device.name}</p>
                      <p className="text-xs text-muted-foreground">{device.type}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      device.status === "online" 
                        ? "bg-green-500/10 text-green-500" 
                        : "bg-red-500/10 text-red-500"
                    }`}>
                      {device.status.toUpperCase()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Metrics</CardTitle>
              <CardDescription>Latest telemetry data visualization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics?.slice(0, 5).map((metric, index) => (
                  <motion.div
                    key={metric._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{metric.metricType}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(metric.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{metric.value} {metric.unit}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </motion.div>
  );
}
