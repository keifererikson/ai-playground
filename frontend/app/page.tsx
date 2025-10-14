import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

export default function Home() {
  const isDirty = true; // Placeholder for form dirty state

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

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Set your API key and adjust the model settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Select>
                  <SelectTrigger id="provider">
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Select>
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature: 0.7</Label>
                <Slider
                  id="temperature"
                  defaultValue={[0.7]}
                  max={2}
                  step={0.1}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Reset to Defaults</Button>
            <Button disabled={!isDirty}>Save Configuration</Button>
          </CardFooter>
        </Card>

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
