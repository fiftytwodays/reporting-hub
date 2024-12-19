import { useState } from "react";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { MessageInstance } from "antd/es/message/interface";

import CreateClusterForm from "./CreateClusterForm";


interface CreateClusterModalProps {
  messageApi: MessageInstance;
}

export default function CreateClusterModal({
  messageApi,
}: CreateClusterModalProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const onCreateClusterModalClose = () => {
    setIsOpenModal(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpenModal(true)}
        type="primary"
        icon={<PlusOutlined />}
      >
        Create cluster
      </Button>

      <Modal
        title="Create cluster"
        centered
        footer={null}
        open={isOpenModal}
        onCancel={onCreateClusterModalClose}
        destroyOnClose
      >
        {isOpenModal && (
          <CreateClusterForm
          onCreateClusterModalClose={onCreateClusterModalClose}
            messageApi={messageApi}
          />
        )}
      </Modal>
    </>
  );
}
