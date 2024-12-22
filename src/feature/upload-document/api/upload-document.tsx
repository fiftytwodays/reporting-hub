import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";

interface UploadDocumentInput {
  name: string;
  document: string;
}

interface DocumentResponse {
  id: string;
  name: string;
  document: string;
}

export default function useUploadDocument() {
  const client = generateClient<Schema>();

  const uploadDocument = async (
    key: string,
    { arg }: { arg: UploadDocumentInput }
  ) => {
    const response = await client.models.Document.create({
      name: arg.name,
      document: arg.document,
    });
    if (response?.data) {
      const document = {
        id: response.data.id,
        name: response.data.name,
        document: response.data.document,
      } as DocumentResponse;

      return document;
    }

    throw new Error("Failed to upload the document");
  };

  // Use SWR Mutation to handle the creation request
  const { trigger, data, isMutating, error } = useSWRMutation(
    "api/upload-document",
    uploadDocument
  );

  return {
    uploadDocument: trigger,
    uploadedDocument: data,
    isUploading: isMutating,
    uploadError: error,
  };
}
