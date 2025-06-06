import React from "react";
import { Button } from "antd";
import styled from "@emotion/styled";
import { Flex, Space, Typography, Popconfirm } from "antd";
import { getCurrentUser } from "@aws-amplify/auth";
import useParameters from "@/entities/parameters/api/parameters-list";
import dayjs from "dayjs";
import { months } from "@/widgets/monthly-forms-list/config/projects";

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

  const [userId, setUserId] = React.useState<string | undefined>(undefined);
  const { parametersList } = useParameters({ condition: true });

  React.useEffect(() => {
    getCurrentUser()
      .then((user) => {
        setUserId(user.userId);
      })
      .catch((error) => {
        console.error("Failed to fetch user:", error);
      });
  }, []);

  const canShowEdit = (record: any) => {
    if (!parametersList?.monthlyFormStartDate) return false;
    const monthlyFormStartDate = Number(parametersList.monthlyFormStartDate);
    const today = dayjs();

    // Convert record.month (string) to number using months array
    let recordMonth = Number(record.month);
    if (isNaN(recordMonth)) {
      const found = months.find((m) => m.label === record.month);
      recordMonth = found ? found.value : -1;
    }
    const recordYear = Number(record.year);
    const currentMonth = today.month() + 1; // dayjs months are 0-indexed
    const currentYear = today.year();

    // Previous month logic (handle January edge case)
    let prevMonth = currentMonth - 1;
    let prevMonthYear = currentYear;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevMonthYear = currentYear - 1;
    }

    return (
      record.status !== "approved" &&
      record.status !== "submitted" &&
      record.facilitator === userId &&
      recordMonth === prevMonth &&
      recordYear === prevMonthYear &&
      today.date() < monthlyFormStartDate
    );
  };

  return columns.map((column) => ({
    ...column,
    render: (item: any, record: any, index: number) => {
      console.log(record);
      if (column.key === "actions") {
        return (
          <div>
            <Space>
              {canShowEdit(record) && (
                <_Button
                  type="link"
                  href={`/monthly-plans/my-plans/${record.id}/edit`}
                >
                  Edit
                </_Button>
              )}
              <_Button
                type="link"
                href={`/monthly-plans/my-plans/${record.id}/view`}
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
