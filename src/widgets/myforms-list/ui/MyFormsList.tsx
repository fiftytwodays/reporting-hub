import { message } from "antd";
import { useState } from "react";
import { YearlyPlan } from "@/entities/yearly-form/config/types";
import useYearlyPlansList from "@/entities/yearly-form/api/yearlyplan-list";
// import { EditYearlyPlanModal } from "@/feature/edit-region";
import { YearlyPlansList as _YearlyPlansList } from "@/entities/yearly-form";
// import useDeleteYearlyPlan from "@/feature/delete-region/delete-region";

export default function YearlyPlansList() {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 2,
  });
  const [selectedYearlyPlan, setSelectedYearlyPlan] = useState<YearlyPlan | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const { yearlyPlansList, isYearlyPlansListLoading } =
    useYearlyPlansList({
      condition: true,
    });

  const handleEdit = (yearlyPlan: YearlyPlan) => {
    setSelectedYearlyPlan(yearlyPlan);
    setIsEditModalVisible(true);
  };

  // const { deleteYearlyPlan } = useDeleteYearlyPlan();

  const handleDelete = async (yearlyPlan: YearlyPlan) => {
    // const payload = { id: region.id };
    // try {
    //   const data = await deleteYearlyPlan(payload);
    //   if (data) {
    //     messageApi.success("YearlyPlan has been deleted successfully.");
    //     reloadYearlyPlansList();
    //   }
    // } catch (error: any) {
    //   messageApi.error("Unable to delete the region. Please try again.");
    // }
  };

  return (
    <>
      {contextHolder}
      <_YearlyPlansList
        data={yearlyPlansList}
        isLoading={isYearlyPlansListLoading}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      {/* {isEditModalVisible && selectedYearlyPlan && (
        <EditYearlyPlanModal
          regionDetails={selectedYearlyPlan}
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          messageApi={messageApi}
        />
      )} */}
    </>
  );
}