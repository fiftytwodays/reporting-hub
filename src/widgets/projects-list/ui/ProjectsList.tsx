import { message } from "antd";
import { useState } from "react";

import { ProjectsList as _ProjectsLists } from "@/entities/project";
import useProjectsList from "@/entities/project/api/project-list";
import { Project } from "@/entities/project/config/types";
import { EditProjectModal } from "@/feature/edit-project";
import useDeleteProject from "@/feature/delete-project/delete-project";

export default function ProjectsList() {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 2,
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const { reloadProjectList } = useProjectsList({ condition: true });

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsEditModalVisible(true);
  };

  const { deleteProject } = useDeleteProject();
  const handleDelete = async (project: Project) => {
    const payload = { id: project.id };
    try {
      const data = await deleteProject(payload);
      if (data) {
        messageApi.success("Project has been deleted successfully.");
        reloadProjectList();
      }
    } catch (error: any) {
      messageApi.error("Unable to delete the project. Please try again.");
    }
  };

  const { projectsList, isProjectsListLoading } = useProjectsList({
    condition: true,
  });

  return (
    <>
      {contextHolder}
      <_ProjectsLists
        data={projectsList}
        isLoading={isProjectsListLoading}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      {isEditModalVisible && selectedProject && (
        <EditProjectModal
          projectDetails={selectedProject}
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          messageApi={messageApi}
        />
      )}
    </>
  );
}
