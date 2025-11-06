import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Loader2, ArrowLeft, XCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export default function Alerts() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const alerts = useQuery(api.alerts.list, {});
  const acknowledgeAlert = useMutation(api.alerts.acknowledge);
  const resolveAlert = useMutation(api.alerts.resolve);

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

  const handleAcknowledge = async (alertId: Id<"alerts">) => {
    try {
      await acknowledgeAlert({ id: alertId });
      toast.success("Alert acknowledged");
    } catch (error) {
      toast.error("Failed to acknowledge alert");
    }
  };

  const handleResolve = async (alertId: Id<"alerts">) => {
    try {
      await resolveAlert({ id: alertId });
      toast.success("Alert resolved");
    } catch (error) {
      toast.error("Failed to resolve alert");
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const activeAlerts = alerts?.filter(a => a.status === "active") || [];
  const acknowledgedAlerts = alerts?.filter(a => a.status === "acknowledged") || [];
  const resolvedAlerts = alerts?.filter(a => a.status === "resolved") || [];

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
              <h1 className="text-2xl font-bold tracking-tight">Intelligent Alerts</h1>
              <p className="text-sm text-muted-foreground">Advanced alarm lifecycle management with severity-based escalation</p>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-orange-500" />
                <span className="text-3xl font-bold">{activeAlerts.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Acknowledged</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-blue-500" />
                <span className="text-3xl font-bold">{acknowledgedAlerts.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <span className="text-3xl font-bold">{resolvedAlerts.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>Alerts requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeAlerts.map((alert, index) => (
                <motion.div
                  key={alert._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`h-2 w-2 rounded-full mt-2 ${getSeverityColor(alert.severity)}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={getSeverityColor(alert.severity) + " text-white"}>
                          {alert.severity}
                        </Badge>
                        <Badge variant="outline">{alert.alertType}</Badge>
                      </div>
                      <p className="font-medium mb-1">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(alert._creationTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAcknowledge(alert._id)}
                  >
                    Acknowledge
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Acknowledged Alerts */}
        {acknowledgedAlerts.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Acknowledged Alerts</CardTitle>
              <CardDescription>Alerts that have been acknowledged and are being addressed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {acknowledgedAlerts.map((alert, index) => (
                <motion.div
                  key={alert._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start justify-between p-4 border rounded-lg bg-muted/30"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{alert.severity}</Badge>
                        <Badge variant="outline">{alert.alertType}</Badge>
                      </div>
                      <p className="font-medium mb-1">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        Acknowledged at {alert.acknowledgedAt ? new Date(alert.acknowledgedAt).toLocaleString() : "N/A"}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResolve(alert._id)}
                  >
                    Resolve
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Resolved Alerts */}
        {resolvedAlerts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Resolved Alerts</CardTitle>
              <CardDescription>Successfully resolved alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resolvedAlerts.slice(0, 5).map((alert, index) => (
                <motion.div
                  key={alert._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 border rounded-lg opacity-60"
                >
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{alert.severity}</Badge>
                      <Badge variant="outline">{alert.alertType}</Badge>
                    </div>
                    <p className="font-medium mb-1">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      Resolved at {alert.resolvedAt ? new Date(alert.resolvedAt).toLocaleString() : "N/A"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!alerts || alerts.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No alerts at this time</p>
              <p className="text-sm text-muted-foreground mt-2">All systems operating normally</p>
            </CardContent>
          </Card>
        )}
      </main>
    </motion.div>
  );
}
