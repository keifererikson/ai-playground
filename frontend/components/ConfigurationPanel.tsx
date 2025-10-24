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
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { LucideSave } from "lucide-react";
import { getModelsForProvider } from "@/app/lib/api";
import { getProviderMetadata } from "@/app/lib/providers";


const providerTempLimits: { [key: string]: number } = {
  'openai': 2.0,
  'anthropic': 1.0,
  'gemini': 1.0,
  'default': 1.0,
}

export function ConfigurationPanel({ }) {
  const { settings, saveSettings, isLoading } = useSettings();

  const [localProvider, setLocalProvider] = useState("");
  const [localModel, setLocalModel] = useState("");
  const [localTemperature, setLocalTemperature] = useState(0.7);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isModelsLoading, setIsModelsLoading] = useState(false);

  const currentMaxTemp = providerTempLimits[localProvider] || providerTempLimits['default'];

  useEffect(() => {
    if (settings) {
      setLocalProvider(settings.provider);
      setLocalModel(settings.model);
      setLocalTemperature(settings.temperature);
      setAvailableModels(settings.available_models);
    }
  }, [settings]);

  useEffect(() => {
    if (!localProvider) return;

    const fetchModels = async () => {
      setIsModelsLoading(true);
      try {
        const models = await getModelsForProvider(localProvider);
        setAvailableModels(models);
        if (!models.includes(localModel)) {
          setLocalModel(models[0] || "");
        }
      } catch (error) {
        toast.error("Failed to fetch models for provider.");
        setAvailableModels([]);
      } finally {
        setIsModelsLoading(false);
      }
    };

    if (localProvider !== settings?.provider) {
      fetchModels();
    } else {
      setAvailableModels(settings.available_models);
      setLocalModel(settings.model);
    }
  }, [localProvider, settings]);

  useEffect(() => {
    if (!settings) return;

    const hasChanged =
      localProvider !== settings.provider ||
      localModel !== settings.model ||
      localTemperature !== settings.temperature;

    setIsDirty(hasChanged);
  }, [localProvider, localModel, localTemperature, settings]);

  useEffect(() => {
    const newMax = providerTempLimits[localProvider] || providerTempLimits['default'];
    if (localTemperature > newMax) {
      setLocalTemperature(newMax);
    }
  }, [localTemperature, localProvider]);

  const handleSave = async () => {
    const payload = {
      provider: localProvider,
      model: localModel,
      temperature: localTemperature,
    }
    setIsSaving(true);
    try {
      await saveSettings(payload);
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
          Adjust your AI provider settings below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 max-w-3xl mx-auto">
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
                    {settings?.available_providers.map((providerId) => {
                      const { name, logo: Logo } = getProviderMetadata(providerId);
                      return (
                        <SelectItem key={providerId} value={providerId}>
                          <div className="flex items-center gap-2">
                            <Logo className="h-4 w-4" />
                            <span>{name}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              {isLoading || isModelsLoading ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <Select value={localModel} onValueChange={setLocalModel} disabled={availableModels.length === 0}>
                  <SelectTrigger id="model" className="w-full">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
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
                  max={currentMaxTemp}
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
          disabled={!isDirty || isSaving || isModelsLoading}
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
