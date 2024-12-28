export interface Column {
  key?: string;
  title: string;
  dataIndex?: string | undefined;
  hidden?: boolean;
  render?: (params: any) => any;
  actions?: String[];
  onViewAction?: (params: any) => any;
  onEditAction?: (params: any) => any;
  onDeleteAction?: (params: any) => any;
  onResetPasswordAction?: (params: any) => any;
  onDisableAction?: (params: any) => any;
  onEnableAction?: (params: any) => any;
}
