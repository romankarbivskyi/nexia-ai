import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModelStore } from "@/store/useModelStore";
import { Model } from "@/types/model";
import { useEffect, useState } from "react";

const DEFAULT_MODEL = "openai";

export default function ModelSelect() {
  const [models, setModels] = useState<Model[]>([]);
  const { setModel } = useModelStore();

  const getModels = () => {
    fetch("https://text.pollinations.ai/models", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((models) => {
        const textOnlyModels = models.filter((m) => m.audio === false);
        setModels(textOnlyModels);
        setModel(textOnlyModels.find((m) => m.name == DEFAULT_MODEL));
        console.log(models);
      });
  };

  const handleModelChange = (value: string) => {
    const model = models.find((m) => m.name === value);

    if (!model) {
      console.log("Model not found");
      return;
    }

    setModel(model);
  };

  useEffect(() => {
    getModels();
  }, []);

  return (
    <Select defaultValue={DEFAULT_MODEL} onValueChange={handleModelChange}>
      <SelectTrigger className="bg-background m-2 w-[180px]">
        <SelectValue placeholder="Model" />
      </SelectTrigger>
      <SelectContent className="max-w-min">
        {models.map((model) => (
          <SelectItem value={model.name} key={model.name}>
            {model.description}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
