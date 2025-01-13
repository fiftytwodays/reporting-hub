import { Flex, Typography } from "antd";

import styled from "@emotion/styled";

const { Text } = Typography;

export default function mapToAntDColumns(columns) {
  return columns.map((column) => {
    if (column?.render) return column;

    return {
      ...column,
      render: (item) => {
        if (!item) {
          return "---";
        }

        if (column?.dataType === "array") {
          return (
            <Flex gap="middle" vertical>
              <Text>{item && item[0]}</Text>
              <Text>{item && item[1]}</Text>
            </Flex>
          );
        }
        if (column?.copyable) {
          return (
            <_Text copyable ellipsis={{ tooltip: item }}>
              {item}
            </_Text>
          );
        } else {
          return item;
        }
      },
      ellipsis: true,
    };
  });
}

export const _Text = styled(Text)`
  display: ${(props) => (props.copyable ? "flex !important" : "")};
  width: 90%;
  .ant-typography-copy {
    margin-left: auto;
  }
`;
