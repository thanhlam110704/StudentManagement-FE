import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Button, Modal, Popconfirm, message, Pagination } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry, GridApi, GridReadyEvent, ColDef } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import ClassForm from "../modal-form/ClassForm";
import { textFilterParams, dateFilterParams, numberFilterParams } from "../../../utils/filterParams";
import { deleteClass, getClasses, getClassDetail } from "../api/classApi";
import { getFilterModel } from "../../../utils/filterModel";
import { formatDate } from "../../../utils/dateConvert";
import "../../../styles/table.component.css";
import dayjs from "dayjs";
import { ClassFormValues, ClassData, Filter } from "../model/class"; 

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const ClassTable: React.FC = () => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingClass, setEditingClass] = useState<ClassFormValues | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [filter, setFilter] = useState<Filter[]>([]);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "">("");
  const hasFetched = useRef<boolean>(false);
  const navigate = useNavigate();

  const loadClasses = useCallback(async () => {
    setLoading(true);
    try {
      const data: { data: ClassData[]; totalRecords: number } = await getClasses(
        currentPage,
        pageSize,
        filter,
        sortBy,
        sortDirection
      );
      setClasses(data.data);
      setTotalItems(data.totalRecords);
      hasFetched.current = false;
    } catch (error) {
      message.error("Fail to load classes");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filter, sortBy, sortDirection]);

  useEffect(() => {
    if (!hasFetched.current) {
      loadClasses();
      hasFetched.current = true;
    }
  }, [loadClasses]);

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleFilterChange = () => {
    if (gridApi) {
      const filters = getFilterModel(gridApi);
      setFilter(filters.length > 0 ? filters : []);
    }
  };

  const handleSortChange = (params: { api: GridApi }) => {
    const columnState = params.api.getColumnState();
    const sortedColumn = columnState.find((col) => col.sort === "asc" || col.sort === "desc");
    if (sortedColumn) {
      setSortBy(sortedColumn.colId);
      setSortDirection(sortedColumn.sort as "asc" | "desc");
    } else {
      setSortBy("");
      setSortDirection("");
    }
  };

  const handleEdit = useCallback(async (id: string | number) => {
    setLoading(true);
    try {
      const data: ClassData = await getClassDetail(id);
      const formData: ClassFormValues = {
        ...data,
        startDate: data.startDate ? dayjs(data.startDate) : undefined,
        endDate: data.endDate ? dayjs(data.endDate) : undefined,
      };
      setEditingClass(formData);
      setIsModalOpen(true);
    } catch {
      message.error("Unable to retrieve class information");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (id: string | number) => {
    try {
      await deleteClass(id);
      message.success("Delete class successfully");
      loadClasses();
    } catch {
      message.error("Error deleting class");
    }
  }, [loadClasses]);

  const columnDefs: ColDef<ClassData>[] = useMemo(
    () => [
      {
        headerName: "ID",
        field: "id",
        width: 80,
        sortable: true,
        filterParams: numberFilterParams,
      } as ColDef<ClassData>,
      {
        headerName: "Class Name",
        field: "name",
        width: 140,
        filter: true,
        filterParams: textFilterParams,
      } as ColDef<ClassData>,
      {
        headerName: "Capacity",
        field: "capacity",
        width: 140,
        sortable: true,
        filterParams: numberFilterParams,
      } as ColDef<ClassData>,
      {
        headerName: "Start Date",
        field: "startDate",
        valueFormatter: (params) => formatDate(params.value as string),
        width: 160,
        filter: "agDateColumnFilter",
        filterParams: dateFilterParams,
      } as ColDef<ClassData>,
      {
        headerName: "End Date",
        field: "endDate",
        valueFormatter: (params) => formatDate(params.value as string),
        width: 160,
        filter: "agDateColumnFilter",
        filterParams: dateFilterParams,
      } as ColDef<ClassData>,
      {
        headerName: "Created At",
        field: "createdAt",
        valueFormatter: (params) => formatDate(params.value as string),
        width: 160,
        filter: "agDateColumnFilter",
        filterParams: dateFilterParams,
      } as ColDef<ClassData>,
      {
        headerName: "Updated At",
        field: "updatedAt",
        valueFormatter: (params) => formatDate(params.value as string),
        width: 160,
        filter: "agDateColumnFilter",
        filterParams: dateFilterParams,
      } as ColDef<ClassData>,
      {
        headerName: "Actions",
        width: 160,
        cellRenderer: (params: { data: ClassData }) => (
          <div className="action-buttons">
            <Button
              icon={<InfoOutlined />}
              onClick={() => navigate(`/class/${params.data.id}?tab=InfomationClass`)}
              className="action-button info"
            />
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(params.data.id)}
              className="action-button edit"
              loading={loading}
            />
            <Popconfirm title="Are you sure you want to delete?" onConfirm={() => handleDelete(params.data.id)}>
              <Button icon={<DeleteOutlined />} className="action-button delete" />
            </Popconfirm>
          </div>
        ),
      } as ColDef<ClassData>,
    ],
    [navigate, loading, handleEdit, handleDelete]
  );

  return (
    <div className="table-container">
      <div className="header">
        <h2>Class Management</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Add Class
        </Button>
      </div>

      <div className="ag-theme-alpine">
        <AgGridReact<ClassData>
          rowData={classes}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={pageSize}
          suppressPaginationPanel={true}
          defaultColDef={{ resizable: true, sortable: true, filter: true }}
          domLayout="autoHeight"
          onGridReady={(params: GridReadyEvent) => setGridApi(params.api)}
          onFilterChanged={handleFilterChange}
          onSortChanged={handleSortChange}
        />
      </div>

      <div className="pagination-container">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          showSizeChanger={true}
          pageSizeOptions={["5", "10", "20", "50"]}
          onChange={handlePageChange}
        />
      </div>

      <Modal
        title={editingClass ? "Edit Class" : "Add Class"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingClass(null);
        }}
        footer={null}
      >
        <ClassForm initialValues={editingClass ?? undefined} onSuccess={loadClasses} />
      </Modal>
    </div>
  );
};

export default ClassTable;