import { Button, FileInput, Stack, Text } from "@mantine/core";
import { axiosInstance } from "../utils/axios";
import { isNotEmpty, useForm } from "@mantine/form";
import { useState } from "react";
import { getErrorMessage } from "../utils/error";
import { isAxiosError } from "axios";
interface PassportData {
  birthDate: string;
  id: string;
  expiryDate: string;
}
export const Home = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PassportData | null>(null);
  const form = useForm<{ passport: File }>({
    validate: {
      passport: isNotEmpty("Passport image is required"),
    },
  });

  const handleOnSubmit = async (values: { passport: File }) => {
    setError(null);
    setData(null);
    setIsUploading(true);
    const endpoint = `/api/v1/passport/upload`;
    const formData = new FormData();
    formData.append("file", values.passport);
    formData.append("fileName", values.passport.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    try {
      const { data } = await axiosInstance.post(endpoint, formData, config);
      setData(data);
    } catch (error) {
      if (!isAxiosError(error)) throw error;
      setError(getErrorMessage(error.response?.data.message));
    } finally {
      setIsUploading(false);
      form.reset();
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleOnSubmit)}>
      <Stack align="flex-start">
        <FileInput
          {...form.getInputProps("passport")}
          accept="image/png,image/jpeg"
          label="Upload passport photo"
          placeholder="Upload passport image"
        />
        <Button loading={isUploading} type="submit">
          Upload
        </Button>
      </Stack>
      {error && <Text c="red">{error}</Text>}
      {data && (
        <pre>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      )}
    </form>
  );
};
