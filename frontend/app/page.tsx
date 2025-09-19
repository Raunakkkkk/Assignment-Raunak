"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Bot, CallLog } from "@/lib/types";
import { getBots, getOpenMicCalls } from "@/lib/api";
import Header from "@/components/Header";
import BotManagement from "@/components/BotManagement";
import CallLogs from "@/components/CallLogs";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"bots" | "logs">("bots");
  const [bots, setBots] = useState<Bot[]>([]);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  const botNames = useMemo(() => {
    const map: Record<string, string> = {};
    bots.forEach((b) => (map[b.id] = b.name));
    return map;
  }, [bots]);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Load bots and call logs in parallel
      const [botsData, omCalls] = await Promise.all([
        getBots(),
        getOpenMicCalls({ limit: 50 }).catch(() => []),
      ]);

      setBots(botsData);
      setCallLogs(omCalls);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCallLogs = async () => {
    try {
      const omCalls = await getOpenMicCalls({ limit: 50 });
      setCallLogs(omCalls);
      toast.success("Call logs refreshed");
    } catch (error) {
      toast.error("Failed to refresh call logs");
    }
  };

  const tabs = [
    { id: "bots", label: "Bot Management", icon: "🤖" },
    { id: "logs", label: "Call Logs", icon: "📞" },
    { id: "webhooks", label: "Webhook Config", icon: "🔗" },
    { id: "patients", label: "Patient Data", icon: "👥" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
        tabs={[
          { id: "bots", label: "Bot Management", icon: "🤖" },
          { id: "logs", label: "Call Logs", icon: "📞" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation moved to Header */}

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "bots" && (
            <BotManagement
              bots={bots}
              onBotsChange={setBots}
              onRefresh={loadData}
            />
          )}

          {activeTab === "logs" && (
            <CallLogs
              callLogs={callLogs}
              onRefresh={refreshCallLogs}
              botNames={botNames}
            />
          )}
        </div>
      </div>
    </div>
  );
}
