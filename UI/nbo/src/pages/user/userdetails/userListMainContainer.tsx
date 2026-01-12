import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const products = [
  { code: "P001", name: "Laptop", category: "Electronics" },
  { code: "P002", name: "Headphones", category: "Accessories" },
  { code: "P003", name: "Coffee Mug", category: "Kitchen" },
  { code: "P004", name: "Notebook", category: "Stationery" },
  { code: "P005", name: "Smartphone", category: "Electronics" }
];

const MyTable = () => {
  return (
    <DataTable value={products} paginator rows={5} stripedRows>
      <Column field="code" header="Code" sortable />
      <Column field="name" header="Name" sortable />
      <Column field="category" header="Category" sortable />
    </DataTable>
  );
};

export default MyTable;
