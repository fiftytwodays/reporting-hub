import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";
import { fetchUserAttributes, getCurrentUser } from "@aws-amplify/auth";

interface FetchOptions {
  condition: boolean;
  usersList: any[];
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

function stringToArray(str: string | undefined): string[] {
  if (!str) return [];
  const cleanedStr = str.replace(/[\[\]]/g, "").trim();
  if (!cleanedStr) return [];
  return cleanedStr.includes(",")
    ? cleanedStr.split(",").map((item) => item.trim())
    : [cleanedStr];
}

export function useMonthlyFormsListUser({
  condition = true,
  usersList,
}: FetchOptions) {
  const client = generateClient<Schema>();

  console.log("Users List:", usersList);

  const fetcher = async () => {
    const attributes = await fetchUserAttributes();

    const monthlyFormsAccumulated: any[] = [];
    const seenProjectIds = new Set<string>();

    if (condition) {
      const clustersArr = stringToArray(attributes["custom:clusters"]);

      let projectIds: string[] = [];

      // Get projects from clusters
      if (clustersArr.length > 0) {
        const projects = await client.models.Project.list({
          filter: {
            or: clustersArr.map((clusterId) => ({
              clusterId: { eq: clusterId },
            })),
          },
        });
        const ids =
          projects?.data.map((project) => project.id).filter(Boolean) || [];
        projectIds.push(...ids);
      }

      for (const projectId of projectIds) {
        seenProjectIds.add(projectId);
        const response =
          await client.models.MonthlyForm.listMonthlyFormByProjectId({
            projectId,
          });
        if (response?.data) {
          for (const form of response.data) {
            let userName = "";
            usersList.find((user) => {
              if (user.Username === form.facilitator) {
                userName = `${user.GivenName ?? ""} ${
                  user.FamilyName ?? ""
                }`.trim();
              }
            });

            const project = await client.models.Project.get({
              id: form.projectId ?? "",
            });
            if (form.status === "submitted") {
              monthlyFormsAccumulated.push({
                id: form.id ?? "",
                projectName: project.data?.name ?? "",
                location: project.data?.location ?? "",
                month: getMonthName(Number(form.month)),
                year: form.year ?? "",
                status: form.status ?? "",
                facilitator: form.facilitator ?? "",
                facilitatorName: userName,
              });
            }
          }
        }
      }

      // Sort forms
      const sortedMonthlyForms = monthlyFormsAccumulated.sort((a, b) => {
        const yearA = Number(a.year);
        const yearB = Number(b.year);
        if (yearA !== yearB) {
          return yearB - yearA; // Descending year
        }
        const monthA = monthNames.indexOf(a.month);
        const monthB = monthNames.indexOf(b.month);
        return monthB - monthA; // Descending month
      });
      console.log("Sorted Monthly Forms:", sortedMonthlyForms);
      return { MonthlyForms: sortedMonthlyForms };
    }

    return { MonthlyForms: [] };
  };

  const { data, isLoading, error } = useSWR(
    condition ? ["api/approverview/monthlyPlans"] : null,
    fetcher,
    { keepPreviousData: true }
  );

  const reloadMonthlyFormsList = () => {
    mutate(
      (keys) =>
        Array.isArray(keys) &&
        keys.some((item) => item.startsWith("api/approverview/monthlyPlans")),
      undefined,
      { revalidate: true }
    );
  };

  const monthlyFormsData = data?.MonthlyForms?.map((form, index) => ({
    key: index,
    id: form?.id,
    name: form?.projectName,
    month: form.month,
    year: form.year,
    status: form.status,
    facilitator: form.facilitator,
    location: form.location,
    facilitatorName: form.facilitatorName,
  }));

  return {
    monthlyFormsList: monthlyFormsData ?? [],
    isMonthlyFormsListLoading: isLoading,
    isMonthlyFormsListError: error,
    reloadMonthlyFormsList,
  };
}
