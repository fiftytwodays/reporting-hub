import styled from "@emotion/styled";
import { Flex, Space, Typography } from "antd";
import { Button } from 'antd';

import Image from "next/image";

const getColumnTitle = (column) => {
  if (column?.isLogoVisible && column?.logoURL) {
    return (
      <Flex justify="center">
        <Image src={column?.logoURL} alt="Logo" width={70} height={70} />
      </Flex>
    );
  } else return column?.title;
};

const { Text } = Typography;

export default function mapToAntDColumns(columns, data) {
  return columns.map((column) => ({
    ...column,
    title: getColumnTitle(column, data),
    render: (item) => {
      // if (column.key === "actions") {
      //   return (
      //     <div>
      //       <Space>
      //       <_Button type="link" onClick={() => handleEdit(record)}>Edit</_Button>
      //       <_Button type="link" danger onClick={() => handleDelete(record)}>Delete</_Button>
      //       </Space>
      //     </div>
      //   );
      // }
      if (column?.type === "break") {
        return (
          <Flex justify="center">
            <VerticalText>Break</VerticalText>
          </Flex>
        );
      } else if (!item) {
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
  }));
}

export const _Text = styled(Text)`
  display: ${(props) => (props.copyable ? "flex !important" : "")};
  width: 90%;
  .ant-typography-copy {
    margin-left: auto;
  }
`;

const VerticalText = styled.div`
  text-transform: uppercase;
  letter-spacing: 3px;
`;

const _Button = styled(Button)`
  padding: 0;
  margin: 0;
`;