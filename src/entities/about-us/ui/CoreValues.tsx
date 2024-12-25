import { Typography } from "antd";

import { titleStyle } from "../config/titleStyle";
import renderContent from "../lib/renderContent";

const { Title } = Typography;

interface CoreValuesProps {
  data: string;
}

export default function CoreValues({ data }: CoreValuesProps) {
  return (
    <>
      <Title level={2} style={titleStyle}>
        Core values
      </Title>
      {renderContent(data)}
    </>
  );
}
