import React from "react";
import { Select } from "antd";
import { FormInstance } from "antd/es/form";
import useRegionsList from "../api/region-list";

interface Region {
  id: string | number;
  name: string;
}

interface RegionsProps {
  form: FormInstance;
}

const Regions: React.FC<RegionsProps> = ({ form }) => {
  const { regionsData } = useRegionsList({ condition: true });

  const handleChange = (value: string | number ) => {
    
    form.setFieldValue(
      "region",
      value
    );
  };

  const transformRegionsData = (data?: Region[]) => {
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
      options={transformRegionsData(regionsData)}
    />
  );
};

export default Regions;
