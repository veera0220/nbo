import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Download, TrendingUp } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Label } from './ui/label';
import { Separator } from './ui/separator';

interface DesignWin {
  id: string;
  customer: string;
  product: string;
  winDate: string;
  value: number;
  region: string;
  bu: string;
  status: 'Active' | 'Archived';
  owner: string;
  description: string;
  projectedVolume: number;
  competitorDisplaced?: string;
}

export function DesignWins() {
  const navigate = useNavigate();
  
  // Filter states
  const [filterCustomer, setFilterCustomer] = useState<string>('all');
  const [filterProduct, setFilterProduct] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('all');
  
  const [selectedWin, setSelectedWin] = useState<DesignWin | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [designWins, setDesignWins] = useState<DesignWin[]>([
    {
      id: '1',
      customer: 'ACME Corporation',
      product: 'QSFP28 Standard Connector',
      winDate: '2025-01-15',
      value: 1500000,
      region: 'North America',
      bu: 'HSIO Connectors',
      status: 'Active',
      owner: 'John Smith',
      description: 'Major data center deployment win',
      projectedVolume: 50000,
      competitorDisplaced: 'Competitor A',
    },
    {
      id: '2',
      customer: 'TechCo Industries',
      product: 'QSFP-DD High Speed Connector',
      winDate: '2025-02-10',
      value: 2200000,
      region: 'Europe',
      bu: 'HSIO Connectors',
      status: 'Active',
      owner: 'Sarah Johnson',
      description: 'Next-gen network infrastructure',
      projectedVolume: 75000,
      competitorDisplaced: 'Competitor B',
    },
    {
      id: '3',
      customer: 'GlobalTel Communications',
      product: 'OSFP 800G Connector',
      winDate: '2024-11-20',
      value: 3100000,
      region: 'Asia Pacific',
      bu: 'HSIO Connectors',
      status: 'Active',
      owner: 'Mike Chen',
      description: '5G infrastructure rollout',
      projectedVolume: 100000,
      competitorDisplaced: 'Competitor C',
    },
    {
      id: '4',
      customer: 'DataNet Solutions',
      product: 'SFP+ 10G Flash Mount Connector',
      winDate: '2024-10-05',
      value: 650000,
      region: 'North America',
      bu: 'HSIO Connectors',
      status: 'Archived',
      owner: 'Lisa Wang',
      description: 'Enterprise network upgrade',
      projectedVolume: 30000,
    },
    {
      id: '5',
      customer: 'CloudNet Systems',
      product: 'QSFP28 Enhanced Thermal Connector',
      winDate: '2025-03-01',
      value: 1800000,
      region: 'China',
      bu: 'HSIO Connectors',
      status: 'Active',
      owner: 'David Lee',
      description: 'Hyperscale data center deployment',
      projectedVolume: 60000,
      competitorDisplaced: 'Competitor A',
    },
  ]);

  const activeWins = designWins.filter(w => w.status === 'Active');
  const archivedWins = designWins.filter(w => w.status === 'Archived');

  // Get unique values for filters
  const uniqueCustomers = Array.from(new Set(designWins.map(w => w.customer))).sort();
  const uniqueProducts = Array.from(new Set(designWins.map(w => w.product))).sort();
  const uniqueRegions = Array.from(new Set(designWins.map(w => w.region))).sort();
  const uniqueDates = Array.from(new Set(designWins.map(w => w.winDate))).sort().reverse();

  // Filter records
  const filterWins = (data: DesignWin[]) => {
    return data.filter(win => {
      const matchesCustomer = filterCustomer === 'all' || win.customer === filterCustomer;
      const matchesProduct = filterProduct === 'all' || win.product === filterProduct;
      const matchesRegion = filterRegion === 'all' || win.region === filterRegion;
      const matchesDate = filterDate === 'all' || win.winDate === filterDate;
      
      return matchesCustomer && matchesProduct && matchesRegion && matchesDate;
    }).sort((a, b) => {
      // Sort by win date, newest first
      return new Date(b.winDate).getTime() - new Date(a.winDate).getTime();
    });
  };

  // Apply filters
  const filteredActiveWins = filterWins(activeWins);
  const filteredArchivedWins = filterWins(archivedWins);

  // Clear all filters
  const handleClearFilters = () => {
    setFilterCustomer('all');
    setFilterProduct('all');
    setFilterRegion('all');
    setFilterDate('all');
  };

  const hasActiveFilters = filterCustomer !== 'all' || filterProduct !== 'all' || 
                          filterRegion !== 'all' || filterDate !== 'all';

  const handleViewWin = (win: DesignWin) => {
    navigate(`/design-wins/${win.id}`);
  };

  const handleExport = () => {
    toast.success('Exporting design wins to Excel...');
  };

  const renderTable = (data: DesignWin[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Win Date</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Region</TableHead>
          <TableHead>BU</TableHead>
          <TableHead>Projected Volume</TableHead>
          <TableHead>Owner</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((win) => (
          <TableRow 
            key={win.id}
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => handleViewWin(win)}
          >
            <TableCell>{win.customer}</TableCell>
            <TableCell>{win.product}</TableCell>
            <TableCell>{win.winDate}</TableCell>
            <TableCell>${win.value.toLocaleString()}</TableCell>
            <TableCell>{win.region}</TableCell>
            <TableCell>
              <Badge variant="outline">{win.bu}</Badge>
            </TableCell>
            <TableCell>{win.projectedVolume.toLocaleString()} units</TableCell>
            <TableCell>{win.owner}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const totalValue = activeWins.reduce((sum, win) => sum + win.value, 0);
  const totalVolume = activeWins.reduce((sum, win) => sum + win.projectedVolume, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Design Wins</h1>
          <p className="text-gray-600">Browse and manage design wins across all regions and products</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export to Excel
        </Button>
      </div>

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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Active Wins</CardDescription>
            <CardTitle className="text-3xl">{activeWins.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+3 this quarter</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Win Value</CardDescription>
            <CardTitle className="text-3xl">${(totalValue / 1000000).toFixed(1)}M</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Across active wins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Projected Volume</CardDescription>
            <CardTitle className="text-3xl">{(totalVolume / 1000).toFixed(0)}K</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Total units</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <Tabs defaultValue="active">
          <CardHeader className="pb-4">
            <TabsList>
              <TabsTrigger value="active">
                Active Wins ({activeWins.length})
              </TabsTrigger>
              <TabsTrigger value="archived">
                Archived Wins ({archivedWins.length})
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="active" className="m-0">
              {renderTable(filteredActiveWins)}
            </TabsContent>
            <TabsContent value="archived" className="m-0">
              {renderTable(filteredArchivedWins)}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* View Win Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Design Win Details</SheetTitle>
            <SheetDescription>
              Complete information about this design win
            </SheetDescription>
          </SheetHeader>
          
          {selectedWin && (
            <div className="space-y-6 mt-6">
              <div>
                <Label>Customer</Label>
                <p className="text-lg">{selectedWin.customer}</p>
              </div>
              
              <Separator />
              
              <div>
                <Label>Product</Label>
                <p>{selectedWin.product}</p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Win Date</Label>
                  <p>{selectedWin.winDate}</p>
                </div>
                <div>
                  <Label>Region</Label>
                  <p>{selectedWin.region}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Business Unit</Label>
                  <Badge variant="outline">{selectedWin.bu}</Badge>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge variant={selectedWin.status === 'Active' ? 'default' : 'secondary'}>
                    {selectedWin.status}
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Win Value</Label>
                  <p className="text-lg">${selectedWin.value.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Projected Volume</Label>
                  <p className="text-lg">{selectedWin.projectedVolume.toLocaleString()} units</p>
                </div>
              </div>
              
              <Separator />
              
              {selectedWin.competitorDisplaced && (
                <>
                  <div>
                    <Label>Competitor Displaced</Label>
                    <p>{selectedWin.competitorDisplaced}</p>
                  </div>
                  <Separator />
                </>
              )}
              
              <div>
                <Label>Owner</Label>
                <p>{selectedWin.owner}</p>
              </div>
              
              <div>
                <Label>Description</Label>
                <p className="text-gray-700">{selectedWin.description}</p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}