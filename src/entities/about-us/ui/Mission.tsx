import { Typography } from "antd";

import { titleStyle } from "../config/titleStyle";
import renderContent from "../lib/renderContent";

const { Title } = Typography;

interface MissionProps {
  data: string;
}

export default function Mission({ data }: MissionProps) {
  return (
    <>
      <Title level={2} style={titleStyle}>
        Our mission
      </Title>
      {renderContent(data)}
    </>
  );
}
