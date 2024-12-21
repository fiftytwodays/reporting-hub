import { useState } from "react";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import CreateRegionForm from "./CreateRegionForm";
import { MessageInstance } from "antd/es/message/interface";


interface CreateRegionModalProps {
  messageApi: MessageInstance;
}

export default function CreateRegionModal({
  messageApi,
}: CreateRegionModalProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const onCreateRegionModalClose = () => {
    setIsOpenModal(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpenModal(true)}
        type="primary"
        icon={<PlusOutlined />}
      >
        Create region
      </Button>

      <Modal
        title="Create region"
        centered
        footer={null}
        open={isOpenModal}
        onCancel={onCreateRegionModalClose}
        destroyOnClose
      >
        {isOpenModal && (
          <CreateRegionForm
          onCreateRegionModalClose={onCreateRegionModalClose}
            messageApi={messageApi}
          />
        )}
      </Modal>
    </>
  );
}
