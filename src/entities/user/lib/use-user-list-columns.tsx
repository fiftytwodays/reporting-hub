import { useState } from "react";
import { Button, Tooltip, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  CheckOutlined,
} from "@ant-design/icons";

import { Column } from "@/shared/ui/entity-list/config/types";
import { User } from "../config/types";

interface UseUserListColumnsResult {
  userListColumns: Column[];
  selectedRecord: User | undefined;
  setIsUserResetPasswordOpen?: (value: boolean) => void;
  onDeleteAction?: (userName?: string) => void;
  onDisableAction?: (userName?: string) => void;
  onEnableAction?: (userName?: string) => void;
}

export const useUserListColumns = (
  columns: Column[],
  setIsUserViewOpen: (value: boolean) => void,
  setIsUserEditOpen: (value: boolean) => void,
  setIsUserResetPasswordOpen: (value: boolean) => void,
  onDeleteAction: (userName?: string) => void,
  onDisableAction: (userName?: string) => void,
  onEnableAction: (userName?: string) => void
): UseUserListColumnsResult => {
  const [selectedRecord, setSelectedRecord] = useState<User | undefined>();

  const userListColumns = columns.map((column: Column) => {
    let updatedColumn = { ...column };

    if (column.actions) {
      updatedColumn.render = (record: User) => {
        return (
          <>
            {column.actions && column.actions.includes("view") && (
              <Tooltip title="View">
                <Button
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={() => {
                    setIsUserViewOpen(true);
                    setSelectedRecord(record);
                  }}
                />
              </Tooltip>
            )}
            {column.actions && column.actions.includes("edit") && (
              <Tooltip title="Edit">
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setIsUserEditOpen(true);
                    setSelectedRecord(record);
                  }}
                />
              </Tooltip>
            )}
            {column.actions && column.actions.includes("delete") && (
              <Tooltip title="Delete">
                <Popconfirm
                  title="Are you sure you want to delete this user?"
                  onConfirm={() => onDeleteAction(record.Username)}
                  okText="Yes"
                  cancelText="No"
                  placement="left"
                >
                  <Button type="link" icon={<DeleteOutlined />} />
                </Popconfirm>
              </Tooltip>
            )}
            {column.actions &&
              column.actions.length > 0 &&
              ["disable", "enable"].some((action) =>
                column.actions?.includes(action)
              ) && (
                <Tooltip
                  key={record?.Enabled ? "disable" : "enable"}
                  title={record?.Enabled ? "Disable User" : "Enable User"}
                >
                  <Popconfirm
                    title={`Are you sure you want to ${
                      record?.Enabled ? "disable" : "enable"
                    } this user?`}
                    onConfirm={() =>
                      record?.Enabled
                        ? onDisableAction(record.Username)
                        : onEnableAction(record.Username)
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
                      danger={record?.Enabled}
                    />
                  </Popconfirm>
                </Tooltip>
              )}
          </>
        );
      };
    }

    return updatedColumn;
  });

  return {
    userListColumns,
    selectedRecord,
    setIsUserResetPasswordOpen,
    onDeleteAction,
    onDisableAction,
    onEnableAction,
  };
};
