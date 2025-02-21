import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

interface EditButtonProps {
  setIsEditing: (status: boolean) => void;
  isEnabled: boolean;
}

const EditButton: React.FC<EditButtonProps> = ({ setIsEditing, isEnabled }) => {
  return (
    <Button type="primary" onClick={() => setIsEditing(true)} disabled={!isEnabled}>
      <EditOutlined /> Edit organization
    </Button>
  );
};

export default EditButton;
