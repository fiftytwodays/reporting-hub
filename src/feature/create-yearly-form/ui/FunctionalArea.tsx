import React, { useEffect, useState } from "react";
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
  functionalAreaId: string,
}

const FunctionalArea: React.FC<FunctionalAreaProps> = ({ handlePlanChange, quarterKey, index, functionalAreaId }) => {
  const { functionalAreasData } = useFunctionalAreaList({ condition: true });
const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (functionalAreasData) {
      const functionalArea = functionalAreasData.find(functionalArea => functionalArea.id === functionalAreaId);
      setSelectedValue(functionalArea?.name);
    }
  }, [functionalAreasData, functionalAreaId]);

  if (selectedValue === undefined && functionalAreaId) {
    return null; // Or you can show a loading indicator here
  }
  const handleChange = (value: string | number ) => {
    handlePlanChange(quarterKey, index, "functionalAreaId", value)
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
      defaultValue={selectedValue}
    />
  );
};

export default FunctionalArea;
