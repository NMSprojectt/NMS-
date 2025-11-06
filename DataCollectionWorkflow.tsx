import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function DataCollectionWorkflow() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

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
              <h1 className="text-2xl font-bold tracking-tight">Data Collection Workflow</h1>
              <p className="text-sm text-muted-foreground">End-to-end data collection and processing pipeline</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold tracking-tight mb-4">Data Collection Workflow</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            How data flows through the system from sensors to visualization
          </p>
        </motion.div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Collection Pipeline</CardTitle>
            <CardDescription>5-step process from IoT sensors to visualization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              "IoT Sensor Data: Medical devices transmit telemetry via SNMP/NETCONF",
              "Zabbix Collection: Agents poll devices every 30-60 seconds for metrics",
              "Data Processing: Real-time analysis against predefined thresholds",
              "Alert Generation: Automatic alerts triggered for anomalies",
              "Visualization: Grafana dashboards display metrics with trends",
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 border rounded-lg"
              >
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                  {index + 1}
                </div>
                <p className="text-base pt-1">{step}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </main>
    </motion.div>
  );
}
