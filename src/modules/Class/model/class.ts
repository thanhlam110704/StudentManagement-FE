// src/types/types.ts
import { Dayjs } from "dayjs";
import React from "react";


export interface Tab {
  label: string;
  key: string;
  component: React.ReactNode;
}


export interface ClassFormValues {
  id?: string | number;
  name: string;
  capacity: number;
  startDate?: Dayjs;
  endDate?: Dayjs;
}

export interface ClassData {
  id: string | number;
  name: string;
  capacity: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}


export interface Student {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
}


export interface Filter {
  field: string;
  value: string;
  operator: string;
}


export interface ClassInfo {
  name: string;
  capacity: number;
  startDate: string;
  endDate: string;
}