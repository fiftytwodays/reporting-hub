import { MessageInstance } from "antd/es/message/interface";
import { Modal } from "antd";
import { ProjectType } from "@/entities/project-type/config/types";
import EditProjectTypeForm from "./EditProjectTypeForm";


interface EditProjectTypeModalProps {
  projectTypeDetails: ProjectType;
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  messageApi: MessageInstance;
}

export default function EditProjectTypeModal({
  projectTypeDetails,
  isModalVisible,
  setIsModalVisible,
  messageApi,
}: EditProjectTypeModalProps) {
  const onModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      title="Edit Project type"
      centered
      footer={null}
      open={isModalVisible}
      onCancel={onModalClose}
      destroyOnClose
    >
      <EditProjectTypeForm
        onEditProjectTypeModalClose={onModalClose}
        messageApi={messageApi}
        projectTypeDetails={projectTypeDetails}
      />
    </Modal>
  );
}
