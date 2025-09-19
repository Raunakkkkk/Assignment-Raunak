import axios from "axios";
import {
  Patient,
  CallLog,
  Bot,
  ApiResponse,
  PreCallData,
  FunctionCallRequest,
  FunctionCallResponse,
  PostCallRequest,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("API Response Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Health check
export const checkHealth = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get("/health");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Health check failed");
  }
};

// Pre-call webhook
export const getPreCallData = async (): Promise<PreCallData> => {
  try {
    const response = await api.post("/precall");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to get pre-call data"
    );
  }
};

// Function call (get patient by medical ID)
export const getPatientByMedicalID = async (
  medicalID: string
): Promise<FunctionCallResponse> => {
  try {
    const response = await api.post("/getPatient", { medicalID });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to get patient data"
    );
  }
};

// Post-call webhook
export const submitPostCallData = async (
  data: PostCallRequest
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post("/postcall", data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to submit post-call data"
    );
  }
};

// Get call logs
export const getCallLogs = async (): Promise<ApiResponse<CallLog[]>> => {
  try {
    const response = await api.get("/logs");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get call logs");
  }
};

// Fetch calls from OpenMic API (preferred over local /logs)
export const getOpenMicCalls = async (params?: {
  limit?: number;
  offset?: number;
  bot_uid?: string;
}): Promise<CallLog[]> => {
  try {
    if (!OPENMIC_API_KEY) {
      throw new Error("OpenMic API key not configured");
    }
    const response = await openmicApi.get("/calls", { params });
    const calls = response.data?.calls || response.data?.data || [];

    const toIso = (ts: any): string => {
      if (!ts && ts !== 0) return new Date().toISOString();
      if (typeof ts === "number") return new Date(ts).toISOString();
      return new Date(ts).toISOString();
    };

    // Map OpenMic call object to local CallLog shape
    const toCallLog = (c: any): CallLog => ({
      type: c.type || c.call_type || "call",
      sessionId: c.session_id || c.call_id || c.uid || c.id || "",
      toPhoneNumber: c.to || c.to_phone_number || c.to_number || "",
      fromPhoneNumber: c.from || c.from_phone_number || c.from_number || "",
      callType: c.call_type || "phonecall",
      disconnectionReason:
        c.disconnection_reason || c.reason || c.call_status || "",
      direction: c.direction || "outbound",
      createdAt: c.created_at || c.started_at || toIso(c.start_timestamp),
      endedAt:
        c.ended_at ||
        c.completed_at ||
        c.finished_at ||
        toIso(c.end_timestamp) ||
        c.created_at ||
        new Date().toISOString(),
      transcript: c.transcript || c.messages || [],
      summary:
        c.summary || c.post_call_summary || c.call_analysis?.summary || "",
      isSuccessful:
        typeof c.is_successful === "boolean"
          ? c.is_successful
          : typeof c.call_analysis?.is_successful === "boolean"
          ? c.call_analysis.is_successful
          : c.call_status
          ? c.call_status === "completed" || c.call_status === "ended"
          : true,
      dynamicVariables: c.dynamic_variables || c.dynamicVariables || {},
      timestamp: new Date().toISOString(),
      saved: true,
      agentId: c.agent_id || c.bot_id || undefined,
    });

    return calls.map(toCallLog);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch OpenMic calls"
    );
  }
};

// OpenMic API Bot Management
const OPENMIC_API_BASE = "https://api.openmic.ai/v1";
const OPENMIC_API_KEY = process.env.NEXT_PUBLIC_OPENMIC_API_KEY;

const openmicApi = axios.create({
  baseURL: OPENMIC_API_BASE,
  headers: {
    Authorization: `Bearer ${OPENMIC_API_KEY}`,
    "Content-Type": "application/json",
  },
});

// Get all bots from OpenMic API
export const getBots = async (): Promise<Bot[]> => {
  try {
    if (!OPENMIC_API_KEY) {
      console.warn("OpenMic API key not configured, returning mock data");
    }

    const response = await openmicApi.get("/bots");
    const openmicBots = response.data.bots || [];

    // Transform OpenMic bot format to our Bot interface
    return openmicBots.map((bot: any) => ({
      id: bot.uid,
      name: bot.name,
      description: bot.prompt || "No description available",
      domain: "medical" as const,
      status: "active" as const,
      createdAt: bot.created_at,
      webhookUrls: {
        preCall: `${API_BASE_URL}/precall`,
        postCall: `${API_BASE_URL}/postcall`,
        functionCall: `${API_BASE_URL}/getPatient`,
      },
      firstMessage: bot.first_message || "",
      voice: bot.voice || "alloy",
      voiceSpeed: bot.voice_speed || 1.0,
      llmModel: bot.llm_model_name || "gpt-4",
      temperature: bot.llm_model_temperature || 0.7,
      maxCallDuration: bot.call_settings?.max_call_duration || 16,
      silenceTimeout: bot.call_settings?.silence_timeout || 25,
      callRecording: bot.call_settings?.call_recording_enabled || true,
      openmicData: bot,
    }));
  } catch (error: any) {
    console.error("Error fetching bots from OpenMic API:", error);
    return [];
  }
};

