"use client";

import { useState } from 'react';
import { ConfigurationPanel } from '@/components/ConfigurationPanel';
import { PlaygroundPanel } from '@/components/PlaygroundPanel';
import { HealthiconsArtificialIntelligence } from '@/components/icons/AiIcon';

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [accessCodeError, setAccessCodeError] = useState<string | null>(null);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    if (key) {
      setAccessCodeError(null);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12 lg:p-24">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col items-center text-center">
          <div className="relative flex items-center pt-12 md:pt-0">
            <h1 className="pb-1 text-3xl font-black md:text-4xl bg-gradient-to-r from-fuchsia-800 to-primary bg-clip-text text-transparent">
              AI Playground
            </h1>
            <HealthiconsArtificialIntelligence className="relative bottom-7 right-3.5" />
          </div>
          <p className="mb-8 text-muted-foreground">
            A playground to test out many different AI providers and models.
          </p>
        </div>

        <ConfigurationPanel
          apiKey={apiKey}
          setApiKey={handleApiKeyChange}
          accessCodeError={accessCodeError}
        />

        <PlaygroundPanel
          apiKey={apiKey}
          setAccessCodeError={setAccessCodeError}
        />

      </div>
    </main>
  );
}
