"use client"

import { useState, useEffect, useRef } from "react"
import HCaptcha from "@hcaptcha/react-hcaptcha"
import { useSettings } from "@/app/context/SettingsContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { testPrompt, embedPrompt } from "@/app/lib/api"
import { toast } from "sonner"
import { LucideSendHorizontal } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { TypingIndicator } from "@/components/ui/typing-indicator"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export function PlaygroundPanel({ }) {
  const { settings } = useSettings();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [promptError, setPromptError] = useState<string | null>(null);

  const [embeddingPrompt, setEmbeddingPrompt] = useState("");
  const [embeddingResponse, setEmbeddingResponse] = useState<number[] | null>(null);
  const [isEmbeddingLoading, setIsEmbeddingLoading] = useState(false);
  const [embeddingApiError, setEmbeddingApiError] = useState<string | null>(null);
  const [embeddingPromptError, setEmbeddingPromptError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("text-generation");

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const hcaptchaRef = useRef<HCaptcha>(null);

  const embeddingsSupported = !!settings?.embedding_model;

  useEffect(() => {
    if (activeTab === "embeddings" && !embeddingsSupported) {
      setActiveTab("text-generation");
    }
  }, [settings, activeTab, embeddingsSupported]);


  const handleSubmit = async () => {

    if (!prompt) {
      const errorMessage = "Prompt cannot be empty.";
      setPromptError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    if (!captchaToken) {
      toast.error("Please complete the hCaptcha verification.");
      return;
    }

    setIsLoading(true);
    setApiError(null);
    setResponse("");

    try {
      const result = await testPrompt(prompt, captchaToken);
      setResponse(result);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "An unknown error occurred.");
      toast.error("Failed to get response", { description: apiError });
    } finally {
      setIsLoading(false);
      hcaptchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    }
  }

  const handleEmbed = async () => {
    if (!embeddingPrompt) {
      const errorMessage = "Prompt cannot be empty.";
      setEmbeddingPromptError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    if (!captchaToken) {
      toast.error("Please complete the hCaptcha verification.");
      return;
    }

    setIsEmbeddingLoading(true);
    setEmbeddingApiError(null);
    setEmbeddingResponse(null);

    try {
      const result = await embedPrompt(embeddingPrompt, captchaToken);
      setEmbeddingResponse(result);
    } catch (err) {
      setEmbeddingApiError(err instanceof Error ? err.message : "An unknown error occurred.");
      toast.error("Failed to get embeddings", { description: embeddingApiError });
    } finally {
      setIsEmbeddingLoading(false);
      hcaptchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Playground</CardTitle>
        <CardDescription>
          Enter your prompt below and get a response from the AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Tabs
            defaultValue="text-generation"
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text-generation">Text Generation</TabsTrigger>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full">
                      <TabsTrigger
                        value="embeddings"
                        disabled={!embeddingsSupported}
                        className="w-full"
                      >
                        Embeddings
                      </TabsTrigger>
                    </div>
                  </TooltipTrigger>
                  {!embeddingsSupported && (
                    <TooltipContent>
                      <p>The selected provider does not support embeddings.</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>

            </TabsList>
            <TabsContent value="text-generation" className="mt-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Enter your prompt here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isLoading}
                  className={cn(promptError && "border-destructive focus-visible:ring-destructive")}
                />
              </div>

              <div className="flex flex-col items-end gap-4 mt-4">
                <HCaptcha
                  sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY!}
                  onVerify={(token) => setCaptchaToken(token)}
                  onExpire={() => setCaptchaToken(null)}
                  ref={hcaptchaRef}
                  theme="dark"
                />
                <Button onClick={handleSubmit} disabled={isLoading || !prompt}>
                  {isLoading ? <><Spinner />Submitting...</> : <><LucideSendHorizontal />Submit Prompt</>}
                </Button>
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="response">Response</Label>
                <div id="response" className="min-h-[120px] w-full rounded-md border border-input bg-background p-3 text-sm whitespace-pre-wrap">
                  {isLoading ? <TypingIndicator /> : apiError ? <p className="text-destructive">{apiError}</p> : response ? <p>{response}</p> : <p className="text-muted-foreground">AI response will appear here...</p>}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="embeddings" className="mt-4">
              <div className="space-y-2">
                <Label htmlFor="embedding-prompt">Text to Embed</Label>
                <Textarea
                  id="embedding-prompt"
                  placeholder="Enter the text you want to convert into a vector embedding..."
                  value={embeddingPrompt}
                  onChange={(e) => setEmbeddingPrompt(e.target.value)}
                  disabled={isEmbeddingLoading}
                  className={cn(embeddingPromptError && "border-destructive focus-visible:ring-destructive")}
                />
              </div>
              <div className="flex flex-col items-end gap-4 mt-4">
                <HCaptcha
                  sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY!}
                  onVerify={(token) => setCaptchaToken(token)}
                  onExpire={() => setCaptchaToken(null)}
                  ref={hcaptchaRef}
                  theme="dark"
                />
                <Button onClick={handleEmbed} disabled={isEmbeddingLoading || !embeddingPrompt}>
                  {isEmbeddingLoading ? <><Spinner />Generating...</> : <><LucideSendHorizontal />Generate Embedding</>}
                </Button>
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="embedding-response">Embedding Vector (first 10 dimensions)</Label>
                <pre id="embedding-response" className="min-h-[120px] w-full rounded-md border border-input bg-background p-3 text-sm whitespace-pre-wrap overflow-x-auto">
                  {isEmbeddingLoading ? <TypingIndicator /> : embeddingApiError ? <p className="text-destructive">{embeddingApiError}</p> : embeddingResponse ? <p>{JSON.stringify(embeddingResponse, null, 2)}</p> : <p className="text-muted-foreground">Embedding vector will appear here...</p>}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>

    </Card >

  )
}
