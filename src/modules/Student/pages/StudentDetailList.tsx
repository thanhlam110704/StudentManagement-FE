import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Button, Popconfirm, message, Pagination } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { AgGridReact } from "@ag-grid-community/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import AddClassModal from "../../ClassStudent/modal-form/AddClassModal";
import { fetchAvailableClasses, removeStudentFromClass } from "../../ClassStudent/api/classStudentApi";
import { getClassesListofStudent } from "../api/studentApi";
import { textFilterParams, dateFilterParams, numberFilterParams } from "../../../utils/filterParams";
import { getFilterModel } from "../../../utils/filterModel";
import { formatDate } from "../../../utils/dateConvert";
import { GridApi, GridReadyEvent, ColDef } from "@ag-grid-community/core";

interface ClassData {
  id: string | number;
  name: string;
  capacity: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

interface Filter {
  field: string;
  value: string;
  operator: string;
}

interface StudentDetailListProps {
  studentId: string | number;
}

const StudentDetailList: React.FC<StudentDetailListProps> = ({ studentId }) => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [availableClasses, setAvailableClasses] = useState<ClassData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [filter, setFilter] = useState<Filter[]>([]);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "">("");
  const hasFetched = useRef<boolean>(false);

  const loadAvailableClasses = useCallback(async () => {
    try {
      const data: ClassData[] = await fetchAvailableClasses(studentId);
      setAvailableClasses(data);
    } catch (error: any) {
      message.error(error.response?.data?.message);
    }
  }, [studentId]);

  const loadClassList = useCallback(async () => {
    setLoading(true);
    try {
      const data: { data: ClassData[]; totalRecords: number } = await getClassesListofStudent(
        studentId,
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
      message.error("Fail to load list of classes!");
    } finally {
      setLoading(false);
    }
  }, [studentId, currentPage, pageSize, filter, sortBy, sortDirection]);

  useEffect(() => {
    if (!hasFetched.current) {
      loadClassList();
      hasFetched.current = true;
    }
  }, [loadClassList]);

  const handleRemoveStudent = useCallback(
    async (classId: string | number) => {
      try {
        await removeStudentFromClass(studentId, classId);
        message.success("Đã xóa sinh viên khỏi lớp thành công!");
        loadClassList();
      } catch (error) {
        message.error("Lỗi khi xóa sinh viên khỏi lớp!");
      }
    },
    [studentId, loadClassList]
  );

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
          <Popconfirm
            title="Are you sure to remove from this class?"
            onConfirm={() => handleRemoveStudent(params.data.id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        ),
      } as ColDef<ClassData>,
    ],
    [handleRemoveStudent]
  );

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setIsModalOpen(true);
          loadAvailableClasses();
        }}
        className="add-button-detail"
      >
        Add Class
      </Button>

      <div className="ag-theme-alpine" style={{ height: "auto", width: "100%" }}>
        <AgGridReact<ClassData>
          className="detail-table"
          rowData={classes}
          columnDefs={columnDefs}
          pagination={true}
          loading={loading}
          paginationPageSize={pageSize}
          suppressPaginationPanel={true}
          defaultColDef={{ resizable: true, sortable: true, filter: true }}
          domLayout="autoHeight"
          onGridReady={(params: GridReadyEvent) => setGridApi(params.api)}
          onFilterChanged={handleFilterChange}
          onSortChanged={handleSortChange}
        />
      </div>

      <div className="pagination-container-detail">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          showSizeChanger={true}
          pageSizeOptions={["5", "10", "20", "50"]}
          onChange={handlePageChange}
        />
      </div>

      <AddClassModal
        studentId={studentId}
        availableClasses={availableClasses}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadClassList}
      />
    </>
  );
};

export default StudentDetailList;