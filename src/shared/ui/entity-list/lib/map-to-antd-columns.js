import { Flex, Typography, Tooltip, Button, Popconfirm, List } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  StopOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";

const { Text } = Typography;

export default function mapToAntDColumns(columns) {
  return columns.map((column) => {
    return {
      ...column,
      render: (item, record) => {
        if (!item) {
          return "---";
        }

        if (column?.actions?.length > 0) {
          const actionButtons = column.actions.map((action) => {
            switch (action) {
              case "view":
                return (
                  <Tooltip key="view" title="View Details">
                    <Button
                      onClick={() => column?.onViewAction(record)}
                      icon={<EyeOutlined />}
                      type="link"
                    />
                  </Tooltip>
                );
              case "edit":
                return (
                  <Tooltip key="edit" title="Edit Details">
                    <Button
                      onClick={() => column?.onEditAction(record)}
                      icon={<EditOutlined />}
                      type="link"
                    />
                  </Tooltip>
                );
              case "delete":
                return (
                  <Tooltip key="delete" title="Delete">
                    <Popconfirm
                      title="Delete this user?"
                      description="Are you sure to delete this user?"
                      onConfirm={() => column?.onDeleteAction(record)}
                      // onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                      placement="left"
                    >
                      <Button icon={<DeleteOutlined />} type="link" danger />
                    </Popconfirm>
                  </Tooltip>
                );

              case "reset-password":
                return (
                  <Tooltip key="reset-password" title="Reset Password">
                    <Button
                      onClick={() => column?.onResetPasswordAction(record)}
                      icon={<LockOutlined />}
                      type="link"
                    />
                  </Tooltip>
                );
              case "disable" || "enable":
                return (
                  <Tooltip
                    key={record?.Enabled ? "disable" : "enable"}
                    title={record?.Enabled ? "Disable User" : "Enable User"}
                  >
                    <Popconfirm
                      title={`Are you sure you want to ${
                        record?.Enabled ? "disable" : "enable"
                      } this record?`}
                      onConfirm={() =>
                        record?.Enabled
                          ? column?.onDisableAction(record)
                          : column?.onEnableAction(record)
                      }
                      okText="Yes"
                      cancelText="No"
                      placement="left"
                    >
                      <Button
                        icon={
                          record.Enabled ? <StopOutlined /> : <CheckOutlined />
                        }
                        type="link"
                      />
                    </Popconfirm>
                  </Tooltip>
                );
              default:
                return null;
            }
          });

          return <Flex gap="small">{actionButtons}</Flex>;
        }

        if (column?.dataType === "array") {
          return (
            <List
              size="small"
              dataSource={item}
              renderItem={(tag) => <List.Item style={{ padding: '0px' }}>{tag}</List.Item>}
            />
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
