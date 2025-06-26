export type Chat = {
  created_at: string;
  id: string;
  title: string;
  user_id: string;
};

export type GroupedChats = {
  [date: string]: Chat[];
};
