import { useState, useEffect } from 'react';
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
import { Plus, Edit, Trash2, ArrowLeft, FileText, Upload } from 'lucide-react';
import { toast } from 'sonner';
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
import { Separator } from './ui/separator';
import { nboApi, PaginationRequest } from '../services/api';
import { useNBO } from '../context/NBOContext';
import type { NBO } from '../context/NBOContext';

interface Opportunity {
  id: string;
  name: string;
  customer: string;
  bu: string;
  stage: string;
  value: number;
  probability: number;
  expectedCloseDate: string;
  owner: string;
  status: 'Active' | 'Won' | 'Lost' | 'On Hold';
}

type ViewMode = 'list' | 'create' | 'view' | 'edit';

// Helper function to convert backend API response to NBO format
const convertBackendToFrontendNBO = (backendNBO: any): NBO => {
  // Convert yearly data from API format (year0Q1Dec, year1Q1Dec, etc.) to yearlyData structure
  const convertYearlyData = (backendNBO: any): Record<number, any> => {
    const yearlyData: Record<number, any> = {};
    
    // Map year0 through year9 quarters
    for (let year = 0; year <= 9; year++) {
      const q1 = backendNBO[`year${year}Q1Dec`] !== null && backendNBO[`year${year}Q1Dec`] !== undefined ? backendNBO[`year${year}Q1Dec`] : null;
      const q2 = backendNBO[`year${year}Q2Dec`] !== null && backendNBO[`year${year}Q2Dec`] !== undefined ? backendNBO[`year${year}Q2Dec`] : null;
      const q3 = backendNBO[`year${year}Q3Dec`] !== null && backendNBO[`year${year}Q3Dec`] !== undefined ? backendNBO[`year${year}Q3Dec`] : null;
      const q4 = backendNBO[`year${year}Q4Dec`] !== null && backendNBO[`year${year}Q4Dec`] !== undefined ? backendNBO[`year${year}Q4Dec`] : null;
      const total = backendNBO[`year${year}Total`] !== null && backendNBO[`year${year}Total`] !== undefined ? backendNBO[`year${year}Total`] : null;
      
      if (q1 !== null || q2 !== null || q3 !== null || q4 !== null || total !== null) {
        const calculatedTotal = total !== null ? total : ((q1 || 0) + (q2 || 0) + (q3 || 0) + (q4 || 0));
        yearlyData[year] = {
          q1: q1 || 0,
          q2: q2 || 0,
          q3: q3 || 0,
          q4: q4 || 0,
          total: calculatedTotal,
        };
      }
    }
    
    return yearlyData;
  };

  // Calculate total value from year totals
  const calculateTotalFromYearTotals = (backendNBO: any): number => {
    let total = 0;
    for (let year = 0; year <= 11; year++) {
      const yearTotal = backendNBO[`year${year}Total`];
      if (yearTotal !== null && yearTotal !== undefined) {
        total += parseFloat(yearTotal) || 0;
      }
    }
    return total;
  };

  const formatDate = (date: string | null | undefined): string => {
    if (!date) return '';
    try {
      return new Date(date).toISOString().split('T')[0];
    } catch {
      return date;
    }
  };

  return {
    ...backendNBO,
    id: (backendNBO.nboId || backendNBO.id || '').toString(),
    // Map backend IDs to form fields (convert to string for form compatibility)
    bu: backendNBO.buId ? backendNBO.buId.toString() : backendNBO.bu || '',
    salesRep: backendNBO.salesRepId ? backendNBO.salesRepId.toString() : backendNBO.salesRep || backendNBO.salesRepName || '',
    appEng: backendNBO.appsEngId ? backendNBO.appsEngId.toString() : backendNBO.appEng || backendNBO.appsEngName || '',
    salesGroup: backendNBO.salesGroupId ? backendNBO.salesGroupId.toString() : backendNBO.salesGroup || backendNBO.salesGroupName || '',
    orderingType: backendNBO.orderingTypeId ? backendNBO.orderingTypeId.toString() : backendNBO.orderingType || backendNBO.orderingTypeName || '',
    status: backendNBO.nboStatusId ? backendNBO.nboStatusId.toString() : backendNBO.status || backendNBO.statusName || 'New',
    risk: backendNBO.riskId ? backendNBO.riskId.toString() : backendNBO.risk || backendNBO.riskName || '',
    type: backendNBO.typeId ? backendNBO.typeId.toString() : backendNBO.type || backendNBO.typeName || '',
    market: backendNBO.marketId ? backendNBO.marketId.toString() : backendNBO.market || backendNBO.marketName || '',
    assumedMarketShare: backendNBO.assumedMsValue || backendNBO.assumedMs ? (typeof backendNBO.assumedMsValue === 'number' ? backendNBO.assumedMsValue : (typeof backendNBO.assumedMs === 'number' ? backendNBO.assumedMs : parseFloat(backendNBO.assumedMsValue || backendNBO.assumedMs || '0'))) : undefined,
    yearlyData: convertYearlyData(backendNBO),
    expectedDecisionDate: formatDate(backendNBO.expectedDecisionDate),
    massProductionStart: formatDate(backendNBO.massProductionStart || backendNBO.orderStartDate),
    parentEndUser: backendNBO.parentEndUser || '',
    orderingCEMCM: backendNBO.ordering || backendNBO.orderingCEMCM || '',
    orderingLocation: backendNBO.orderingLocation || '',
    program: backendNBO.program || '',
    application: backendNBO.application || '',
    product: backendNBO.productId ? backendNBO.productId.toString() : backendNBO.product || '',
    pnProductDescription: backendNBO.productText || backendNBO.pnProductDescription || '',
    productLine: backendNBO.productLine || '',
    competition: backendNBO.competition || '',
    formFactor: backendNBO.formFactor || backendNBO.productf1Name || (backendNBO.productf1 ? backendNBO.productf1.toString() : ''),
    dataRate: backendNBO.dataRate || backendNBO.productf2Name || (backendNBO.productf2 ? backendNBO.productf2.toString() : ''),
    stacking: backendNBO.stacking || backendNBO.productf3Name || (backendNBO.productf3 ? backendNBO.productf3.toString() : ''),
    tsyAt100MS: backendNBO.tsyDec || backendNBO.tsyAt100MS || 0,
    tbvAt100MS: backendNBO.tbvAt100MS || 0,
    tsyAssumptions: backendNBO.tsyAssumptions || '',
    comments: backendNBO.comments || '',
    customerName: backendNBO.customerName || '',
    region: backendNBO.region || '',
    country: backendNBO.country || '',
    projectName: backendNBO.projectName || backendNBO.customerName || '',
    description: backendNBO.description || '',
    owner: backendNBO.owner || backendNBO.salesRepName || backendNBO.plOwnerId?.toString() || '',
    nboYear: backendNBO.nboYear || new Date().getFullYear(),
    quarter: backendNBO.quarter || undefined,
    winProbability: backendNBO.winProbability || 50,
    expectedValue: backendNBO.expectedValue || calculateTotalFromYearTotals(backendNBO) || backendNBO.assumedMsValue || 0,
    productManager: backendNBO.productManager || '',
    createdDate: formatDate(backendNBO.createdDate) || new Date().toISOString().split('T')[0],
    updatedDate: formatDate(backendNBO.updatedDate || backendNBO.lastUpdatedDate) || new Date().toISOString().split('T')[0],
    isArchived: backendNBO.isArchived || false,
  };
};

