import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ConfigurationPanel } from '@/components/ConfigurationPanel';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12 lg:p-24">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col items-center text-center">
          <div className="relative flex items-center pt-12 md:pt-0">
            <h1 className="pb-1 text-3xl font-black md:text-4xl bg-gradient-to-r from-fuchsia-800 to-primary bg-clip-text text-transparent">
              AI Playground
            </h1>
            <Icon
              className="relative bottom-7 right-4"
              icon="healthicons:artificial-intelligence"
              width="48"
            />
          </div>
          <p className="mb-8 text-muted-foreground">
            A playground to test out many different AI providers and models.
          </p>
        </div>

        <ConfigurationPanel />

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
      </div>
    </main>
  );
}
