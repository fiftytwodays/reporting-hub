import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

interface FetchOptions {
  condition: boolean;
}

export function getAdditionalActivitiesByMonthlyFormId({
  condition = true,
  monthlyFormId,
}: {
  condition: boolean;
  monthlyFormId: string;
}) {
  const client = generateClient<Schema>();

  const fetcher = async () => {
    const additionalActivitiesResponse =
      await client.models.AdditionalActivity.listAdditionalActivityByMonthlyFormId(
        {
          monthlyFormId: monthlyFormId,
        }
      );

    console.log(
      "Fetched additional activities response:",
      additionalActivitiesResponse
    );

    if (additionalActivitiesResponse?.data?.length) {
      const additionalActivities = additionalActivitiesResponse.data.map(
        (activity) => ({
          id: activity.id ?? "",
          monthlyFormId: activity.monthlyFormId ?? "",
          activity: activity.activity ?? "",
          functionalAreaId: activity.functionalAreaId ?? "",
          comments: activity.comments ?? "",
          isMajorGoal: activity.isMajorGoal ?? false,
        })
      );

      console.log("Fetched additional activities:", additionalActivities);
      return additionalActivities;
    }
    return null;
  };

  const { data, isLoading, error } = useSWR(
    condition
      ? [`api/monthlyForm/${monthlyFormId}/additionalActivities`]
      : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const reloadAdditionalActivities = () => {
    mutate(
      (keys) =>
        Array.isArray(keys) &&
        keys.some((item) =>
          item.startsWith(
            `api/monthlyForm/${monthlyFormId}/additionalActivities`
          )
        ),
      undefined,
      {
        revalidate: true,
      }
    );
  };

  return {
    additionalActivities: data ?? null,
    isAdditionalActivitiesLoading: isLoading,
    isAdditionalActivitiesError: error,
    reloadAdditionalActivities,
  };
}
