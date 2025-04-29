"use client";

import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Authenticator } from "@aws-amplify/ui-react";
import styled from "@emotion/styled";
import type { MenuProps } from "antd";
import useUserGroupList from "@/entities/user/api/user-group-list";

import { Avatar, Button, Dropdown, Layout, Menu, Spin, Typography } from "antd";
import {
  fetchUserAttributes,
  FetchUserAttributesOutput,
  getCurrentUser,
  signOut,
} from "aws-amplify/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import { UserGroup } from "@/entities/user/config/types";
import { fetchAuthSession } from "aws-amplify/auth";
import { useEffect, useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const { Text, Title } = Typography;

const layoutStyle = {
  padding: "0 2rem",
};

const defaultItems = [
  {
    key: "monthly-plans",
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
    key: "monthly-plans",
    label: "Monthly plans",
    children: [
      {
        key: "my-plans",
        label: <Link href="/monthly-plans/my-plans">My plans</Link>,
      },
      {
        key: "approver-view",
        label: <Link href="/monthly-plans/approver-view">Approver view</Link>,
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
      // {
      //   key: "project-reports",
      //   label: <Link href="/reports/project-reports">Project reports</Link>,
      // },
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
      {
        key: "parameters",
        label: <Link href="/settings/parameters">Parameters</Link>,
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

  const { data: userData, error: userError } = useSWR(
    ["user-details"],
    getCurrentUser
  );

  // State to store user attributes
  const [attributes, setAttributes] =
    useState<FetchUserAttributesOutput | null>(null);
  const [loadingAttributes, setLoadingAttributes] = useState<boolean>(false);

  const { userGroupList, isUserGroupListLoading } = useUserGroupList({
    userName: userData?.signInDetails?.loginId,
  });

  const groupNames = userGroupList.map((group: UserGroup) => group.GroupName);

  // Check if the user is logged in and fetch attributes if necessary
  useEffect(() => {
    if (userData) {
      const fetchAttributes = async () => {
        try {
          setLoadingAttributes(true);
          const userAttributes = await fetchUserAttributes();
          setAttributes(userAttributes);
        } catch (error) {
          console.error("Error fetching user attributes", error);
        } finally {
          setLoadingAttributes(false);
        }
      };
      fetchAttributes();
    }
  }, [userData]); // Trigger when userData changes

  const isLoading =
    isUserGroupListLoading || !userData || loadingAttributes || userError;

  const getMenuItems = () => {
    const updatedItems = [...defaultItems];

    if (groupNames.includes("admin")) {
      return updatedItems.map((item) => {
        switch (item.key) {
          case "settings":
            return menuConfigurations.settings;
          case "reports":
            return menuConfigurations.reports;
          case "monthly-plans":
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
      return updatedItems.map((item) => {
        switch (item.key) {
          case "monthly-plans":
            return menuConfigurations.monthlyForm;
          case "yearly-form":
            return menuConfigurations.yearlyForm;
          default:
            return item;
        }
      });
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
        {isLoading && (
          <Spin tip="Loading, please wait" size="large" spinning fullscreen />
        )}
        {!isLoading && (
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
            <Content style={layoutStyle}>
              {pathname === "/" ? (
                <div style={{ padding: "2rem" }}>
                  <Title level={2}>
                    Welcome back, {attributes?.given_name ?? ""}{" "}
                    {attributes?.family_name ?? ""}!
                  </Title>
                </div>
              ) : (
                children
              )}
            </Content>
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
