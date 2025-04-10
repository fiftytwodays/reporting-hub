import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { FormInstance } from "antd/es/form";
import useProjectList from "../api/project-list";
import useProjectsList from "../api/full-project-list";

interface Project {
  id: string | number;
  name: string;
}

interface ProjectsProps {
  form: FormInstance;
  id: string;
  fetchAll: boolean;
  disabled?: boolean;
  setLoading: (loading: boolean) => void;
  setSelectedProject?: (projectId: string) => void; // Optional onChange prop
}

const Projects: React.FC<ProjectsProps> = ({
  form,
  id,
  fetchAll,
  disabled,
  setLoading,
  setSelectedProject,
}) => {
  const projectListData = useProjectList({
    condition: true,
    projectId: id,
    type: "user",
  });

  const fullProjectListData = useProjectsList({
    condition: true,
  });

  // Decide which data to use
  const projectsData = fetchAll
    ? fullProjectListData.projectsList
    : projectListData.projectsData;
  const isProjectTypesDataLoading = fetchAll
    ? fullProjectListData.isProjectsListLoading
    : projectListData.isProjectTypesDataLoading;

  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (projectsData) {
      const project = projectsData.find((project) => project.id === id);
      setSelectedValue(project?.name);
    }
    setLoading(isProjectTypesDataLoading);

    console.log("ProjectsData", projectsData);
    console.log("isProjectTypesDataLoading", isProjectTypesDataLoading);
  }, [isProjectTypesDataLoading, projectsData, id, setLoading]);

  if (!selectedValue && id && id !== "project") {
    console.log("Selected value is not set", selectedValue);
    console.log("ID is not 'project'", id);
    return null; // Optionally, show a loading indicator instead
  }

  const handleChange = (value: string | number) => {
    form.resetFields([
      "additionalActivities",
      "additionalActivitiesNextMonth",
      "praisePoints",
      "prayerRequests",
      "storyTestimony",
      "concernsStruggles",
    ]);
    form.setFieldsValue({ project: value });
    if (setSelectedProject) {
      setSelectedProject(value as string); // Call the optional onChange prop
    }
  };

  const transformProjectsData = (data?: Project[]) =>
    data?.map((item) => ({
      label: item.name, // Use "label" for Ant Design Select
      value: item.id,
    })) || [];

  return (
    !isProjectTypesDataLoading &&
    projectsData && (
      <Select
        disabled={disabled}
        showSearch
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        allowClear
        onChange={handleChange}
        options={transformProjectsData(projectsData)}
        value={selectedValue} // Changed from defaultValue to value
        optionFilterProp="label"
      />
    )
  );
};

export default Projects;
