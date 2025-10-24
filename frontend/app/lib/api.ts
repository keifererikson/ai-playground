export interface Settings {
  provider: string;
  model: string;
  embedding_model: string | null;
  temperature: number;
  available_models: string[];
  available_providers: string[];
}

export interface UpdateSettingsPayload {
  provider?: string;
  model?: string;
  temperature?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function getSettings(): Promise<Settings> {
  const response = await fetch(`${API_BASE_URL}/api/v1/settings`)
  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }
  return response.json();
};

export async function getModelsForProvider(provider: string): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/providers/${provider}/models`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch models');
  }
  const result = await response.json();
  return result.models;
}

export async function updateSettings(payload: UpdateSettingsPayload): Promise<Settings> {
  const response = await fetch(`${API_BASE_URL}/api/v1/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update settings');
  }
  return response.json();
}

export async function testPrompt(prompt: string, captchaToken: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/v1/test`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Captcha-Token': captchaToken,
    },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get AI response');
  }
  const result = await response.json();
  return result.response;
}

export async function embedPrompt(text: string, captchaToken: string): Promise<number[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/embed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Captcha-Token': captchaToken,
    },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get embeddings');
  }
  const result = await response.json();
  return result;
}