// Create a new bot via OpenMic API
export const createBot = async (
  botData: Partial<
    Pick<
      Bot,
      | "firstMessage"
      | "voice"
      | "voiceSpeed"
      | "llmModel"
      | "temperature"
      | "maxCallDuration"
      | "silenceTimeout"
      | "callRecording"
    >
  > & {
    name: string;
    description: string;
  }
): Promise<Bot> => {
  try {
    if (!OPENMIC_API_KEY) {
      throw new Error("OpenMic API key not configured");
    }

    const openmicBotData: any = {
      name: botData.name,
      prompt: botData.description,
    };
    if (botData.firstMessage)
      openmicBotData.first_message = botData.firstMessage;
    if (botData.voice) openmicBotData.voice = botData.voice;
    if (botData.voiceSpeed !== undefined)
      openmicBotData.voice_speed = botData.voiceSpeed;
    if (botData.llmModel) openmicBotData.llm_model_name = botData.llmModel;
    if (botData.temperature !== undefined)
      openmicBotData.llm_model_temperature = botData.temperature;

    if (
      botData.maxCallDuration !== undefined ||
      botData.silenceTimeout !== undefined ||
      botData.callRecording !== undefined
    ) {
      openmicBotData.call_settings = {} as any;
      if (botData.maxCallDuration !== undefined)
        openmicBotData.call_settings.max_call_duration =
          botData.maxCallDuration;
      if (botData.silenceTimeout !== undefined)
        openmicBotData.call_settings.silence_timeout = botData.silenceTimeout;
      if (botData.callRecording !== undefined)
        openmicBotData.call_settings.call_recording_enabled =
          botData.callRecording;
    }

    const response = await openmicApi.post("/bots", openmicBotData);
    const createdBot = response.data;

    return {
      id: createdBot.uid,
      name: createdBot.name,
      description: createdBot.prompt,
      domain: "medical" as const,
      status: "active" as const,
      createdAt: createdBot.created_at,
      webhookUrls: {
        preCall: `${API_BASE_URL}/precall`,
        postCall: `${API_BASE_URL}/postcall`,
        functionCall: `${API_BASE_URL}/getPatient`,
      },
      firstMessage: createdBot.first_message,
      voice: createdBot.voice,
      voiceSpeed: createdBot.voice_speed,
      llmModel: createdBot.llm_model_name,
      temperature: createdBot.llm_model_temperature,
      maxCallDuration: createdBot.call_settings?.max_call_duration,
      silenceTimeout: createdBot.call_settings?.silence_timeout,
      callRecording: createdBot.call_settings?.call_recording_enabled,
      openmicData: createdBot,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create bot");
  }
};

// Update a bot via OpenMic API
export const updateBot = async (
  id: string,
  botData: Partial<Bot>
): Promise<Bot> => {
  try {
    if (!OPENMIC_API_KEY) {
      throw new Error("OpenMic API key not configured");
    }

    const updateData: any = {};
    if (botData.name) updateData.name = botData.name;
    if (botData.description) updateData.prompt = botData.description;
    if (botData.firstMessage) updateData.first_message = botData.firstMessage;
    if (botData.voice) updateData.voice = botData.voice;
    if (botData.voiceSpeed !== undefined)
      updateData.voice_speed = botData.voiceSpeed;
    if (botData.llmModel) updateData.llm_model_name = botData.llmModel;
    if (botData.temperature !== undefined)
      updateData.llm_model_temperature = botData.temperature;

    if (
      botData.maxCallDuration !== undefined ||
      botData.silenceTimeout !== undefined ||
      botData.callRecording !== undefined
    ) {
      updateData.call_settings = {};
      if (botData.maxCallDuration !== undefined)
        updateData.call_settings.max_call_duration = botData.maxCallDuration;
      if (botData.silenceTimeout !== undefined)
        updateData.call_settings.silence_timeout = botData.silenceTimeout;
      if (botData.callRecording !== undefined)
        updateData.call_settings.call_recording_enabled = botData.callRecording;
    }

    const response = await openmicApi.patch(`/bots/${id}`, updateData);
    const updatedBot = response.data;

    return {
      id: updatedBot.uid,
      name: updatedBot.name,
      description: updatedBot.prompt,
      domain: "medical" as const,
      status: "active" as const,
      createdAt: updatedBot.created_at,
      webhookUrls: {
        preCall: `${API_BASE_URL}/precall`,
        postCall: `${API_BASE_URL}/postcall`,
        functionCall: `${API_BASE_URL}/getPatient`,
      },
      firstMessage: updatedBot.first_message,
      voice: updatedBot.voice,
      voiceSpeed: updatedBot.voice_speed,
      llmModel: updatedBot.llm_model_name,
      temperature: updatedBot.llm_model_temperature,
      maxCallDuration: updatedBot.call_settings?.max_call_duration,
      silenceTimeout: updatedBot.call_settings?.silence_timeout,
      callRecording: updatedBot.call_settings?.call_recording_enabled,
      openmicData: updatedBot,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update bot");
  }
};

// Delete a bot via OpenMic API
export const deleteBot = async (id: string): Promise<void> => {
  try {
    if (!OPENMIC_API_KEY) {
      throw new Error("OpenMic API key not configured");
    }

    await openmicApi.delete(`/bots/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete bot");
  }
};

// Mock data fallback

export default api;
