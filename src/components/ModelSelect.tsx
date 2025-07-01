import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_MODEL } from "@/lib/constants";
import { useModelStore } from "@/store/useModelStore";

export default function ModelSelect() {
  const { models, setActiveModel, activeModel } = useModelStore();

  const handleModelChange = (value: string) => {
    const model = models?.find((m) => m.name === value);

    if (!model) {
      console.log("Model not found");
      return;
    }

    setActiveModel(model);
  };

  return (
    <Select
      defaultValue={activeModel?.name || DEFAULT_MODEL}
      onValueChange={handleModelChange}
    >
      <SelectTrigger
        className="bg-background m-2 w-[180px] rounded-2xl"
        size="sm"
      >
        <SelectValue placeholder="Model" />
      </SelectTrigger>
      <SelectContent className="max-w-min rounded-2xl">
        {models?.map((model) => (
          <SelectItem value={model.name} key={model.name}>
            {model.description}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
