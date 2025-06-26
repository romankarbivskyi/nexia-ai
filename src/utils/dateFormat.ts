export const formatDateLabel = (dateString: string) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const chatDate = new Date(dateString);

  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  chatDate.setHours(0, 0, 0, 0);

  if (chatDate.getTime() === today.getTime()) {
    return "Today";
  } else if (chatDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  } else {
    return dateString;
  }
};
