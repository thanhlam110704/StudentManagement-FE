import _ from 'lodash';
import { GridApi } from "@ag-grid-community/core";

interface Filter {
  field: string;
  value: string;
  operator: string;
}

interface FilterModel {
  [key: string]: {
    filterType: 'text' | 'number' | 'date';
    type: string;
    filter?: string | number;
    filterTo?: string | number;
    dateFrom?: string;
    dateTo?: string;
  };
}

export const getFilterModel = (gridApi: GridApi): Filter[] => {
  const filterModel: FilterModel = gridApi.getFilterModel();

  const filters = _.flatMap(filterModel, (filterValue, field) => {
    if (filterValue.filterType === 'date') {
      const dateFilters: Filter[] = [];

      if (filterValue.type === 'inRange') {
        if (filterValue.dateFrom) {
          dateFilters.push({
            field,
            value: filterValue.dateFrom,
            operator: 'greaterThan'
          });
        }
        if (filterValue.dateTo) {
          dateFilters.push({
            field,
            value: filterValue.dateTo,
            operator: 'lessThan'
          });
        }
      } else {
        if (filterValue.dateFrom) {
          dateFilters.push({
            field,
            value: filterValue.dateFrom,
            operator: filterValue.type
          });
        }
      }

      return dateFilters;
    }

    else if (filterValue.filterType === 'number') {
      const numberFilters: Filter[] = [];

      if (filterValue.type === 'inRange') {
        if (filterValue.filter !== undefined && filterValue.filter !== null) {
          numberFilters.push({
            field,
            value: filterValue.filter.toString(),
            operator: 'greaterThan'
          });
        }
        if (filterValue.filterTo !== undefined && filterValue.filterTo !== null) {
          numberFilters.push({
            field,
            value: filterValue.filterTo.toString(),
            operator: 'lessThan'
          });
        }
      } else {
        if (filterValue.filter !== undefined && filterValue.filter !== null) {
          numberFilters.push({
            field,
            value: filterValue.filter.toString(),
            operator: filterValue.type
          });
        }
      }

      return numberFilters;
    }

    else {
      return {
        field,
        value: filterValue.filter as string,
        operator: filterValue.type
      };
    }
  });

  const validFilters = _.filter(filters, filter =>
    !_.isNil(filter.value) && filter.value !== ''
  );

  return validFilters;
};