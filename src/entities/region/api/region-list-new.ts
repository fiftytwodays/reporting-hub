import useSWR from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

interface FetchOptions {
  condition?: boolean;
  filter?: Record<string, any>;
}

const fetchRegionList = async (filter: Record<string, any>) => {
  const client = generateClient<Schema>();
  const { data } = await client.models.Region.list({ filter: filter });
  return data;
};

export default function useRegionList({
  condition = true,
  filter = {},
}: FetchOptions) {
  const { data, error, isLoading } = useSWR(
    condition ? ["/api/region-list", filter] : null,
    ([, filter]) => fetchRegionList(filter),
    { keepPreviousData: true }
  );

  data?.sort((a, b) => a.name.localeCompare(b.name));

  return {
    regionList: condition ? data : [],
    isRegionListLoading: isLoading,
    regionListError: error,
  };
}
