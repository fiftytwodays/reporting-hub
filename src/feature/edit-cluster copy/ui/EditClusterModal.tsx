import { MessageInstance } from "antd/es/message/interface";
import { Modal } from "antd";
import { Cluster } from "@/entities/cluster/config/types";
import EditClusterForm from "./EditClusterForm";


interface EditClusterModalProps {
  clusterDetails: Cluster;
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  messageApi: MessageInstance;
}

export default function EditClusterModal({
  clusterDetails,
  isModalVisible,
  setIsModalVisible,
  messageApi,
}: EditClusterModalProps) {
  const onModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      title="Edit Cluster"
      centered
      footer={null}
      open={isModalVisible}
      onCancel={onModalClose}
      destroyOnClose
    >
      <EditClusterForm
        onEditClusterModalClose={onModalClose}
        messageApi={messageApi}
        clusterDetails={clusterDetails}
      />
    </Modal>
  );
}
