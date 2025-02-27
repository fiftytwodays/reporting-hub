"use client";

import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Authenticator } from "@aws-amplify/ui-react";
import styled from "@emotion/styled";
import type { MenuProps } from "antd";
import useUserGroupList from "@/entities/user/api/user-group-list";

import { Avatar, Button, Dropdown, Layout, Menu, Spin, Typography } from "antd";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import { UserGroup } from "@/entities/user/config/types";
import { fetchAuthSession } from "aws-amplify/auth";

interface LayoutProps {
  children: React.ReactNode;
}

const { Text, Title } = Typography;

const layoutStyle = {
  padding: "0 2rem",
};

const defaultItems = [
  {
    key: "monthly-form",
    label: "null",
  },
  {
    key: "yearly-form",
    label: "null",
  },
  {
    key: "reports",
    label: "null",
  },
  {
    key: "settings",
    label: "null",
  },
  {
    key: "about-us",
    label: <Link href="/about-us">About us</Link>,
  },
];

const menuConfigurations = {
  monthlyForm: {
    key: "monthly-form",
    label: "Monthly form",
    children: [
      {
        key: "my-forms",
        label: <Link href="/monthly-form/my-forms">My forms</Link>,
      },
      {
        key: "approver-view",
        label: <Link href="/monthly-form/approver-view">Approver view</Link>,
      },
    ],
  },
  yearlyForm: {
    key: "yearly-form",
    label: "Yearly Plans",
    children: [
      {
        key: "my-forms",
        label: <Link href="/yearly-form/my-forms">My Yearly Plans</Link>,
      },
      {
        key: "reviewer-view",
        label: <Link href="/yearly-form/reviewer-view">Reviewer View</Link>,
      },
      {
        key: "approver-view",
        label: <Link href="/yearly-form/approver-view">Approver View</Link>,
      },
    ],
  },
  reports: {
    key: "reports",
    label: "Reports",
    children: [
      {
        key: "project-reports",
        label: <Link href="/reports/project-reports">Project reports</Link>,
      },
      {
        key: "miscellaneous-reports",
        label: (
          <Link href="/reports/miscellaneous-reports">
            Miscellaneous reports
          </Link>
        ),
      },
      {
        key: "reporting-status-report",
        label: (
          <Link href="/reports/reporting-status-reports">Monthly reports</Link>
        ),
      },
    ],
  },
  settings: {
    key: "settings",
    label: "Settings",
    children: [
      {
        key: "user",
        label: <Link href="/settings/user">User</Link>,
      },
      {
        key: "role",
        label: <Link href="/settings/roles">Roles</Link>,
      },
      {
        key: "region",
        label: <Link href="/settings/region">Region</Link>,
      },
      {
        key: "cluster",
        label: <Link href="/settings/cluster">Cluster</Link>,
      },
      {
        key: "project",
        label: <Link href="/settings/project">Project</Link>,
      },
      {
        key: "project-type",
        label: <Link href="/settings/project-type">Project type</Link>,
      },
      {
        key: "functional-area",
        label: <Link href="/settings/functional-area">Functional area</Link>,
      },
      {
        key: "organization",
        label: <Link href="/settings/organization">Organization</Link>,
      },
    ],
  },
};

const useMenuItems: MenuProps["items"] = [
  {
    key: "sign-out",
    label: "Sign out",
    icon: <LogoutOutlined />,
  },
];

const AppLayout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const menuName = pathname?.split("/")[1];
  const { data: userData } = useSWR(["user-details"], getCurrentUser);
  const { userGroupList, isUserGroupListLoading } = useUserGroupList({
    userName: userData?.signInDetails?.loginId,
  });

  // const abc = fetchAuthSession();

  const groupNames = userGroupList.map((group: UserGroup) => group.GroupName);

  const getMenuItems = () => {
    const updatedItems = [...defaultItems];

    if (groupNames.includes("admin")) {
      return updatedItems.map((item) => {
        switch (item.key) {
          case "settings":
            return menuConfigurations.settings;
          case "reports":
            return menuConfigurations.reports;
          case "monthly-form":
            return menuConfigurations.monthlyForm;
          case "yearly-form":
            return menuConfigurations.yearlyForm;
          default:
            return item;
        }
      });
    }

    if (groupNames.includes("report-viewer")) {
      return updatedItems.map((item) =>
        item.key === "reports" ? menuConfigurations.reports : item
      );
    }

    if (groupNames.includes("user")) {
      return updatedItems.map((item) =>
        item.key === "yearly-form" ? menuConfigurations.yearlyForm : item
      );
    }
    return updatedItems;
  };

  const handleMenuClick = async ({ key }: { key: string }) => {
    if (key === "sign-out") {
      await signOut();
      router.push("/login");
      mutate(["user-details"], null);
    }
  };

  return (
    <>
      <Authenticator hideSignUp={true}>
        {(!groupNames || groupNames.length == 0) && (
          <Spin tip="Loading, please wait" size="large" spinning fullscreen />
        )}
        {!(groupNames.length == 0) && (
          <Layout style={{ minHeight: "100vh" }}>
            <Header
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "2rem",
                padding: "2rem",
              }}
            >
              <Title level={4} style={{ margin: 0, color: "#fff" }}>
                Reporting Hub
              </Title>
              <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[menuName]}
                items={getMenuItems().filter((item) => item.label !== "null")}
                style={{ flex: 1, minWidth: 0 }}
              />
              <Dropdown
                menu={{
                  items: useMenuItems,
                  onClick: handleMenuClick,
                }}
                placement="bottomLeft"
                arrow
              >
                <Button
                  type="text"
                  icon={<_Avatar size="small" icon={<UserOutlined />} />}
                >
                  <Text style={{ color: "#fff" }}>
                    {userData?.signInDetails?.loginId}
                  </Text>
                </Button>
              </Dropdown>
            </Header>
            <Content style={layoutStyle}>{children}</Content>
            <Footer style={{ textAlign: "center" }}>
              Reporting hub ©{new Date().getFullYear()} Created by Fiftytwodays
            </Footer>
          </Layout>
        )}
      </Authenticator>
    </>
  );
};

const _Avatar = styled(Avatar)`
  background-color: #fde3cf;
  color: #f56a00;
`;

export default AppLayout;
