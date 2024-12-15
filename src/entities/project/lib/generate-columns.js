import { Button } from "antd";
import styled from "@emotion/styled";
import { Flex, Space, Typography, Popconfirm } from "antd";

export default function generateColumns(
  columns,
  handleDelete,
  handleEdit
) {

  const { Text } = Typography;

  return columns.map((column) => ({
    ...column,
    // title: getColumnTitle(column, data),
    render: (item) => {
      if (column.key === "actions") {
        return (
          <div>
            <Space>
            <_Button type="link" onClick={() => handleEdit(item)}>Edit</_Button>
            <Popconfirm
              placement="bottomRight"
              title="Are you sure you want to delete the project?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(item)}
            >
              <_Button type="link" danger>Delete</_Button>
            </Popconfirm>
            </Space>
          </div>
        );
      }
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
