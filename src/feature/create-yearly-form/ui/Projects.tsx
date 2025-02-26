import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { FormInstance } from "antd/es/form";
import useProjectList from "../api/project-list";

interface Project {
  id: string | number;
  name: string;
}

interface ProjectsProps {
  form: FormInstance;
  id: string;
}

const Projects: React.FC<ProjectsProps> = ({ form, id }) => {
  const { projectsData } = useProjectList({ condition: true, projectId: id });
  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (projectsData) {
      const project = projectsData.find(project => project.id === id);
      setSelectedValue(project?.name);
    }
  }, [projectsData, id]);

  if (selectedValue === undefined && id && id != "project") {
    return null; // Or you can show a loading indicator here
  }

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

  return (projectsData &&
    <Select
      showSearch
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      allowClear
      onChange={(value) => handleChange(value)}
      options={transformProjectsData(projectsData)}
      defaultValue={selectedValue}
      optionFilterProp="label"
    />
  );
};

export default Projects;
