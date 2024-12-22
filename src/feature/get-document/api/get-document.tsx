import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

interface FetchOptions {
  condition: boolean;
}

interface Document {
  id: string;
  name: string;
  document: string;
}

interface ApiResponse {
  Document: Document;
}

interface FetchDocument {
  id: string;
}

export default function useGetDocument(
  { condition = true }: FetchOptions,
  arg: FetchDocument
) {
  const client = generateClient<Schema>();

  const fetcher = async () => {
    const response = await client.models.Document.get({ id: arg.id });
    if (response?.data) {
      const document = {
        id: response.data.id,
        name: response.data.name,
        document: response.data.document,
      };

      const apiResponse: ApiResponse = {
        Document: document,
      };

      return apiResponse;
    }
    return null;
  };

  const { data, isLoading, error } = useSWR(
    condition ? ["api/document"] : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const reloadDocument = () => {
    mutate(
      (keys) =>
        Array.isArray(keys) &&
        keys.some((item) => item.startsWith("api/document")),
      undefined,
      {
        revalidate: true,
      }
    );
  };

  const documentData = data?.Document;
  return {
    documentData: documentData,
    isDocumentLoading: isLoading,
    isDocumentError: error,
    reloadDocument,
  };
}
