import { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axios";
import { getErrorMessage } from "../utils/error";

type Status = "idle" | "pending" | "success" | "failed";

interface Props {
  url: string;
}

export const useFetch = <T,>({ url }: Props) => {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatus("pending");
        setError(null);
        const response = await axiosInstance.get(url);
        setData(response.data);
        setStatus("success");
      } catch (error) {
        setError(getErrorMessage(error));
        setStatus("failed");
      }
    };
    fetchData();
  }, [url]);

  return {
    data,
    error,
    isIdle: status === "idle",
    isLoading: status === "pending",
    isFailed: status === "failed",
    isSuccess: status === "success",
  };
};
