import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

interface FetchOptions {
  condition?: boolean;
  filter?: Record<string, any>;
}

const fetchProjectList = async (filter: Record<string, any>) => {
  const client = generateClient<Schema>();
  const { data } = await client.models.Project.list({ filter: filter });
  return data;
};

export default function useProjectList({
  condition = true,
  filter = {},
}: FetchOptions = {}) {
  const { data, error, isLoading } = useSWR(
    condition ? ["/api/projects", filter] : null,
    ([, filter]) => fetchProjectList(filter),
    { keepPreviousData: true }
  );

  const reloadProjectList = () => {
    mutate(
      (keys) =>
        Array.isArray(keys) &&
        keys.some((item) => item.startsWith("/api/projects")),
      undefined,
      {
        revalidate: true,
      }
    );
  };

  return {
    projectList: condition ? data : [],
    isProjectListLoading: isLoading,
    projectListError: error,
    reloadProjectList: reloadProjectList,
  };
}
