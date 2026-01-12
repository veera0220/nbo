import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNBO } from '../context/NBOContext';
import { nboApi } from '../services/api';
import type { NBO } from '../context/NBOContext';
import { ArrowLeft, Info, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Separator } from './ui/separator';

const currentYear = new Date().getFullYear();

// Mock data for dropdowns (fallback if API data not available)
const applications = ['Network Switch', 'Server', 'Storage', 'Data Center Switch', '5G Base Station', 'Router'];
const products = ['QSFP-DD Connectors', 'OSFP Connectors', 'Power Distribution', 'RF Connectors', 'Cable Assemblies'];

// Helper function to convert backend NBO to frontend format
const convertBackendToFrontendNBO = (backendNBO: any): NBO => {
  // Helper function to convert yearly data from backend format to frontend format
  const convertYearlyData = (backendData: any, backendNBO: any): Record<number, { q1?: number; q2?: number; q3?: number; q4?: number; total?: number }> | undefined => {
    // First, try to reconstruct from year0-year9 fields if they exist
    const yearlyData: Record<number, any> = {};
    const currentYear = new Date().getFullYear();
    let hasYearlyData = false;
    
    for (let i = 0; i <= 9; i++) {
      const year = currentYear + i;
      const q1 = backendNBO[`year${i}Q1Dec`];
      const q2 = backendNBO[`year${i}Q2Dec`];
      const q3 = backendNBO[`year${i}Q3Dec`];
      const q4 = backendNBO[`year${i}Q4Dec`];
      const total = backendNBO[`year${i}Total`];
      
      // Check if any quarter data exists
      const hasQuarterData = (q1 !== null && q1 !== undefined) || 
                            (q2 !== null && q2 !== undefined) || 
                            (q3 !== null && q3 !== undefined) || 
                            (q4 !== null && q4 !== undefined);
      
      if (hasQuarterData) {
        yearlyData[year] = {
          q1: q1 ?? 0,
          q2: q2 ?? 0,
          q3: q3 ?? 0,
          q4: q4 ?? 0,
        };
        hasYearlyData = true;
      } else if (total !== null && total !== undefined && total !== 0) {
        yearlyData[year] = { total: total };
        hasYearlyData = true;
      }
    }
    
    // If we found yearly data from year fields, return it
    if (hasYearlyData) {
      return yearlyData;
    }
    
    // Otherwise, try to use the backendData if provided
    if (backendData) {
      if (typeof backendData === 'string') {
        try {
          const parsed = JSON.parse(backendData);
          return parsed;
        } catch {
          return undefined;
        }
      }
      return backendData;
    }
    
    return undefined;
  };

  // Format date to YYYY-MM-DD for date inputs
  const formatDate = (date: any): string => {
    if (!date) return '';
    if (typeof date === 'string') {
      // If it's already in YYYY-MM-DD format, return as is
      if (date.match(/^\d{4}-\d{2}-\d{2}$/)) return date;
      // Try to parse and format
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split('T')[0];
      }
    }
    return '';
  };

  return {
    ...backendNBO,
    id: (backendNBO.nboId || backendNBO.id || '').toString(),
    // Map backend IDs to form fields (convert to string for form compatibility)
    bu: backendNBO.buId ? backendNBO.buId.toString() : backendNBO.bu || '',
    salesRep: backendNBO.salesRepId ? backendNBO.salesRepId.toString() : backendNBO.salesRep || '',
    appEng: backendNBO.appsEngId ? backendNBO.appsEngId.toString() : backendNBO.appEng || '',
    salesGroup: backendNBO.salesGroupId ? backendNBO.salesGroupId.toString() : backendNBO.salesGroup || '',
    orderingType: backendNBO.orderingType ? backendNBO.orderingType.toString() : backendNBO.orderingType || '',
    status: backendNBO.nboStatusId ? backendNBO.nboStatusId.toString() : backendNBO.status || backendNBO.statusName || 'New',
    risk: backendNBO.riskId ? backendNBO.riskId.toString() : backendNBO.risk || '',
    type: backendNBO.typeId ? backendNBO.typeId.toString() : backendNBO.type || '',
    market: backendNBO.marketId ? backendNBO.marketId.toString() : backendNBO.market || '',
    assumedMarketShare: backendNBO.assumedMs ? (typeof backendNBO.assumedMs === 'number' ? backendNBO.assumedMs : parseInt(backendNBO.assumedMs)) : undefined,
    yearlyData: convertYearlyData(backendNBO.yearlyData, backendNBO),
    expectedDecisionDate: formatDate(backendNBO.expectedDecisionDate),
    massProductionStart: formatDate(backendNBO.massProductionStart || backendNBO.orderStartDate),
    parentEndUser: backendNBO.parentEndUser || '',
    orderingCEMCM: backendNBO.ordering || backendNBO.orderingCEMCM || '',
    orderingLocation: backendNBO.orderingLocation || '',
    program: backendNBO.program || '',
    application: backendNBO.application || '',
    product: backendNBO.product || '',
    pnProductDescription: backendNBO.productText || backendNBO.pnProductDescription || '',
    productActive: backendNBO.productActive || 'Active',
    competition: backendNBO.competition || '',
    formFactor: backendNBO.formFactor || backendNBO.productf1Name || '',
    dataRate: backendNBO.dataRate || backendNBO.productf2Name || '',
    stacking: backendNBO.stacking || backendNBO.productf3Name || '',
    tsyAt100MS: backendNBO.tsyDec || backendNBO.tsyAt100MS || 0,
    tbvAt100MS: backendNBO.tbvAt100MS || 0,
    tsyAssumptions: backendNBO.tsyAssumptions || '',
    comments: backendNBO.comments || '',
    customerName: backendNBO.customerName || '',
    region: backendNBO.region || '',
    country: backendNBO.country || '',
    productLine: backendNBO.productLine || '',
    projectName: backendNBO.projectName || '',
    description: backendNBO.description || '',
    owner: backendNBO.owner || '',
    nboYear: backendNBO.nboYear || new Date().getFullYear(),
    quarter: backendNBO.quarter || undefined,
    winProbability: backendNBO.winProbability || 50,
    expectedValue: backendNBO.expectedValue || 0,
    productManager: backendNBO.productManager || '',
    createdDate: formatDate(backendNBO.createdDate) || new Date().toISOString().split('T')[0],
    updatedDate: formatDate(backendNBO.updatedDate || backendNBO.lastUpdatedDate) || new Date().toISOString().split('T')[0],
    isArchived: backendNBO.isArchived || false,
  };
};

