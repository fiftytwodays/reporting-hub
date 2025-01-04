import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function CreateMonthlyFormButton() {
  return (
    <>
      <Button
        href="/monthly-form/create"
        type="primary"
        icon={<PlusOutlined />}
      >
        Create monthly form
      </Button>
    </>
  );
}
