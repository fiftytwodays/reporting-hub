export interface Column<T = any> {
  key?: string;
  title: string;
  dataIndex?: keyof T | undefined;
  hidden?: boolean;
  render?: (params: T) => any;
  actions?: string[];
  onViewAction?: (params: T) => any;
  onEditAction?: (params: T) => any;
  onDeleteAction?: (params: T) => any;
  onResetPasswordAction?: (params: T) => any;
  onDisableAction?: (params: T) => any;
  onEnableAction?: (params: T) => any;
}
