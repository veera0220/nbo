import { useState, useMemo, useEffect, useRef } from 'react';
import { useNBO, convertBackendToFrontendNBO } from '../context/NBOContext';
import { Link, useNavigate } from 'react-router-dom';
import { nboApi, PaginationRequest } from '../services/api';
import { toast } from 'sonner';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { AdvancedFilterPanel } from './AdvancedFilterPanel';

const statusColors = {
  'New': 'bg-blue-100 text-blue-700',
  'Open': 'bg-green-100 text-green-700',
  'Won': 'bg-emerald-100 text-emerald-700',
  'Lost': 'bg-red-100 text-red-700',
  'On Hold': 'bg-yellow-100 text-yellow-700',
};

interface FilterState {
  customers: string[];
  regions: string[];
  countries: string[];
  bus: string[];
  productLines: string[];
  applications: string[];
  statuses: string[];
  years: number[];
  quarters: string[];
  owners: string[];
  formFactors: string[];
  dataRates: string[];
  stackings: string[];
  markets?: string[];
  orderingTypes?: string[];
  risks?: string[];
  types?: string[];
  salesGroups?: string[];
  valueMin?: number;
  valueMax?: number;
}

const defaultColumns = {
  nboId: true,
  customerName: true,
  region: true,
  country: true,
  bu: true,
  productLine: true,
  application: false,
  projectName: true,
  status: true,
  winProbability: true,
  expectedValue: true,
  nboYear: true,
  quarter: true,
  formFactor: false,
  dataRate: false,
  stacking: false,
  owner: true,
  salesRep: false,
  appEng: false,
  salesGroup: false,
  market: false,
  orderingType: false,
  risk: false,
  type: false,
  createdDate: false,
  updatedDate: true,
};

