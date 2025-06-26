export interface Chat {
  created_at: string;
  id: string;
  title: string;
  user_id: string;
}

export interface GroupedChats {
  [date: string]: Chat[];
}
