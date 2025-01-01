"use client";

import { Amplify } from "aws-amplify";

import { message } from "antd";
import Page from "@/shared/ui/page/ui/Page";
// import { CreateYearlyFormModal } from "@/feature/create-yearly-form";
import { MyFormsList } from "@/widgets/myforms-list";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {  useRouter } from "next/navigation";

import outputs from "@root/amplify_outputs.json";
Amplify.configure(outputs);

export default function MyForms() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1, duration: 2 });
  return (
    <>
     {contextHolder}
    <Page
    showPageHeader
      header={{
        title: "Approver View",
        breadcrumbs: [
          {
            title: "Home",
            href: "/",
          },

          {
            title: "Approver View",
            href: "/yearly-form/approver-view",
          },
        ],
      }}
      content={<MyFormsList />}
    />
    </>
  );
}
