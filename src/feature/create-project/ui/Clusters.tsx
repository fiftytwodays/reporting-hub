import React from "react";
import { Select } from "antd";
import { FormInstance } from "antd/es/form";
import useClustersList from "../api/clusters-list";

interface Cluster {
  id: string | number;
  name: string;
}

interface ClustersProps {
  form: FormInstance;
}

const Clusters: React.FC<ClustersProps> = ({ form }) => {
  const { clustersData } = useClustersList({ condition: true });

  const handleChange = (value: string | number ) => {
    
    form.setFieldValue(
      "cluster",
      value
    );
  };

  const transformClustersData = (data?: Cluster[]) => {
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
      options={transformClustersData(clustersData)}
    />
  );
};

export default Clusters;
