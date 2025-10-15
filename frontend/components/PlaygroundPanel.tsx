"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { testPrompt } from "@/app/lib/api"
import { toast } from "sonner"
import { LucideSendHorizontal } from "lucide-react"
import { TypingIndicator } from "@/components/ui/typing-indicator"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface PlaygroundPanelProps {
  apiKey: string;
  setAccessCodeError: (error: string | null) => void;
}

export function PlaygroundPanel({ apiKey, setAccessCodeError }: PlaygroundPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [promptError, setPromptError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setAccessCodeError(null);

    if (!prompt) {
      const errorMessage = "Prompt cannot be empty.";
      setPromptError(errorMessage);
      toast.error(errorMessage);
      return;
    }
    if (!apiKey) {
      const errorMessage = "Please enter your Access Code in the configuration panel.";
      setAccessCodeError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    setIsLoading(true);
    setApiError(null);
    setResponse("");

    try {
      const result = await testPrompt(prompt, apiKey);
      setResponse(result);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "An unknown error occurred.");
      toast.error("Failed to get response", { description: apiError });
    } finally {
      setIsLoading(false);
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
        <div className="space-y-2">
          <Label htmlFor="prompt">Prompt</Label>
          <Textarea
            id="prompt"
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            className={cn(
              promptError && "border-destructive focus-visible:ring-destructive"
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isLoading || !prompt}>
            {isLoading ? (
              <>
                <Spinner />
                Submitting...
              </>
            ) : (
              <>
                <LucideSendHorizontal />
                Submit Prompt
              </>
            )}
          </Button>        </div>
        <div className="space-y-2">
          <Label htmlFor="response">Response</Label>
          <div
            id="response"
            className="min-h-[120px] w-full rounded-md border border-input bg-background p-3 text-sm whitespace-pre-wrap"
          >
            {isLoading ? (
              <TypingIndicator />
            ) : apiError ? (
              <p className="text-destructive">{apiError}</p>
            ) : response ? (
              <p>{response}</p>
            ) : (
              <p className="text-muted-foreground">AI response will appear here...</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>

  )
}
