import { axiosInstance } from "./axios";

export const getStreamToken = async () => {
  const res = await axiosInstance.get("/chat/token");
  return res.data;
};