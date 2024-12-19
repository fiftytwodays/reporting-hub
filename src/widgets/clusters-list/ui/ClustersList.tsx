import useClustersList from "@/entities/cluster/api/clusters-list";
import { Cluster } from "@/entities/cluster/config/types";
import useDeleteCluster from "@/feature/delete-cluster/delete-cluster";
import { message } from "antd";
import { useState } from "react";
import { ClustersList as _ClustersList } from "@/entities/cluster";
import { EditClusterModal } from "@/feature/edit-cluster";

export default function ClustersList() {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 2,
  });
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const { clustersList, isClustersListLoading, reloadClustersList } =
    useClustersList({
      condition: true,
    });

  const handleEdit = (cluster: Cluster) => {
    setSelectedCluster(cluster);
    setIsEditModalVisible(true);
  };

  const { deleteCluster } = useDeleteCluster();

  const handleDelete = async (cluster: Cluster) => {
    const payload = { id: cluster.id };
    try {
      const data = await deleteCluster(payload);
      if (data) {
        messageApi.success("Cluster has been deleted successfully.");
        reloadClustersList();
      }
    } catch (error: any) {
      messageApi.error("Unable to delete the cluster. Please try again.");
    }
  };

  return (
    <>
      {contextHolder}
      <_ClustersList
        data={clustersList}
        isLoading={isClustersListLoading}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      {isEditModalVisible && selectedCluster && (
        <EditClusterModal
          clusterDetails={selectedCluster}
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          messageApi={messageApi}
        />
      )}
    </>
  );
}
