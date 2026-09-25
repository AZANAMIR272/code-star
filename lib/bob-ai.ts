/**
 * IBM Watsonx.ai — Inference client
 * Model: meta-llama/llama-3-3-70b-instruct
 * Endpoint: https://au-syd.ml.cloud.ibm.com/ml/v1/text/chat
 */

const WATSONX_API_KEY = process.env.WATSONX_API_KEY ?? "";
const WATSONX_PROJECT_ID = process.env.WATSONX_PROJECT_ID ?? "";
const WATSONX_URL = process.env.WATSONX_URL ?? "https://au-syd.ml.cloud.ibm.com";
const WATSONX_MODEL = "meta-llama/llama-3-3-70b-instruct";

export interface BobMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface BobInferenceOptions {
  messages: BobMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface BobInferenceResult {
  content: string;
  model: string;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

/** Get a fresh IBM IAM bearer token from the API key */
async function getIAMToken(): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch("https://iam.cloud.ibm.com/identity/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${WATSONX_API_KEY}`,
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`IAM token error: ${res.status}`);
    const json = await res.json();
    return json.access_token as string;
  } finally {
    clearTimeout(timeout);
  }
}

export async function bobInference(opts: BobInferenceOptions): Promise<BobInferenceResult> {
  const { messages, model, maxTokens = 1024, temperature = 0.7 } = opts;

  const token = await getIAMToken();

  const body = {
    model_id: model ?? WATSONX_MODEL,
    messages,
    project_id: WATSONX_PROJECT_ID,
    parameters: { max_new_tokens: maxTokens, temperature },
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  let res: Response;
  try {
    res = await fetch(`${WATSONX_URL}/ml/v1/text/chat?version=2023-05-29`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Watsonx API error ${res.status}: ${text}`);
  }

  const json = await res.json();
  let content: string = json?.choices?.[0]?.message?.content ?? "";

  // Strip markdown code fences if model wrapped JSON in ```json ... ```
  content = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();

  return {
    content,
    model: json?.model_id ?? WATSONX_MODEL,
    usage: json?.usage,
  };
}

/** Shorthand: single user prompt → assistant reply string */
export async function askBob(
  prompt: string,
  systemPrompt?: string,
  opts?: Partial<BobInferenceOptions>
): Promise<string> {
  const messages: BobMessage[] = [];
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
  messages.push({ role: "user", content: prompt });
  const result = await bobInference({ ...opts, messages });
  return result.content;
}
