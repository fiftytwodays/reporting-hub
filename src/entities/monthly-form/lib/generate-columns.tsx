import React from "react";
import { Button } from "antd";
import styled from "@emotion/styled";
import { Flex, Space, Typography, Popconfirm } from "antd";
import { MonthlyForm } from "../config/types";

interface Column<T = any> {
  key: string;
  title: string;
  type?: string;
  dataIndex?: string;
  hidden?: boolean;
  dataType?: string;
  copyable?: boolean;
  render?: (value: any, record: any, index: number) => React.ReactNode;
}

export default function generateColumns<T>(
  columns: Column[],
  handleView: (item: MonthlyForm) => void,
  handleEdit: (item: MonthlyForm) => void
): Column<T>[] {
  const { Text } = Typography;

  return columns.map((column) => ({
    ...column,
    render: (item: any, record: any) => {
      if (column.key === "actions") {
        return (
          <div>
            <Space>
              {record.status !== "Approved" && (
                <_Button type="link" onClick={() => handleEdit(record)}>
                  Edit
                </_Button>
              )}
              <_Button type="link" onClick={() => handleView(record)}>
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
