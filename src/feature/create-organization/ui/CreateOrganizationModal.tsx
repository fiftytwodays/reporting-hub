import { useState } from "react";
import { MessageInstance } from "antd/es/message/interface";
import CreateOrganizationForm from "./CreateOrganizationForm";
import { Modal } from "antd";

interface CreateOrganizationModalProps {
  messageApi: MessageInstance;
  isListEmpty: boolean;
}

export default function CreateClusterModal({
  messageApi,
  isListEmpty,
}: CreateOrganizationModalProps) {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(isListEmpty);
  const onCreateOrganizationModalClose = () => {
    setIsOpenModal(false);
  };

  return (
    <>
      <Modal
        title="Create organization"
        centered
        footer={null}
        open={isOpenModal}
        onCancel={onCreateOrganizationModalClose}
        destroyOnClose
      >
        {isOpenModal && (
          <CreateOrganizationForm
            onCreateOrganizationModalClose={onCreateOrganizationModalClose}
            messageApi={messageApi}
          />
        )}
      </Modal>
    </>
  );
}
