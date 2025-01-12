import { Page } from "@/shared/ui/page";
import ViewMonthlyFormApprover from "./ViewMonthlyFormApprover";
import ConfirmationModal from "./ConfirmationModal";
import { useState } from "react";

interface PageProps {
  id: string | string[];
}

export default function ViewMonthlyFormPage({ id }: PageProps) {
const [isModalVisible, setIsModalVisible] = useState<boolean>(false);


  return (
    <>
      <Page
        showPageHeader
        header={{
          title: "View monthly form",
          breadcrumbs: [
            {
              title: "Home",
              href: "/",
            },
            {
              title: "Monthly forms",
              href: "/monthly-form",
            },
            {
              title: `Form ${id}`, // Dynamically set the breadcrumb title based on `id`
              href: `/monthly-form/approver-view/${id}/view`,
            },
          ],
        }}
        content={<><ViewMonthlyFormApprover id={id} setIsModalVisible={setIsModalVisible} /><ConfirmationModal isOpenModal={isModalVisible} closeModal={ () => setIsModalVisible(false)} /></>} // Pass `id` as a prop to the component
      />
    </>
  );
}
