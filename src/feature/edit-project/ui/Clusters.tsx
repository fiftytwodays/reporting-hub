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

  // Transform clusters data for the Select component options
  const transformClustersData = (data?: Cluster[]) => {
    return (
      data?.map((item) => ({
        label: item.name, // Use "label" for Ant Design Select.
        value: item.id,
      })) || []
    );
  };

  // Get the initial value for the cluster from the form
  const initialCluster = form.getFieldValue("cluster");

  const handleChange = (value: string | number) => {
    form.setFieldValue("cluster", value);
  };

  return (
    <Select
      value={initialCluster} // Ensure the dropdown has the correct initial value
      showSearch
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      allowClear
      onChange={handleChange}
      options={transformClustersData(clustersData)}
    />
  );
};

export default Clusters;
