import React, { useState, Dispatch, SetStateAction } from "react";
import { Button, Popconfirm, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";

interface Item {
  id: string | number;
  [key: string]: any;
}

interface Action {
  label: string;
  fetchAvailable: () => Promise<Item[]>;
}

interface RemoveAction {
  itemName: string;
  func: (id: string | number) => Promise<void>;
}

interface DetailListComponentProps {
  listData: Item[];
  setListData: Dispatch<SetStateAction<Item[]>>;
  columns: ColDef[];
  addAction: Action;
  removeAction: RemoveAction;
  modalComponent: (props: {
    isOpen: boolean;
    onClose: () => void;
    availableItems: Item[];
    setListData: Dispatch<SetStateAction<Item[]>>;
  }) => React.ReactNode;
}

const DetailListComponent: React.FC<DetailListComponentProps> = ({
  listData,
  setListData,
  columns,
  addAction,
  removeAction,
  modalComponent,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [availableItems, setAvailableItems] = useState<Item[]>([]);

  const loadAvailableItems = async () => {
    try {
      const data = await addAction.fetchAvailable();
      setAvailableItems(data);
    } catch {
      message.error("Failed to load available items.");
    }
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setIsModalOpen(true);
          loadAvailableItems();
        }}
        className="add-button"
      >
        {addAction.label}
      </Button>

      <AgGridReact
        rowData={listData}
        columnDefs={[
          ...columns,
          {
            headerName: "Actions",
            field: "actions",
            width: 140,
            cellRenderer: (params: any) => (
              <Popconfirm
                title={`Are you sure to remove this ${removeAction.itemName}?`}
                onConfirm={async () => {
                  await removeAction.func(params.data.id);
                  setListData((prev) => prev.filter((item) => item.id !== params.data.id));
                }}
              >
                <Button icon={<DeleteOutlined />} danger />
              </Popconfirm>
            ),
          },
        ]}
      />

      {modalComponent({ isOpen: isModalOpen, onClose: () => setIsModalOpen(false), availableItems, setListData })}
    </>
  );
};

export default DetailListComponent;