import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Modal from "../../reusablecomponents/Modal";

interface HelpTextProps {
  name: string;
  helptext: string;
}

const HelpText: HelpTextProps[] = [
  {
    name: "Design Win Apps Engineer",
    helptext: "Application Engineer: list name if opportunity"
  },
  {
    name: "Design Win Business Unit",
    helptext:
      "Business Unit: Active Optics = Loop (OBO). Xcels Cables, ExaMAX cables, Mezzanine, ARO, InfinX, AIOP = Terminal Blocks"
  },
  {
    name: "Design Win CM/Dist/OEM",
    helptext:
      "Ordering Customer and location. If not direct, specify Distributor"
  },
  {
    name: "Design Win Comments",
    helptext:
      "Design Win Competition: What other competitors are known?"
  },
  {
    name: "Design Win Current Year",
    helptext:
      "Estimated business amount for the current year"
  },
  {
    name: "Design Win Customer",
    helptext:
      "List the END USER/OEM. Example: If Emulex is doing a design for Oracle, list 'Oracle' as the customer and note in comments: 'Emulex doing ODM work for Oracle'"
  }
];


const HelpTextTable: React.FC = () => {
  const [selectedRow, setSelectedRow] = useState<HelpTextProps | null>(null);
  const [open, setOpen] = useState(false);
  const [editedText, setEditedText] = useState("");

  // 🔹 Populate textarea when row changes
  useEffect(() => {
    if (selectedRow) {
      setEditedText(selectedRow.helptext);
    }
  }, [selectedRow]);

  const nameBodyTemplate = (rowData: HelpTextProps) => (
    <span
      className="link-text"
      onClick={() => {
        setSelectedRow(rowData);
        setOpen(true);
      }}
    >
      {rowData.name}
    </span>
  );

  const handleSave = () => {
    console.log("Updated help text:", editedText);
    setOpen(false);
  };

  return (
    <div className="helptext-table-container">
      <div className="header-section">
          <h4 className="text-lg font-semibold mb-2">Help Text</h4>
      </div>
      <DataTable value={HelpText} stripedRows>
        <Column header="Name" 
        body={nameBodyTemplate} 
        style={{width: "250px"}} />
        <Column field="helptext" header="Text" />
      </DataTable>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Update Help"
        width="600px"
      >
        {selectedRow && (
          <div className="flex flex-col gap-2">
            {/* Label */}
            <label className="form-label mb-0">
              <strong>{selectedRow.name}</strong>
            </label>

            {/* Textarea */}
            <textarea
              className="form-textarea p-1 border border-gray-300 rounded"
              rows={4}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
          </div>
        )}

        {/* Footer actions */}
        <div className="modal-actions mt-1 flex justify-end gap-2">
          <button className="border border-gray-300 px-3 text-sm" onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default HelpTextTable;
