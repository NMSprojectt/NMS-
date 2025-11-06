import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Network, Loader2, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function NetworkMonitoring() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
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

  const onlineDevices = devices?.filter(d => d.status === "online").length || 0;
  const totalDevices = devices?.length || 0;

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
              <h1 className="text-2xl font-bold tracking-tight">Network Monitoring</h1>
              <p className="text-sm text-muted-foreground">SNMP and NETCONF protocol support for comprehensive network device monitoring and configuration management.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Network Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Network Uptime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Network className="h-8 w-8 text-green-500" />
                <span className="text-3xl font-bold">
                  {totalDevices > 0 ? ((onlineDevices / totalDevices) * 100).toFixed(1) : "0"}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-blue-500" />
                <span className="text-3xl font-bold">{onlineDevices}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Nodes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Network className="h-8 w-8 text-purple-500" />
                <span className="text-3xl font-bold">{totalDevices}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Network Devices */}
        <Card>
          <CardHeader>
            <CardTitle>Network Devices</CardTitle>
            <CardDescription>All devices connected to the network with protocol information</CardDescription>
          </CardHeader>
          <CardContent>
            {!devices || devices.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No network devices found
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
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
                          <span className="text-muted-foreground">Protocol:</span>
                          <span className="font-medium">SNMP/NETCONF</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">IP Address:</span>
                          <span className="font-mono text-xs">{device.ipAddress}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <span className="font-medium">{device.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className={`font-medium ${device.status === "online" ? "text-green-500" : "text-red-500"}`}>
                            {device.status.toUpperCase()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
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
