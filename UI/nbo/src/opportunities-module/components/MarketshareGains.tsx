import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
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
import { Download, Eye, Archive as ArchiveIcon, AlertCircle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface MarketshareRecord {
  id: string;
  customer: string;
  competitor: string;
  product: string;
  region: string;
  marketValue: number;
  gainedShare: number;
  gainDate: string;
  status: 'Active' | 'Archived';
  owner: string;
  comments: string;
}

export function MarketshareGains() {
  const navigate = useNavigate();
  
  // Filter states
  const [filterCustomer, setFilterCustomer] = useState<string>('all');
  const [filterProduct, setFilterProduct] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('all');

  const [records, setRecords] = useState<MarketshareRecord[]>([
    {
      id: '1',
      customer: 'ACME Corporation',
      competitor: 'Competitor A',
      product: 'QSFP28 Standard Connector',
      region: 'North America',
      marketValue: 1200000,
      gainedShare: 15,
      gainDate: '2025-01-15',
      status: 'Active',
      owner: 'John Smith',
      comments: 'Won major data center contract',
    },
    {
      id: '2',
      customer: 'TechCo Industries',
      competitor: 'Competitor B',
      product: 'QSFP-DD High Speed Connector',
      region: 'Europe',
      marketValue: 850000,
      gainedShare: 12,
      gainDate: '2025-02-20',
      status: 'Active',
      owner: 'Sarah Johnson',
      comments: 'Displaced competitor in network upgrade',
    },
    {
      id: '3',
      customer: 'GlobalTel Communications',
      competitor: 'Competitor C',
      product: 'OSFP 800G Connector',
      region: 'Asia Pacific',
      marketValue: 2100000,
      gainedShare: 20,
      gainDate: '2024-12-10',
      status: 'Archived',
      owner: 'Mike Chen',
      comments: '5G infrastructure win',
    },
    {
      id: '4',
      customer: 'DataNet Solutions',
      competitor: 'Competitor A',
      product: 'SFP+ 10G Flash Mount Connector',
      region: 'North America',
      marketValue: 450000,
      gainedShare: 8,
      gainDate: '2025-03-05',
      status: 'Active',
      owner: 'Lisa Wang',
      comments: 'Strategic partnership established',
    },
  ]);

  const activeRecords = records.filter(r => r.status === 'Active');
  const archivedRecords = records.filter(r => r.status === 'Archived');

  // Get unique values for filters
  const uniqueCustomers = Array.from(new Set(records.map(r => r.customer))).sort();
  const uniqueProducts = Array.from(new Set(records.map(r => r.product))).sort();
  const uniqueRegions = Array.from(new Set(records.map(r => r.region))).sort();
  const uniqueDates = Array.from(new Set(records.map(r => r.gainDate))).sort().reverse();

  // Filter records
  const filterRecords = (data: MarketshareRecord[]) => {
    return data.filter(record => {
      const matchesCustomer = filterCustomer === 'all' || record.customer === filterCustomer;
      const matchesProduct = filterProduct === 'all' || record.product === filterProduct;
      const matchesRegion = filterRegion === 'all' || record.region === filterRegion;
      const matchesDate = filterDate === 'all' || record.gainDate === filterDate;
      
      return matchesCustomer && matchesProduct && matchesRegion && matchesDate;
    }).sort((a, b) => {
      // Sort by gain date, newest first
      return new Date(b.gainDate).getTime() - new Date(a.gainDate).getTime();
    });
  };

  // Apply filters
  const filteredActiveRecords = filterRecords(activeRecords);
  const filteredArchivedRecords = filterRecords(archivedRecords);

  // Clear all filters
  const handleClearFilters = () => {
    setFilterCustomer('all');
    setFilterProduct('all');
    setFilterRegion('all');
    setFilterDate('all');
  };

  const hasActiveFilters = filterCustomer !== 'all' || filterProduct !== 'all' || 
                          filterRegion !== 'all' || filterDate !== 'all';

  const handleViewRecord = (record: MarketshareRecord) => {
    navigate(`/marketshare/${record.id}`);
  };

  const handleExport = () => {
    toast.success('Exporting data to Excel...');
  };

  const handleExportLarge = () => {
    toast.info('Large export will run in background. You will receive an email once ready.');
  };

  const renderTable = (data: MarketshareRecord[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Competitor Displaced</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Region</TableHead>
          <TableHead>Market Value</TableHead>
          <TableHead>Share Gained (%)</TableHead>
          <TableHead>Gain Date</TableHead>
          <TableHead>Owner</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((record) => (
          <TableRow 
            key={record.id}
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => handleViewRecord(record)}
          >
            <TableCell>{record.customer}</TableCell>
            <TableCell>{record.competitor}</TableCell>
            <TableCell>{record.product}</TableCell>
            <TableCell>{record.region}</TableCell>
            <TableCell>${record.marketValue.toLocaleString()}</TableCell>
            <TableCell>
              <Badge className="bg-green-100 text-green-700">
                +{record.gainedShare}%
              </Badge>
            </TableCell>
            <TableCell>{record.gainDate}</TableCell>
            <TableCell>{record.owner}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Marketshare Gains</h1>
          <p className="text-gray-600">Track and analyze competitive wins and market share gains</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export to Excel
          </Button>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Large Export Notice</AlertTitle>
        <AlertDescription>
          Large exports with extensive data will run in the background and send an email notification when ready.
        </AlertDescription>
      </Alert>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear All Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {/* Customer Filter */}
            <div className="space-y-2">
              <Label>Customer</Label>
              <Select value={filterCustomer} onValueChange={setFilterCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="All Customers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {uniqueCustomers.map((customer) => (
                    <SelectItem key={customer} value={customer}>
                      {customer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Product Filter */}
            <div className="space-y-2">
              <Label>Product</Label>
              <Select value={filterProduct} onValueChange={setFilterProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {uniqueProducts.map((product) => (
                    <SelectItem key={product} value={product}>
                      {product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Region Filter */}
            <div className="space-y-2">
              <Label>Region</Label>
              <Select value={filterRegion} onValueChange={setFilterRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {uniqueRegions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter */}
            <div className="space-y-2">
              <Label>Date</Label>
              <Select value={filterDate} onValueChange={setFilterDate}>
                <SelectTrigger>
                  <SelectValue placeholder="All Dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  {uniqueDates.map((date) => (
                    <SelectItem key={date} value={date}>
                      {date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <Tabs defaultValue="active">
          <CardHeader className="pb-4">
            <TabsList>
              <TabsTrigger value="active">
                Active ({filteredActiveRecords.length})
              </TabsTrigger>
              <TabsTrigger value="archived">
                Archived ({filteredArchivedRecords.length})
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="active" className="m-0">
              {renderTable(filteredActiveRecords)}
            </TabsContent>
            <TabsContent value="archived" className="m-0">
              {renderTable(filteredArchivedRecords)}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}