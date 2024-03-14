import { Center, Loader } from "@mantine/core";
import { isAxiosError } from "axios";
import { getErrorMessage } from "../utils/error";

interface Props {
  isLoading: boolean;
  error: unknown;
  children: React.ReactNode;
}

export const View = ({ isLoading, error, children }: Props) => {
  if (isLoading)
    return (
      <Center h="100%">
        <Loader>Loading...</Loader>
      </Center>
    );

  if (error) {
    if (isAxiosError(error)) {
      return <div>Error: {error.response?.data.message}</div>;
    }

    return <div>Error: {getErrorMessage(error)}</div>;
  }

  return <div>{children}</div>;
};
