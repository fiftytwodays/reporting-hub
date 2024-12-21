import { MessageInstance } from "antd/es/message/interface";
import { Modal } from "antd";
import EditRegionForm from "./EditRegionForm";
import { Region } from "@/entities/region/config/types";


interface EditClusterModalProps {
  regionDetails: Region;
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  messageApi: MessageInstance;
}

export default function EditRegionModal({
  regionDetails,
  isModalVisible,
  setIsModalVisible,
  messageApi,
}: EditClusterModalProps) {
  const onModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      title="Edit Region"
      centered
      footer={null}
      open={isModalVisible}
      onCancel={onModalClose}
      destroyOnClose
    >
      <EditRegionForm
        onEditRegionModalClose={onModalClose}
        messageApi={messageApi}
        regionDetails={regionDetails}
      />
    </Modal>
  );
}
