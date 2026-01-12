import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { Search, Filter, Eye, Edit, Download, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner@2.0.3';

interface SearchResult {
  id: string;
  name: string;
  customer: string;
  bu: string;
  market: string;
  region: string;
  stage: string;
  value: number;
  expectedCloseDate: string;
  owner: string;
}

export function SearchOpportunity() {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([
    {
      id: '1',
      name: 'Data Center Expansion - ACME Corp',
      customer: 'ACME Corporation',
      bu: 'HSIO Connectors',
      market: 'Data Center',
      region: 'North America',
      stage: 'Qualification',
      value: 1500000,
      expectedCloseDate: '2025-06-30',
      owner: 'John Smith',
    },
    {
      id: '2',
      name: 'Network Upgrade - TechCo',
      customer: 'TechCo Industries',
      bu: 'HSIO Connectors',
      market: 'Networking',
      region: 'Europe',
      stage: 'Proposal',
      value: 850000,
      expectedCloseDate: '2025-04-15',
      owner: 'Sarah Johnson',
    },
    {
      id: '3',
      name: '5G Infrastructure - GlobalTel',
      customer: 'GlobalTel Communications',
      bu: 'HSIO Connectors',
      market: 'Telecommunications',
      region: 'Asia Pacific',
      stage: 'Negotiation',
      value: 2200000,
      expectedCloseDate: '2025-03-31',
      owner: 'Mike Chen',
    },
  ]);

  const [filters, setFilters] = useState({
    bu: '',
    market: '',
    region: '',
    stage: '',
    dateFrom: '',
    dateTo: '',
    keyword: '',
  });

  const [advancedFilters, setAdvancedFilters] = useState({
    customers: [] as string[],
    owners: [] as string[],
    valueMin: '',
    valueMax: '',
    probabilityMin: '',
    probabilityMax: '',
    includeArchived: false,
  });

  const handleSearch = () => {
    toast.success('Search completed - 3 results found');
  };

  const handleClearFilters = () => {
    setFilters({
      bu: '',
      market: '',
      region: '',
      stage: '',
      dateFrom: '',
      dateTo: '',
      keyword: '',
    });
    toast.info('Filters cleared');
  };

  const handleApplyAdvancedFilters = () => {
    setShowAdvancedFilters(false);
    toast.success('Advanced filters applied');
  };

  const handleClearAdvancedFilters = () => {
    setAdvancedFilters({
      customers: [],
      owners: [],
      valueMin: '',
      valueMax: '',
      probabilityMin: '',
      probabilityMax: '',
      includeArchived: false,
    });
  };

  const handleExport = () => {
    toast.success('Exporting results to Excel...');
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      'Qualification': 'bg-blue-100 text-blue-700',
      'Proposal': 'bg-purple-100 text-purple-700',
      'Negotiation': 'bg-orange-100 text-orange-700',
      'Closed Won': 'bg-green-100 text-green-700',
      'Closed Lost': 'bg-red-100 text-red-700',
    };
    return colors[stage] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Search Opportunities</h1>
        <p className="text-gray-600">Search and filter opportunities with advanced criteria</p>
      </div>

      {/* Basic Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Filters</CardTitle>
          <CardDescription>Filter opportunities by basic criteria</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Business Unit</Label>
              <Select value={filters.bu} onValueChange={(value) => setFilters({ ...filters, bu: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select BU" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HSIO Connectors">HSIO Connectors</SelectItem>
                  <SelectItem value="Power Solutions">Power Solutions</SelectItem>
                  <SelectItem value="Automotive">Automotive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Market</Label>
              <Select value={filters.market} onValueChange={(value) => setFilters({ ...filters, market: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Market" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Networking">Networking</SelectItem>
                  <SelectItem value="Data Center">Data Center</SelectItem>
                  <SelectItem value="Telecommunications">Telecommunications</SelectItem>
                  <SelectItem value="Consumer Electronics">Consumer Electronics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Region</Label>
              <Select value={filters.region} onValueChange={(value) => setFilters({ ...filters, region: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="North America">North America</SelectItem>
                  <SelectItem value="Europe">Europe</SelectItem>
                  <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
                  <SelectItem value="China">China</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Stage</Label>
              <Select value={filters.stage} onValueChange={(value) => setFilters({ ...filters, stage: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Qualification">Qualification</SelectItem>
                  <SelectItem value="Proposal">Proposal</SelectItem>
                  <SelectItem value="Negotiation">Negotiation</SelectItem>
                  <SelectItem value="Closed Won">Closed Won</SelectItem>
                  <SelectItem value="Closed Lost">Closed Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Date From</Label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
            </div>
            <div>
              <Label>Date To</Label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>
            <div>
              <Label>Keyword Search</Label>
              <Input
                placeholder="Search by name, customer..."
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" onClick={() => setShowAdvancedFilters(true)}>
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
            <Button variant="outline" onClick={handleClearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>{searchResults.length} opportunities found</CardDescription>
            </div>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export to Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Opportunity Name</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>BU</TableHead>
                <TableHead>Market</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Expected Close</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchResults.map((result) => (
                <TableRow 
                  key={result.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => toast.info('Opening opportunity details...')}
                >
                  <TableCell>{result.name}</TableCell>
                  <TableCell>{result.customer}</TableCell>
                  <TableCell>{result.bu}</TableCell>
                  <TableCell>{result.market}</TableCell>
                  <TableCell>{result.region}</TableCell>
                  <TableCell>
                    <Badge className={getStageColor(result.stage)}>
                      {result.stage}
                    </Badge>
                  </TableCell>
                  <TableCell>${result.value.toLocaleString()}</TableCell>
                  <TableCell>{result.expectedCloseDate}</TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => toast.info('Opening edit...')}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Advanced Filters Modal */}
      <Dialog open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
            <DialogDescription>
              Apply advanced criteria to narrow your search
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Customer (Multi-select)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acme">ACME Corporation</SelectItem>
                    <SelectItem value="techco">TechCo Industries</SelectItem>
                    <SelectItem value="globaltel">GlobalTel Communications</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Owner (Multi-select)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select owners" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John Smith</SelectItem>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="mike">Mike Chen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Min Value ($)</Label>
                <Input
                  type="number"
                  placeholder="Enter minimum value"
                  value={advancedFilters.valueMin}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, valueMin: e.target.value })}
                />
              </div>
              <div>
                <Label>Max Value ($)</Label>
                <Input
                  type="number"
                  placeholder="Enter maximum value"
                  value={advancedFilters.valueMax}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, valueMax: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Min Win Probability (%)</Label>
                <Input
                  type="number"
                  placeholder="0-100"
                  min="0"
                  max="100"
                  value={advancedFilters.probabilityMin}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, probabilityMin: e.target.value })}
                />
              </div>
              <div>
                <Label>Max Win Probability (%)</Label>
                <Input
                  type="number"
                  placeholder="0-100"
                  min="0"
                  max="100"
                  value={advancedFilters.probabilityMax}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, probabilityMax: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-archived"
                checked={advancedFilters.includeArchived}
                onCheckedChange={(checked) => setAdvancedFilters({ ...advancedFilters, includeArchived: checked as boolean })}
              />
              <label
                htmlFor="include-archived"
                className="text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include archived opportunities
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClearAdvancedFilters}>
              Clear All
            </Button>
            <Button onClick={handleApplyAdvancedFilters}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}