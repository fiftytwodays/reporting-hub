export const formatDate = (dateString: string | undefined) => {
  const date = new Date(dateString ? dateString : "");
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true, // Display in 12-hour format with AM/PM
  });
};

export default formatDate;
