import { message, Select } from "antd";
import { useState } from "react";
import { data } from "@/entities/monthly-form/api/monthly-forms-list";
import { MonthlyForm } from "@/entities/monthly-form/config/types";
import { MonthlyFormsApproverList as _MonthlyFormsList } from "@/entities/monthly-form -approver";
import { projects } from "../config/projects";
import { useMonthlyFormsList } from "@/entities/monthly-form -approver/api/get-specific-monthlyForm";
import useProjectList, {
  Project,
} from "@/feature/create-monthly-form/api/project-list";
import { useMonthlyFormsListUser } from "@/entities/monthly-form -approver/api/get-monthlyForm-user";
import useUsersList from "@/entities/user/api/users-list";

export default function MonthlyFormsListApprover() {
  const { usersList } = useUsersList({ condition: true });

  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 2,
  });

  const [projectId, setSelectedProject] = useState("");

  // Fetch all projects
  const { projectsData, isProjectTypesDataLoading } = useProjectList({
    condition: true,
    projectId: "project",
    type: "approver",
  });

  // Fetch monthly forms list only when projectId is selected
  const { monthlyFormsList, isMonthlyFormsListLoading } = useMonthlyFormsList({
    projectId,
    condition: !!projectId && Array.isArray(usersList) && usersList.length > 0,
    usersList,
  });

  const {
    monthlyFormsList: allMonthlyFormList,
    isMonthlyFormsListLoading: isAllMonthlyFormListLoading,
  } = useMonthlyFormsListUser({
    condition:
      projectId === "" && Array.isArray(usersList) && usersList.length > 0,
    usersList,
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
