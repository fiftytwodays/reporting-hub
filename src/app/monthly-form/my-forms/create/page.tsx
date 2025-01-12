"use client";

import { Amplify } from "aws-amplify";

import { message } from "antd";
import outputs from "@root/amplify_outputs.json";
import Page from "@/shared/ui/page/ui/Page";
import CreateMonthlyFormForm from "@/feature/create-monthly-form/ui/CreateMonthlyFormForm";

Amplify.configure(outputs);

export default function CreateMonthlyFormPage() {
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1, duration: 2 });
  return (
    <>
     {contextHolder}
    <Page
    showPageHeader
      header={{
        title: "Create monthly form",
        breadcrumbs: [
          {
            title: "Home",
            href: "/",
          },

          {
            title: "Monthly forms",
            href: "/monthly-form/create",
          },
        ],
      }}
      content={<CreateMonthlyFormForm messageApi={messageApi}/>}
    />
    </>
  );
}