// Helper function to convert NBO to Opportunity format
const convertNBOToOpportunity = (nbo: NBO, pickList: any): Opportunity => {
  // Use buName from API response if available, otherwise lookup from pickList
  const buDisplay = (nbo as any).buName || pickList?.businessUnits?.find((item: any) => item.key === nbo.bu)?.value || nbo.bu || '';
  // Use statusName from API response if available, otherwise lookup from pickList
  const statusDisplay = (nbo as any).statusName || pickList?.statuses?.find((item: any) => item.key === nbo.status)?.value || nbo.status || 'New';
  
  // Map NBO status to Opportunity status
  const mapStatus = (status: string): 'Active' | 'Won' | 'Lost' | 'On Hold' => {
    if (status.toLowerCase().includes('won')) return 'Won';
    if (status.toLowerCase().includes('lost')) return 'Lost';
    if (status.toLowerCase().includes('hold')) return 'On Hold';
    return 'Active';
  };

  // Calculate total value from yearly data
  const calculateTotalValue = (yearlyData?: Record<number, any>) => {
    if (!yearlyData) return 0;
    return Object.keys(yearlyData).reduce((sum, year) => {
      const yearData = yearlyData[Number(year)];
      if (yearData.total !== undefined && yearData.total !== null) {
        return sum + (yearData.total || 0);
      }
      const { q1 = 0, q2 = 0, q3 = 0, q4 = 0 } = yearData;
      return sum + q1 + q2 + q3 + q4;
    }, 0);
  };

  return {
    id: nbo.id,
    name: nbo.projectName || nbo.customerName || 'Unnamed Opportunity',
    customer: nbo.customerName || '',
    bu: buDisplay,
    stage: statusDisplay,
    value: nbo.expectedValue || calculateTotalValue(nbo.yearlyData) || 0,
    probability: nbo.winProbability || 0,
    expectedCloseDate: nbo.expectedDecisionDate || '',
    owner: nbo.owner || nbo.salesRep || '',
    status: mapStatus(statusDisplay),
  };
};

