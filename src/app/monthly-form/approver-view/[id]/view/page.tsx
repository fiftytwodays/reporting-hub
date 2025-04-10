"use client";
import { Amplify } from "aws-amplify";
import outputs from "@root/amplify_outputs.json";
import ViewMonthlyFormPage from "@/feature/view-monthly-form-approver/ui/ViewMonthlyFormPage";
import { message } from "antd";
import Page from "@/shared/ui/page/ui/Page";
import { CreateMonthlyFormForm } from "@/feature/create-monthly-form";
import { useMonthlyForm } from "@/entities/monthly-form/api/get-monthlyForms";

Amplify.configure(outputs);

const MonthlyFormApproverPage = ({ params }: { params: { id: string } }) => {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 2,
  });
  const id = params.id;

  const { monthlyForm, isMonthlyFormLoading, isMonthlyFormError } =
    useMonthlyForm({ formId: id as string, condition: true });

  if (isMonthlyFormLoading) return <div>Loading...</div>;
  if (isMonthlyFormError) return <div>Error loading form</div>;

  return (
    <>
      {contextHolder}
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
              href: "/monthly-form/approver-view",
            },
          ],
        }}
        content={
          <CreateMonthlyFormForm
            action="approver-view"
            messageApi={messageApi}
            monthlyForm={monthlyForm}
          />
        }
      />
    </>
  );
};

export default MonthlyFormApproverPage;
