import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const products = [
  { name: "Laptop", helptext: "Electronics" },
  { name: "Headphones", helptext: "Accessories" },
  { name: "Coffee Mug", helptext: "Kitchen" },
  { name: "Notebook", helptext: "Stationery" },
  { name: "Smartphone", helptext: "Electronics" }
];

const HelpTextTable = () => {
  return (
    <div className="general-table-main-container">
        <div className="header-section">
            <h4 className="text-base font-semibold mb-2">Help Text</h4>
        </div>
    {/* General Table */}
    <div className="general-tbl">
        <DataTable value={products} paginator rows={5} stripedRows>
            <Column field="name" header="Name" sortable />
            <Column field="helptext" header="Text" sortable />
        </DataTable>
    </div>
   </div> 
  );
};

export default HelpTextTable;
