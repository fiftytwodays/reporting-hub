import useParameters from "@/entities/parameters/api/parameters-list";
import { CreateParametersForm } from "@/feature/create-parameters";
import { EditParametersForm } from "@/feature/edit-parameter";
import { message, Skeleton } from "antd";

interface ParametersListProps {
  setIsEditing: (status: boolean) => void;
  setIsEnabled: (status: boolean) => void;
  isEditing: boolean;
}

export default function ParametersList({
  setIsEditing,
  setIsEnabled,
  isEditing,
}: ParametersListProps) {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 2,
  });

  const { parametersList, isParametersListLoading } = useParameters({
    condition: true,
  });
  parametersList?.id == "" ? setIsEnabled(false) : setIsEnabled(true);

  return (
    <>
      {contextHolder} {/* message context should remain at the top */}
      <Skeleton loading={isParametersListLoading} active>
        {!isParametersListLoading && parametersList?.id == "" ? (
          <CreateParametersForm messageApi={messageApi} />
        ) : !isParametersListLoading && parametersList ? (
          <EditParametersForm
            parameters={parametersList}
            setIsEditing={setIsEditing}
            isEditing={isEditing}
            isLoading={isParametersListLoading}
            messageApi={messageApi}
          />
        ) : null}
      </Skeleton>
    </>
  );
}
