import { Typography } from "antd";

import { titleStyle } from "../config/titleStyle";
import renderContent from "../lib/renderContent";

const { Title } = Typography;

interface VisionProps {
  data: string;
}

export default function Vision({ data }: VisionProps) {
  return (
    <>
      <Title level={2} style={titleStyle}>
        Our vision
      </Title>
      {renderContent(data)}
    </>
  );
}
