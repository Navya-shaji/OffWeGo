export const generateBookingId = (): string => {
  const datePart = new Date().toISOString().split("T")[0].replace(/-/g, ""); 
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `BK-${datePart}-${randomPart}`; 
};
