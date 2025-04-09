import { ITextFilterParams, IDateFilterParams, INumberFilterParams } from "ag-grid-community";

export const textFilterParams: ITextFilterParams = {
    filterOptions: ["contains", "equals", "startsWith", "endsWith"],
    buttons: ["apply", "reset"],
    trimInput: true,
    maxNumConditions: 1,
    debounceMs: 2000
};

export const dateFilterParams: IDateFilterParams = {
    filterOptions: ["equals", "greaterThan", "lessThan","greaterThanOrEqual","lessThanOrEqual", "inRange"],
    buttons: ["apply", "reset"],
    maxNumConditions: 1,
    debounceMs: 2000,
    comparator: (filterLocalDateAtMidnight, cellValue) => {
        const cellDate = new Date(cellValue);
        if (filterLocalDateAtMidnight < cellDate) {
            return 1; 
        } else if (filterLocalDateAtMidnight > cellDate) {
            return -1; 
        }
        return 0; 
    }
};


export const numberFilterParams: INumberFilterParams = {
    filterOptions: ["equals", "greaterThan", "lessThan","greaterThanOrEqual","lessThanOrEqual", "inRange"],
    buttons: ["apply", "reset"],
    maxNumConditions: 1,
    debounceMs: 2000
};
