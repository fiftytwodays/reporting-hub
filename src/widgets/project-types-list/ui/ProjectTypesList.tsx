import useProjectTypesList from "@/entities/project-type/api/project-types-list";
import { ProjectType } from "@/entities/project-type/config/types";
import useDeleteProjectType from "@/feature/delete-project-type/delete-project-type";
import { message } from "antd";
import { useState } from "react";
import { ProjectTypesList as _ProjectTypesList } from "@/entities/project-type";
import { EditProjectTypeModal } from "@/feature/edit-project-type";

export default function ProjectTypesList() {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 2,
  });
  const [selectedProjectType, setSelectedProjectType] = useState<ProjectType | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const { projectTypesList, isProjectTypesListLoading, reloadProjectTypesList } =
    useProjectTypesList({
      condition: true,
    });

  const handleEdit = (projectType: ProjectType) => {
    setSelectedProjectType(projectType);
    setIsEditModalVisible(true);
  };

  const { deleteProjectType } = useDeleteProjectType();

  const handleDelete = async (projectType: ProjectType) => {
    const payload = { id: projectType.id };
    try {
      const data = await deleteProjectType(payload);
      if (data) {
        messageApi.success("Project type has been deleted successfully.");
        reloadProjectTypesList();
      }
    } catch (error: any) {
      messageApi.error("Unable to delete the project type. Please try again.");
    }
  };

  return (
    <>
      {contextHolder}
      <_ProjectTypesList
        data={projectTypesList}
        isLoading={isProjectTypesListLoading}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      {isEditModalVisible && selectedProjectType && (
        <EditProjectTypeModal
          projectTypeDetails={selectedProjectType}
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          messageApi={messageApi}
        />
      )}
    </>
  );
}
