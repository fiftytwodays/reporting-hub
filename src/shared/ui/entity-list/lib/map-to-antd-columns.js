import { Flex, Typography, Tooltip, Button } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";

const { Text } = Typography;

export default function mapToAntDColumns(columns) {
  return columns.map((column) => {
    if (column?.render) return column;

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
                      onClick={() => {}}
                      icon={<EditOutlined />}
                      type="link"
                    />
                  </Tooltip>
                );
              case "delete":
                return (
                  <Tooltip key="delete" title="Delete">
                    <Button
                      onClick={() => {}}
                      icon={<DeleteOutlined />}
                      type="link"
                    />
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
