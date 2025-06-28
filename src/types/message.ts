export interface Message {
  id: string;
  created_at: string;
  role: string;
  content: string;
  chat_id: string;
  user_id: string;
  files: string[];
}
