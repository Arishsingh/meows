type AiRole = "system" | "user" | "assistant";

export type AiMessage = {
  role: AiRole;
  content: string;
};

export type GenerateTextOptions = {
  messages?: AiMessage[];
  system?: string;
  prompt?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: "text" | "json_object";
  fallback?: string | (() => string | Promise<string>);
};

type ProviderName = "openrouter" | "huggingface" | "openai";

type ProviderConfig = {
  name: ProviderName;
  apiKey: string;
  baseUrl: string;
  model: string;
  headers?: Record<string, string>;
};

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
    text?: string;
  }>;
  error?: { message?: string };
};

export class AiProviderError extends Error {
  code: "AI_NOT_CONFIGURED" | "AI_PROVIDER_ERROR" | "AI_RESPONSE_ERROR";
  provider?: string;
  status?: number;
  retryable: boolean;

  constructor(
    code: AiProviderError["code"],
    message: string,
    options: { provider?: string; status?: number; retryable?: boolean } = {},
  ) {
    super(message);
    this.name = "AiProviderError";
    this.code = code;
    this.provider = options.provider;
    this.status = options.status;
    this.retryable = options.retryable ?? false;
  }
}

function env(name: string): string {
  return process.env[name]?.trim() ?? "";
}

function cleanBaseUrl(value: string, fallback: string): string {
  return (value || fallback).replace(/\/+$/, "");
}

function providerOrder(): ProviderName[] {
  const raw = env("AI_PROVIDER_ORDER") || "openrouter,huggingface,openai";
  const out: ProviderName[] = [];
  for (const part of raw.split(",")) {
    const key = part.trim().toLowerCase();
    const name =
      key === "or" || key === "openrouter"
        ? "openrouter"
        : key === "hf" || key === "huggingface"
          ? "huggingface"
          : key === "openai"
            ? "openai"
            : null;
    if (name && !out.includes(name)) out.push(name);
  }
  return out.length > 0 ? out : ["openrouter", "huggingface", "openai"];
}

function providerConfig(name: ProviderName): ProviderConfig | null {
  if (name === "openrouter") {
    const apiKey = env("OPENROUTER_API_KEY");
    if (!apiKey) return null;
    const headers: Record<string, string> = {};
    const referer = env("OPENROUTER_REFERER") || env("NEXT_PUBLIC_APP_URL");
    const title = env("OPENROUTER_TITLE") || env("NEXT_PUBLIC_APP_NAME") || "[GROWTH-AB] You are the always-on growth";
    if (referer) headers["HTTP-Referer"] = referer;
    if (title) headers["X-OpenRouter-Title"] = title;
    return {
      name,
      apiKey,
      baseUrl: cleanBaseUrl(env("OPENROUTER_BASE_URL"), "https://openrouter.ai/api/v1"),
      model: env("OPENROUTER_MODEL") || "openrouter/free",
      headers,
    };
  }

  if (name === "huggingface") {
    const apiKey = env("HF_TOKEN");
    if (!apiKey) return null;
    const billTo = env("HF_BILL_TO");
    return {
      name,
      apiKey,
      baseUrl: cleanBaseUrl(env("HF_BASE_URL"), "https://router.huggingface.co/v1"),
      model: env("HF_MODEL") || "deepseek-ai/DeepSeek-R1:fastest",
      headers: billTo ? { "X-HF-Bill-To": billTo } : undefined,
    };
  }

  const apiKey = env("OPENAI_API_KEY");
  if (!apiKey) return null;
  return {
    name,
    apiKey,
    baseUrl: cleanBaseUrl(env("OPENAI_BASE_URL"), "https://api.openai.com/v1"),
    model: env("OPENAI_MODEL") || "gpt-4o-mini",
  };
}

function configuredProviders(): ProviderConfig[] {
  return providerOrder()
    .map((name) => providerConfig(name))
    .filter((provider): provider is ProviderConfig => provider !== null);
}

export function hasConfiguredAiProvider(): boolean {
  return configuredProviders().length > 0;
}

