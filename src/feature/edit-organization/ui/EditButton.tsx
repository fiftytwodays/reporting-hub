import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

interface EditButtonProps {
  setIsEditing: (status: boolean) => void;
}

const EditButton: React.FC<EditButtonProps> = ({ setIsEditing }) => {
  return (
    <Button type="primary" onClick={() => setIsEditing(true)}>
      <EditOutlined /> Edit organization
    </Button>
  );
};

export default EditButton;