export function EditNBO() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateNBO, formFactors, dataRates, stackings, pickList, loading: contextLoading } = useNBO();
  
  const [nbo, setNbo] = useState<NBO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    salesRep: '',
    appEng: '',
    salesGroup: '',
    bu: '',
    expectedDecisionDate: '',
    massProductionStart: '',
    parentEndUser: '',
    orderingType: '',
    orderingCEMCM: '',
    orderingLocation: '',
    program: '',
    application: '',
    market: '',
    product: '',
    pnProductDescription: '',
    productActive: 'Active',
    status: 'New' as const,
    risk: '',
    type: '',
    competition: '',
    formFactor: '',
    dataRate: '',
    stacking: '',
    tsyAt100MS: 0,
    assumedMarketShare: '',
    yearlyData: {
      2025: { q1: 0, q2: 0, q3: 0, q4: 0 },
      2026: { q1: 0, q2: 0, q3: 0, q4: 0 },
      2027: { total: 0 },
      2028: { total: 0 },
    },
    tsyAssumptions: '',
    comments: '',
  });

  const [tsyAssumptionsLength, setTsyAssumptionsLength] = useState(0);
  const [commentsLength, setCommentsLength] = useState(0);

  // Fetch NBO by ID from API
  useEffect(() => {
    const fetchNBO = async () => {
      if (!id) {
        setError('NBO ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await nboApi.getById(id);
        const fetchedNBO = convertBackendToFrontendNBO(response.data);
        setNbo(fetchedNBO);
      } catch (err) {
        console.error('Error fetching NBO:', err);
        setError('Failed to load NBO. Please try again.');
        toast.error('Failed to load NBO');
      } finally {
        setLoading(false);
      }
    };

    fetchNBO();
  }, [id]);

  // Update form data when NBO is loaded
  useEffect(() => {
    if (nbo) {
      // Ensure yearlyData has the expected structure with default years
      const defaultYearlyData = {
        2025: { q1: 0, q2: 0, q3: 0, q4: 0 },
        2026: { q1: 0, q2: 0, q3: 0, q4: 0 },
        2027: { total: 0 },
        2028: { total: 0 },
      };
      
      // Merge backend yearlyData with defaults
      const mergedYearlyData = nbo.yearlyData 
        ? { ...defaultYearlyData, ...nbo.yearlyData }
        : defaultYearlyData;

      // Convert formFactor, dataRate, and stacking IDs to names if needed
      let formFactorName = nbo.formFactor || '';
      let dataRateName = nbo.dataRate || '';
      let stackingName = nbo.stacking || '';
      
      // If formFactor is an ID (numeric string), look up the name
      if (formFactorName && !isNaN(Number(formFactorName)) && formFactors.length > 0) {
        const ff = formFactors.find(f => f.id === formFactorName);
        if (ff) formFactorName = ff.name;
      }
      
      // If dataRate is an ID (numeric string), look up the name
      if (dataRateName && !isNaN(Number(dataRateName)) && dataRates.length > 0) {
        const dr = dataRates.find(d => d.id === dataRateName);
        if (dr) dataRateName = dr.name;
      }
      
      // If stacking is an ID (numeric string), look up the name
      if (stackingName && !isNaN(Number(stackingName)) && stackings.length > 0) {
        const st = stackings.find(s => s.id === stackingName);
        if (st) stackingName = st.name;
      }

      // Convert status: if it's a name (not a numeric ID), look up the ID from pickList
      let statusValue = nbo.status || 'New';
      if (statusValue && isNaN(Number(statusValue)) && pickList?.statuses) {
        // Status is a name, find the corresponding ID
        const statusItem = pickList.statuses.find(item => item.value === statusValue);
        if (statusItem) {
          statusValue = statusItem.key;
        }
      }

      setFormData({
        salesRep: nbo.salesRep || '',
        appEng: nbo.appEng || '',
        salesGroup: nbo.salesGroup || '',
        bu: nbo.bu || '',
        expectedDecisionDate: nbo.expectedDecisionDate || '',
        massProductionStart: nbo.massProductionStart || '',
        parentEndUser: nbo.parentEndUser || '',
        orderingType: nbo.orderingType || '',
        orderingCEMCM: nbo.orderingCEMCM || '',
        orderingLocation: nbo.orderingLocation || '',
        program: nbo.program || '',
        application: nbo.application || '',
        market: nbo.market || '',
        product: nbo.product || '',
        pnProductDescription: nbo.pnProductDescription || '',
        productActive: nbo.productActive || 'Active',
        status: statusValue,
        risk: nbo.risk || '',
        type: nbo.type || '',
        competition: nbo.competition || '',
        formFactor: formFactorName,
        dataRate: dataRateName,
        stacking: stackingName,
        tsyAt100MS: nbo.tsyAt100MS || 0,
        assumedMarketShare: nbo.assumedMarketShare ? nbo.assumedMarketShare.toString() : '',
        yearlyData: mergedYearlyData,
        tsyAssumptions: nbo.tsyAssumptions || '',
        comments: nbo.comments || '',
      });
      setTsyAssumptionsLength(nbo.tsyAssumptions?.length || 0);
      setCommentsLength(nbo.comments?.length || 0);
    }
  }, [nbo, formFactors, dataRates, stackings, pickList]);

  // Get dropdown options from API - keep full objects to access both key (ID) and value (name)
  const salesGroups = pickList?.salesGroups || [];
  const businessUnits = pickList?.businessUnits || [];
  const orderingTypes = pickList?.orderingTypes || [];
  const markets = pickList?.markets || [];
  const statuses = pickList?.statuses || [];
  const riskLevels = pickList?.risks || [];
  const types = pickList?.types || [];
  const salesReps = pickList?.salesReps || [];
  const appEngs = pickList?.appsEngs || [];
  const assumedMarketShares = pickList?.assumedMarketShares || [];
  
  // Helper function to find display value by ID
  const getDisplayValue = (items: Array<{key: string, value: string}>, id: string) => {
    return items.find(item => item.key === id)?.value || '';
  };

  // Show loading state while data is being fetched
  if (loading || contextLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  if (error || !nbo) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">{error || 'NBO not found'}</h2>
          <p className="text-gray-600 mb-4">The requested NBO could not be loaded.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/nbos')} variant="outline">
              Back to NBOs
            </Button>
            {error && (
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Check if HSIO Connectors is selected by comparing ID or value
  const selectedBU = businessUnits.find(item => item.key === formData.bu);
  const isHSIO = selectedBU?.value === 'HSIO Connectors' || formData.bu === 'HSIO Connectors';

  const availableDataRates = formData.formFactor
    ? dataRates.filter(dr => {
        const ff = formFactors.find(f => f.name === formData.formFactor);
        return ff && dr.formFactorId === ff.id;
      })
    : [];

  const availableStackings = formData.formFactor && formData.dataRate
    ? stackings.filter(st => {
        const ff = formFactors.find(f => f.name === formData.formFactor);
        const dr = dataRates.find(d => d.name === formData.dataRate && d.formFactorId === ff?.id);
        return ff && dr && st.formFactorId === ff.id && st.dataRateId === dr.id;
      })
    : [];

  const calculateYearTotal = (year: number) => {
    const yearData = formData.yearlyData[year];
    if ('total' in yearData && yearData.total !== undefined) {
      return yearData.total;
    }
    const { q1 = 0, q2 = 0, q3 = 0, q4 = 0 } = yearData;
    return q1 + q2 + q3 + q4;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.salesRep || !formData.bu) {
      toast.error('Please fill in required fields');
      return;
    }

    if (isHSIO && (!formData.formFactor || !formData.dataRate || !formData.stacking)) {
      toast.error('HSIO Connectors require Form Factor, Data Rate, and Stacking');
      return;
    }

    const expectedValue = Object.keys(formData.yearlyData).reduce((sum, year) => {
      return sum + calculateYearTotal(Number(year));
    }, 0) * (Number(formData.assumedMarketShare) / 100);

    const productManager = formData.formFactor
      ? formFactors.find(ff => ff.name === formData.formFactor)?.productManager
      : undefined;

    updateNBO(id!, {
      ...formData,
      expectedValue,
      owner: formData.salesRep,
      customerName: formData.parentEndUser || nbo.customerName,
      region: formData.salesGroup || nbo.region,
      productLine: formData.product || nbo.productLine,
      projectName: formData.program || nbo.projectName,
      description: formData.comments || nbo.description,
      formFactor: isHSIO ? formData.formFactor : undefined,
      dataRate: isHSIO ? formData.dataRate : undefined,
      stacking: isHSIO ? formData.stacking : undefined,
      productManager: isHSIO ? productManager : undefined,
    } as any);

    toast.success('NBO updated successfully');
    navigate(`/nbos/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} title="Return to previous page">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl">Edit Business Opportunity</h1>
            <p className="text-sm text-gray-600 mt-1">
              Edit the form below to update this business opportunity
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: Basic Information */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                  1
                </div>
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <div className="space-y-4">
                  <Label htmlFor="salesRep" className="flex items-center gap-1">
                    Sales Rep <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.salesRep} onValueChange={(value) => setFormData({ ...formData, salesRep: value })}>
                    <SelectTrigger id="salesRep">
                      <SelectValue placeholder="Select sales representative">
                        {formData.salesRep ? getDisplayValue(salesReps, formData.salesRep) : ''}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {salesReps.length > 0 ? (
                        salesReps.map(item => (
                          <SelectItem key={item.key} value={item.key}>{item.value}</SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>Loading...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="appEng">App Eng</Label>
                  <Select value={formData.appEng} onValueChange={(value) => setFormData({ ...formData, appEng: value })}>
                    <SelectTrigger id="appEng">
                      <SelectValue placeholder="Select application engineer">
                        {formData.appEng ? getDisplayValue(appEngs, formData.appEng) : ''}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {appEngs.length > 0 ? (
                        appEngs.map(item => (
                          <SelectItem key={item.key} value={item.key}>{item.value}</SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>Loading...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="salesGroup">Sales Group</Label>
                  <Select value={formData.salesGroup} onValueChange={(value) => setFormData({ ...formData, salesGroup: value })}>
                    <SelectTrigger id="salesGroup">
                      <SelectValue placeholder="Select sales group">
                        {formData.salesGroup ? getDisplayValue(salesGroups, formData.salesGroup) : ''}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {salesGroups.length > 0 ? (
                        salesGroups.map(item => (
                          <SelectItem key={item.key} value={item.key}>{item.value}</SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>Loading...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="bu" className="flex items-center gap-1">
                    Business Unit <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.bu} 
                    onValueChange={(value) => setFormData({ 
                      ...formData, 
                      bu: value, 
                      formFactor: '', 
                      dataRate: '', 
                      stacking: '' 
                    })}
                  >
                    <SelectTrigger id="bu">
                      <SelectValue placeholder="Select business unit">
                        {formData.bu ? getDisplayValue(businessUnits, formData.bu) : ''}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {businessUnits.length > 0 ? (
                        businessUnits.map(item => (
                          <SelectItem key={item.key} value={item.key}>{item.value}</SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>Loading...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="expectedDecisionDate">Expected Decision Date</Label>
                  <Input
                    id="expectedDecisionDate"
                    type="date"
                    value={formData.expectedDecisionDate}
                    onChange={(e) => setFormData({ ...formData, expectedDecisionDate: e.target.value })}
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="massProductionStart">Mass Production Start</Label>
                  <Input
                    id="massProductionStart"
                    type="date"
                    value={formData.massProductionStart}
                    onChange={(e) => setFormData({ ...formData, massProductionStart: e.target.value })}
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="parentEndUser">Parent/End User</Label>
                  <Input
                    id="parentEndUser"
                    value={formData.parentEndUser}
                    onChange={(e) => setFormData({ ...formData, parentEndUser: e.target.value })}
                    placeholder="Enter parent or end user company"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="orderingType">Ordering Type</Label>
                  <Select value={formData.orderingType} onValueChange={(value) => setFormData({ ...formData, orderingType: value })}>
                    <SelectTrigger id="orderingType">
                      <SelectValue placeholder="Select ordering type">
                        {formData.orderingType ? getDisplayValue(orderingTypes, formData.orderingType) : ''}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {orderingTypes.length > 0 ? (
                        orderingTypes.map(item => (
                          <SelectItem key={item.key} value={item.key}>{item.value}</SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>Loading...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="orderingCEMCM">Ordering CEM/CM</Label>
                  <Input
                    id="orderingCEMCM"
                    value={formData.orderingCEMCM}
                    onChange={(e) => setFormData({ ...formData, orderingCEMCM: e.target.value })}
                    placeholder="Enter CEM/CM name"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="orderingLocation">Ordering Location</Label>
                  <Input
                    id="orderingLocation"
                    value={formData.orderingLocation}
                    onChange={(e) => setFormData({ ...formData, orderingLocation: e.target.value })}
                    placeholder="Enter location"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="program">Program</Label>
                  <Input
                    id="program"
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    placeholder="Enter program name"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="application">Application</Label>
                  <Select value={formData.application} onValueChange={(value) => setFormData({ ...formData, application: value })}>
                    <SelectTrigger id="application">
                      <SelectValue placeholder="Select application" />
                    </SelectTrigger>
                    <SelectContent>
                      {applications.map(app => (
                        <SelectItem key={app} value={app}>{app}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="market">Market</Label>
                  <Select value={formData.market} onValueChange={(value) => setFormData({ ...formData, market: value })}>
                    <SelectTrigger id="market">
                      <SelectValue placeholder="Select market">
                        {formData.market ? getDisplayValue(markets, formData.market) : ''}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {markets.length > 0 ? (
                        markets.map(item => (
                          <SelectItem key={item.key} value={item.key}>{item.value}</SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>Loading...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <div className="space-y-4">
                  <Label htmlFor="formFactor" className="flex items-center gap-1">
                    Product Form Factor
                    {isHSIO && <span className="text-red-500">*</span>}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Select this first - it determines available Data Rates</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Select 
                    value={formData.formFactor} 
                    onValueChange={(value) => setFormData({ 
                      ...formData, 
                      formFactor: value, 
                      dataRate: '', 
                      stacking: '' 
                    })}
                  >
                    <SelectTrigger id="formFactor">
                      <SelectValue placeholder="Select form factor" />
                    </SelectTrigger>
                    <SelectContent>
                      {formFactors.map(ff => (
                        <SelectItem key={ff.id} value={ff.name}>{ff.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="dataRate" className="flex items-center gap-1">
                    Product Data Rate
                    {isHSIO && <span className="text-red-500">*</span>}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Options depend on selected Form Factor</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Select 
                    value={formData.dataRate} 
                    onValueChange={(value) => setFormData({ 
                      ...formData, 
                      dataRate: value, 
                      stacking: '' 
                    })}
                    disabled={!formData.formFactor}
                  >
                    <SelectTrigger id="dataRate">
                      <SelectValue placeholder={formData.formFactor ? "Select data rate" : "Select form factor first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDataRates.map(dr => (
                        <SelectItem key={dr.id} value={dr.name}>{dr.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="stacking" className="flex items-center gap-1">
                    Product CN Cage, Stacked
                    {isHSIO && <span className="text-red-500">*</span>}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Options depend on Form Factor + Data Rate combination</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Select 
                    value={formData.stacking} 
                    onValueChange={(value) => setFormData({ ...formData, stacking: value })}
                    disabled={!formData.dataRate}
                  >
                    <SelectTrigger id="stacking">
                      <SelectValue placeholder={formData.dataRate ? "Select stacking" : "Select data rate first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStackings.map(st => (
                        <SelectItem key={st.id} value={st.name}>{st.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="product">Product</Label>
                  <Select value={formData.product} onValueChange={(value) => setFormData({ ...formData, product: value })}>
                    <SelectTrigger id="product">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(prod => (
                        <SelectItem key={prod} value={prod}>{prod}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="pnProductDescription">P/N Product Description</Label>
                  <Input
                    id="pnProductDescription"
                    value={formData.pnProductDescription}
                    onChange={(e) => setFormData({ ...formData, pnProductDescription: e.target.value })}
                    placeholder="Enter part number or product description"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="productActive">Product Active</Label>
                  <Select value={formData.productActive} onValueChange={(value) => setFormData({ ...formData, productActive: value })}>
                    <SelectTrigger id="productActive">
                      <SelectValue placeholder="Select product active status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger id="status">
                      <SelectValue>
                        {formData.status ? getDisplayValue(statuses, formData.status) : ''}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.length > 0 ? (
                        statuses.map(item => (
                          <SelectItem key={item.key} value={item.key}>{item.value}</SelectItem>
                        ))
                      ) : (
                        <SelectItem value="New">New</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="risk">Risk</Label>
                  <Select value={formData.risk} onValueChange={(value) => setFormData({ ...formData, risk: value })}>
                    <SelectTrigger id="risk">
                      <SelectValue placeholder="Select risk level">
                        {formData.risk ? getDisplayValue(riskLevels, formData.risk) : ''}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {riskLevels.length > 0 ? (
                        riskLevels.map(item => (
                          <SelectItem key={item.key} value={item.key}>{item.value}</SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>Loading...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type">
                        {formData.type ? getDisplayValue(types, formData.type) : ''}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {types.length > 0 ? (
                        types.map(item => (
                          <SelectItem key={item.key} value={item.key}>{item.value}</SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>Loading...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="competition">Competition</Label>
                  <Input
                    id="competition"
                    value={formData.competition}
                    onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
                    placeholder="e.g., TE Connectivity, Molex, Amphenol"
                  />
                </div>
              </div>

              {/* Product Manager Info - Show when Form Factor is selected */}
              {formData.formFactor && (
                <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-md">
                  <p className="text-sm text-blue-900">
                    <strong>Product Manager:</strong> {formFactors.find(ff => ff.name === formData.formFactor)?.productManager || 'N/A'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Forecast Information */}
          <Card>
            <CardHeader>
              <CardTitle>Forecast Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <div className="space-y-4">
                  <Label htmlFor="tsyAt100MS" className="flex items-center gap-1">
                    TSY (at 100% MS)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Total Serviceable Year at 100% Market Share (US $K)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="tsyAt100MS"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.tsyAt100MS}
                    onChange={(e) => setFormData({ ...formData, tsyAt100MS: Number(e.target.value) })}
                    placeholder="Enter amount in US $K"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="assumedMarketShare">Assumed Market Share %</Label>
                  <Select value={formData.assumedMarketShare} onValueChange={(value) => setFormData({ ...formData, assumedMarketShare: value })}>
                    <SelectTrigger id="assumedMarketShare">
                      <SelectValue placeholder="Select market share percentage">
                        {formData.assumedMarketShare ? getDisplayValue(assumedMarketShares, formData.assumedMarketShare) : ''}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {assumedMarketShares.length > 0 ? (
                        assumedMarketShares.map(item => (
                          <SelectItem key={item.key} value={item.key}>{item.value}</SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>Loading...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Breakdown by Year</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* 2025 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">2025</h4>
                  <div className="text-sm text-gray-600">
                    Total: <span className="font-semibold text-blue-600">
                      ${calculateYearTotal(2025).toLocaleString()} K
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['q1', 'q2', 'q3', 'q4'].map((q) => (
                    <div key={q} className="space-y-1.5">
                      <Label htmlFor={`2025-${q}`} className="text-xs">2025 {q.toUpperCase()} (US $K)</Label>
                      <Input
                        id={`2025-${q}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.yearlyData[2025][q as 'q1' | 'q2' | 'q3' | 'q4']}
                        onChange={(e) => setFormData({
                          ...formData,
                          yearlyData: {
                            ...formData.yearlyData,
                            2025: { ...formData.yearlyData[2025], [q]: Number(e.target.value) }
                          }
                        })}
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* 2026 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">2026</h4>
                  <div className="text-sm text-gray-600">
                    Total: <span className="font-semibold text-blue-600">
                      ${calculateYearTotal(2026).toLocaleString()} K
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['q1', 'q2', 'q3', 'q4'].map((q) => (
                    <div key={q} className="space-y-1.5">
                      <Label htmlFor={`2026-${q}`} className="text-xs">2026 {q.toUpperCase()} (US $K)</Label>
                      <Input
                        id={`2026-${q}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.yearlyData[2026][q as 'q1' | 'q2' | 'q3' | 'q4']}
                        onChange={(e) => setFormData({
                          ...formData,
                          yearlyData: {
                            ...formData.yearlyData,
                            2026: { ...formData.yearlyData[2026], [q]: Number(e.target.value) }
                          }
                        })}
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* 2027 & 2028 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label htmlFor="2027-total" className="font-medium text-gray-900">
                    2027 Total (US $K)
                  </Label>
                  <Input
                    id="2027-total"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.yearlyData[2027].total}
                    onChange={(e) => setFormData({
                      ...formData,
                      yearlyData: {
                        ...formData.yearlyData,
                        2027: { total: Number(e.target.value) }
                      }
                    })}
                    placeholder="0"
                    className="text-base"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="2028-total" className="font-medium text-gray-900">
                    2028 Total (US $K)
                  </Label>
                  <Input
                    id="2028-total"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.yearlyData[2028].total}
                    onChange={(e) => setFormData({
                      ...formData,
                      yearlyData: {
                        ...formData.yearlyData,
                        2028: { total: Number(e.target.value) }
                      }
                    })}
                    placeholder="0"
                    className="text-base"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="tsyAssumptions">100% MS TSY Assumptions</Label>
                  <span className="text-xs text-gray-500">
                    {tsyAssumptionsLength} / 1000 characters
                  </span>
                </div>
                <Textarea
                  id="tsyAssumptions"
                  value={formData.tsyAssumptions}
                  onChange={(e) => {
                    if (e.target.value.length <= 1000) {
                      setFormData({ ...formData, tsyAssumptions: e.target.value });
                      setTsyAssumptionsLength(e.target.value.length);
                    }
                  }}
                  rows={5}
                  placeholder="Enter assumptions for 100% Market Share TSY calculation..."
                  className="resize-none"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="comments">Comments</Label>
                  <span className="text-xs text-gray-500">
                    {commentsLength} / 1000 characters
                  </span>
                </div>
                <Textarea
                  id="comments"
                  value={formData.comments}
                  onChange={(e) => {
                    if (e.target.value.length <= 1000) {
                      setFormData({ ...formData, comments: e.target.value });
                      setCommentsLength(e.target.value.length);
                    }
                  }}
                  rows={5}
                  placeholder="Enter any additional comments or notes about this NBO..."
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* SECTION 6: Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 pb-8">
            <Button 
              type="button" 
              variant="outline" 
              size="lg"
              onClick={() => navigate(-1)}
              className="min-w-[120px]"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              size="lg"
              className="min-w-[120px]"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}