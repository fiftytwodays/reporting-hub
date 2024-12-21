import { Column } from "@/shared/ui/entity-list/config/types";
import { useState } from "react";

interface UseUserListColumnsResult {
  userListColumns: Column[];
  selectedRecord: any;
}

export const useUserListColumns = (
  columns: Column[],
  setIsModalOpen: (value: boolean) => any
): UseUserListColumnsResult => {
  const [selectedRecord, setSelectedRecord] = useState("");
  const userListColumns = columns.map((column: Column) => {
    if (column?.actions?.includes("view")) {
      return {
        ...column,
        onViewAction: (record) => {
          setIsModalOpen(true);
          setSelectedRecord(record);
        },
      };
    }

    return column;
  });
  return {
    userListColumns,
    selectedRecord,
  };
};
