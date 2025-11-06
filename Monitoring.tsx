import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Activity, CheckCircle, Loader2, XCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function Monitoring() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const devices = useQuery(api.devices.list, {});
  const metrics = useQuery(api.metrics.list, { limit: 50 });

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
              <h1 className="text-2xl font-bold tracking-tight">Real-Time Monitoring</h1>
              <p className="text-sm text-muted-foreground">Monitor all connected devices with sub-second latency</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Device Status Grid */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Device Status Overview</CardTitle>
            <CardDescription>Real-time status of all IoT devices using SNMP and NETCONF protocols</CardDescription>
          </CardHeader>
          <CardContent>
            {!devices || devices.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No devices connected yet
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {devices.map((device, index) => (
                  <motion.div
                    key={device._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={device.status === "online" ? "border-green-500/50" : "border-red-500/50"}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{device.name}</CardTitle>
                          {device.status === "online" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium">{device.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <span className="font-medium">{device.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">IP:</span>
                          <span className="font-mono text-xs">{device.ipAddress}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className={`font-medium ${device.status === "online" ? "text-green-500" : "text-red-500"}`}>
                            {device.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Seen:</span>
                          <span className="text-xs">{new Date(device.lastSeen).toLocaleTimeString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Metrics</CardTitle>
            <CardDescription>Latest telemetry data from connected devices</CardDescription>
          </CardHeader>
          <CardContent>
            {!metrics || metrics.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No metrics data available yet</p>
                <p className="text-sm mt-2">Metrics will appear as devices report telemetry</p>
              </div>
            ) : (
              <div className="space-y-3">
                {metrics.slice(0, 10).map((metric, index) => (
                  <motion.div
                    key={metric._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">{metric.metricType}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(metric.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{metric.value} {metric.unit}</p>
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
