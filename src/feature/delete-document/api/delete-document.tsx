import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";

interface DeleteDocumentInput {
  id: string;
}

interface DocumentResponse {
  id: string;
  name: string;
  document: string;
}

export default function useDeleteDocument() {
  const client = generateClient<Schema>();

  const deleteDocument = async (
    key: string,
    { arg }: { arg: DeleteDocumentInput }
  ) => {
    const response = await client.models.Document.delete({
      id: arg.id,
    });

    if (response?.data) {
      const document = {
        id: response.data.id,
        name: response.data.name,
        document: response.data.document,
      } as DocumentResponse;

      return document;
    }

    throw new Error("Failed to delete the document");
  };

  const { trigger, data, isMutating, error } = useSWRMutation(
    "api/delete-document",
    deleteDocument
  );

  return {
    deleteDocument: trigger,
    deletedDocument: data,
    isDeleting: isMutating,
    deleteError: error,
  };
}
