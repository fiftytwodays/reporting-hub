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

  const handleChange = (value: string | number ) => {
    form.setFieldValue(
      "projectType",
      value
    );
  };

  const transformProjectTypesData = (data?: ProjectType[]) => {
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
      options={transformProjectTypesData(projectTypesData)}
      optionFilterProp="label"
    />
  );
};

export default ProjectTypes;
