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

interface ConfigurationPanelProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

export function ConfigurationPanel({ apiKey, setApiKey }: ConfigurationPanelProps) {
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
      saveSettings(payload, apiKey);
    } catch (error) {
      console.error("Failed to save settings:", error);
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

  if (isLoading) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading settings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
        <CardDescription>
          Set your Access Code and adjust the model settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="access-code">Access Code</Label>
            <Input
              id="access-code"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Access Code"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="provider">Provider</Label>
            <Select value={localProvider} onValueChange={setLocalProvider}>
              <SelectTrigger id="provider">
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select value={localModel} onValueChange={setLocalModel}>
              <SelectTrigger id="model">
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature: {localTemperature}</Label>
            <Slider
              id="temperature"
              value={[localTemperature]}
              onValueChange={(value) => setLocalTemperature(value[0])}
              max={2}
              step={0.1}
            />
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
          Save Configuration
        </Button>
      </CardFooter>
    </Card>
  )
}
