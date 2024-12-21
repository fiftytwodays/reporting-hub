export interface Column {
  key?: string;
  title: string;
  dataIndex?: string | undefined;
  hidden?: boolean;
  render?: (params: any) => any;
  actions?: String[];
  onViewAction?: (params: any) => any;
}
