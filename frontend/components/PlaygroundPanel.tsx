import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icon } from "@iconify/react"

export function PlaygroundPanel() {
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
            className="min-h-[120px]"
          />
        </div>
        <Button>
          <Icon icon="mdi:send" className="mr-2 h-4 w-4" />
          Submit Prompt
        </Button>
        <div className="space-y-2">
          <Label htmlFor="response">Response</Label>
          <div
            id="response"
            className="min-h-[120px] w-full rounded-md border border-input bg-background p-3 text-sm"
          >
            <p className="text-muted-foreground">AI response will appear here...</p>
          </div>
        </div>
      </CardContent>
    </Card>

  )
}
