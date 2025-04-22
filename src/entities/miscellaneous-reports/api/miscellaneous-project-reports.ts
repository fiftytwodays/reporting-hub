import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";
import useUsersList from "@/entities/user/api/users-list";
import { MiscellaneousProjectReport } from "../config/types";

interface FetchOptions {
  condition: boolean;
  year: string;
  month: string;
}

interface ApiResponse {
  MiscellaneousProjectReports: MiscellaneousProjectReport[];
}

export function getMiscellaneousProjectReportsList({
  condition = true,
  year,
  month,
}: FetchOptions) {
  const { usersList, isUsersListLoading } = useUsersList({ condition: true });
  const client = generateClient<Schema>();
  const fetcher = async () => {
    try {
      const monthlyFormsResponse =
        await client.models.MonthlyForm.listMonthlyFormByYear({
          year: year,
        });
      if (monthlyFormsResponse?.data?.length) {
        const monthlyForms = await Promise.all(
          monthlyFormsResponse.data
            .filter(
              (monthlyForm) =>
                monthlyForm.month == month && monthlyForm.status !== "draft"
            )
            .map(async (monthlyForm) => {
              try {
                const projectDetails = await client.models.Project.get({
                  id: monthlyForm.projectId,
                });
                const userDetails = usersList.find(
                  (user) => user.Username === monthlyForm.facilitator
                );
                return {
                  id: monthlyForm.id ?? "",
                  project: projectDetails.data?.name ?? "",
                  facilitator: userDetails
                    ? `${userDetails.GivenName ?? ""} ${
                        userDetails.FamilyName ?? ""
                      }`.trim()
                    : "",
                  concerns: monthlyForm.concerns ?? "",
                  stories: monthlyForm.story ?? "",
                  praisePoints: (monthlyForm.praisePoints ?? []).filter(
                    (p): p is string => p !== null
                  ),
                  prayerRequests: (monthlyForm.prayerRequests ?? []).filter(
                    (p): p is string => p !== null
                  ),
                };
              } catch (error) {
                console.error("Error processing monthly form:", error);
                throw error; // Re-throw to propagate the error
              }
            })
        );
        return {
          MiscellaneousProjectReports: monthlyForms,
        };
      }

      console.log("No monthly forms found for the given year and month.");
      return null;
    } catch (error) {
      console.error("Error in fetcher:", error);
      throw error; // Re-throw to propagate the error to SWR
    }
  };

  const { data, isLoading, error } = useSWR(
    condition ? [`api/miscellaneous-reports`] : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const reloadMiscellaneousReports = () => {
    mutate(
      (keys) =>
        Array.isArray(keys) &&
        keys.some((item) => item.startsWith(`api/miscellaneous-reports`)),
      undefined,
      {
        revalidate: true,
      }
    );
  };

  return {
    miscellaneousProjectReport: data ?? null,
    isMiscellaneousProjectReportLoading: isLoading,
    isMiscellaneousProjectReportError: error,
    reloadMiscellaneousReports,
  };
}
