import { Modal, Input, message } from "antd";
import { useState } from "react";

// Define the props for the CommentModal component
interface CommentModalProps {
  status: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (status: string, comment: string) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ status, isOpen, onClose, onSave }) => {
  const [comment, setComment] = useState<string>("");

  const handleSubmit = () => {
    if (status === "rejected" && !comment.trim()) {
      message.error("A comment is required for rejection.");
      return;
    }
    onSave(status, comment);
    setComment(""); // Reset input after submission
    onClose(); // Close the modal
  };

  return (
    <Modal
      open={isOpen}
      title={status === "rejected" ? "Provide a Reason for Rejection" : "Add Comments (Optional)"}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Submit"
      cancelText="Cancel"
    >
      <Input.TextArea
        rows={4}
        placeholder={status === "rejected" ? "Please enter a reason for rejection" : "Enter comments here (optional)"}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
    </Modal>
  );
};

export default CommentModal;
