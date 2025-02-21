"use client";

import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Authenticator } from "@aws-amplify/ui-react";
import styled from "@emotion/styled";
import type { MenuProps } from "antd";
import { Avatar, Button, Dropdown, Layout, Menu, Typography } from "antd";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";

import { Content, Footer, Header } from "antd/lib/layout/layout";

interface LayoutProps {
  children: any;
}

const { Text, Title } = Typography;

const layoutStyle = {
  padding: "0 2rem",
};

const items = [
  {
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
    ]
  },
  {
    key: "yearly-form",
    label: "Yearly Form",
    children: [
      {
        key: "my-forms",
        label: <Link href="/yearly-form/my-forms">My Forms</Link>,
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
  {
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
          <Link href="/reports/reporting-status-reports">
            Monthly reports
          </Link>
        ),
      },
    ],
  },
  {
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
  {
    key: "about-us",
    label: <Link href="/about-us">About us</Link>,
  },
];

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

  const handleMenuClick = async ({ key }: { key: string }) => {
    if (key === "sign-out") {
      await signOut();
      router.push("/login");
      mutate(["user-details"], null);
    }
  };

  return (
    <Authenticator>
      <Layout className="" style={{ minHeight: "100vh" }}>
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
            items={items}
            style={{
              flex: 1,
              minWidth: 0,
            }}
          />
          {userData ? (
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
          ) : (
            <Link href="/login">
              <Button
                type="text"
                icon={<_Avatar size="small" icon={<UserOutlined />} />}
              >
                <Text style={{ color: "#fff" }}>Sign in</Text>
              </Button>
            </Link>
          )}
        </Header>
        <Content style={layoutStyle}>{children}</Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Reporting hub ©{new Date().getFullYear()} Created by Fiftytwodays
        </Footer>
      </Layout>
    </Authenticator>
  );
};

const _Avatar = styled(Avatar)`
  background-color: #fde3cf;
  color: #f56a00;
`;

export default AppLayout;