export function ViewAllNBOs() {
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(defaultColumns);
  const [filters, setFilters] = useState<FilterState>({
    customers: [],
    regions: [],
    countries: [],
    bus: [],
    productLines: [],
    applications: [],
    statuses: [],
    years: [],
    quarters: [],
    owners: [],
    formFactors: [],
    dataRates: [],
    stackings: [],
  });

  // Pagination state
  const [nbos, setNBOs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy] = useState('nboId');
  const [sortDir] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { pickList } = useNBO();

  // Fetch NBOs with pagination
  const fetchNBOs = async () => {
    try {
      setLoading(true);
      const request: PaginationRequest = {
        pageNo,
        pageSize,
        search: debouncedSearchQuery || undefined,
        sortBy,
        sortDir,
      };
      
      const response = await nboApi.getPaginated(request);
      if (response && response.data) {
        const converted = response.data.map((nbo: any) => convertBackendToFrontendNBO(nbo));
        setNBOs(converted);
        setTotalCount(response.count || 0);
      }
    } catch (error) {
      console.error('Error fetching NBOs:', error);
      toast.error('Failed to load NBOs');
    } finally {
      setLoading(false);
    }
  };

  // Debounce search query
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPageNo(1); // Reset to first page on search
    }, 500); // 500ms debounce delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    fetchNBOs();
  }, [pageNo, pageSize, debouncedSearchQuery, sortBy, sortDir]);

  // Reset to page 1 when page size changes
  useEffect(() => {
    setPageNo(1);
  }, [pageSize]);

  const activeNBOs = nbos.filter((nbo: any) => !nbo.isArchived);

  // Apply filters (search is handled by backend, so we only apply client-side filters here)
  const filteredNBOs = useMemo(() => {
    return activeNBOs.filter(nbo => {
      // Advanced filters (search is handled server-side)
      if (filters.customers.length && !filters.customers.includes(nbo.customerName)) return false;
      if (filters.regions.length && !filters.regions.includes(nbo.region)) return false;
      if (filters.countries.length && !filters.countries.includes(nbo.country)) return false;
      if (filters.bus.length && !filters.bus.includes(nbo.bu)) return false;
      if (filters.productLines.length && !filters.productLines.includes(nbo.productLine)) return false;
      if (filters.applications.length && !filters.applications.includes(nbo.application)) return false;
      if (filters.statuses.length && !filters.statuses.includes(nbo.status)) return false;
      if (filters.years.length && !filters.years.includes(nbo.nboYear)) return false;
      if (filters.quarters.length && nbo.quarter && !filters.quarters.includes(nbo.quarter)) return false;
      if (filters.owners.length && !filters.owners.includes(nbo.owner)) return false;
      if (filters.formFactors.length && nbo.formFactor && !filters.formFactors.includes(nbo.formFactor)) return false;
      if (filters.dataRates.length && nbo.dataRate && !filters.dataRates.includes(nbo.dataRate)) return false;
      if (filters.stackings.length && nbo.stacking && !filters.stackings.includes(nbo.stacking)) return false;
      
      // New picklist-based filters (match by name/value)
      if (filters.markets?.length && nbo.market && !filters.markets.includes(nbo.market)) return false;
      if (filters.orderingTypes?.length && nbo.orderingType && !filters.orderingTypes.includes(nbo.orderingType)) return false;
      if (filters.risks?.length && nbo.risk && !filters.risks.includes(nbo.risk)) return false;
      if (filters.types?.length && nbo.type && !filters.types.includes(nbo.type)) return false;
      if (filters.salesGroups?.length && nbo.salesGroup && !filters.salesGroups.includes(nbo.salesGroup)) return false;
      
      if (filters.valueMin !== undefined && nbo.expectedValue < filters.valueMin) return false;
      if (filters.valueMax !== undefined && nbo.expectedValue > filters.valueMax) return false;

      return true;
    }).sort((a, b) => {
      // Sort by updated date, newest first
      return new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime();
    });
  }, [activeNBOs, filters]);

  const activeFilterCount = Object.values(filters).filter(v => 
    Array.isArray(v) ? v.length > 0 : v !== undefined
  ).length;

  const handleExport = () => {
    const csvContent = [
      // Header
      Object.keys(defaultColumns).join(','),
      // Data
      ...filteredNBOs.map(nbo => [
        nbo.id,
        nbo.customerName,
        nbo.region,
        nbo.country,
        nbo.bu,
        nbo.productLine,
        nbo.application,
        nbo.projectName,
        nbo.status,
        nbo.winProbability,
        nbo.expectedValue,
        nbo.nboYear,
        nbo.quarter || '',
        nbo.formFactor || '',
        nbo.dataRate || '',
        nbo.stacking || '',
        nbo.owner,
        nbo.createdDate,
        nbo.updatedDate,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nbos-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>All New Business Opportunities</h1>
          <p className="text-gray-600">
            {loading ? 'Loading...' : `Showing ${filteredNBOs.length} of ${totalCount} NBOs`}
          </p>
        </div>
        <Link to="/nbos/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create NBO
          </Button>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by customer, project, ID, region..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeFilterCount > 0 ? "default" : "outline"}
            onClick={() => setFilterPanelOpen(!filterPanelOpen)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filter
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-white text-blue-600">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Columns
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 max-h-96 overflow-y-auto">
              {Object.entries(defaultColumns).map(([key]) => {
                const displayNames: Record<string, string> = {
                  nboId: 'NBO ID',
                  customerName: 'Customer',
                  productLine: 'Product Line',
                  projectName: 'Project',
                  winProbability: 'Win %',
                  expectedValue: 'Value',
                  nboYear: 'Year',
                  formFactor: 'Form Factor',
                  dataRate: 'Data Rate',
                  salesRep: 'Sales Rep',
                  appEng: 'Apps Eng',
                  salesGroup: 'Sales Group',
                  orderingType: 'Ordering Type',
                  createdDate: 'Created',
                  updatedDate: 'Updated',
                };
                const displayName = displayNames[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={visibleColumns[key as keyof typeof defaultColumns]}
                    onCheckedChange={(checked: boolean) => 
                      setVisibleColumns(prev => ({ ...prev, [key]: checked }))
                    }
                  >
                    {displayName}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      {filterPanelOpen && (
        <AdvancedFilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setFilterPanelOpen(false)}
          nbos={nbos}
        />
      )}

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.statuses.map(status => (
            <Badge key={status} variant="secondary" className="gap-2">
              Status: {status}
              <button
                onClick={() => setFilters(prev => ({
                  ...prev,
                  statuses: prev.statuses.filter(s => s !== status)
                }))}
                className="hover:text-red-600"
              >
                ×
              </button>
            </Badge>
          ))}
          {filters.bus.map(bu => (
            <Badge key={bu} variant="secondary" className="gap-2">
              BU: {bu}
              <button
                onClick={() => setFilters(prev => ({
                  ...prev,
                  bus: prev.bus.filter(b => b !== bu)
                }))}
                className="hover:text-red-600"
              >
                ×
              </button>
            </Badge>
          ))}
          {filters.years.map(year => (
            <Badge key={year} variant="secondary" className="gap-2">
              Year: {year}
              <button
                onClick={() => setFilters(prev => ({
                  ...prev,
                  years: prev.years.filter(y => y !== year)
                }))}
                className="hover:text-red-600"
              >
                ×
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters({
              customers: [],
              regions: [],
              countries: [],
              bus: [],
              productLines: [],
              applications: [],
              statuses: [],
              years: [],
              quarters: [],
              owners: [],
              formFactors: [],
              dataRates: [],
              stackings: [],
              markets: [],
              orderingTypes: [],
              risks: [],
              types: [],
              salesGroups: [],
            })}
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.nboId && <TableHead>NBO ID</TableHead>}
              {visibleColumns.customerName && <TableHead>Customer</TableHead>}
              {visibleColumns.region && <TableHead>Region</TableHead>}
              {visibleColumns.country && <TableHead>Country</TableHead>}
              {visibleColumns.bu && <TableHead>BU</TableHead>}
              {visibleColumns.productLine && <TableHead>Product Line</TableHead>}
              {visibleColumns.application && <TableHead>Application</TableHead>}
              {visibleColumns.projectName && <TableHead>Project</TableHead>}
              {visibleColumns.status && <TableHead>Status</TableHead>}
              {visibleColumns.winProbability && <TableHead>Win %</TableHead>}
              {visibleColumns.expectedValue && <TableHead>Value</TableHead>}
              {visibleColumns.nboYear && <TableHead>Year</TableHead>}
              {visibleColumns.quarter && <TableHead>Quarter</TableHead>}
              {visibleColumns.formFactor && <TableHead>Form Factor</TableHead>}
              {visibleColumns.dataRate && <TableHead>Data Rate</TableHead>}
              {visibleColumns.stacking && <TableHead>Stacking</TableHead>}
              {visibleColumns.owner && <TableHead>Owner</TableHead>}
              {visibleColumns.salesRep && <TableHead>Sales Rep</TableHead>}
              {visibleColumns.appEng && <TableHead>Apps Eng</TableHead>}
              {visibleColumns.salesGroup && <TableHead>Sales Group</TableHead>}
              {visibleColumns.market && <TableHead>Market</TableHead>}
              {visibleColumns.orderingType && <TableHead>Ordering Type</TableHead>}
              {visibleColumns.risk && <TableHead>Risk</TableHead>}
              {visibleColumns.type && <TableHead>Type</TableHead>}
              {visibleColumns.createdDate && <TableHead>Created</TableHead>}
              {visibleColumns.updatedDate && <TableHead>Updated</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNBOs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={Object.keys(visibleColumns).filter(key => visibleColumns[key as keyof typeof visibleColumns]).length + 1} className="text-center py-8 text-gray-500">
                  No NBOs found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredNBOs.map((nbo) => (
                <TableRow 
                  key={nbo.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/nbos/${nbo.id}`)}
                >
                  {visibleColumns.nboId && (
                    <TableCell>
                      <span className="text-blue-600">
                        {nbo.id}
                      </span>
                    </TableCell>
                  )}
                  {visibleColumns.customerName && <TableCell>{nbo.customerName}</TableCell>}
                  {visibleColumns.region && <TableCell>{nbo.region}</TableCell>}
                  {visibleColumns.country && <TableCell>{nbo.country}</TableCell>}
                  {visibleColumns.bu && (
                    <TableCell>
                      {(nbo as any).buName || 
                       (pickList?.businessUnits?.find((item: any) => item.key === nbo.bu)?.value) || 
                       nbo.bu || 
                       '-'}
                    </TableCell>
                  )}
                  {visibleColumns.productLine && <TableCell>{nbo.productLine}</TableCell>}
                  {visibleColumns.application && <TableCell>{nbo.application}</TableCell>}
                  {visibleColumns.projectName && <TableCell>{nbo.projectName}</TableCell>}
                  {visibleColumns.status && (
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[nbo.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'}>
                        {nbo.status}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.winProbability && <TableCell>{nbo.winProbability}%</TableCell>}
                  {visibleColumns.expectedValue && (
                    <TableCell>${(nbo.expectedValue / 1000).toFixed(0)}K</TableCell>
                  )}
                  {visibleColumns.nboYear && <TableCell>{nbo.nboYear}</TableCell>}
                  {visibleColumns.quarter && <TableCell>{nbo.quarter || '-'}</TableCell>}
                  {visibleColumns.formFactor && <TableCell>{nbo.formFactor || '-'}</TableCell>}
                  {visibleColumns.dataRate && <TableCell>{nbo.dataRate || '-'}</TableCell>}
                  {visibleColumns.stacking && <TableCell>{nbo.stacking || '-'}</TableCell>}
                  {visibleColumns.owner && <TableCell>{nbo.owner}</TableCell>}
                  {visibleColumns.salesRep && <TableCell>{nbo.salesRep || '-'}</TableCell>}
                  {visibleColumns.appEng && <TableCell>{nbo.appEng || '-'}</TableCell>}
                  {visibleColumns.salesGroup && <TableCell>{nbo.salesGroup || '-'}</TableCell>}
                  {visibleColumns.market && <TableCell>{nbo.market || '-'}</TableCell>}
                  {visibleColumns.orderingType && <TableCell>{nbo.orderingType || '-'}</TableCell>}
                  {visibleColumns.risk && <TableCell>{nbo.risk || '-'}</TableCell>}
                  {visibleColumns.type && <TableCell>{nbo.type || '-'}</TableCell>}
                  {visibleColumns.createdDate && <TableCell>{nbo.createdDate}</TableCell>}
                  {visibleColumns.updatedDate && <TableCell>{nbo.updatedDate}</TableCell>}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                      <Link to={`/nbos/${nbo.id}/edit`}>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {!loading && totalCount > 0 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value: string) => setPageSize(Number(value))}
            >
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {((pageNo - 1) * pageSize) + 1} to {Math.min(pageNo * pageSize, totalCount)} of {totalCount}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPageNo(prev => Math.max(1, prev - 1))}
                disabled={pageNo === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPageNo(prev => Math.min(Math.ceil(totalCount / pageSize), prev + 1))}
                disabled={pageNo >= Math.ceil(totalCount / pageSize)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}