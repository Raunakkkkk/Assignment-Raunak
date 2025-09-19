export interface Patient {
  medicalID: string;
  name: string;
  age: number;
  lastVisit: string;
  allergies: string[];
  condition: string;
  medications: string[];
  phone: string;
  email: string;
  address: string;
}

export interface CallLog {
  type: string;
  sessionId: string;
  toPhoneNumber: string;
  fromPhoneNumber: string;
  callType: string;
  disconnectionReason: string;
  direction: string;
  createdAt: string;
  endedAt: string;
  transcript: any[];
  summary: string;
  isSuccessful: boolean;
  dynamicVariables: Record<string, any>;
  timestamp: string;
  saved: boolean;
  agentId?: string;
}

export interface Bot {
  id: string;
  name: string;
  description: string;
  domain: "medical" | "legal" | "receptionist";
  status: "active" | "inactive";
  createdAt: string;
  webhookUrls: {
    preCall: string;
    postCall: string;
    functionCall: string;
  };
  // Additional OpenMic parameters
  firstMessage: string;
  voice: string;
  voiceSpeed: number;
  llmModel: string;
  temperature: number;
  maxCallDuration: number;
  silenceTimeout: number;
  callRecording: boolean;
  openmicData?: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

export interface PreCallData {
  call: {
    dynamic_variables: {
      name: string;
      age: number;
      lastVisit: string;
    };
  };
}

export interface FunctionCallRequest {
  medicalID: string;
}

export interface FunctionCallResponse extends Patient {}

export interface PostCallRequest {
  type: string;
  sessionId: string;
  toPhoneNumber?: string;
  fromPhoneNumber?: string;
  callType?: string;
  disconnectionReason?: string;
  direction?: string;
  createdAt?: string;
  endedAt?: string;
  transcript?: any[];
  summary?: string;
  isSuccessful?: boolean;
  dynamicVariables?: Record<string, any>;
}
