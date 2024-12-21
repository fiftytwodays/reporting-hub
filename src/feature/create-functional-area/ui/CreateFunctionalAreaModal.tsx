import { useState } from "react";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import CreateFunctionalAreaForm from "./CreateFunctionalAreaForm";
import { MessageInstance } from "antd/es/message/interface";


interface CreateFunctionalAreaModalProps {
  messageApi: MessageInstance;
}

export default function CreateFunctionalAreaModal({
  messageApi,
}: CreateFunctionalAreaModalProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const onCreateFunctionalAreaModalClose = () => {
    setIsOpenModal(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpenModal(true)}
        type="primary"
        icon={<PlusOutlined />}
      >
        Create Functional area
      </Button>

      <Modal
        title="Create Functional area"
        centered
        footer={null}
        open={isOpenModal}
        onCancel={onCreateFunctionalAreaModalClose}
        destroyOnClose
      >
        {isOpenModal && (
          <CreateFunctionalAreaForm
          onCreateFunctionalAreaModalClose={onCreateFunctionalAreaModalClose}
            messageApi={messageApi}
          />
        )}
      </Modal>
    </>
  );
}
