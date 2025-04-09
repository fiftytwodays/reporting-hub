"use client";
import ViewMonthlyFormPage from "@/feature/view-monthly-form/ui/ViewMonthlyFormPage";
import { Amplify } from "aws-amplify";
import outputs from "@root/amplify_outputs.json";
import { CreateMonthlyFormForm } from "@/feature/create-monthly-form";
import Page from "@/shared/ui/page/ui/Page";
import { useMonthlyForm } from "@/entities/monthly-form/api/get-monthlyForms";
import { message } from "antd";

Amplify.configure(outputs);

const MonthlyFormPage = ({ params }: { params: { id: string } }) => {
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
              href: "/monthly-form/my-forms",
            },
          ],
        }}
        content={
          <CreateMonthlyFormForm
            action="view"
            messageApi={messageApi}
            monthlyForm={monthlyForm}
          />
        }
      />
    </>
  );
};

export default MonthlyFormPage;
