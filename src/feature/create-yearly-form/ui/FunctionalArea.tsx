import React from "react";
import { Select } from "antd";
import { FormInstance } from "antd/es/form";
import useFunctionalAreaList from "../api/functional-area";

interface FunctionalArea {
  id: string | number;
  name: string;
}

interface FunctionalAreaProps {
  handlePlanChange: (quarter: number, index: number, field: string, value: any) => void;
  quarterKey: number;
  index: number;
}

const FunctionalArea: React.FC<FunctionalAreaProps> = ({ handlePlanChange, quarterKey, index }) => {
  const { functionalAreasData } = useFunctionalAreaList({ condition: true });

  const handleChange = (value: string | number ) => {

    console.log("CHeckign the value inside Functional Area", quarterKey, index)
    handlePlanChange(quarterKey, index, "functionalArea", value)
    // form.setFieldValue(
    //   "project",
    //   value
    // );
  };

  const transformFunctionalAreaData = (data?: FunctionalArea[]) => {
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
      options={transformFunctionalAreaData(functionalAreasData)}
    />
  );
};

export default FunctionalArea;
