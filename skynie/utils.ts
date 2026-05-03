export const getDuration = (totalMinutes: number | null) => {
  if (!totalMinutes) return 'N/A';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
};

export const formatTimeHHMM = (dateInput: string | Date): string => {
  const date = new Date(dateInput);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};