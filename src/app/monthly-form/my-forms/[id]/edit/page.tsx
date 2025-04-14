"use client";
import { Amplify } from "aws-amplify";
import outputs from "@root/amplify_outputs.json";
import EditMonthlyFormPage from "@/feature/edit-monthly-form/ui/EditMonthlyFormPage";
import { useRouter } from "next/router";
import { useMonthlyForm } from "@/entities/monthly-form/api/get-monthlyForms";
import { CreateMonthlyFormForm } from "@/feature/create-monthly-form";
import { message } from "antd";
import Page from "@/shared/ui/page/ui/Page";

Amplify.configure(outputs);

const EditMonthlyForm = ({ params }: { params: { id: string } }) => {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 2,
  });
  const id = params.id;

  const { monthlyForm, isMonthlyFormLoading, isMonthlyFormError } =
    useMonthlyForm({ formId: id as string, condition: true });

  return (
    <>
      {contextHolder}
      <Page
        showPageHeader
        header={{
          title: "Edit monthly form",
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
            action="edit"
            messageApi={messageApi}
            monthlyForm={monthlyForm}
          />
        }
      />
    </>
  );
};

export default EditMonthlyForm;
