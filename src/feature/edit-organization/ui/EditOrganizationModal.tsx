import { MessageInstance } from "antd/es/message/interface";
import { Modal, Skeleton } from "antd";
import { Organization } from "@/entities/organization/config/types";
import EditOrganizationForm from "./EditOrganizationForm";
import useGetDocument from "@/feature/get-document/api/get-document";

interface EditOrganizationModalProps {
  organizationDetails: Organization;
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  messageApi: MessageInstance;
}

export default function EditOrganizationModal({
  organizationDetails,
  isModalVisible,
  setIsModalVisible,
  messageApi,
}: EditOrganizationModalProps) {
  const { documentData } = useGetDocument(
    { condition: true },
    { id: organizationDetails.logo }
  );

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      title="Edit Organization"
      centered
      footer={null}
      open={isModalVisible}
      onCancel={onModalClose}
      destroyOnClose
    >
      <EditOrganizationForm
        isLoading={!(organizationDetails.logo == "" || documentData)}
        document={documentData}
        onEditOrganizationModalClose={onModalClose}
        messageApi={messageApi}
        organizationDetails={organizationDetails}
      />
    </Modal>
  );
}
