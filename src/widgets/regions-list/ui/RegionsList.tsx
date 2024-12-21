import { message } from "antd";
import { useState } from "react";
import { Region } from "@/entities/region/config/types";
import useRegionsList from "@/entities/region/api/region-list";
import { EditRegionModal } from "@/feature/edit-region";
import { RegionsList as _RegionsList } from "@/entities/region";
import useDeleteRegion from "@/feature/delete-region/delete-region";

export default function RegionsList() {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 2,
  });
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const { regionsList, isRegionsListLoading, reloadRegionsList } =
    useRegionsList({
      condition: true,
    });

  const handleEdit = (region: Region) => {
    setSelectedRegion(region);
    setIsEditModalVisible(true);
  };

  const { deleteRegion } = useDeleteRegion();

  const handleDelete = async (region: Region) => {
    const payload = { id: region.id };
    try {
      const data = await deleteRegion(payload);
      if (data) {
        messageApi.success("Region has been deleted successfully.");
        reloadRegionsList();
      }
    } catch (error: any) {
      messageApi.error("Unable to delete the region. Please try again.");
    }
  };

  return (
    <>
      {contextHolder}
      <_RegionsList
        data={regionsList}
        isLoading={isRegionsListLoading}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      {isEditModalVisible && selectedRegion && (
        <EditRegionModal
          regionDetails={selectedRegion}
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          messageApi={messageApi}
        />
      )}
    </>
  );
}
