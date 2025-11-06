import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import AuthPage from "@/pages/Auth.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";
import Landing from "./pages/Landing.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Monitoring from "./pages/Monitoring.tsx";
import Alerts from "./pages/Alerts.tsx";
import Analytics from "./pages/Analytics.tsx";
import DeviceManagement from "./pages/DeviceManagement.tsx";
import SmartAlerts from "./pages/Alerts.tsx";
import PerformanceMetrics from "./pages/PerformanceMetrics.tsx";
import NetworkMonitoring from "./pages/NetworkMonitoring.tsx";
import ObservabilityDashboards from "./pages/ObservabilityDashboards.tsx";
import DataCollection from "./pages/DataCollection.tsx";
import NotFound from "./pages/NotFound.tsx";
import TechnologyStack from "./pages/TechnologyStack.tsx";
import DataCollectionWorkflow from "./pages/DataCollectionWorkflow.tsx";
import "./types/global.d.ts";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VlyToolbar />
    <InstrumentationProvider>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter>
          <RouteSyncer />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/device-management" element={<DeviceManagement />} />
            <Route path="/smart-alerts" element={<SmartAlerts />} />
            <Route path="/performance-metrics" element={<PerformanceMetrics />} />
            <Route path="/network-monitoring" element={<NetworkMonitoring />} />
            <Route path="/observability-dashboards" element={<ObservabilityDashboards />} />
            <Route path="/data-collection" element={<DataCollection />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/technology-stack" element={<TechnologyStack />} />
            <Route path="/data-collection-workflow" element={<DataCollectionWorkflow />} />
            <Route path="/auth" element={<AuthPage redirectAfterAuth="/dashboard" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </ConvexAuthProvider>
    </InstrumentationProvider>
  </StrictMode>,
);