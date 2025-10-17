import { OpenAI, Anthropic, Gemini } from '@lobehub/icons';

interface ProviderMetadata {
  name: string;
  logo: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const PROVIDER_METADATA: Record<string, ProviderMetadata> = {
  openai: {
    name: "OpenAI",
    logo: OpenAI,
  },
  anthropic: {
    name: "Anthropic",
    logo: Anthropic,
  },
  gemini: {
    name: "Gemini",
    logo: Gemini.Color,
  },
};

export const getProviderMetadata = (providerId: string): ProviderMetadata => {
  return (
    PROVIDER_METADATA[providerId] || {
      name: providerId.charAt(0).toUpperCase() + providerId.slice(1), logo: () => null,
    }
  )
}

