import React from "react";
import { Select } from "antd";
import { FormInstance } from "antd/es/form";
import useRegionsList from "../api/regions-list";

interface Region {
  id: string | number;
  name: string;
}

interface RegionsProps {
  form: FormInstance;
}

const Regions: React.FC<RegionsProps> = ({ form }) => {
  const { regionsData } = useRegionsList({ condition: true });

  // Transform regions data for the Select component options
  const transformRegionsData = (data?: Region[]) => {
    return (
      data?.map((item) => ({
        label: item.name, 
        value: item.id,
      })) || []
    );
  };

  // Get the initial value for the cluster from the form
  const initialCluster = form.getFieldValue("region");

  const handleChange = (value: string | number) => {
    form.setFieldValue("region", value);
  };

  return (
    <Select
      value={initialCluster} // Ensure the dropdown has the correct initial value
      showSearch
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      allowClear
      onChange={handleChange}
      options={transformRegionsData(regionsData)}
    />
  );
};

export default Regions;
