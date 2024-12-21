import { useState } from "react";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { MessageInstance } from "antd/es/message/interface";
import CreateProjectTypeForm from "./CreateProjectTypeForm";

interface CreateProjectTypeModalProps {
  messageApi: MessageInstance;
}

export default function CreateProjectTypeModal({
  messageApi,
}: CreateProjectTypeModalProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const onCreateProjectTypeModalClose = () => {
    setIsOpenModal(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpenModal(true)}
        type="primary"
        icon={<PlusOutlined />}
      >
        Create project type
      </Button>

      <Modal
        title="Create project type"
        centered
        footer={null}
        open={isOpenModal}
        onCancel={onCreateProjectTypeModalClose}
        destroyOnClose
      >
        {isOpenModal && (
          <CreateProjectTypeForm
            onCreateProjectTypeModalClose={onCreateProjectTypeModalClose}
            messageApi={messageApi}
          />
        )}
      </Modal>
    </>
  );
}
