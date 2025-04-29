"use client";

import { Amplify } from "aws-amplify";

import { message } from "antd";
import outputs from "@root/amplify_outputs.json";
import Page from "@/shared/ui/page/ui/Page";
import { MonthlyFormsList } from "@/widgets/monthly-forms-list";
import { CreateMonthlyFormButton } from "@/feature/create-monthly-form";

Amplify.configure(outputs);

export default function MonthlyFormList() {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 2,
  });
  return (
    <>
      {contextHolder}
      <Page
        showPageHeader
        header={{
          title: "Monthly plans",
          breadcrumbs: [
            {
              title: "Home",
              href: "/",
            },

            {
              title: "Monthly plans",
              href: "/monthly-plans",
            },
          ],
          extra: <CreateMonthlyFormButton />,
        }}
        content={<MonthlyFormsList />}
      />
    </>
  );
}
