import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>NBO System Help & Documentation</DialogTitle>
          <DialogDescription>
            Learn how to use the NBO Management System effectively
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="years">NBO Years</TabsTrigger>
            <TabsTrigger value="hsio">HSIO Rules</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[50vh] mt-4">
            <TabsContent value="overview" className="space-y-4">
              <div>
                <h3 className="mb-2">System Overview</h3>
                <p className="text-sm text-gray-600">
                  The NBO (New Business Opportunity) Management System helps you track and manage 
                  business opportunities across different business units, regions, and time periods.
                </p>
              </div>

              <div>
                <h4 className="mb-2">Key Features</h4>
                <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                  <li>Dashboard with summary cards and charts for quick insights</li>
                  <li>Comprehensive NBO tracking with customizable columns</li>
                  <li>Advanced filtering by customer, region, BU, status, and more</li>
                  <li>HSIO-specific fields with dependency validation</li>
                  <li>Multi-year revenue breakdown with quarterly planning</li>
                  <li>Export functionality for reporting and analysis</li>
                  <li>Archive system for historical data management</li>
                  <li>Master data management for Form Factor, Data Rate, and Stacking</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-2">Getting Started</h4>
                <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Click "Create New NBO" from the Dashboard or All NBOs page</li>
                  <li>Fill in required fields: Customer, Region, Country, BU, Product Line, Owner</li>
                  <li>For HSIO Connectors, select Form Factor, Data Rate, and Stacking</li>
                  <li>Enter revenue breakdown by year and quarter</li>
                  <li>Set status and win probability</li>
                  <li>Save to create the NBO</li>
                </ol>
              </div>

              <div>
                <h4 className="mb-2">NBO Statuses</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li><strong>New:</strong> Recently created opportunity, not yet qualified</li>
                  <li><strong>Open:</strong> Active opportunity being pursued</li>
                  <li><strong>Won:</strong> Successfully closed opportunity</li>
                  <li><strong>Lost:</strong> Opportunity lost to competitor or cancelled</li>
                  <li><strong>On Hold:</strong> Temporarily paused opportunity</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="years" className="space-y-4">
              <div>
                <h3 className="mb-2">Dynamic NBO Years</h3>
                <p className="text-sm text-gray-600">
                  The NBO system uses a dynamic year system that automatically adjusts based on 
                  the current year. This ensures your planning always covers the current year 
                  plus the next 3 years.
                </p>
              </div>

              <div>
                <h4 className="mb-2">Year Structure</h4>
                <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                  <li><strong>Current Year (2025):</strong> Full quarterly breakdown (Q1-Q4)</li>
                  <li><strong>Next Year (2026):</strong> Full quarterly breakdown (Q1-Q4)</li>
                  <li><strong>+2 Years (2027):</strong> Total value only, no quarterly breakdown</li>
                  <li><strong>+3 Years (2028):</strong> Total value only, no quarterly breakdown</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-2">Revenue Breakdown</h4>
                <p className="text-sm text-gray-600 mb-2">
                  When creating or editing an NBO, you can specify expected revenue by:
                </p>
                <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                  <li>Quarter-by-quarter for current and next year</li>
                  <li>Annual totals for +2 and +3 years</li>
                  <li>Overall total expected value</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  This granular breakdown helps with accurate forecasting and resource planning.
                </p>
              </div>

              <div>
                <h4 className="mb-2">NBO Year Selection</h4>
                <p className="text-sm text-gray-600">
                  When setting the "NBO Year", select the year when revenue is expected to begin. 
                  The quarter field indicates which quarter the opportunity is expected to close or start.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="hsio" className="space-y-4">
              <div>
                <h3 className="mb-2">HSIO Connector Dependencies</h3>
                <p className="text-sm text-gray-600">
                  When Business Unit is set to "HSIO Connectors", three additional technical 
                  fields are required with specific dependency rules.
                </p>
              </div>

              <div>
                <h4 className="mb-2">Field Hierarchy</h4>
                <div className="text-sm text-gray-600 space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <strong>1. Form Factor</strong>
                    <p>Select the physical connector form factor first (e.g., QSFP-DD, OSFP, QSFP28)</p>
                    <p className="text-xs mt-1">This determines the available Data Rates and Product Manager</p>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4">
                    <strong>2. Data Rate</strong>
                    <p>Select the data transmission rate (e.g., 400G, 800G)</p>
                    <p className="text-xs mt-1">Only data rates compatible with the selected Form Factor are shown</p>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4">
                    <strong>3. Stacking</strong>
                    <p>Select the port stacking configuration (e.g., 1x, 2x, 4x)</p>
                    <p className="text-xs mt-1">Only valid combinations for the Form Factor + Data Rate are shown</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-2">Valid Combinations</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Not all combinations are technically valid. The system automatically filters 
                  available options based on your selections:
                </p>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="bg-gray-50 p-3 rounded">
                    <strong>Example:</strong> QSFP-DD → 400G → 1x, 2x, or 4x
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <strong>Example:</strong> OSFP → 800G → 1x only
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-2">Product Manager Assignment</h4>
                <p className="text-sm text-gray-600">
                  Each Form Factor is assigned to a specific Product Manager. When you select 
                  a Form Factor, the corresponding Product Manager is automatically displayed 
                  and associated with the NBO.
                </p>
              </div>

              <div>
                <h4 className="mb-2">Master Data Management</h4>
                <p className="text-sm text-gray-600">
                  Administrators can manage valid combinations through the Master Data screens:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Form Factor Master: Add/edit form factors and assign Product Managers</li>
                  <li>Data Rate Master: Define data rates for each form factor</li>
                  <li>Stacking Master: Set valid stacking options for each combination</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              <div>
                <h3 className="mb-2">Export Functionality</h3>
                <p className="text-sm text-gray-600">
                  The export feature allows you to download NBO data for external analysis, 
                  reporting, and archival purposes.
                </p>
              </div>

              <div>
                <h4 className="mb-2">Export Options</h4>
                <p className="text-sm text-gray-600 mb-2">
                  When you click "Export" from the All NBOs page:
                </p>
                <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                  <li>Exports all visible NBOs based on current filters</li>
                  <li>Includes all fields (not just visible columns)</li>
                  <li>Exports in CSV format for Excel/spreadsheet compatibility</li>
                  <li>Includes historical data from prior years</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-2">Export Fields</h4>
                <p className="text-sm text-gray-600">The export includes all NBO fields:</p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-600">
                  <div>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>NBO ID</li>
                      <li>Customer Name</li>
                      <li>Region</li>
                      <li>Country</li>
                      <li>Business Unit</li>
                      <li>Product Line</li>
                      <li>Application</li>
                      <li>Project Name</li>
                      <li>Status</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Win Probability</li>
                      <li>Expected Value</li>
                      <li>NBO Year</li>
                      <li>Quarter</li>
                      <li>Form Factor (HSIO)</li>
                      <li>Data Rate (HSIO)</li>
                      <li>Stacking (HSIO)</li>
                      <li>Owner</li>
                      <li>Created/Updated Dates</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-2">Using Filters Before Export</h4>
                <p className="text-sm text-gray-600">
                  Use the Advanced Filter panel to narrow down your export:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside mt-2">
                  <li>Filter by specific customers, regions, or BUs</li>
                  <li>Select specific years or quarters</li>
                  <li>Filter by status (e.g., only "Won" opportunities)</li>
                  <li>Set value ranges to export high-value NBOs only</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-2">Best Practices</h4>
                <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                  <li>Export regularly for backup purposes</li>
                  <li>Use filters to create targeted reports (e.g., quarterly BU reports)</li>
                  <li>Include archived data when exporting for annual reviews</li>
                  <li>Review exported data in Excel for pivot tables and advanced analysis</li>
                </ul>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
