import { Typography } from "antd";

import { titleStyle } from "../config/titleStyle";
import renderContent from "../lib/renderContent";
import { Organization } from "@/entities/organization/config/types";

const { Title } = Typography;

interface OtherDetailsProps {
  data: Organization | undefined;
}

export default function OtherDetails({ data }: OtherDetailsProps) {
  return (
    <>
      <Title level={2} style={titleStyle}>
        Our vision
      </Title>
      {renderContent(data?.vision??"")}
      <Title level={2} style={titleStyle}>
        Our mission
      </Title>
      {renderContent(data?.mission??"")}
      <Title level={2} style={titleStyle}>
        Core values
      </Title>
      {renderContent(data?.coreValues??"")}
    </>
  );
}
