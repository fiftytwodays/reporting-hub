import { useState } from "react";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import CreateProjectForm from "./CreateProjectForm";
import { MessageInstance } from "antd/es/message/interface";


interface CreateProjectModalProps {
  messageApi: MessageInstance;
}

export default function CreateProjectModal({
  messageApi,
}: CreateProjectModalProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const onCreateProjectModalClose = () => {
    setIsOpenModal(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpenModal(true)}
        type="primary"
        icon={<PlusOutlined />}
      >
        Create project
      </Button>

      <Modal
        title="Create project"
        centered
        footer={null}
        open={isOpenModal}
        onCancel={onCreateProjectModalClose}
        destroyOnClose
      >
        {isOpenModal && (
          <CreateProjectForm
            onCreateProjectModalClose={onCreateProjectModalClose}
            messageApi={messageApi}
          />
        )}
      </Modal>
    </>
  );
}
