"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icon } from "@iconify/react"
import { testPrompt } from "@/app/lib/api"
import { toast } from "sonner"

interface PlaygroundPanelProps {
  apiKey: string;
}

export function PlaygroundPanel({ apiKey }: PlaygroundPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!prompt) {
      setError("Prompt cannot be empty.");
      toast.error(error);
      return;
    }
    if (!apiKey) {
      setError("Please enter your Access Code in the configuration panel.");
      toast.error(error);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse("");

    try {
      const result = await testPrompt(prompt, apiKey);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      toast.error("Failed to get response", { description: error });
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
            placeholder="An old robot tends to a rooftop garden. It finds a single, withered flower. Describe its thoughts."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            className="min-h-[120px]"
            error={!!error}
          />
        </div>
        <Button onClick={handleSubmit} disabled={isLoading}>
          <Icon icon="mdi:send" className="mr-2 h-4 w-4" />
          Submit Prompt
        </Button>
        <div className="space-y-2">
          <Label htmlFor="response">Response</Label>
          <div
            id="response"
            className="min-h-[120px] w-full rounded-md border border-input bg-background p-3 text-sm whitespace-pre-wrap"
          >
            {isLoading && <p className="text-muted-foreground">Thinking...</p>}
            {error && <p className="text-destructive">{error}</p>}
            {response && <p>{response}</p>}
            {!isLoading && !error && !response && (
              <p className="text-muted-foreground">AI response will appear here...</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>

  )
}
