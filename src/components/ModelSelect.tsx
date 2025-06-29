import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModelStore } from "@/store/useModelStore";
import { Model } from "@/types/model";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const DEFAULT_MODEL = "openai";

export default function ModelSelect() {
  const [models, setModels] = useState<Model[]>([]);
  const { setModel } = useModelStore();

  const getModels = async () => {
    const supabase = createClient();

    const { data, error } = await supabase.from("models").select();

    if (error) {
      console.log("Error fetching models:", error);
      return;
    }

    setModels(data);
    setModel(data.find((m) => m.name == DEFAULT_MODEL));
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
      <SelectTrigger className="bg-background m-2 w-[180px] rounded-2xl">
        <SelectValue placeholder="Model" />
      </SelectTrigger>
      <SelectContent className="max-w-min rounded-2xl">
        {models.map((model) => (
          <SelectItem value={model.name} key={model.name}>
            {model.description}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
