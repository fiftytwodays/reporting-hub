import React, { useState, useEffect } from "react";
import { Button } from "antd";
import styled from "@emotion/styled";
import { Flex, Space, Typography, Popconfirm } from "antd";
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';


interface Column<T = any> {
  key?: string | undefined;
  title: string;
  type?: string;
  dataIndex?: string | number | symbol | undefined;
  hidden?: boolean;
  dataType?: string;
  copyable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

export default function generateColumns<T>(
  columns: Column<any>[],
  handleDelete: (item: T) => void,
  handleEdit: (item: T) => void,
  handleView: (item: T) => void,
  type: string,
  userId: string
): Column<T>[] {
  const { Text } = Typography;
  // const [userIdTest, setUserId] = useState<string>("");

  // useEffect(() => {
  //     const fetchUser = async () => {
  //       try {
  //         const { userId } = await getCurrentUser();
  //         setUserId(userId);
  //       } catch (error) {
  //         console.error("Error fetching user:", error);
  //       }
  //     };
  //     fetchUser();
  //   }, []);


  return columns.map((column) => ({
    ...column,
    render: (item: any) => {
      if (column.key === "actions") {
        return userId != "" && (
          <div>
            <Space>
            <_Button type="link" onClick={() => handleView(item)}>
                  View
                </_Button>
              {(type === "myforms") ? (
                (item.status === "approved" && item.userId === userId) ? (
                  <Popconfirm
                    placement="bottomRight"
                    title="The yearly plan has already been approved. Are you sure you want to edit it?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => handleEdit(item)}
                  >
                    <_Button type="link">
                      Edit
                    </_Button>

                  </Popconfirm>
                ) : (((item.status === "draft" || item.status === "resent") && item.userId === userId) ? (<_Button type="link" onClick={() => handleEdit(item)}>
                  Edit
                </_Button>) : null
                )

              ) : null}
              {(type === "myforms") && (item.userId === userId) && (
                <Popconfirm
                  placement="bottomRight"
                  title="Are you sure you want to delete the Yearly Plan?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleDelete(item)}
                >
                  <_Button type="link" danger>
                    Delete
                  </_Button>

                </Popconfirm>
              )}
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

export const _Text = styled(Typography.Text) <{ copyable?: boolean }>`
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
