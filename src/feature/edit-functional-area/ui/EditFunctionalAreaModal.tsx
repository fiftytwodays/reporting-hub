import { MessageInstance } from "antd/es/message/interface";
import { Modal } from "antd";
import EditFunctionalAreaForm from "./EditFunctionalAreaForm";
import { FunctionalArea } from "@/entities/functional-area/config/types";


interface EditFunctionalAreaModalProps {
  functionalAreaDetails: FunctionalArea;
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  messageApi: MessageInstance;
}

export default function EditFunctionalAreaModal({
  functionalAreaDetails,
  isModalVisible,
  setIsModalVisible,
  messageApi,
}: EditFunctionalAreaModalProps) {
  const onModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      title="Edit Functional area"
      centered
      footer={null}
      open={isModalVisible}
      onCancel={onModalClose}
      destroyOnClose
    >
      <EditFunctionalAreaForm
        onEditFunctionalAreaModalClose={onModalClose}
        messageApi={messageApi}
        functionalAreaDetails={functionalAreaDetails}
      />
    </Modal>
  );
}
