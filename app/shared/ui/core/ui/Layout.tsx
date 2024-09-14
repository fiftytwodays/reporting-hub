"use client";

import React from "react";
import { Layout, Menu } from "antd";
import Link from "next/link";
import Router, { usePathname } from "next/navigation";

import { Header, Content, Footer } from "antd/lib/layout/layout";
import Title from "antd/es/typography/Title";
interface LayoutProps {
  children: any;
}

const layoutStyle = {
  borderRadius: 8,
  overflow: "hidden",
  width: "calc(50% - 8px)",
  maxWidth: "calc(50% - 8px)",
};

const items = [
  {
    key: "monthly-form",
    label: <Link href="/monthly-form">Monthly form</Link>,
  },
  {
    key: "yearly-form",
    label: <Link href="/yearly-form">Yearly form</Link>,
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
          <Link href="/reports/reporting-status-report">
            Reporting status report
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
    ],
  },
];

const AppLayout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const menuName = pathname?.split("/")[1];
  return (
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
      </Header>
      <Content>{children}</Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        Reporting hub ©{new Date().getFullYear()} Created by Fiftytwodays
      </Footer>
    </Layout>
  );
};

export default AppLayout;
