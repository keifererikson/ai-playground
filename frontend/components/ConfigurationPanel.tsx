"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useSettings } from "@/app/context/SettingsContext";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { LucideSave } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfigurationPanelProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  accessCodeError: string | null;
}

export function ConfigurationPanel({ apiKey, setApiKey, accessCodeError }: ConfigurationPanelProps) {
  const { settings, saveSettings, isLoading } = useSettings();

  const [localProvider, setLocalProvider] = useState("");
  const [localModel, setLocalModel] = useState("");
  const [localTemperature, setLocalTemperature] = useState(0.7);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setLocalProvider(settings.provider);
      setLocalModel(settings.model);
      setLocalTemperature(settings.temperature);
    }
  }, [settings]);

  useEffect(() => {
    if (!settings) return;

    const hasChanged =
      localProvider !== settings.provider ||
      localModel !== settings.model ||
      localTemperature !== settings.temperature;

    setIsDirty(hasChanged);
  }, [localProvider, localModel, localTemperature, settings]);

  const handleSave = async () => {
    const payload = {
      provider: localProvider,
      model: localModel,
      temperature: localTemperature,
    }
    setIsSaving(true);
    try {
      await saveSettings(payload, apiKey);
      toast.success("Settings saved successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast.error("Failed to save settings:", { description: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (settings) {
      setLocalProvider(settings.provider);
      setLocalModel(settings.model);
      setLocalTemperature(settings.temperature);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
        <CardDescription>
          Set your Access Code and adjust the model settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="space-y-2">
            <Label htmlFor="access-code">Access Code</Label>
            <Input
              id="access-code"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Access Code"
              className={cn(
                accessCodeError && "border-destructive focus-visible:ring-destructive"
              )}
            />
          </div>
          <Separator />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              {isLoading ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <Select value={localProvider} onValueChange={setLocalProvider}>
                  <SelectTrigger id="provider" className="w-full">
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {settings?.available_providers.map((provider) => (
                      <SelectItem key={provider} value={provider}>
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              {isLoading ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <Select value={localModel} onValueChange={setLocalModel}>
                  <SelectTrigger id="model" className="w-full">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {settings?.available_models.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature: {isLoading ? (
                <>
                  <Skeleton className="h-3 w-5 inline-block" />
                </>
              ) : (
                <>
                  {localTemperature}
                </>
              )}
              </Label>
              {isLoading ? (
                <Skeleton className="h-5 mt-4 w-full" />
              ) : (
                <Slider
                  id="temperature"
                  value={[localTemperature]}
                  onValueChange={(value) => setLocalTemperature(value[0])}
                  max={2}
                  step={0.1}
                  className="pt-3"
                />)}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={!isDirty || isSaving}
        >
          Reset to Defaults
        </Button>
        <Button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className="bg-primary text-primary-foreground hover:bg-primary/90"

        >
          {isSaving ? (
            <>
              <Spinner /> Saving...
            </>
          ) : (
            <>
              <LucideSave /> Save Configuration
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
