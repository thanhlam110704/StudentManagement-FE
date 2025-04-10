import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Button, Modal, Popconfirm, message, Pagination } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry, GridApi, GridReadyEvent, ColDef } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import StudentForm from "../modal-form/StudentForm";
import { getStudents, getStudentDetail, deleteStudent } from "../api/studentApi";
import { textFilterParams, dateFilterParams, numberFilterParams } from "../../../utils/filterParams";
import { getFilterModel } from "../../../utils/filterModel";
import { formatDate } from "../../../utils/dateConvert";
import "../../../styles/table.component.css";
import dayjs from "dayjs";
import { StudentFormValues, StudentData, Filter } from "../model/student";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const StudentTable: React.FC = () => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<StudentFormValues | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [filter, setFilter] = useState<Filter[]>([]);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "">("");
  const hasFetched = useRef<boolean>(false);
  const navigate = useNavigate();

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data: { data: StudentData[]; totalRecords: number } = await getStudents(
        currentPage,
        pageSize,
        filter,
        sortBy,
        sortDirection
      );
      setStudents(data.data);
      setTotalItems(data.totalRecords);
      hasFetched.current = false;
    } catch (error) {
      message.error("Fail to load students");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filter, sortBy, sortDirection]);

  useEffect(() => {
    if (!hasFetched.current) {
      loadStudents();
      hasFetched.current = true;
    }
  }, [loadStudents]);

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
      const data: StudentData = await getStudentDetail(id);
      const formData: StudentFormValues = {
        ...data,
        dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth) : undefined,
      };
      setEditingStudent(formData);
      setIsModalOpen(true);
    } catch {
      message.error("Unable to retrieve student information");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = useCallback(
    async (id: string | number) => {
      try {
        await deleteStudent(id);
        message.success("Delete student successfully");
        loadStudents();
      } catch {
        message.error("Error deleting student");
      }
    },
    [loadStudents]
  );

  const columnDefs: ColDef<StudentData>[] = useMemo(
    () => [
      {
        headerName: "ID",
        field: "id",
        width: 80,
        sortable: true,
        filterParams: numberFilterParams,
      } as ColDef<StudentData>,
      {
        headerName: "Full Name",
        field: "name",
        width: 160,
        filter: true,
        filterParams: textFilterParams,
      } as ColDef<StudentData>,
      {
        headerName: "Email",
        field: "email",
        width: 160,
        filter: true,
        filterParams: textFilterParams,
      } as ColDef<StudentData>,
      {
        headerName: "Phone",
        field: "phone",
        width: 160,
        filter: true,
        filterParams: textFilterParams,
      } as ColDef<StudentData>,
      {
        headerName: "Date of Birth",
        field: "dateOfBirth",
        valueFormatter: (params) => formatDate(params.value as string),
        width: 150,
        filter: "agDateColumnFilter",
        filterParams: dateFilterParams,
      } as ColDef<StudentData>,
      {
        headerName: "Created At",
        field: "createdAt",
        valueFormatter: (params) => formatDate(params.value as string),
        width: 150,
        filter: "agDateColumnFilter",
        filterParams: dateFilterParams,
      } as ColDef<StudentData>,
      {
        headerName: "Updated At",
        field: "updatedAt",
        valueFormatter: (params) => formatDate(params.value as string),
        width: 150,
        filter: "agDateColumnFilter",
        filterParams: dateFilterParams,
      } as ColDef<StudentData>,
      {
        headerName: "Actions",
        width: 160,
        cellRenderer: (params: { data: StudentData }) => (
          <div className="action-buttons">
            <Button
              icon={<InfoOutlined />}
              onClick={() => navigate(`/student/${params.data.id}?tab=InfomationStudent`)}
              className="action-button info"
            />
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(params.data.id)}
              className="action-button edit"
              loading={loading}
            />
            <Popconfirm
              title="Are you sure you want to delete?"
              onConfirm={() => handleDelete(params.data.id)}
            >
              <Button icon={<DeleteOutlined />} className="action-button delete" />
            </Popconfirm>
          </div>
        ),
      } as ColDef<StudentData>,
    ],
    [navigate, loading, handleEdit, handleDelete]
  );

  return (
    <div className="table-container">
      <div className="header">
        <h2>Student Management</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Add Student
        </Button>
      </div>

      <div className="ag-theme-alpine">
        <AgGridReact<StudentData>
          rowData={students}
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
        title={editingStudent ? "Edit Student" : "Add Student"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
        }}
        footer={null}
      >
        <StudentForm initialValues={editingStudent ?? undefined} onSuccess={loadStudents} />
      </Modal>
    </div>
  );
};

export default StudentTable;