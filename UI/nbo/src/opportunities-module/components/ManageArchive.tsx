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
import { Download, Eye, RotateCcw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface ArchivedRecord {
  id: string;
  type: 'NBO' | 'Opportunity' | 'Design Win' | 'Marketshare';
  name: string;
  customer: string;
  bu: string;
  value: number;
  archivedDate: string;
  archivedBy: string;
  originalDate: string;
  status: string;
}

export function ManageArchive() {
  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState<ArchivedRecord | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('archivedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [archivedRecords, setArchivedRecords] = useState<ArchivedRecord[]>([
    {
      id: '1',
      type: 'NBO',
      name: 'Legacy Network Upgrade - RetailCo',
      customer: 'RetailCo International',
      bu: 'HSIO Connectors',
      value: 450000,
      archivedDate: '2024-12-15',
      archivedBy: 'John Smith',
      originalDate: '2024-03-10',
      status: 'Lost',
    },
    {
      id: '2',
      type: 'Opportunity',
      name: 'Cloud Infrastructure - StartupX',
      customer: 'StartupX Technologies',
      bu: 'HSIO Connectors',
      value: 125000,
      archivedDate: '2024-11-20',
      archivedBy: 'Sarah Johnson',
      originalDate: '2024-06-15',
      status: 'Cancelled',
    },
    {
      id: '3',
      type: 'Design Win',
      name: 'Enterprise Router Platform',
      customer: 'NetEquip Corporation',
      bu: 'HSIO Connectors',
      value: 850000,
      archivedDate: '2024-10-30',
      archivedBy: 'Mike Chen',
      originalDate: '2023-12-05',
      status: 'Completed',
    },
    {
      id: '4',
      type: 'Marketshare',
      name: 'Telecom Provider Win',
      customer: 'TeleCom Global',
      bu: 'HSIO Connectors',
      value: 1200000,
      archivedDate: '2024-09-10',
      archivedBy: 'Lisa Wang',
      originalDate: '2024-01-20',
      status: 'Superseded',
    },
  ]);

  const filteredRecords = filterType === 'all' 
    ? archivedRecords 
    : archivedRecords.filter(r => r.type === filterType);

  // Apply sorting
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    let compareValue = 0;
    
    switch (sortBy) {
      case 'archivedDate':
        compareValue = a.archivedDate.localeCompare(b.archivedDate);
        break;
      case 'name':
        compareValue = a.name.localeCompare(b.name);
        break;
      case 'customer':
        compareValue = a.customer.localeCompare(b.customer);
        break;
      case 'value':
        compareValue = a.value - b.value;
        break;
      case 'type':
        compareValue = a.type.localeCompare(b.type);
        break;
      default:
        compareValue = 0;
    }
    
    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  const handleViewRecord = (record: ArchivedRecord) => {
    navigate(`/archive/${record.id}`);
  };

  const handleRestore = (record: ArchivedRecord) => {
    toast.success(`${record.name} restored successfully`);
  };

  const handleExport = () => {
    toast.success('Exporting archived data to Excel...');
  };

  const getTypeBadge = (type: ArchivedRecord['type']) => {
    const colors = {
      'NBO': 'bg-blue-100 text-blue-700',
      'Opportunity': 'bg-purple-100 text-purple-700',
      'Design Win': 'bg-green-100 text-green-700',
      'Marketshare': 'bg-orange-100 text-orange-700',
    };
    return <Badge className={colors[type]}>{type}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Manage Archive</h1>
          <p className="text-gray-600">View and manage archived records from all modules</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export to Excel
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Archived</CardDescription>
            <CardTitle className="text-3xl">{archivedRecords.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>NBOs</CardDescription>
            <CardTitle className="text-3xl">
              {archivedRecords.filter(r => r.type === 'NBO').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Opportunities</CardDescription>
            <CardTitle className="text-3xl">
              {archivedRecords.filter(r => r.type === 'Opportunity').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Design Wins</CardDescription>
            <CardTitle className="text-3xl">
              {archivedRecords.filter(r => r.type === 'Design Win').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Archived Records</CardTitle>
              <CardDescription>
                {filteredRecords.length} records
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <div className="w-48">
                <Label className="text-xs">Filter by Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="NBO">NBOs</SelectItem>
                    <SelectItem value="Opportunity">Opportunities</SelectItem>
                    <SelectItem value="Design Win">Design Wins</SelectItem>
                    <SelectItem value="Marketshare">Marketshare Gains</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-48">
                <Label className="text-xs">Sort by</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="archivedDate">Archived Date</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="value">Value</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Label className="text-xs">Order</Label>
                <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Business Unit</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Archived Date</TableHead>
                <TableHead>Archived By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRecords.map((record) => (
                <TableRow 
                  key={record.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleViewRecord(record)}
                >
                  <TableCell>{getTypeBadge(record.type)}</TableCell>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{record.customer}</TableCell>
                  <TableCell>{record.bu}</TableCell>
                  <TableCell>${record.value.toLocaleString()}</TableCell>
                  <TableCell>{record.archivedDate}</TableCell>
                  <TableCell>{record.archivedBy}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{record.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRestore(record)}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Record Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Archived Record Details</SheetTitle>
            <SheetDescription>
              Complete information about this archived record
            </SheetDescription>
          </SheetHeader>
          
          {selectedRecord && (
            <div className="space-y-6 mt-6">
              <div>
                <Label>Record Type</Label>
                {getTypeBadge(selectedRecord.type)}
              </div>
              
              <Separator />
              
              <div>
                <Label>Name</Label>
                <p className="text-lg">{selectedRecord.name}</p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer</Label>
                  <p>{selectedRecord.customer}</p>
                </div>
                <div>
                  <Label>Business Unit</Label>
                  <p>{selectedRecord.bu}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label>Value</Label>
                <p className="text-lg">${selectedRecord.value.toLocaleString()}</p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Original Date</Label>
                  <p>{selectedRecord.originalDate}</p>
                </div>
                <div>
                  <Label>Archived Date</Label>
                  <p>{selectedRecord.archivedDate}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label>Archived By</Label>
                <p>{selectedRecord.archivedBy}</p>
              </div>
              
              <div>
                <Label>Status</Label>
                <Badge variant="outline">{selectedRecord.status}</Badge>
              </div>
              
              <Separator />
              
              <Button
                className="w-full"
                variant="outline"
                onClick={() => handleRestore(selectedRecord)}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restore Record
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}