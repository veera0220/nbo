import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";



const generalData = [
  { settingsName: "Notification Email Address", settingsVal: "Electronics" },
  { settingsName: "Headphones", settingsVal: "Accessories" },
  { settingsName: "Coffee Mug", settingsVal: "Kitchen" },
  { settingsName: "Notebook", settingsVal: "Stationery" },
  { settingsName: "Smartphone", settingsVal: "Electronics" }
];

const GeneralTable = () => {
  return (
    <div className="general-table-main-container">
        <div className="header-section">
            <h4 className="text-xl font-semibold mb-2">General</h4>
        </div>
    {/* General Table */}
    <div className="general-tbl">
        <DataTable value={generalData} paginator rows={5} stripedRows>
            <Column field="settingsName" header="Settings" sortable />
            <Column field="settingsVal" header="Value" sortable />
        </DataTable>
    </div>
   </div> 
  );
};

export default GeneralTable;
