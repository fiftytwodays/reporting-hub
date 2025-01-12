import { Button, Form, Modal, Input } from "antd";
import { FC } from "react";

const { TextArea } = Input;

interface CommentsSectionProps {
  comments?: string;
  onCommentsChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit?: () => void;
}

const CommentsSection: FC<CommentsSectionProps> = ({
  comments,
  onCommentsChange,
  onSubmit,
}) => (
  <Form layout="vertical" onFinish={onSubmit}>
    <Form.Item>
      <TextArea
        value={comments}
        onChange={onCommentsChange}
        rows={4}
        showCount
        maxLength={100}
        style={{
          height: 120,
          resize: "none",
        }}
        placeholder="Enter your comments here..."
      />
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit">
        Proceed
      </Button>
      <Button
        style={{ marginLeft: "10px" }}
        danger
        onClick={onSubmit} // Action for discard can be added here
      >
        Discard
      </Button>
    </Form.Item>
  </Form>
);

interface ConfirmationModalProps {
  isOpenModal: boolean;
  closeModal: () => void;
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpenModal,
  closeModal,
}) => {
  const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Handle change logic for comments
  };

  const handleSubmit = () => {
    // Handle form submit logic
    closeModal();
  };

  return (
    <Modal
      title={"Comments"}
      footer={null}
      open={isOpenModal}
      onCancel={closeModal}
      width="600px"
    >
      <CommentsSection
        comments={undefined}
        onCommentsChange={handleCommentsChange}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};

export default ConfirmationModal;
