import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Badge } from './ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface MasterDataItem {
  id: string;
  name: string;
  code: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export function MasterData() {
  const [businessUnits, setBusinessUnits] = useState<MasterDataItem[]>([
    { id: '1', name: 'HSIO Connectors', code: 'HSIO', description: 'High Speed I/O Connectors', status: 'Active' },
    { id: '2', name: 'Power Solutions', code: 'PWR', description: 'Power Connector Solutions', status: 'Active' },
    { id: '3', name: 'Automotive', code: 'AUTO', description: 'Automotive Connectors', status: 'Active' },
    { id: '4', name: 'Industrial', code: 'IND', description: 'Industrial Connectors', status: 'Inactive' },
  ]);

  const [markets, setMarkets] = useState<MasterDataItem[]>([
    { id: '1', name: 'Networking', code: 'NET', description: 'Network Equipment Market', status: 'Active' },
    { id: '2', name: 'Data Center', code: 'DC', description: 'Data Center Infrastructure', status: 'Active' },
    { id: '3', name: 'Telecommunications', code: 'TELE', description: 'Telecom Equipment', status: 'Active' },
    { id: '4', name: 'Consumer Electronics', code: 'CE', description: 'Consumer Electronics Market', status: 'Active' },
  ]);

  const [regions, setRegions] = useState<MasterDataItem[]>([
    { id: '1', name: 'North America', code: 'NA', description: 'United States and Canada', status: 'Active' },
    { id: '2', name: 'Europe', code: 'EU', description: 'European Region', status: 'Active' },
    { id: '3', name: 'Asia Pacific', code: 'APAC', description: 'Asia Pacific Region', status: 'Active' },
    { id: '4', name: 'China', code: 'CN', description: 'Greater China Region', status: 'Active' },
    { id: '5', name: 'Latin America', code: 'LATAM', description: 'Latin America Region', status: 'Inactive' },
  ]);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<'business-units' | 'markets' | 'regions'>('business-units');
  const [editingItem, setEditingItem] = useState<MasterDataItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<MasterDataItem | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const handleEdit = (item: MasterDataItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      code: item.code,
      description: item.description,
      status: item.status,
    });
    setIsSheetOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      status: 'Active',
    });
    setIsSheetOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.code) {
      toast.error('Name and Code are required');
      return;
    }

    const newItem: MasterDataItem = {
      id: editingItem?.id || Date.now().toString(),
      ...formData,
    };

    if (currentTab === 'business-units') {
      if (editingItem) {
        setBusinessUnits(prev => prev.map(item => item.id === editingItem.id ? newItem : item));
        toast.success('Business Unit updated successfully');
      } else {
        setBusinessUnits(prev => [...prev, newItem]);
        toast.success('Business Unit added successfully');
      }
    } else if (currentTab === 'markets') {
      if (editingItem) {
        setMarkets(prev => prev.map(item => item.id === editingItem.id ? newItem : item));
        toast.success('Market updated successfully');
      } else {
        setMarkets(prev => [...prev, newItem]);
        toast.success('Market added successfully');
      }
    } else if (currentTab === 'regions') {
      if (editingItem) {
        setRegions(prev => prev.map(item => item.id === editingItem.id ? newItem : item));
        toast.success('Region updated successfully');
      } else {
        setRegions(prev => [...prev, newItem]);
        toast.success('Region added successfully');
      }
    }

    setIsSheetOpen(false);
  };

  const handleDelete = () => {
    if (!deleteItem) return;

    if (currentTab === 'business-units') {
      setBusinessUnits(prev => prev.filter(item => item.id !== deleteItem.id));
    } else if (currentTab === 'markets') {
      setMarkets(prev => prev.filter(item => item.id !== deleteItem.id));
    } else if (currentTab === 'regions') {
      setRegions(prev => prev.filter(item => item.id !== deleteItem.id));
    }

    toast.success('Item deleted successfully');
    setDeleteItem(null);
  };

  const renderTable = (data: MasterDataItem[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.code}</TableCell>
            <TableCell className="text-gray-600">{item.description}</TableCell>
            <TableCell>
              <Badge variant={item.status === 'Active' ? 'default' : 'secondary'}>
                {item.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(item)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteItem(item)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Manage Master Data</h1>
        <p className="text-gray-600">Manage business units, markets, and regions</p>
      </div>

      <Card>
        <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as any)}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="business-units">Business Units</TabsTrigger>
                <TabsTrigger value="markets">Markets</TabsTrigger>
                <TabsTrigger value="regions">Regions</TabsTrigger>
              </TabsList>
              <Button onClick={handleAddNew}>
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="business-units" className="m-0">
              {renderTable(businessUnits)}
            </TabsContent>
            <TabsContent value="markets" className="m-0">
              {renderTable(markets)}
            </TabsContent>
            <TabsContent value="regions" className="m-0">
              {renderTable(regions)}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Add/Edit Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editingItem ? 'Edit' : 'Add New'} {currentTab === 'business-units' ? 'Business Unit' : currentTab === 'markets' ? 'Market' : 'Region'}</SheetTitle>
            <SheetDescription>
              {editingItem ? 'Update' : 'Create'} the details below
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div>
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
              />
            </div>
            <div>
              <Label>Code *</Label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Enter code"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
                rows={3}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value: 'Active' | 'Inactive') => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1">
                {editingItem ? 'Update' : 'Create'}
              </Button>
              <Button variant="outline" onClick={() => setIsSheetOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteItem?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
