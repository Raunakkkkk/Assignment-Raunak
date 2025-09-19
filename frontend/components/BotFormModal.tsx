"use client";

import { useState } from "react";

export type BotFormValues = {
  name: string;
  description: string; // prompt
  firstMessage?: string;
  voice?: string;
  voiceSpeed?: number;
  llmModel?: string;
  temperature?: number;
  maxCallDuration?: number;
  silenceTimeout?: number;
  callRecording?: boolean;
};

export default function BotFormModal({
  title,
  submitLabel,
  initialValues,
  onSubmit,
  isLoading,
  onClose,
}: {
  title: string;
  submitLabel: string;
  initialValues: BotFormValues;
  onSubmit: (data: BotFormValues) => void;
  isLoading: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<BotFormValues>(initialValues);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: BotFormValues = {
      name: formData.name.trim(),
      description: formData.description.trim(),
    };
    if (formData.firstMessage && formData.firstMessage.trim())
      payload.firstMessage = formData.firstMessage.trim();
    if (formData.voice) payload.voice = formData.voice;
    if (typeof formData.voiceSpeed === "number")
      payload.voiceSpeed = formData.voiceSpeed;
    if (formData.llmModel) payload.llmModel = formData.llmModel;
    if (typeof formData.temperature === "number")
      payload.temperature = formData.temperature;
    if (typeof formData.maxCallDuration === "number")
      payload.maxCallDuration = formData.maxCallDuration;
    if (typeof formData.silenceTimeout === "number")
      payload.silenceTimeout = formData.silenceTimeout;
    if (typeof formData.callRecording === "boolean")
      payload.callRecording = formData.callRecording;

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bot Name <span className="text-red-500">*</span>
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
                Description (Prompt) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input-field"
                rows={6}
                placeholder="Enter bot description"
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
                />
              </div>
            </div>

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
                  !formData.description.trim()
                }
              >
                {submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
