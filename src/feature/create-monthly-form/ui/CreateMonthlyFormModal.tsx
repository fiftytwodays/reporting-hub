import { useState } from "react";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import CreateMonthlyFormForm from "./CreateMonthlyFormForm";
import { MessageInstance } from "antd/es/message/interface";

interface CreateMonthlyFormModalProps {
  messageApi: MessageInstance;
}

export default function CreateMonthlyFormModal({
  messageApi,
}: CreateMonthlyFormModalProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const onCreateMonthlyFormModalClose = () => {
    setIsOpenModal(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpenModal(true)}
        type="primary"
        icon={<PlusOutlined />}
      >
        Create monthly form
      </Button>

      <Modal
        title="Create monthly form"
        width="70%"
        centered
        footer={null}
        open={isOpenModal}
        onCancel={onCreateMonthlyFormModalClose}
        destroyOnClose
      >
        {isOpenModal && (
          <CreateMonthlyFormForm
            // onCreateMonthlyFormModalClose={onCreateMonthlyFormModalClose}
            messageApi={messageApi}
          />
        )}
      </Modal>
    </>
  );
}
