export const generateBookingId = (): string => {
  const datePart = new Date().toISOString().split("T")[0].replace(/-/g, ""); // e.g., 20251024
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `BK-${datePart}-${randomPart}`; // e.g., BK-20251024-4827
};
