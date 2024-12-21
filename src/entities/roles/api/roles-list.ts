import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";
import { Group } from "../config/types";

interface FetchOptions {
  condition: boolean;
}

interface ApiResponse {
  Groups: Group[];
}

interface GroupData {
  CreationDate: string;
  GroupName: string;
  LastModifiedDate: string;
  Precedence: number;
  RoleArn: string;
  UserPoolId: string;
}

export default function useRolesList({ condition = true }: FetchOptions) {
  const client = generateClient<Schema>();

  const fetcher = async () => {
    const response = await client.mutations.listGroups({});

    if (response.data && typeof response.data === "string") {
      const parsedData = JSON.parse(response.data);

      const groupList: GroupData[] = parsedData.Groups;
      const groups = await Promise.all(
        groupList.map(async (group) => {
          return {
            name: group.GroupName ?? "",
            precedence: group.Precedence.toString(),
          };
        })
      );

      const apiResponse: ApiResponse = {
        Groups: groups,
      };

      return apiResponse;
    }

    return null;
  };

  const { data, isLoading, error } = useSWR(
    condition ? ["api/roles"] : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const reloadRolesList = () => {
    mutate(
      (keys) =>
        Array.isArray(keys) &&
        keys.some((item) => item.startsWith("api/roles")),
      undefined,
      {
        revalidate: true,
      }
    );
  };

  const rolesData = data?.Groups?.map((group, index) => ({
    key: index,
    name: group.name,
    precedence: group.precedence,
  }));
  return {
    rolesList: rolesData ?? [],
    isRolesListLoading: isLoading,
    isRolesListError: error,
    reloadRolesList,
  };
}
