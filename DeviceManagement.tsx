import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Database, Loader2, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function DeviceManagement() {
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
              <h1 className="text-2xl font-bold tracking-tight">Device Management</h1>
              <p className="text-sm text-muted-foreground">Monitor all IoT medical devices in real-time. Track MRI scanners, ventilators, patient monitors, and more from a unified dashboard.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Database className="h-8 w-8 text-primary" />
                <span className="text-3xl font-bold">{devices?.length || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Online Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <span className="text-3xl font-bold">{devices?.filter(d => d.status === "online").length || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Offline Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-red-500" />
                <span className="text-3xl font-bold">{devices?.filter(d => d.status === "offline").length || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device List */}
        <Card>
          <CardHeader>
            <CardTitle>All Devices</CardTitle>
            <CardDescription>Complete list of monitored medical devices</CardDescription>
          </CardHeader>
          <CardContent>
            {!devices || devices.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No devices available
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
                        Last seen: {new Date(device.lastSeen).toLocaleString()}
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
