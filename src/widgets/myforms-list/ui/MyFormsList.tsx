import { message, Spin } from "antd";
import { useState, useEffect } from "react";
import { YearlyPlan } from "@/entities/yearly-form/config/types";
import useYearlyPlansList from "@/entities/yearly-form/api/yearlyplan-list";
// import { EditYearlyPlanModal } from "@/feature/edit-region";
import { YearlyPlansList as _YearlyPlansList } from "@/entities/yearly-form";
import { useRouter } from "next/navigation";
import useDeleteYearlyForm from "@/feature/delete-yearly-form/delete-yearly-form"
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';


export default function YearlyPlansList({ type }: { type: string }) {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 3,
  });
  const [selectedYearlyPlan, setSelectedYearlyPlan] = useState<YearlyPlan | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { userId } = await getCurrentUser();
        setUserId(userId);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    reloadYearlyPlansList();
    fetchUser();
  }, []);

  const { yearlyPlansList, isYearlyPlansListLoading, reloadYearlyPlansList } =
    useYearlyPlansList({
      condition: true,
      type,
    });

  const { deleteYearlyForm } = useDeleteYearlyForm();
  const handleEdit = (yearlyPlan: YearlyPlan) => {
    setSelectedYearlyPlan(yearlyPlan);
    // setIsEditModalVisible(true);
    if (type === "myforms") {
      router.push('/yearly-form/my-forms/' + yearlyPlan.id);
    }

    if (type === "approver")
      router.push('/yearly-form/approver-view/' + yearlyPlan.id);
    if (type === "reviewer")
      router.push('/yearly-form/reviewer-view/' + yearlyPlan.id);

  };

  const handleView = (yearlyPlan: YearlyPlan) => {
    setSelectedYearlyPlan(yearlyPlan);
    // setIsEditModalVisible(true);
    if (type === "myforms") {
      router.push('/yearly-form/my-forms/' + yearlyPlan.id + '/view');
    }

    if (type === "approver")
      router.push('/yearly-form/approver-view/' + yearlyPlan.id + '/view');
    if (type === "reviewer")
      router.push('/yearly-form/reviewer-view/' + yearlyPlan.id + '/view');

  };

  // const { deleteYearlyPlan } = useDeleteYearlyPlan();

  const handleDelete = async (yearlyPlan: YearlyPlan) => {
    const payload = { id: yearlyPlan.id };

    // const payload = { id: region.id };
    try {
      const data = await deleteYearlyForm(payload);;
      if (data) {
        messageApi.success("Yearly Plan has been deleted successfully.");
        reloadYearlyPlansList();
      }
    } catch (error: any) {
      messageApi.error("Unable to delete YearlyPlan. Please try again.");
    }
  };

  return (
    <>
      {contextHolder}
      {(isYearlyPlansListLoading)?(<div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255, 255, 255, 0.7)",
          zIndex: 9999,
        }}
      >
        <Spin size="large" />
      </div>):(
      <_YearlyPlansList
        data={yearlyPlansList}
        isLoading={isYearlyPlansListLoading}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleView={handleView}
        type={type}
        userId={userId}
      />)}
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
