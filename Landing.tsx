import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Activity, AlertTriangle, BarChart3, Clock, Database, Gauge, Loader2, Network, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden py-32"
      >
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center"
            >
              <div className="h-24 w-24 rounded-2xl bg-muted flex items-center justify-center">
                <Activity className="h-12 w-12" />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold tracking-tight"
            >
              Real-Time Healthcare IoT
              <br />
              Network Monitoring
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              Ensure zero downtime for connected hospital devices with enterprise-grade monitoring,
              real-time alerts, and comprehensive observability dashboards.
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 justify-center"
            >
              <Button size="lg" onClick={handleGetStarted} disabled={isLoading} className="bg-foreground text-background hover:bg-foreground/90">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isAuthenticated ? (
                  "Go to Dashboard"
                ) : (
                  "Get Started"
                )}
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
                Try Live Demo
              </Button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-12"
            >
              {[
                { icon: Clock, label: "Guaranteed", value: "99.9% Uptime", color: "text-green-500" },
                { icon: Zap, label: "Monitoring", value: "Real-Time", color: "text-blue-500" },
                { icon: Shield, label: "Compliant", value: "HIPAA", color: "text-purple-500" },
                { icon: AlertTriangle, label: "Alerts", value: "Instant", color: "text-orange-500" },
              ].map((stat, index) => (
                <Card key={index} className="text-center border-2">
                  <CardContent className="pt-6 pb-6">
                    <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                    <p className="font-bold text-lg mb-1">{stat.label}</p>
                    <p className="text-sm text-muted-foreground">{stat.value}</p>
                    <div className={`h-1 w-full mt-3 rounded-full ${stat.color.replace('text-', 'bg-')}`} />
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Comprehensive Features Section */}
      <section id="features" className="py-32 bg-muted/30">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold tracking-tight mb-4">Comprehensive Monitoring Features</h2>
            <p className="text-lg text-muted-foreground">
              Built with open-source tools for reliability, scalability, and transparency
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Database,
                title: "Device Management",
                description: "Monitor all IoT medical devices in real-time. Track MRI scanners, ventilators, patient monitors, and more from a unified dashboard.",
                link: "/device-management",
              },
              {
                icon: AlertTriangle,
                title: "Smart Alert System",
                description: "Intelligent alarm lifecycle management with severity levels, acknowledgment workflows, and automated escalation protocols.",
                link: "/smart-alerts",
              },
              {
                icon: BarChart3,
                title: "Performance Metrics",
                description: "Track CPU usage, memory consumption, network latency, and device uptime with historical data and trend analysis.",
                link: "/performance-metrics",
              },
              {
                icon: Network,
                title: "Network Monitoring",
                description: "SNMP and NETCONF protocol support for comprehensive network device monitoring and configuration management.",
                link: "/network-monitoring",
              },
              {
                icon: Gauge,
                title: "Observability Dashboards",
                description: "Grafana-powered visualizations with customizable dashboards, real-time graphs, and exportable reports.",
                link: "/observability-dashboards",
              },
              {
                icon: Database,
                title: "Data Collection",
                description: "Automated data collection from IoT sensors using industry-standard protocols with secure storage and retrieval.",
                link: "/data-collection",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="h-full border-2 hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => {
                    if (isAuthenticated) {
                      navigate(feature.link);
                    } else {
                      navigate("/auth");
                    }
                  }}
                >
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="flex items-center gap-2">
                      {feature.title}
                      <span className="text-muted-foreground">↗</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-foreground text-background">
        <div className="max-w-4xl mx-auto px-8 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Ready to Ensure Zero Downtime?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Start monitoring your healthcare IoT network today
            </p>
            <Button size="lg" variant="secondary" onClick={handleGetStarted}>
              {isAuthenticated ? "Go to Dashboard" : "Get Started Now"}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-6xl mx-auto px-8 text-center text-sm text-muted-foreground">
          <p>Built with open-source technologies • Zabbix • SNMP • NETCONF • Grafana</p>
          <p className="mt-2">© 2024 Healthcare IoT Monitor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}