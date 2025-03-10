import useOrganizationsList from "@/entities/organization/api/oganization-list";
import CreateOrganizationForm from "@/feature/create-organization/ui/CreateOrganizationForm";
import EditOrganizationForm from "@/feature/edit-organization/ui/EditOrganizationForm";
import { message, Skeleton } from "antd";

interface OrganizationListProps {
  setIsEditing: (status: boolean) => void;
  setIsEnabled: (status: boolean) => void;
  isEditing: boolean;
}

export default function OrganizationList({
  setIsEditing,
  setIsEnabled,
  isEditing,
}: OrganizationListProps) {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 2,
  });

  const { organizationsList, isOrganizationsListLoading } =
    useOrganizationsList({
      condition: true,
    });
  organizationsList?.name == "" ? setIsEnabled(false) : setIsEnabled(true);

  return (
    <>
      {contextHolder} {/* message context should remain at the top */}
      <Skeleton loading={isOrganizationsListLoading} active>
        {!isOrganizationsListLoading && organizationsList?.name == "" ? (
          <CreateOrganizationForm messageApi={messageApi} />
        ) : !isOrganizationsListLoading && organizationsList ? (
          <EditOrganizationForm
            organizationDetails={organizationsList}
            setIsEditing={setIsEditing}
            isEditing={isEditing}
            isLoading={isOrganizationsListLoading}
            messageApi={messageApi}
          />
        ) : null}
      </Skeleton>
    </>
  );
}
