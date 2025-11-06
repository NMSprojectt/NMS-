import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Activity, AlertTriangle, ArrowLeft, CheckCircle, Loader2, Server, XCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function Dashboard() {
  const { isLoading, isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const devices = useQuery(api.devices.list, {});
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
  const activeAlerts = alerts?.filter(a => a.status === "active").length || 0;
  const uptime = totalDevices > 0 ? ((activeDevices / totalDevices) * 100).toFixed(1) : "0";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="flex-shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <img src="/logo.svg" alt="Logo" className="h-8 w-8 cursor-pointer" onClick={() => navigate("/")} />
          <div>
            <h1 className="text-lg font-bold tracking-tight">Healthcare IoT Monitor</h1>
            <p className="text-xs text-muted-foreground">Real-time network monitoring</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.1 }}
            className="cursor-pointer"
            onClick={() => navigate("/monitoring")}
          >
            <Card className="hover:border-primary transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Server className="h-8 w-8 text-primary" />
                  <span className="text-3xl font-bold">{totalDevices}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Click to view monitoring</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="cursor-pointer"
            onClick={() => navigate("/monitoring")}
          >
            <Card className="hover:border-primary transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <span className="text-3xl font-bold">{activeDevices}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Real-time monitoring</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.3 }}
            className="cursor-pointer"
            onClick={() => navigate("/analytics")}
          >
            <Card className="hover:border-primary transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Network Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Activity className="h-8 w-8 text-blue-500" />
                  <span className="text-3xl font-bold">{uptime}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">View analytics</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.4 }}
            className="cursor-pointer"
            onClick={() => navigate("/alerts")}
          >
            <Card className="hover:border-primary transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-orange-500" />
                  <span className="text-3xl font-bold">{activeAlerts}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Manage alerts</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => navigate("/monitoring")}>
              <CardHeader>
                <Activity className="h-12 w-12 mb-4 text-primary" />
                <CardTitle>Real-Time Monitoring</CardTitle>
                <CardDescription>Monitor all connected devices with sub-second latency using SNMP and NETCONF protocols</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => navigate("/alerts")}>
              <CardHeader>
                <AlertTriangle className="h-12 w-12 mb-4 text-primary" />
                <CardTitle>Intelligent Alerts</CardTitle>
                <CardDescription>Advanced alarm lifecycle management with severity-based escalation and acknowledgment workflows</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => navigate("/analytics")}>
              <CardHeader>
                <Activity className="h-12 w-12 mb-4 text-primary" />
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>Beautiful, customizable observability dashboards with historical data analysis and trends</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </div>

        {/* Devices List */}
        <Card>
          <CardHeader>
            <CardTitle>Connected Devices</CardTitle>
            <CardDescription>Monitor all IoT devices in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            {!devices || devices.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No devices connected yet
              </div>
            ) : (
              <div className="space-y-4">
                {devices.map((device) => (
                  <motion.div
                    key={device._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {device.status === "online" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-sm text-muted-foreground">{device.type} • {device.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{device.ipAddress}</p>
                      <p className="text-xs text-muted-foreground">
                        Last seen: {new Date(device.lastSeen).toLocaleTimeString()}
                      </p>
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