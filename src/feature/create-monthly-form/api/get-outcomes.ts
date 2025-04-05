import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

interface FetchOptions {
  condition: boolean;
}

export async function getAllOutcomes() {
  const client = generateClient<Schema>();

  try {
    const outcomesResponse = await client.models.Outcome.list();
    if (outcomesResponse?.data) {
      const outcomes = await Promise.all(
        outcomesResponse.data.map(async (outcome) => {
          const monthlyForm = await client.models.MonthlyForm.get({
            id: outcome.monthlyFormId ?? "",
          });
          const activity = await client.models.Plan.get({
            id: outcome.activityId ?? "",
          });

          return {
            id: outcome.id ?? "",
            monthlyFormId: outcome.monthlyFormId ?? "",
            monthlyFormName: monthlyForm.data?.id ?? "",
            activityId: outcome.activityId ?? "",
            activityName: activity.data?.activity ?? "",
            reason: outcome.reason ?? "",
            achieved: outcome.achieved ?? false,
            comments: outcome.comments ?? "",
          };
        })
      );

      console.log("Fetched outcomes:", outcomes);
      return outcomes;
    }
    return [];
  } catch (error) {
    console.error("Error fetching outcomes:", error);
    return [];
  }
}
