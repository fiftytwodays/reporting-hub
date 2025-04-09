import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

interface FetchOptions {
  condition: boolean;
}

export function getAdditionalActivitiesNextMonthByMonthlyFormId({
  condition = true,
  monthlyFormId,
}: {
  condition: boolean;
  monthlyFormId: string;
}) {
  const client = generateClient<Schema>();

  const fetcher = async () => {
    try {
      const additionalActivitiesResponse =
        await client.models.AdditionalActivityNextMonth.listAdditionalActivityNextMonthByMonthlyFormId(
          {
            monthlyFormId,
          }
        );

      console.log(
        "Fetched additional activities next month response:",
        additionalActivitiesResponse
      );

      if (additionalActivitiesResponse?.data?.length) {
        const additionalActivityNextMonthIds =
          additionalActivitiesResponse.data.map(
            (activity) => activity.activityId
          );

        // Filter out null or undefined IDs
        const validActivityIds = additionalActivityNextMonthIds.filter(
          (id): id is string => Boolean(id)
        );

        const plansResponses = await Promise.all(
          validActivityIds.map((activityId) =>
            client.models.Plan.get({ id: activityId })
          )
        );

        plansResponses.forEach((res, index) => {
          console.log(
            `Fetched plans response for activityId ${validActivityIds[index]}:`,
            res
          );
        });

        const plans = plansResponses.flatMap((res) => res?.data ?? []);

        return plans;
      }

      return null;
    } catch (err) {
      console.error("Error fetching additional activities or plans:", err);
      throw err;
    }
  };

  const swrKey = `api/monthlyForm/${monthlyFormId}/additionalActivitiesNextMonth`;

  const { data, isLoading, error } = useSWR(
    condition ? [swrKey] : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const reloadAdditionalActivitiesNextMonth = () => {
    mutate(
      (keys) =>
        Array.isArray(keys) && keys.some((item) => item.startsWith(swrKey)),
      undefined,
      {
        revalidate: true,
      }
    );
  };

  return {
    additionalActivitiesNextMonth: data ?? null,
    isAdditionalActivitiesNextMonthLoading: isLoading,
    isAdditionalActivitiesNextMonthError: error,
    reloadAdditionalActivitiesNextMonth,
  };
}
