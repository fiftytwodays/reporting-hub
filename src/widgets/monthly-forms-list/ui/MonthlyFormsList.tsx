import { message, Select } from "antd";
import { useEffect, useState } from "react";
import { MonthlyFormsList as _MonthlyFormsList } from "@/entities/monthly-form";
import useProjectList, {
  Project,
} from "@/feature/create-monthly-form/api/project-list";
import { useMonthlyFormsList } from "@/entities/monthly-form/api/get-specific-monthlyForm";
import { useMonthlyFormsListUser } from "@/entities/monthly-form/api/get-monthlyForm-user";
import useUsersList from "@/entities/user/api/users-list";

export default function MonthlyFormsList() {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 2,
  });
  const [projectId, setSelectedProject] = useState<string | null>(null);

  const { projectsData, isProjectTypesDataLoading } = useProjectList({
    condition: true,
    projectId: "project",
    type: "myplans",
  });

  const { usersList } = useUsersList({ condition: true });
  console.log("usersList", usersList);
  console.log(
    "the condition",
    !!projectId && Array.isArray(usersList) && usersList.length > 0
  );

  const { monthlyFormsList, isMonthlyFormsListLoading } = useMonthlyFormsList({
    projectId: projectId || "",
    condition: !!projectId && Array.isArray(usersList) && usersList.length > 0,
    usersList,
  });

  const {
    monthlyFormsList: allMonthlyFormList,
    isMonthlyFormsListLoading: isAllMonthlyFormListLoading,
  } = useMonthlyFormsListUser({
    condition: !projectId && Array.isArray(usersList) && usersList.length > 0,
    usersList,
  });

  console.log(
    "all form the condition",
    !projectId && Array.isArray(usersList) && usersList.length > 0
  );

  const transformProjectsData = (data?: Project[]) =>
    data?.map((item) => ({ label: item.name, value: item.id })) || [];

  return (
    <>
      {contextHolder}
      {!isProjectTypesDataLoading && (
        <Select
          options={transformProjectsData(projectsData)}
          onChange={(value: string) => {
            setSelectedProject(value || null);
          }}
          placeholder="Select Project"
          style={{ width: 200, marginBottom: 16 }}
          allowClear
        />
      )}

      {projectId ? (
        <_MonthlyFormsList
          data={monthlyFormsList}
          isLoading={!monthlyFormsList}
        />
      ) : (
        <_MonthlyFormsList
          data={allMonthlyFormList}
          isLoading={isAllMonthlyFormListLoading}
        />
      )}
    </>
  );
}
