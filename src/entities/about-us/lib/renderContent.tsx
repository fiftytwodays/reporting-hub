import { Typography } from "antd";

import { contentStyle } from "../config/contentStyle";
import { listStyle } from "../config/listStyle";

const { Paragraph } = Typography;

const renderContent = (text: string) => {
  const isOrderedList = /^\d+\./.test(text.trim());

  if (isOrderedList) {
    const listItems = text
      .split("\n")
      .map((item, index) => (
        <li key={index}>{item.replace(/^\d+\.\s*/, "")}</li>
      ));

    return <ol style={listStyle}>{listItems}</ol>;
  } else {
    return <Paragraph style={contentStyle}>{text}</Paragraph>;
  }
};

export default renderContent;
