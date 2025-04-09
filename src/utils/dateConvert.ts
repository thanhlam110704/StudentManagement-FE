import dayjs from "dayjs";

export const formatDate = (dateString?: string): string => {
  return dateString ? dayjs(dateString).format("DD/MM/YYYY") : "";
};