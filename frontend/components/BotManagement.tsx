"use client";

import { useState } from "react";
import { Bot } from "@/lib/types";
import { createBot, updateBot, deleteBot } from "@/lib/api";
import BotFormModal, { BotFormValues } from "@/components/BotFormModal";
import { Plus, Edit2, Trash2, Copy, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

interface BotManagementProps {
  bots: Bot[];
  onBotsChange: (bots: Bot[]) => void;
  onRefresh: () => void;
}

export default function BotManagement({
  bots,
  onBotsChange,
  onRefresh,
}: BotManagementProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBot, setEditingBot] = useState<Bot | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateBot = async (
    botData: Partial<BotFormValues> & { name: string; description: string }
  ) => {
    try {
      setIsLoading(true);
      const newBot = await createBot(botData as any);

      onBotsChange([...bots, newBot]);
      setShowCreateModal(false);
      toast.success("Bot created successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to create bot");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBot = async (
    id: string,
    botData: Partial<BotFormValues> & { name: string; description: string }
  ) => {
    try {
      setIsLoading(true);
      const updatedBot = await updateBot(id, botData as any);
      onBotsChange(bots.map((bot) => (bot.id === id ? updatedBot : bot)));
      setEditingBot(null);
      toast.success("Bot updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update bot");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBot = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bot?")) return;

    try {
      setIsLoading(true);
      await deleteBot(id);
      onBotsChange(bots.filter((bot) => bot.id !== id));
      toast.success("Bot deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete bot");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bot Management</h2>
          <p className="text-gray-600">Manage your OpenMic AI agents</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Bot</span>
        </button>
      </div>

      {/* Bots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bots.map((bot) => (
          <div key={bot.id} className="card hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  {bot.domain}
                </span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => setEditingBot(bot)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Edit bot"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteBot(bot.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                  title="Delete bot"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {bot.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {bot.description}
            </p>

            <div className="space-y-2">
              <div className="text-xs text-gray-500">
                <strong>Bot ID:</strong>
                <div className="flex items-center space-x-1 mt-1">
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                    {bot.id}
                  </code>
                  <button
                    onClick={() => copyToClipboard(bot.id)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Copy Bot ID"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                <strong>Created:</strong>{" "}
                {new Date(bot.createdAt).toLocaleDateString()}
              </div>

              <div className="pt-2 border-t border-gray-200">
                <a
                  href={`https://chat.openmic.ai/agent`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
                >
                  <span>Open in OpenMic Dashboard</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}

        {bots.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bots created yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first AI agent to get started
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Your First Bot
            </button>
          </div>
        )}
      </div>

      {/* Create Bot Modal */}
      {showCreateModal && (
        <BotFormModal
          title="Create New Bot"
          submitLabel="Create Bot"
          isLoading={isLoading}
          onClose={() => setShowCreateModal(false)}
          initialValues={{
            name: "",
            description: "",
            firstMessage: "",
            voice: "",
            voiceSpeed: undefined as any,
            llmModel: "",
            temperature: undefined as any,
            maxCallDuration: undefined as any,
            silenceTimeout: undefined as any,
            callRecording: undefined as any,
          }}
          onSubmit={handleCreateBot}
        />
      )}

      {/* Edit Bot Modal */}
      {editingBot && (
        <BotFormModal
          title="Edit Bot"
          submitLabel="Update Bot"
          isLoading={isLoading}
          onClose={() => setEditingBot(null)}
          initialValues={{
            name: editingBot.name,
            description: editingBot.description,
            firstMessage: editingBot.firstMessage || "",
            voice: editingBot.voice || "",
            voiceSpeed: editingBot.voiceSpeed as any,
            llmModel: editingBot.llmModel || "",
            temperature: editingBot.temperature as any,
            maxCallDuration: editingBot.maxCallDuration as any,
            silenceTimeout: editingBot.silenceTimeout as any,
            callRecording: editingBot.callRecording as any,
          }}
          onSubmit={(vals) => handleUpdateBot(editingBot.id, vals)}
        />
      )}
    </div>
  );
}

// Create Bot Modal Component
function CreateBotModal({
  onClose,
  onSubmit,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    firstMessage: string;
    voice: string;
    voiceSpeed: number;
    llmModel: string;
    temperature: number;
    maxCallDuration: number;
    silenceTimeout: number;
    callRecording: boolean;
    domain?: "medical" | "legal" | "receptionist";
    status?: "active" | "inactive";
    webhookUrls?: {
      preCall?: string;
      postCall?: string;
      functionCall?: string;
    };
  }) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    firstMessage: "",
    voice: "",
    voiceSpeed: 1.0,
    llmModel: "",
    temperature: 0.7,
    maxCallDuration: 15,
    silenceTimeout: 25,
    callRecording: true,
    domain: "" as "" | "medical" | "legal" | "receptionist",
    status: "" as "" | "active" | "inactive",
    webhookPreCall: "",
    webhookPostCall: "",
    webhookFunctionCall: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      firstMessage: formData.firstMessage.trim(),
      voice: formData.voice,
      voiceSpeed: formData.voiceSpeed,
      llmModel: formData.llmModel,
      temperature: formData.temperature,
      maxCallDuration: formData.maxCallDuration,
      silenceTimeout: formData.silenceTimeout,
      callRecording: formData.callRecording,
      domain: formData.domain || undefined,
      status: formData.status || undefined,
      webhookUrls: {
        preCall: formData.webhookPreCall,
        postCall: formData.webhookPostCall,
        functionCall: formData.webhookFunctionCall,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Create New Bot
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bot Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input-field"
                  placeholder="Enter bot name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voice
                </label>
                <select
                  value={formData.voice}
                  onChange={(e) =>
                    setFormData({ ...formData, voice: e.target.value })
                  }
                  className="input-field"
                  required
                >
                  <option value="" disabled>
                    Select voice
                  </option>
                  <option value="alloy">Alloy</option>
                  <option value="echo">Echo</option>
                  <option value="fable">Fable</option>
                  <option value="onyx">Onyx</option>
                  <option value="nova">Nova</option>
                  <option value="shimmer">Shimmer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input-field"
                rows={2}
                placeholder="Enter bot description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Message
              </label>
              <textarea
                value={formData.firstMessage}
                onChange={(e) =>
                  setFormData({ ...formData, firstMessage: e.target.value })
                }
                className="input-field"
                rows={2}
                placeholder="Enter the first message the bot will say"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LLM Model
                </label>
                <select
                  value={formData.llmModel}
                  onChange={(e) =>
                    setFormData({ ...formData, llmModel: e.target.value })
                  }
                  className="input-field"
                  required
                >
                  <option value="" disabled>
                    Select model
                  </option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature
                </label>
                <input
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      temperature: parseFloat(e.target.value),
                    })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voice Speed
                </label>
                <input
                  type="number"
                  min="0.25"
                  max="4"
                  step="0.25"
                  value={formData.voiceSpeed}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      voiceSpeed: parseFloat(e.target.value),
                    })
                  }
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Call Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={formData.maxCallDuration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxCallDuration: parseInt(e.target.value),
                    })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Silence Timeout (seconds)
                </label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={formData.silenceTimeout}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      silenceTimeout: parseInt(e.target.value),
                    })
                  }
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Webhook URLs removed per instruction; configure in OpenMic dashboard */}

            {/* Domain/Status removed (not part of OpenMic Bot create fields) */}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="callRecording"
                checked={formData.callRecording}
                onChange={(e) =>
                  setFormData({ ...formData, callRecording: e.target.checked })
                }
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor="callRecording"
                className="ml-2 block text-sm text-gray-700"
              >
                Enable call recording
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={
                  isLoading ||
                  !formData.name.trim() ||
                  !formData.description.trim() ||
                  !formData.firstMessage.trim() ||
                  !formData.voice ||
                  !formData.llmModel ||
                  (!Number.isFinite(formData.temperature) as any) ||
                  (!Number.isFinite(formData.voiceSpeed) as any) ||
                  (!Number.isFinite(formData.maxCallDuration) as any) ||
                  (!Number.isFinite(formData.silenceTimeout) as any) ||
                  !formData.webhookPreCall ||
                  !formData.webhookPostCall ||
                  !formData.webhookFunctionCall ||
                  !formData.domain ||
                  !formData.status
                }
              >
                {isLoading ? "Creating..." : "Create Bot"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Edit Bot Modal Component
function EditBotModal({
  bot,
  onClose,
  onSubmit,
  isLoading,
}: {
  bot: Bot;
  onClose: () => void;
  onSubmit: (
    id: string,
    data: {
      name: string;
      description: string;
      firstMessage: string;
      voice: string;
      voiceSpeed: number;
      llmModel: string;
      temperature: number;
      maxCallDuration: number;
      silenceTimeout: number;
      callRecording: boolean;
      domain?: "medical" | "legal" | "receptionist";
      status?: "active" | "inactive";
      webhookUrls?: {
        preCall?: string;
        postCall?: string;
        functionCall?: string;
      };
    }
  ) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: bot.name,
    description: bot.description,
    firstMessage: bot.firstMessage,
    voice: bot.voice,
    voiceSpeed: bot.voiceSpeed,
    llmModel: bot.llmModel,
    temperature: bot.temperature,
    maxCallDuration: bot.maxCallDuration,
    silenceTimeout: bot.silenceTimeout,
    callRecording: bot.callRecording,
    domain: bot.domain as "medical" | "legal" | "receptionist",
    status: bot.status as "active" | "inactive",
    webhookPreCall: bot.webhookUrls?.preCall || "",
    webhookPostCall: bot.webhookUrls?.postCall || "",
    webhookFunctionCall: bot.webhookUrls?.functionCall || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.description.trim()) {
      onSubmit(bot.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        firstMessage: formData.firstMessage,
        voice: formData.voice,
        voiceSpeed: formData.voiceSpeed,
        llmModel: formData.llmModel,
        temperature: formData.temperature,
        maxCallDuration: formData.maxCallDuration,
        silenceTimeout: formData.silenceTimeout,
        callRecording: formData.callRecording,
        domain: formData.domain,
        status: formData.status,
        webhookUrls: {
          preCall: formData.webhookPreCall,
          postCall: formData.webhookPostCall,
          functionCall: formData.webhookFunctionCall,
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Bot</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bot Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input-field"
                  placeholder="Enter bot name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voice
                </label>
                <select
                  value={formData.voice}
                  onChange={(e) =>
                    setFormData({ ...formData, voice: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="alloy">Alloy</option>
                  <option value="echo">Echo</option>
                  <option value="fable">Fable</option>
                  <option value="onyx">Onyx</option>
                  <option value="nova">Nova</option>
                  <option value="shimmer">Shimmer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input-field"
                rows={2}
                placeholder="Enter bot description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Message
              </label>
              <textarea
                value={formData.firstMessage}
                onChange={(e) =>
                  setFormData({ ...formData, firstMessage: e.target.value })
                }
                className="input-field"
                rows={2}
                placeholder="Enter the first message the bot will say"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LLM Model
                </label>
                <select
                  value={formData.llmModel}
                  onChange={(e) =>
                    setFormData({ ...formData, llmModel: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature
                </label>
                <input
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      temperature: parseFloat(e.target.value),
                    })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voice Speed
                </label>
                <input
                  type="number"
                  min="0.25"
                  max="4"
                  step="0.25"
                  value={formData.voiceSpeed}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      voiceSpeed: parseFloat(e.target.value),
                    })
                  }
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Call Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={formData.maxCallDuration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxCallDuration: parseInt(e.target.value),
                    })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Silence Timeout (seconds)
                </label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={formData.silenceTimeout}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      silenceTimeout: parseInt(e.target.value),
                    })
                  }
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Webhook URLs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pre-call Webhook URL
                </label>
                <input
                  type="url"
                  value={formData.webhookPreCall}
                  onChange={(e) =>
                    setFormData({ ...formData, webhookPreCall: e.target.value })
                  }
                  className="input-field"
                  placeholder="https://<ngrok>/precall"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Post-call Webhook URL
                </label>
                <input
                  type="url"
                  value={formData.webhookPostCall}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      webhookPostCall: e.target.value,
                    })
                  }
                  className="input-field"
                  placeholder="https://<ngrok>/postcall"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Function Call URL
                </label>
                <input
                  type="url"
                  value={formData.webhookFunctionCall}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      webhookFunctionCall: e.target.value,
                    })
                  }
                  className="input-field"
                  placeholder="https://<ngrok>/getPatient"
                  required
                />
              </div>
            </div>

            {/* Domain/Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Domain
                </label>
                <select
                  value={formData.domain}
                  onChange={(e) =>
                    setFormData({ ...formData, domain: e.target.value as any })
                  }
                  className="input-field"
                  required
                >
                  <option value="medical">Medical</option>
                  <option value="legal">Legal</option>
                  <option value="receptionist">Receptionist</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  className="input-field"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="editCallRecording"
                checked={formData.callRecording}
                onChange={(e) =>
                  setFormData({ ...formData, callRecording: e.target.checked })
                }
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor="editCallRecording"
                className="ml-2 block text-sm text-gray-700"
              >
                Enable call recording
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={
                  isLoading ||
                  !formData.name.trim() ||
                  !formData.description.trim()
                }
              >
                {isLoading ? "Updating..." : "Update Bot"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
