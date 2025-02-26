import React from "react";
import { Select } from "antd";
import { FormInstance } from "antd/es/form";
import useProjectTypesList from "../api/project-types-list";

interface ProjectType {
  id: string | number;
  name: string;
}

interface ProjectTypesProps {
  form: FormInstance;
}

const ProjectTypes: React.FC<ProjectTypesProps> = ({ form }) => {
  const { projectTypesData } = useProjectTypesList({ condition: true });

  // Transform project types for Select component options
  const transformProjectTypesData = (data?: ProjectType[]) => {
    return (
      data?.map((item) => ({
        label: item.name, // Use "label" for Ant Design Select.
        value: item.id,
      })) || []
    );
  };

  // Get the initial value for the project type from the form
  const initialProjectType = form.getFieldValue("projectType");

  const handleChange = (value: string | number) => {
    form.setFieldValue("projectType", value);
  };

  return (
    <Select
      value={initialProjectType} // Ensure the dropdown has the correct initial value
      showSearch
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      allowClear
      onChange={handleChange}
      options={transformProjectTypesData(projectTypesData)}
      optionFilterProp="label"
    />
  );
};

export default ProjectTypes;