export function getAiProviderStatus(): Array<{ name: ProviderName; configured: boolean; model: string }> {
  return providerOrder().map((name) => {
    const config = providerConfig(name);
    return {
      name,
      configured: Boolean(config),
      model:
        config?.model ??
        (name === "openrouter"
          ? env("OPENROUTER_MODEL") || "openrouter/free"
          : name === "huggingface"
            ? env("HF_MODEL") || "deepseek-ai/DeepSeek-R1:fastest"
            : env("OPENAI_MODEL") || "gpt-4o-mini"),
    };
  });
}

function normalizeMessages(options: GenerateTextOptions): AiMessage[] {
  const messages = [...(options.messages ?? [])];
  if (options.system) messages.unshift({ role: "system", content: options.system });
  if (options.prompt) messages.push({ role: "user", content: options.prompt });
  return messages.filter((message) => message.content.trim().length > 0);
}

async function resolveFallback(fallback: GenerateTextOptions["fallback"]): Promise<string | null> {
  if (fallback == null) return null;
  return typeof fallback === "function" ? await fallback() : fallback;
}

function extractText(data: ChatCompletionResponse): string {
  const choice = data.choices?.[0];
  const content = choice?.message?.content;
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((part) => part.text ?? "")
      .join("")
      .trim();
  }
  if (typeof choice?.text === "string") return choice.text.trim();
  return "";
}

async function callProvider(provider: ProviderConfig, options: GenerateTextOptions): Promise<string> {
  const messages = normalizeMessages(options);
  if (messages.length === 0) {
    throw new AiProviderError("AI_RESPONSE_ERROR", "generateText requires messages or prompt", {
      provider: provider.name,
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  try {
    const body: Record<string, unknown> = {
      model: provider.model,
      messages,
      temperature: options.temperature ?? 0.4,
      max_tokens: options.maxTokens ?? 900,
    };
    if (options.responseFormat === "json_object") {
      body.response_format = { type: "json_object" };
    }

    const res = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${provider.apiKey}`,
        "Content-Type": "application/json",
        ...(provider.headers ?? {}),
      },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let data: ChatCompletionResponse | null = null;
    try {
      data = text ? (JSON.parse(text) as ChatCompletionResponse) : null;
    } catch {
      data = null;
    }

    if (!res.ok) {
      const message = data?.error?.message ?? (text.slice(0, 500) || `HTTP ${res.status}`);
      throw new AiProviderError("AI_PROVIDER_ERROR", message, {
        provider: provider.name,
        status: res.status,
        retryable: res.status === 429 || res.status >= 500,
      });
    }

    const output = data ? extractText(data) : "";
    if (!output) {
      throw new AiProviderError("AI_RESPONSE_ERROR", "AI provider returned an empty response", {
        provider: provider.name,
        retryable: true,
      });
    }
    return output;
  } catch (error) {
    if (error instanceof AiProviderError) throw error;
    const message = error instanceof Error ? error.message : "AI request failed";
    throw new AiProviderError("AI_PROVIDER_ERROR", message, {
      provider: provider.name,
      retryable: true,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateText(options: GenerateTextOptions): Promise<string> {
  const providers = configuredProviders();
  if (providers.length === 0) {
    const fallback = await resolveFallback(options.fallback);
    if (fallback != null) return fallback;
    throw new AiProviderError(
      "AI_NOT_CONFIGURED",
      "Set OPENROUTER_API_KEY or HF_TOKEN to enable AI generation.",
      { retryable: false },
    );
  }

  let lastError: AiProviderError | null = null;
  for (const provider of providers) {
    try {
      return await callProvider(provider, options);
    } catch (error) {
      if (error instanceof AiProviderError) {
        lastError = error;
        if (error.status && error.status >= 400 && error.status < 500 && error.status !== 429) {
          continue;
        }
        continue;
      }
      lastError = new AiProviderError("AI_PROVIDER_ERROR", "AI request failed", {
        provider: provider.name,
        retryable: true,
      });
    }
  }

  const fallback = await resolveFallback(options.fallback);
  if (fallback != null) return fallback;
  throw lastError ?? new AiProviderError("AI_PROVIDER_ERROR", "All AI providers failed");
}

function parseJsonObject<T>(text: string): T {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const raw = (fenced ?? text).trim();
  return JSON.parse(raw) as T;
}

export async function generateJson<T>(options: GenerateTextOptions): Promise<T> {
  const text = await generateText({ ...options, responseFormat: "json_object" });
  return parseJsonObject<T>(text);
}
