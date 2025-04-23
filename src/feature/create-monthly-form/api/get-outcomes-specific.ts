import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

interface FetchOptions {
  condition: boolean;
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getMonthName = (month: number) =>
  monthNames[month - 1] || "Invalid month";

export function getOutcomeByMonthlyFormId({
  condition = true,
  monthlyFormId,
}: {
  condition: boolean;
  monthlyFormId: string;
}) {
  const client = generateClient<Schema>();

  const fetcher = async () => {
    const outcomesResponse =
      await client.models.Outcome.listOutcomeByMonthlyFormId({
        monthlyFormId: monthlyFormId,
      });

    if (outcomesResponse?.data?.length) {
      const outcomes = await Promise.all(
        outcomesResponse.data.map(async (outcome) => {
          const activity = await client.models.Plan.get({
            id: outcome.activityId ?? "",
          });

          return {
            id: outcome.id ?? "",
            activityId: outcome.activityId ?? "",
            activityName: activity.data?.activity ?? "",
            achieved: outcome.achieved ?? "",
            reason: outcome.reason ?? "",
            comments: outcome.comments ?? "",
            isMajorGoal: activity.data?.isMajorGoal ?? false,
          };
        })
      );

      console.log("Fetched outcomes:", outcomes);
      return outcomes;
    }
    return null;
  };

  const { data, isLoading, error } = useSWR(
    condition ? [`api/monthlyForm/${monthlyFormId}/outcomes`] : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const reloadMonthlyForm = () => {
    mutate(
      (keys) =>
        Array.isArray(keys) &&
        keys.some((item) =>
          item.startsWith(`api/monthlyForm/${monthlyFormId}/outcomes`)
        ),
      undefined,
      {
        revalidate: true,
      }
    );
  };

  return {
    outcomes: data ?? null,
    isOutcomesLoading: isLoading,
    isOutcomesError: error,
    reloadOutcomes: reloadMonthlyForm,
  };
}
