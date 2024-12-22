import useClustersList from "@/entities/cluster/api/clusters-list";
import { Organization } from "@/entities/organization/config/types";
import { message } from "antd";
import { useState } from "react";
import { OrganizationsList as _OrganizationsList } from "@/entities/organization";
import useOrganizationsList from "@/entities/organization/api/oganization-list";
import { EditOrganizationModal } from "@/feature/edit-organization";
import { CreateOrganizationModal } from "@/feature/create-organization";

export default function ClustersList() {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 2,
  });
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const {
    organizationsList,
    isOrganizationsListLoading,
  } = useOrganizationsList({
    condition: true,
  });

  const handleEdit = (organization: Organization) => {
    setSelectedOrganization(organization);
    setIsEditModalVisible(true);
  };

  return (
    <>
      {contextHolder}
      <_OrganizationsList
        data={organizationsList}
        isLoading={isOrganizationsListLoading}
        handleEdit={handleEdit}
      />
      {!isOrganizationsListLoading && (
        <CreateOrganizationModal
          messageApi={messageApi}
          isListEmpty={organizationsList.length === 0}
        />
      )}
      {isEditModalVisible && selectedOrganization && (
        <EditOrganizationModal
          organizationDetails={selectedOrganization}
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          messageApi={messageApi}
        />
      )}
    </>
  );
}
