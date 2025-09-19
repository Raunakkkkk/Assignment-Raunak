"use client";

import { useState, useMemo } from "react";
import { CallLog } from "@/lib/types";
import {
  Search,
  Filter,
  Download,
  Eye,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";

interface CallLogsProps {
  callLogs: CallLog[];
  onRefresh: () => void;
  botNames?: Record<string, string>;
}

export default function CallLogs({
  callLogs,
  onRefresh,
  botNames = {},
}: CallLogsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "successful" | "failed"
  >("all");
  const [selectedLog, setSelectedLog] = useState<CallLog | null>(null);

  const filteredLogs = useMemo(() => {
    return callLogs.filter((log) => {
      const matchesSearch =
        log.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.toPhoneNumber.includes(searchTerm) ||
        log.fromPhoneNumber.includes(searchTerm) ||
        log.summary.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "successful" && log.isSuccessful) ||
        (statusFilter === "failed" && !log.isSuccessful);

      return matchesSearch && matchesStatus;
    });
  }, [callLogs, searchTerm, statusFilter]);

  // CSV export removed per assignment scope

  const calculateDuration = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    return `${diffMins}:${diffSecs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Call Logs</h2>
          <p className="text-gray-600">Monitor and analyze call performance</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onRefresh}
            className="btn-primary flex items-center space-x-2"
          >
            <Clock className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by session ID, phone number, or summary..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="input-field"
            >
              <option value="all">All Calls</option>
              <option value="successful">Successful</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Calls</p>
              <p className="text-2xl font-bold text-gray-900">
                {callLogs.length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Successful</p>
              <p className="text-2xl font-bold text-gray-900">
                {callLogs.filter((log) => log.isSuccessful).length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-gray-900">
                {callLogs.filter((log) => !log.isSuccessful).length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {callLogs.length > 0
                  ? Math.round(
                      (callLogs.filter((log) => log.isSuccessful).length /
                        callLogs.length) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call Logs Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From → To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bot
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dynamic Variables
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.sessionId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-sm font-mono text-gray-900">
                      {log.sessionId.substring(0, 8)}...
                    </code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.fromPhoneNumber || "N/A"}{" "}
                    <span className="text-gray-400">→</span>{" "}
                    {log.toPhoneNumber || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {botNames[log.agentId || ""] || log.agentId || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {calculateDuration(log.createdAt, log.endedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`status-badge ${
                        log.isSuccessful ? "status-success" : "status-error"
                      }`}
                    >
                      {log.isSuccessful ? "Successful" : "Failed"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {Object.keys(log.dynamicVariables).length > 0 ? (
                      <div className="space-y-1">
                        {Object.entries(log.dynamicVariables)
                          .slice(0, 2)
                          .map(([key, value]) => (
                            <div key={key} className="text-xs">
                              <span className="font-medium text-gray-600">
                                {key.replace(/([A-Z])/g, " $1").trim()}:
                              </span>
                              <span className="ml-1 text-gray-900">
                                {typeof value === "object"
                                  ? JSON.stringify(value)
                                  : String(value)}
                              </span>
                            </div>
                          ))}
                        {Object.keys(log.dynamicVariables).length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{Object.keys(log.dynamicVariables).length - 2} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(log.createdAt), "MMM dd, yyyy HH:mm")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="text-primary-600 hover:text-primary-900 flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No call logs found
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Call logs will appear here after making test calls"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Call Detail Modal */}
      {selectedLog && (
        <CallDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
}

// Call Detail Modal Component
function CallDetailModal({
  log,
  onClose,
}: {
  log: CallLog;
  onClose: () => void;
}) {
  const calculateDuration = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    return `${diffMins}:${diffSecs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Call Details
              </h3>
              <p className="text-sm text-gray-600">
                Session ID: {log.sessionId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Call Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Call ID:</span>
                  <span className="text-gray-900 font-mono">
                    {log.sessionId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Agent:</span>
                  <span className="text-gray-900 font-mono">
                    {log.agentId || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`status-badge ${
                      log.isSuccessful ? "status-success" : "status-error"
                    }`}
                  >
                    {log.isSuccessful ? "Successful" : "Failed"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="text-gray-900">
                    {calculateDuration(log.createdAt, log.endedAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">From → To:</span>
                  <span className="text-gray-900">{`${
                    log.fromPhoneNumber || "N/A"
                  } → ${log.toPhoneNumber || "N/A"}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Call Type:</span>
                  <span className="text-gray-900">{log.callType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Direction:</span>
                  <span className="text-gray-900 capitalize">
                    {log.direction}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900">
                    {format(new Date(log.createdAt), "MMM dd, yyyy HH:mm:ss")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ended:</span>
                  <span className="text-gray-900">
                    {format(new Date(log.endedAt), "MMM dd, yyyy HH:mm:ss")}
                  </span>
                </div>
                {log.disconnectionReason && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Disconnection Reason:</span>
                    <span className="text-gray-900">
                      {log.disconnectionReason}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Variables */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Dynamic Variables</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                {Object.keys(log.dynamicVariables).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(log.dynamicVariables).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center py-1"
                        >
                          <span className="text-sm font-medium text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </span>
                          <span className="text-sm text-gray-900 font-mono">
                            {typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No dynamic variables available
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          {log.summary && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-2">Call Summary</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">{log.summary}</p>
              </div>
            </div>
          )}

          {/* Transcript */}
          {(() => {
            // Normalize various transcript shapes into [{ speaker, text }]
            const normalizeTranscript = (
              raw: any
            ): Array<{ speaker: string; text: string }> => {
              if (!raw) return [];

              const flat: Array<{ speaker: string; text: string }> = [];

              const canonicalizeSpeaker = (value: any): string => {
                const v =
                  typeof value === "string"
                    ? value.toLowerCase().trim()
                    : undefined;
                if (!v) return "Unknown";
                if (["assistant", "agent", "system", "bot"].includes(v))
                  return "Agent";
                if (
                  [
                    "user",
                    "caller",
                    "client",
                    "patient",
                    "customer",
                    "human",
                  ].includes(v)
                )
                  return "Caller";
                return v.charAt(0).toUpperCase() + v.slice(1);
              };

              const deriveSpeaker = (node: any): string => {
                if (!node || typeof node !== "object") return "Unknown";
                const keys = [
                  "speaker",
                  "role",
                  "from",
                  "participant",
                  "name",
                  "source",
                  "speaker_label",
                  "author",
                  "type",
                ];
                for (const k of keys) {
                  if (node[k] !== undefined && node[k] !== null) {
                    return canonicalizeSpeaker(node[k]);
                  }
                }
                if (typeof node.isAgent === "boolean")
                  return node.isAgent ? "Agent" : "Caller";
                if (typeof node.agent === "boolean")
                  return node.agent ? "Agent" : "Caller";
                return "Unknown";
              };

              const pushLine = (speaker: any, text: any) => {
                const s = canonicalizeSpeaker(speaker);
                const t =
                  typeof text === "string"
                    ? text
                    : text?.content || text?.text || JSON.stringify(text);
                if (t && String(t).trim())
                  flat.push({ speaker: s, text: String(t) });
              };

              const mapRole = (s: string | undefined | null): string | null => {
                if (!s) return null;
                const v = s
                  .toLowerCase()
                  .trim()
                  .replace(/^unknown:\s*/, "");
                if (["assistant", "agent", "system", "bot"].includes(v))
                  return "Agent";
                if (
                  [
                    "user",
                    "caller",
                    "client",
                    "patient",
                    "customer",
                    "human",
                  ].includes(v)
                )
                  return "Caller";
                return null;
              };

              const parseInlineRoleLine = (
                line: string
              ): { speaker: string; text: string } | null => {
                const m = line.match(
                  /^\s*(?:unknown:)?\s*([a-zA-Z_]+)\s*:\s*(.*)$/i
                );
                if (!m) return null;
                const role = mapRole(m[1]);
                if (!role) return null;
                const content = m[2] || "";
                return { speaker: role, text: content };
              };

              const walk = (node: any) => {
                if (!node) return;
                if (Array.isArray(node)) {
                  for (let i = 0; i < node.length; i += 1) {
                    const cur = node[i];
                    if (typeof cur === "string") {
                      // Case 1: inline "role: message"
                      const inline = parseInlineRoleLine(cur);
                      if (inline) {
                        pushLine(inline.speaker, inline.text);
                        continue;
                      }

                      // Case 2: standalone role line followed by content on next line
                      const roleOnly = mapRole(cur);
                      if (
                        roleOnly &&
                        i + 1 < node.length &&
                        typeof node[i + 1] === "string"
                      ) {
                        const nextLine = node[i + 1] as string;
                        const nextInline = parseInlineRoleLine(nextLine);
                        if (nextInline) {
                          // next line already includes role, prefer that parsing
                          pushLine(nextInline.speaker, nextInline.text);
                        } else {
                          pushLine(roleOnly, nextLine);
                        }
                        i += 1; // consume next line
                        continue;
                      }
                    }
                    // Fallback: recurse
                    walk(cur);
                  }
                  return;
                }
                if (typeof node === "string") {
                  const inline = parseInlineRoleLine(node);
                  if (inline) {
                    pushLine(inline.speaker, inline.text);
                    return;
                  }
                  pushLine("Unknown", node);
                  return;
                }
                if (typeof node === "object") {
                  // Common shapes
                  if (node.text || node.content) {
                    pushLine(deriveSpeaker(node), node.text || node.content);
                    return;
                  }
                  if (
                    node.message &&
                    (node.message.text || node.message.content)
                  ) {
                    pushLine(
                      deriveSpeaker(node),
                      node.message.text || node.message.content
                    );
                    return;
                  }
                  // Fallback: inspect known keys that may contain arrays
                  if (node.messages) {
                    walk(node.messages);
                    return;
                  }
                  if (node.items) {
                    walk(node.items);
                    return;
                  }
                  if (node.entries) {
                    walk(node.entries);
                    return;
                  }
                  // Last resort: stringify
                  pushLine(deriveSpeaker(node), node);
                }
              };

              walk(raw);
              return flat;
            };

            const normalized = normalizeTranscript(log.transcript);
            if (!normalized.length) return null;

            return (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Transcript</h4>
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <div className="space-y-2">
                    {normalized.map((line, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium text-gray-600">
                          {line.speaker}:
                        </span>
                        <span className="ml-2 text-gray-700">{line.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
