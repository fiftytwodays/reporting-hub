import Head from "next/head";
import { Breadcrumb, Col, Row, Typography, theme } from "antd";
import { ReactNode } from "react";
const { Title } = Typography;
import styled from "@emotion/styled";

interface HeaderProps {
  breadcrumbs?: { href: string; title: string; menu?: { items: { key: string; label: string}[] } }[];
  title?: string;
  extra?: ReactNode;
}

interface PageProps {
  content?: ReactNode;
  showPageHeader?: boolean;
  header?: HeaderProps;
}

export default function Page({
  content = <div />,
  showPageHeader = false,
  header = {},
}: PageProps) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <_Page>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {showPageHeader && (
        <PageHeader>
          <Row justify="space-between">
            <Col>
              <Breadcrumb items={header.breadcrumbs || []} />
              <_Title level={4}>{header?.title}</_Title>
            </Col>
            {header?.extra && <Col>{header?.extra}</Col>}
          </Row>
        </PageHeader>
      )}
      <PageContent
        style={{
          background: colorBgContainer,
          minHeight: 280,
          padding: 24,
          borderRadius: borderRadiusLG,
        }}
      >
        {content}
      </PageContent>
    </_Page>
  );
}

const _Page = styled.div`
  min-height: calc(100vh - 290px);
  margin: 0 2rem;
`;

const PageHeader = styled.div`
  padding-top: 12px;
`;

const _Title = styled(Title)`
  margin-block-start: 7px;
`;

const PageContent = styled.div`
  padding: 24px;
`;
