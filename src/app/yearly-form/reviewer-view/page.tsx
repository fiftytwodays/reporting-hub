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

export default function ReviewerView() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1, duration: 2 });
  return (
    <>
     {contextHolder}
    <Page
    showPageHeader
      header={{
        title: "Reviewer view",
        breadcrumbs: [
          {
            title: "Home",
            href: "/",
          },

          {
            title: "Reviewer view",
            href: "/yearly-form/reviewer-view",
          },
        ],
        // extra: <Button onClick={() => router.push("/yearly-form/create") } type="primary" icon={<PlusOutlined />} > Create Yearly Form  </Button>,
        // extra: <Button onClick={() => router.push("/yearly-form/new-my-form") } type="primary" icon={<PlusOutlined />} > Create Yearly Form  </Button>,
      }}
      content={<MyFormsList type="reviewer"/>}
    />
    </>
  );
}
