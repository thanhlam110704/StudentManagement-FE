import React from "react";
import { Modal } from "antd";

interface CustomModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode[];
  width?: number | string;
  destroyOnClose?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  title,
  open,
  onClose,
  children,
  footer,
  width = 520,
  destroyOnClose = true,
}) => {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      footer={footer}
      width={width}
      destroyOnClose={destroyOnClose}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;