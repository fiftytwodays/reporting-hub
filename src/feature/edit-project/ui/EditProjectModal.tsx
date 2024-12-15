import { MessageInstance } from "antd/es/message/interface";
import { Modal } from "antd";

import { Project } from "@/entities/project/config/types";
import EditProjectForm from "./EditProjectForm";

interface EditProjectModalProps {
  projectDetails: Project;
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  messageApi: MessageInstance;
}

export default function EditProjectModal({
  projectDetails,
  isModalVisible,
  setIsModalVisible,
  messageApi,
}: EditProjectModalProps) {
  const onModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      title="Edit Project"
      centered
      footer={null}
      open={isModalVisible}
      onCancel={onModalClose}
      destroyOnClose
    >
      <EditProjectForm
        onEditProjectModalClose={onModalClose}
        messageApi={messageApi}
        projectDetails={projectDetails}
      />
    </Modal>
  );
}
