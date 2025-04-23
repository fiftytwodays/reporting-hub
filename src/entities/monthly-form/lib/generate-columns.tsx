import React from "react";
import { Button } from "antd";
import styled from "@emotion/styled";
import { Flex, Space, Typography, Popconfirm } from "antd";

interface Column<T = any> {
  key?: string | undefined;
  title: string;
  type?: string;
  dataIndex?: string | number | symbol | undefined;
  hidden?: boolean;
  dataType?: string;
  copyable?: boolean;
  render?: (value: any, record: any, index: number) => React.ReactNode;
}

export default function generateColumns<T>(
  columns: Column<any>[]
): Column<T>[] {
  const { Text } = Typography;

  return columns.map((column) => ({
    ...column,
    render: (item: any, record: any, index: number) => {
      console.log(record);
      if (column.key === "actions") {
        return (
          <div>
            <Space>
              {record.status !== "approved" &&
                record.status !== "submitted" && (
                  <_Button
                    type="link"
                    href={`/monthly-form/my-forms/${record.id}/edit`}
                  >
                    Edit
                  </_Button>
                )}
              <_Button
                type="link"
                href={`/monthly-form/my-forms/${record.id}/view`}
              >
                View
              </_Button>
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
            <Typography.Text>{item[0]}</Typography.Text>
            <Typography.Text>{item[1]}</Typography.Text>
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

export const _Text = styled(Typography.Text)<{ copyable?: boolean }>`
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
