import { message, Select } from "antd";
import { useEffect, useState } from "react";
import { MonthlyForm } from "@/entities/monthly-form/config/types";
import { MonthlyFormsList as _MonthlyFormsList } from "@/entities/monthly-form";
import useProjectList, {
  Project,
} from "@/feature/create-monthly-form/api/project-list";
import { useMonthlyFormsList } from "@/entities/monthly-form/api/get-specific-monthlyForm";
import { useMonthlyFormsListUser } from "@/entities/monthly-form/api/get-monthlyForm-user";

export default function MonthlyFormsList() {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 2,
  });

  const [projectId, setSelectedProject] = useState("");

  // Fetch all projects
  const { projectsData, isProjectTypesDataLoading } = useProjectList({
    condition: true,
    projectId: "project",
    type: "myforms",
  });

  // Fetch monthly forms list only when projectId is selected
  const { monthlyFormsList, isMonthlyFormsListLoading } = useMonthlyFormsList({
    projectId,
    condition: !!projectId,
  });

  const {
    monthlyFormsList: allMonthlyFormList,
    isMonthlyFormsListLoading: isAllMonthlyFormListLoading,
  } = useMonthlyFormsListUser({
    condition: projectId === "",
  });

  const transformProjectsData = (data?: Project[]) =>
    data?.map((item) => ({
      label: item.name,
      value: item.id,
    })) || [];

  return (
    <>
      {contextHolder}
      {!isProjectTypesDataLoading && (
        <Select
          options={transformProjectsData(projectsData)}
          onChange={(value: string) => setSelectedProject(value)}
          placeholder="Select Project"
          style={{ width: 200, marginBottom: 16 }}
        />
      )}

      {/* Render Monthly Forms list when data is available */}
      {projectId !== "" ? (
        <_MonthlyFormsList
          data={monthlyFormsList}
          isLoading={isMonthlyFormsListLoading}
        />
      ) : (
        <_MonthlyFormsList
          data={allMonthlyFormList}
          isLoading={isAllMonthlyFormListLoading}
        />
      )}

      {/* Modal logic placeholder (optional) */}
      {/* {isEditModalVisible && selectedMonthlyForm && (
        <EditMonthlyFormModal
          monthlyFormDetails={selectedMonthlyForm}
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          messageApi={messageApi}
        />
      )} */}
    </>
  );
}
