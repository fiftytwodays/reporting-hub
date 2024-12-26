import { Typography } from "antd";

import { titleStyle } from "../config/titleStyle";
import renderContent from "../lib/renderContent";

const { Title } = Typography;

interface HistoryProps {
  orgName: string;
  data: string;
}

export default function History({ orgName, data }: HistoryProps) {
  return (
    <>
      <Title level={2} style={titleStyle}>
        History of {orgName}
      </Title>
      {renderContent(data)}
    </>
  );
}
