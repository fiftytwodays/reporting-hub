import type {
  SorterResult,
  TablePaginationConfig,
} from "antd/lib/table/interface";
import React from "react";
import { Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import styled from "@emotion/styled";

import mapToAntDColumns from "../lib/map-to-antd-columns";
import { Project } from "@/entities/project/config/types";

interface Column<T = any> {
  key: string;
  title: string;
  type?: string;
  dataIndex?: string;
  hidden?: boolean;
  dataType?: string;
  copyable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

interface EntityListProps {
  componentRef?: React.RefObject<HTMLDivElement> | null;
  columns?: Column[];
  mapColumn?: (columns: Column[]) => Column<any>[];
  data?: any[];
  rowKey?: string;
  totalCount?: number;
  pageNo?: number;
  setPageNo?: (page: number) => void;
  pageSize?: number;
  setPageSize?: (size: number) => void;
  setSort?: (sortValue: string | undefined) => void;
  toolbarExtensions?: React.ReactNode[];
  showToolbar?: boolean;
  isPaginationVisible?: boolean;
  isRowSelectionVisible?: boolean;
  isBordered?: boolean;
  isLoading?: boolean;
  title?: string;
  isEditable?: boolean;
  components?: any;
}

const EntityList: React.FC<EntityListProps> = ({
  componentRef = null,
  columns = [],
  mapColumn = mapToAntDColumns,
  data = [],
  rowKey = "id",
  totalCount = 0,
  pageNo = 1,
  setPageNo = () => {},
  pageSize = 10,
  setPageSize = () => {},
  setSort = () => {},
  toolbarExtensions = [],
  showToolbar = false,
  isPaginationVisible = false,
  isRowSelectionVisible = false,
  isBordered = false,
  isLoading = false,
  title = "",
  isEditable = false,
  components = false,
}) => {
  const visibleColumns = columns.filter((column) => !column?.hidden);
  const setSortValue = (sorter: SorterResult<any>) => {
    let sortField: string | undefined;

    if (Array.isArray(sorter.field)) {
      sortField = sorter.field.join(".");
    } else if (typeof sorter.field === "string") {
      sortField = sorter.field;
    } else {
      sortField = undefined;
    }

    const sortValue = sorter.order
      ? sorter.order === "descend"
        ? `-${sortField}`
        : sortField
      : undefined;

    setSort(sortValue);
  };

  return (
    <>
      {showToolbar && (
        <TableToolbar>
          <Space size="middle">
            <>
              {toolbarExtensions.map((extension, idx) => (
                <Extension key={idx}>{extension}</Extension>
              ))}
            </>
          </Space>
        </TableToolbar>
      )}
      <div ref={componentRef}>
        <Table
          title={() => title}
          loading={isLoading}
          bordered={isBordered}
          columns={mapColumn(visibleColumns)} // mapToAntDColumns is assumed to be defined elsewhere
          dataSource={data}
          rowKey={rowKey}
          rowSelection={
            isRowSelectionVisible
              ? {
                  type: "checkbox",
                }
              : undefined
          }
          onChange={(
            pagination: TablePaginationConfig,
            _,
            sorter: SorterResult<any> | SorterResult<any>[],
          ) => {
            setSortValue(sorter as SorterResult<any>);
            setPageNo((pagination.current || 1) - 1);
          }}
          pagination={
            isPaginationVisible
              ? {
                  total: totalCount,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "15", "20", "25"],
                  pageSize,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                  onShowSizeChange: (_, size) => setPageSize(size),
                  current: pageNo + 1,
                }
              : false
          }
          scroll={{ x: 1 }}
          components={isEditable ? components : undefined}
        />
      </div>
    </>
  );
};

export default EntityList;

const Extension = styled.div``;

const TableToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
`;