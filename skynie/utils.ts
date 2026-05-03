export const getDuration = (totalMinutes: number | null) => {
  if (!totalMinutes) return 'N/A';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
};