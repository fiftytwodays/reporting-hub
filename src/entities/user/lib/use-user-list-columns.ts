import { useState } from "react";
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
    const updatedColumn = { ...column };

    if (column?.actions?.includes("view")) {
      updatedColumn.onViewAction = (record: User) => {
        setIsUserViewOpen(true);
        setSelectedRecord(record);
      };
    }

    if (column?.actions?.includes("edit")) {
      updatedColumn.onEditAction = (record: User) => {
        setIsUserEditOpen(true);
        setSelectedRecord(record);
      };
    }

    if (column?.actions?.includes("delete")) {
      updatedColumn.onDeleteAction = (record: User) => {
        onDeleteAction(record?.Email);
      };
    }

    if (column?.actions?.includes("reset-password")) {
      updatedColumn.onResetPasswordAction = (record: User) => {
        setIsUserResetPasswordOpen(true);
        setSelectedRecord(record);
      };
    }

    if (column?.actions?.includes("disable")) {
      updatedColumn.onDisableAction = (record: User) => {
        onDisableAction(record?.Email);
      };
    }

    if (column?.actions?.includes("enable")) {
      updatedColumn.onEnableAction = (record: User) => {
        onEnableAction(record?.Email);
      };
    }

    return updatedColumn;
  });

  return {
    userListColumns,
    selectedRecord,
  };
};
