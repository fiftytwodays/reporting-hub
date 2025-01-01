import React from "react";
import { Select } from "antd";
import { FormInstance } from "antd/es/form";
import useProjectList from "../api/project-list";

interface Project {
  id: string | number;
  name: string;
}

interface ProjectsProps {
  form: FormInstance;
}

const Projects: React.FC<ProjectsProps> = ({ form }) => {
  const { projectsData } = useProjectList({ condition: true });

  const handleChange = (value: string | number ) => {
    form.setFieldValue(
      "project",
      value
    );
  };

  const transformProjectsData = (data?: Project[]) => {
    return data?.map((item) => ({
      label: item.name, // Use "label" instead of "title" for Ant Design Select.
      value: item.id,
    })) || [];
  };

  return (
    <Select
      showSearch
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      allowClear
      onChange={(value) => handleChange(value)}
      options={transformProjectsData(projectsData)}
    />
  );
};

export default Projects;
