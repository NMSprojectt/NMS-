import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function TechnologyStack() {
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
              <h1 className="text-2xl font-bold tracking-tight">Technology Stack</h1>
              <p className="text-sm text-muted-foreground">Core technologies powering the healthcare IoT monitoring system</p>
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
          <h2 className="text-4xl font-bold tracking-tight mb-4">System Architecture</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A comprehensive monitoring solution built on proven open-source technologies
          </p>
        </motion.div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Technology Stack</CardTitle>
            <CardDescription>Core technologies and their roles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { name: "Zabbix Server", desc: "Core monitoring engine for data collection and alerting" },
              { name: "SNMP Protocol", desc: "Simple Network Management Protocol for device communication" },
              { name: "NETCONF", desc: "Network Configuration Protocol for advanced device management" },
              { name: "Grafana", desc: "Visualization platform for real-time and historical metrics" },
            ].map((tech, index) => (
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
                <div>
                  <p className="font-semibold text-lg">{tech.name}</p>
                  <p className="text-muted-foreground">{tech.desc}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </main>
    </motion.div>
  );
}