export function ManageOpportunity() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [deleteOpportunity, setDeleteOpportunity] = useState<Opportunity | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('nboId');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const { pickList, refreshData } = useNBO();

  // Fetch opportunities from API with pagination
  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const request: PaginationRequest = {
        pageNo,
        pageSize,
        search: search || undefined,
        sortBy,
        sortDir,
      };
      
      const response = await nboApi.getPaginated(request);
      if (response && response.data) {
        const converted = response.data.map((nbo: any) => {
          const frontendNBO: NBO = convertBackendToFrontendNBO(nbo);
          return convertNBOToOpportunity(frontendNBO, pickList);
        });
        setOpportunities(converted);
        setTotalCount(response.count || 0);
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast.error('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [pageNo, pageSize, search, sortBy, sortDir, pickList]);

  const [formData, setFormData] = useState({
    name: '',
    customer: '',
    bu: '',
    stage: '',
    value: '',
    probability: '',
    expectedCloseDate: '',
    owner: '',
    region: '',
    country: '',
    description: '',
    comments: '',
  });

  const handleView = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setViewMode('view');
  };

  const handleEdit = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setFormData({
      name: opp.name,
      customer: opp.customer,
      bu: opp.bu,
      stage: opp.stage,
      value: opp.value.toString(),
      probability: opp.probability.toString(),
      expectedCloseDate: opp.expectedCloseDate,
      owner: opp.owner,
      region: '',
      country: '',
      description: '',
      comments: '',
    });
    setViewMode('edit');
  };

  const handleCreateNew = () => {
    setSelectedOpportunity(null);
    setFormData({
      name: '',
      customer: '',
      bu: '',
      stage: '',
      value: '',
      probability: '',
      expectedCloseDate: '',
      owner: '',
      region: '',
      country: '',
      description: '',
      comments: '',
    });
    setCurrentStep(1);
    setViewMode('create');
  };

  const handleDelete = async () => {
    if (!deleteOpportunity) return;
    try {
      await nboApi.delete(deleteOpportunity.id);
      await refreshData(); // Refresh context data
      await fetchOpportunities(); // Refetch paginated data
      toast.success('Opportunity deleted successfully');
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      toast.error('Failed to delete opportunity');
    } finally {
      setDeleteOpportunity(null);
    }
  };

  const handleSaveOpportunity = async () => {
    if (!formData.name || !formData.customer || !formData.bu) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (viewMode === 'edit' && selectedOpportunity) {
        // Fetch the original NBO to update
        const response = await nboApi.getById(selectedOpportunity.id);
        const originalNBO = convertBackendToFrontendNBO(response.data);
        
        // Prepare update data
        const updateData = {
          ...originalNBO,
          projectName: formData.name,
          customerName: formData.customer,
          bu: formData.bu,
          status: formData.stage,
          expectedValue: parseFloat(formData.value) || 0,
          winProbability: parseFloat(formData.probability) || 0,
          expectedDecisionDate: formData.expectedCloseDate,
          owner: formData.owner,
          salesRep: formData.owner,
          region: formData.region || originalNBO.region,
          country: formData.country || originalNBO.country,
          description: formData.description || originalNBO.description,
          comments: formData.comments || originalNBO.comments,
        };

        await nboApi.update(selectedOpportunity.id, updateData);
        await refreshData();
        await fetchOpportunities(); // Refetch paginated data
        toast.success('Opportunity updated successfully');
      } else {
        // Create new NBO
        const newNBO = {
          projectName: formData.name,
          customerName: formData.customer,
          bu: formData.bu,
          status: formData.stage || 'New',
          expectedValue: parseFloat(formData.value) || 0,
          winProbability: parseFloat(formData.probability) || 0,
          expectedDecisionDate: formData.expectedCloseDate,
          owner: formData.owner,
          salesRep: formData.owner,
          region: formData.region || '',
          country: formData.country || '',
          description: formData.description || '',
          comments: formData.comments || '',
          application: '',
          productLine: '',
          nboYear: new Date().getFullYear(),
          createdDate: new Date().toISOString().split('T')[0],
          updatedDate: new Date().toISOString().split('T')[0],
          isArchived: false,
        };

        await nboApi.create(newNBO);
        await refreshData();
        await fetchOpportunities(); // Refetch paginated data
        toast.success('Opportunity created successfully');
      }

      setViewMode('list');
    } catch (error) {
      console.error('Error saving opportunity:', error);
      toast.error(`Failed to ${viewMode === 'edit' ? 'update' : 'create'} opportunity`);
    }
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

  // List View
  if (viewMode === 'list') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1>Manage Opportunities</h1>
            <p className="text-gray-600">View and manage all opportunities</p>
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            New Opportunity
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Opportunities</CardTitle>
                <CardDescription>
                  {loading ? 'Loading...' : `Showing ${opportunities.length} of ${totalCount} opportunities`}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search opportunities..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPageNo(1); // Reset to first page on search
                  }}
                  className="w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading opportunities...</p>
                </div>
              </div>
            ) : opportunities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No opportunities found</p>
                <Button onClick={handleCreateNew} className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Opportunity
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Business Unit</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Expected Close</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opportunities.map((opp) => (
                  <TableRow 
                    key={opp.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleView(opp)}
                  >
                    <TableCell>{opp.name}</TableCell>
                    <TableCell>{opp.customer}</TableCell>
                    <TableCell>{opp.bu}</TableCell>
                    <TableCell>
                      <Badge className={getStageColor(opp.stage)}>
                        {opp.stage}
                      </Badge>
                    </TableCell>
                    <TableCell>${opp.value.toLocaleString()}</TableCell>
                    <TableCell>{opp.probability}%</TableCell>
                    <TableCell>{opp.expectedCloseDate}</TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(opp)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteOpportunity(opp)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            
            {/* Pagination Controls */}
            {!loading && opportunities.length > 0 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Page {pageNo} of {Math.ceil(totalCount / pageSize)} ({totalCount} total)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageNo(1)}
                    disabled={pageNo === 1}
                  >
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageNo(prev => Math.max(1, prev - 1))}
                    disabled={pageNo === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageNo(prev => Math.min(Math.ceil(totalCount / pageSize), prev + 1))}
                    disabled={pageNo >= Math.ceil(totalCount / pageSize)}
                  >
                    Next
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageNo(Math.ceil(totalCount / pageSize))}
                    disabled={pageNo >= Math.ceil(totalCount / pageSize)}
                  >
                    Last
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteOpportunity} onOpenChange={() => setDeleteOpportunity(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Opportunity?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deleteOpportunity?.name}"? This action cannot be undone.
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

  // View Mode
  if (viewMode === 'view' && selectedOpportunity) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setViewMode('list')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1>{selectedOpportunity.name}</h1>
            <p className="text-gray-600">Opportunity Details</p>
          </div>
          <Button variant="outline" onClick={() => handleEdit(selectedOpportunity)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Opportunity Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Customer</Label>
                  <p>{selectedOpportunity.customer}</p>
                </div>
                <div>
                  <Label>Business Unit</Label>
                  <p>{selectedOpportunity.bu}</p>
                </div>
                <div>
                  <Label>Stage</Label>
                  <Badge className={getStageColor(selectedOpportunity.stage)}>
                    {selectedOpportunity.stage}
                  </Badge>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge>{selectedOpportunity.status}</Badge>
                </div>
                <div>
                  <Label>Opportunity Value</Label>
                  <p>${selectedOpportunity.value.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Win Probability</Label>
                  <p>{selectedOpportunity.probability}%</p>
                </div>
                <div>
                  <Label>Expected Close Date</Label>
                  <p>{selectedOpportunity.expectedCloseDate}</p>
                </div>
                <div>
                  <Label>Owner</Label>
                  <p>{selectedOpportunity.owner}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm">Opportunity created</p>
                    <p className="text-xs text-gray-500">2 days ago by {selectedOpportunity.owner}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm">Stage changed to {selectedOpportunity.stage}</p>
                    <p className="text-xs text-gray-500">5 days ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm">Value updated</p>
                    <p className="text-xs text-gray-500">1 week ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Create/Edit Form
  const steps = ['Basic Details', 'Customer Info', 'Financials', 'Attachments'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setViewMode('list')} title="Return to Opportunities List">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1>{viewMode === 'create' ? 'Create New' : 'Edit'} Opportunity</h1>
          <p className="text-gray-600">Fill in the details below</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                currentStep === index + 1
                  ? 'bg-blue-600 text-white'
                  : currentStep > index + 1
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index + 1}
            </div>
            <span className="text-sm">{step}</span>
            {index < steps.length - 1 && <div className="w-12 h-0.5 bg-gray-300" />}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Opportunity Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter opportunity name"
                  />
                </div>
                <div>
                  <Label>Business Unit *</Label>
                  <Select value={formData.bu} onValueChange={(value: string) => setFormData({ ...formData, bu: value })}>
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
                  <Label>Stage</Label>
                  <Select value={formData.stage} onValueChange={(value: string) => setFormData({ ...formData, stage: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
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
                <div>
                  <Label>Owner</Label>
                  <Input
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    placeholder="Enter owner name"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer Name *</Label>
                  <Input
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <Label>Region</Label>
                  <Select value={formData.region} onValueChange={(value: string) => setFormData({ ...formData, region: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
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
                  <Label>Country</Label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Enter country"
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter opportunity description"
                  rows={4}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Opportunity Value ($)</Label>
                  <Input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="Enter value"
                  />
                </div>
                <div>
                  <Label>Win Probability (%)</Label>
                  <Input
                    type="number"
                    value={formData.probability}
                    onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                    placeholder="Enter probability"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label>Expected Close Date</Label>
                  <Input
                    type="date"
                    value={formData.expectedCloseDate}
                    onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Comments</Label>
                <Textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  placeholder="Enter any additional comments"
                  rows={4}
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">Drag and drop files here or click to browse</p>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
              </div>
              <p className="text-xs text-gray-500">Supported formats: PDF, DOC, DOCX, XLS, XLSX (Max 10MB)</p>
            </div>
          )}

          <Separator className="my-6" />

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setViewMode('list')}>
                Cancel
              </Button>
              {currentStep < steps.length ? (
                <Button onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSaveOpportunity}>
                  {viewMode === 'create' ? 'Create' : 'Update'} Opportunity
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}