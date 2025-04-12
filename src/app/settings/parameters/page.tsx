"use client";

import { Amplify } from "aws-amplify";

import Page from "@/shared/ui/page/ui/Page";
import { ParametersList as ParamList } from "@/widgets/parameters-list";
import outputs from "@root/amplify_outputs.json";
import { message } from "antd";
import { useState } from "react";
import { EditButton } from "@/feature/edit-parameter";

Amplify.configure(outputs);

export default function ParametersList() {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 2,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <>
      {contextHolder}
      <Page
        showPageHeader
        header={{
          title: "Parameters",
          breadcrumbs: [
            {
              title: "Home",
              href: "/",
            },

            {
              title: "Parameters",
              href: "/settings/parameters",
            },
          ],
          extra: (
            <EditButton setIsEditing={setIsEditing} isEnabled={isEnabled} />
          ),
        }}
        content={
          <ParamList
            setIsEnabled={setIsEnabled}
            setIsEditing={setIsEditing}
            isEditing={isEditing}
          />
        }
      />
    </>
  );
}
