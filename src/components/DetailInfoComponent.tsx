import React from "react";
import { Descriptions } from "antd";
import { formatDate } from "../utils/dateConvert";

interface Field {
  label: string;
  key: string;
  isDate?: boolean;
}

interface DetailInfoComponentProps {
  details: Record<string, any> | null;
  fields: Field[];
}

const DetailInfoComponent: React.FC<DetailInfoComponentProps> = ({ details, fields }) => {
  if (!details) return <p>Loading...</p>;

  return (
    <Descriptions bordered column={1} className="info-table">
      {fields.map(({ label, key, isDate }) => (
        <Descriptions.Item key={key} label={label}>
          {isDate ? formatDate(details[key]) : details[key]}
        </Descriptions.Item>
      ))}
    </Descriptions>
  );
};

export default DetailInfoComponent;