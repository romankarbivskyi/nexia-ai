export interface Model {
  name: string;
  description: string;
  provider: string;
  uncensored?: boolean;
  tier: string;
  community: boolean;
  aliases?: string;
  input_modalities: string[];
  output_modalities: string[];
  tools: boolean;
  vision: boolean;
  audio: boolean;
}
