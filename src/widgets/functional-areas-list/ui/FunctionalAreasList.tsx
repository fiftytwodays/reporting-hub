import useFunctionalAreasList from "@/entities/functional-area/api/functional-areas-list";
import { FunctionalArea } from "@/entities/functional-area/config/types";
import useDeleteFunctionalArea from "@/feature/delete-functional-area/delete-functional-area";
import { EditFunctionalAreaModal } from "@/feature/edit-functional-area";
import { FunctionalAreasList as _FunctionalAreasList } from "@/entities/functional-area";
import { message } from "antd";
import { useState } from "react";

export default function FunctionalAreasList() {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 2,
  });
  const [selectedFunctionalArea, setSelectedFunctionalArea] = useState<FunctionalArea | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const { functionalAreasList, isFunctionalAreasListLoading, reloadFunctionalAreasList } =
    useFunctionalAreasList({
      condition: true,
    });

  const handleEdit = (functionalArea: FunctionalArea) => {
    setSelectedFunctionalArea(functionalArea);
    setIsEditModalVisible(true);
  };

  const { deleteFunctionalArea } = useDeleteFunctionalArea();

  const handleDelete = async (functionalArea: FunctionalArea) => {
    const payload = { id: functionalArea.id };
    try {
      const data = await deleteFunctionalArea(payload);
      if (data) {
        messageApi.success("Functional area has been deleted successfully.");
        reloadFunctionalAreasList();
      }
    } catch (error: any) {
      messageApi.error("Unable to delete the functional area. Please try again.");
    }
  };

  return (
    <>
      {contextHolder}
      <_FunctionalAreasList
        data={functionalAreasList}
        isLoading={isFunctionalAreasListLoading}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      {isEditModalVisible && selectedFunctionalArea && (
        <EditFunctionalAreaModal
          functionalAreaDetails={selectedFunctionalArea}
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          messageApi={messageApi}
        />
      )}
    </>
  );
}
