import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Database, Loader2, ArrowLeft, Activity } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function DataCollection() {
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
              <h1 className="text-2xl font-bold tracking-tight">Data Collection</h1>
              <p className="text-sm text-muted-foreground">Automated data collection from IoT sensors using industry-standard protocols with secure storage and retrieval.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Collection Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Data Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Database className="h-8 w-8 text-blue-500" />
                <span className="text-3xl font-bold">{metrics?.length || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Sensors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-green-500" />
                <span className="text-3xl font-bold">{devices?.filter(d => d.status === "online").length || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Collection Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-purple-500" />
                <span className="text-3xl font-bold">30s</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Polling interval</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Collections */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Data Collections</CardTitle>
            <CardDescription>Latest data points collected from IoT sensors</CardDescription>
          </CardHeader>
          <CardContent>
            {!metrics || metrics.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No data collected yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {metrics.slice(0, 20).map((metric, index) => (
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
                      <p className="text-xs text-muted-foreground">Stored securely</p>
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
