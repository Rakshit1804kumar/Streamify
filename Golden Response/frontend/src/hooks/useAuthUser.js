import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const useAuthUser = () => {
  const authUserQuery = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data.user;
      } catch (error) {
        if (error.response?.status === 401) return null;
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    isLoading: authUserQuery.isLoading,
    authUser: authUserQuery.data,
  };
};

export default useAuthUser;
