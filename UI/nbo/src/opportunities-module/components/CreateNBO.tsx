import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNBO } from '../context/NBOContext';
import { productFormFactorApi, productDataRateApi, productCNCageApi, productFieldsMapApi, productsApi } from '../services/productsApi';
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

export function CreateNBO() {
  const navigate = useNavigate();
  const { addNBO, formFactors, dataRates, stackings, pickList, loading } = useNBO();

  const [formData, setFormData] = useState({
    // Section 1: Basic Information
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
    
    // Section 2: Product Information
    product: '',
    pnProductDescription: '',
    productActive: 'Active',
    status: '',
    risk: '',
    type: '',
    competition: '',
    
    // Section 3: HSIO fields (conditional)
    formFactor: '',
    dataRate: '',
    stacking: '',
    
    // Section 4: TSY & Market Share
    tsyAt100MS: 0,
    assumedMarketShare: '',
    
    // Section 5: Revenue Forecast
    yearlyData: {
      2025: { q1: 0, q2: 0, q3: 0, q4: 0 },
      2026: { q1: 0, q2: 0, q3: 0, q4: 0 },
      2027: { total: 0 },
      2028: { total: 0 },
    },
    
    // Section 6: Assumptions & Comments
    tsyAssumptions: '',
    comments: '',
    
    // Legacy compatibility
    customerName: '',
    region: '',
    country: '',
    productLine: '',
    nboYear: currentYear,
    projectName: '',
    description: '',
    owner: '',
  });

  const [tsyAssumptionsLength, setTsyAssumptionsLength] = useState(0);
  const [commentsLength, setCommentsLength] = useState(0);
  const [hsioFormFactors, setHsioFormFactors] = useState<Array<{id: string, name: string, productManager: string}>>([]);
  const [loadingHsioFormFactors, setLoadingHsioFormFactors] = useState(false);
  const [hsioDataRates, setHsioDataRates] = useState<Array<{id: string, name: string, pdid?: string}>>([]);
  const [loadingHsioDataRates, setLoadingHsioDataRates] = useState(false);
  const [hsioStackings, setHsioStackings] = useState<Array<{id: string, name: string, pcnid?: string}>>([]);
  const [loadingHsioStackings, setLoadingHsioStackings] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<Array<{id: string, name: string}>>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

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

  // Fetch HSIO form factors when HSIO Connectors business unit is selected
  useEffect(() => {
    const fetchHsioFormFactors = async () => {
      if (!formData.bu) {
        setHsioFormFactors([]);
        return;
      }

      const selectedBU = businessUnits.find(item => item.key === formData.bu);
      const isHSIO = selectedBU?.value === 'HSIO Connectors' || formData.bu === 'HSIO Connectors';
      
      if (isHSIO) {
        try {
          setLoadingHsioFormFactors(true);
          const response = await productFormFactorApi.getActiveByBusinessUnit(formData.bu);
          // Handle both ApiResponse wrapper and direct array response
          const formFactorsData = response.data || (Array.isArray(response) ? response : []);
          setHsioFormFactors(formFactorsData.map((ff: any) => ({
            id: ff.id || ff.formFactorId || '',
            name: ff.name || ff.formFactorName || '',
            productManager: ff.productManager || ''
          })));
        } catch (error) {
          console.error('Error fetching HSIO form factors:', error);
          toast.error('Failed to load form factors for HSIO Connectors');
          setHsioFormFactors([]);
        } finally {
          setLoadingHsioFormFactors(false);
        }
      } else {
        // Clear HSIO form factors when not HSIO
        setHsioFormFactors([]);
        // Only clear form factor fields if they were previously set
        if (formData.formFactor || formData.dataRate || formData.stacking) {
          setFormData(prev => ({ ...prev, formFactor: '', dataRate: '', stacking: '' }));
        }
      }
    };

    fetchHsioFormFactors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.bu]);

  // Fetch HSIO data rates when form factor is selected
  useEffect(() => {
    const fetchHsioDataRates = async () => {
      const selectedBU = businessUnits.find(item => item.key === formData.bu);
      const isHSIO = selectedBU?.value === 'HSIO Connectors' || formData.bu === 'HSIO Connectors';
      
      if (!isHSIO || !formData.formFactor) {
        setHsioDataRates([]);
        return;
      }

      // Calculate available form factors here to avoid dependency issues
      const currentAvailableFormFactors = isHSIO && hsioFormFactors.length > 0 
        ? hsioFormFactors 
        : formFactors;

      // Find the selected form factor to get its ID
      const selectedFormFactor = currentAvailableFormFactors.find(ff => ff.name === formData.formFactor);
      
      if (selectedFormFactor && selectedFormFactor.id) {
        try {
          setLoadingHsioDataRates(true);
          const response = await productDataRateApi.getActiveByFormFactor(selectedFormFactor.id);
          // Handle both ApiResponse wrapper and direct array response
          const dataRatesData = response.data || (Array.isArray(response) ? response : []);
          setHsioDataRates(dataRatesData.map((dr: any) => ({
            id: dr.id || dr.dataRateId || '',
            name: dr.name || dr.dataRateName || '',
            pdid: dr.pdid || dr.pdId || dr.id || ''
          })));
        } catch (error) {
          console.error('Error fetching HSIO data rates:', error);
          toast.error('Failed to load data rates for selected form factor');
          setHsioDataRates([]);
        } finally {
          setLoadingHsioDataRates(false);
        }
      } else {
        setHsioDataRates([]);
      }
    };

    fetchHsioDataRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.formFactor, formData.bu, hsioFormFactors]);

  // Fetch HSIO stackings when data rate is selected
  useEffect(() => {
    const fetchHsioStackings = async () => {
      const selectedBU = businessUnits.find(item => item.key === formData.bu);
      const isHSIO = selectedBU?.value === 'HSIO Connectors' || formData.bu === 'HSIO Connectors';
      
      if (!isHSIO || !formData.dataRate) {
        setHsioStackings([]);
        return;
      }

      // Calculate available data rates here to avoid dependency issues
      const currentAvailableDataRates = isHSIO && hsioDataRates.length > 0
        ? hsioDataRates
        : formData.formFactor
          ? dataRates.filter(dr => {
              const currentAvailableFormFactors = isHSIO && hsioFormFactors.length > 0 
                ? hsioFormFactors 
                : formFactors;
              const ff = currentAvailableFormFactors.find(f => f.name === formData.formFactor);
              return ff && dr.formFactorId === ff.id;
            })
          : [];

      // Find the selected data rate to get its pdid
      // Check HSIO data rates first (which have pdid), then fall back to regular data rates
      const selectedDataRate = isHSIO && hsioDataRates.length > 0
        ? hsioDataRates.find(dr => dr.name === formData.dataRate)
        : currentAvailableDataRates.find(dr => dr.name === formData.dataRate);
      
      // Use pdid from HSIO data rate if available, otherwise use id
      const dataRateId = isHSIO && hsioDataRates.length > 0 && selectedDataRate && 'pdid' in selectedDataRate
        ? (selectedDataRate as {id: string, name: string, pdid?: string}).pdid || selectedDataRate.id
        : selectedDataRate?.id;
      
      if (selectedDataRate && dataRateId) {
        try {
          setLoadingHsioStackings(true);
          const response = await productCNCageApi.getActiveByDataRate(dataRateId);
          // Handle both ApiResponse wrapper and direct array response
          const stackingsData = response.data || (Array.isArray(response) ? response : []);
          setHsioStackings(stackingsData.map((st: any) => ({
            id: st.id || st.stackingId || '',
            name: st.name || st.stackingName || '',
            pcnid: st.pcnid || st.pcnId || st.id || ''
          })));
        } catch (error) {
          console.error('Error fetching HSIO stackings:', error);
          toast.error('Failed to load stackings for selected data rate');
          setHsioStackings([]);
        } finally {
          setLoadingHsioStackings(false);
        }
      } else {
        setHsioStackings([]);
      }
    };

    fetchHsioStackings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.dataRate, formData.formFactor, formData.bu, hsioFormFactors, hsioDataRates]);

  // Fetch products based on business unit type
  useEffect(() => {
    const fetchProducts = async () => {
      const selectedBU = businessUnits.find(item => item.key === formData.bu);
      const isHSIO = selectedBU?.value === 'HSIO Connectors' || formData.bu === 'HSIO Connectors';
      
      // For HSIO Connectors: need formFactor, dataRate, and stacking
      if (isHSIO) {
        if (!formData.formFactor || !formData.dataRate || !formData.stacking) {
          setAvailableProducts([]);
          return;
        }

        // Calculate available form factors to find the IDs
        const currentAvailableFormFactors = hsioFormFactors.length > 0 
          ? hsioFormFactors 
          : formFactors;

        // Get data rate ID - use pdid for HSIO, id for regular
        const selectedDataRate = hsioDataRates.length > 0
          ? hsioDataRates.find(dr => dr.name === formData.dataRate)
          : dataRates.find(dr => {
              const ff = currentAvailableFormFactors.find(f => f.name === formData.formFactor);
              return ff && dr.formFactorId === ff.id && dr.name === formData.dataRate;
            });
        
        const dataRateId = hsioDataRates.length > 0 && selectedDataRate && 'pdid' in selectedDataRate
          ? (selectedDataRate as {id: string, name: string, pdid?: string}).pdid || selectedDataRate.id
          : selectedDataRate?.id;

        // Find the selected form factor and stacking to get their IDs
        const selectedFormFactor = currentAvailableFormFactors.find(ff => ff.name === formData.formFactor);
        const formFactorId = selectedFormFactor?.id;

        // Find the selected stacking to get its ID
        const selectedStacking = hsioStackings.length > 0
          ? hsioStackings.find(st => st.name === formData.stacking)
          : stackings.find(st => {
              const ff = currentAvailableFormFactors.find(f => f.name === formData.formFactor);
              const dr = hsioDataRates.length > 0
                ? hsioDataRates.find(d => d.name === formData.dataRate)
                : dataRates.find(d => d.name === formData.dataRate && d.formFactorId === ff?.id);
              return ff && dr && st.formFactorId === ff.id && st.dataRateId === dr.id && st.name === formData.stacking;
            });
        
        // Use pcnid from HSIO stacking if available, otherwise use id
        const stackingId = hsioStackings.length > 0 && selectedStacking && 'pcnid' in selectedStacking
          ? (selectedStacking as {id: string, name: string, pcnid?: string}).pcnid || selectedStacking.id
          : selectedStacking?.id;
        
        if (formFactorId && dataRateId && stackingId) {
          try {
            setLoadingProducts(true);
            const response = await productFieldsMapApi.getByCombination(formFactorId, dataRateId, stackingId);
            
            // Handle API response - response.data is an array of product objects
            const responseData = response.data || response;
            let productsData: any[] = [];
            
            if (Array.isArray(responseData)) {
              productsData = responseData;
            } else if (responseData && typeof responseData === 'object') {
              // If it's a single object, check if it has a products array or extract product info
              if (Array.isArray(responseData.products)) {
                productsData = responseData.products;
              } else if (responseData.productId || responseData.productValue) {
                // Single product object
                productsData = [responseData];
              }
            }
            
            // Map products with productValue as the name field
            const mappedProducts = productsData
              .map((product: any, index: number) => ({
                id: String(product.productId || product.id || `product-${index}`),
                name: String(product.productValue || product.name || product.productName || product.product || '')
              }))
              .filter((product: { id: string; name: string }) => product.name && product.name.trim() !== '');
            
            console.log('Product Fields Map API Response:', response);
            console.log('Mapped Products:', mappedProducts);
            
            setAvailableProducts(mappedProducts);
          } catch (error) {
            console.error('Error fetching products from product-fields-map:', error);
            toast.error('Failed to load products');
            setAvailableProducts([]);
          } finally {
            setLoadingProducts(false);
          }
        } else {
          setAvailableProducts([]);
        }
      } else {
        // For non-HSIO business units: fetch products by business unit ID
        if (!formData.bu) {
          setAvailableProducts([]);
          return;
        }

        try {
          setLoadingProducts(true);
          const response = await productsApi.getActiveByBusinessUnit(formData.bu);
          
          console.log('Active Products by BU API Response:', response);
          console.log('Response data:', response.data);
          console.log('Response data type:', typeof response.data, 'Is array:', Array.isArray(response.data));
          
          // Handle API response - response.data is an array of products
          const responseData = response.data || (Array.isArray(response) ? response : []);
          const productsData = Array.isArray(responseData) ? responseData : [];
          
          console.log('Products data:', productsData);
          console.log('Products data length:', productsData.length);
          
          // Map products - API returns productValue as the name field
          const mappedProducts = productsData
            .map((product: any, index: number) => {
              const mapped = {
                id: String(product.productId || product.id || `product-${index}`),
                name: String(product.productValue || product.name || product.productName || product.product || '')
              };
              console.log(`Product ${index}:`, product, '-> Mapped:', mapped);
              return mapped;
            })
            .filter((product: { id: string; name: string }) => {
              const hasName = product.name && product.name.trim() !== '';
              if (!hasName) {
                console.log('Filtered out product (no name):', product);
              }
              return hasName;
            });
          
          console.log('Final Mapped Products:', mappedProducts);
          console.log('Setting available products count:', mappedProducts.length);
          
          setAvailableProducts(mappedProducts);
        } catch (error) {
          console.error('Error fetching active products by business unit:', error);
          toast.error('Failed to load products');
          setAvailableProducts([]);
        } finally {
          setLoadingProducts(false);
        }
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.bu, formData.stacking, formData.formFactor, formData.dataRate, hsioStackings, hsioFormFactors, hsioDataRates]);

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  // Check if HSIO Connectors is selected by comparing ID or value
  const selectedBU = businessUnits.find(item => item.key === formData.bu);
  const isHSIO = selectedBU?.value === 'HSIO Connectors' || formData.bu === 'HSIO Connectors';

  // Use HSIO form factors if available, otherwise use regular form factors
  const availableFormFactors = isHSIO && hsioFormFactors.length > 0 
    ? hsioFormFactors 
    : formFactors;

  // Use HSIO data rates if available, otherwise use regular data rates filtered by form factor
  const availableDataRates = isHSIO && hsioDataRates.length > 0
    ? hsioDataRates
    : formData.formFactor
      ? dataRates.filter(dr => {
          const ff = availableFormFactors.find(f => f.name === formData.formFactor);
          return ff && dr.formFactorId === ff.id;
        })
      : [];

  // Use HSIO stackings if available, otherwise use regular stackings filtered by form factor and data rate
  const availableStackings = isHSIO && hsioStackings.length > 0
    ? hsioStackings
    : formData.formFactor && formData.dataRate
      ? stackings.filter(st => {
          const ff = availableFormFactors.find(f => f.name === formData.formFactor);
          // Try to find data rate from HSIO data rates first, then fall back to regular data rates
          const dr = isHSIO && hsioDataRates.length > 0
            ? hsioDataRates.find(d => d.name === formData.dataRate)
            : dataRates.find(d => d.name === formData.dataRate && d.formFactorId === ff?.id);
          return ff && dr && st.formFactorId === ff.id && st.dataRateId === dr.id;
        })
      : [];

  // Calculate total for a year
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
    console.log(formData);
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
      ? availableFormFactors.find(ff => ff.name === formData.formFactor)?.productManager
      : undefined;

    addNBO({
      ...formData,
      expectedValue,
      owner: formData.salesRep,
      customerName: formData.parentEndUser || 'TBD',
      region: formData.salesGroup || 'TBD',
      country: 'TBD',
      productLine: formData.product || 'TBD',
      projectName: formData.program || 'TBD',
      description: formData.comments || '',
      winProbability: 50,
      formFactor: isHSIO ? formData.formFactor : undefined,
      dataRate: isHSIO ? formData.dataRate : undefined,
      stacking: isHSIO ? formData.stacking : undefined,
      productManager: isHSIO ? productManager : undefined,
      isArchived: false,
    } as any);

    toast.success('NBO created successfully');
    navigate('/nbos');
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
            <h1 className="text-2xl">Create New Business Opportunity</h1>
            <p className="text-sm text-gray-600 mt-1">
              Fill in the form below to create a new business opportunity
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
                        <div className="px-2 py-1.5 text-sm text-gray-500">Loading...</div>
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
                        <div className="px-2 py-1.5 text-sm text-gray-500">Loading...</div>
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
                        <div className="px-2 py-1.5 text-sm text-gray-500">Loading...</div>
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
                        <div className="px-2 py-1.5 text-sm text-gray-500">Loading...</div>
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
                        <div className="px-2 py-1.5 text-sm text-gray-500">Loading...</div>
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
                        <div className="px-2 py-1.5 text-sm text-gray-500">Loading...</div>
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
                {/* HSIO Product Fields - Always shown with cascading logic */}
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
                    disabled={!isHSIO}
                  >
                    <SelectTrigger id="formFactor">
                      <SelectValue placeholder={
                        loadingHsioFormFactors 
                          ? "Loading form factors..." 
                          : isHSIO 
                            ? "Select form factor" 
                            : "Select business unit first"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingHsioFormFactors ? (
                        <div className="px-2 py-1.5 text-sm text-gray-500">Loading form factors...</div>
                      ) : availableFormFactors.length > 0 ? (
                        availableFormFactors.map(ff => (
                          <SelectItem key={ff.id} value={ff.name}>{ff.name}</SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1.5 text-sm text-gray-500">No form factors available</div>
                      )}
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
                    disabled={!isHSIO || !formData.formFactor}
                  >
                    <SelectTrigger id="dataRate">
                      <SelectValue placeholder={
                        !isHSIO 
                          ? "Select business unit first" 
                          : loadingHsioDataRates
                            ? "Loading data rates..."
                            : formData.formFactor 
                              ? "Select data rate" 
                              : "Select form factor first"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingHsioDataRates ? (
                        <div className="px-2 py-1.5 text-sm text-gray-500">Loading data rates...</div>
                      ) : availableDataRates.length > 0 ? (
                        availableDataRates.map(dr => (
                          <SelectItem key={dr.id} value={dr.name}>{dr.name}</SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1.5 text-sm text-gray-500">
                          {formData.formFactor ? "No data rates available" : "Select form factor first"}
                        </div>
                      )}
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
                    onValueChange={(value) => setFormData({ ...formData, stacking: value, product: '' })}
                    disabled={!isHSIO || !formData.dataRate}
                  >
                    <SelectTrigger id="stacking">
                      <SelectValue placeholder={
                        !isHSIO 
                          ? "Select business unit first" 
                          : loadingHsioStackings
                            ? "Loading stackings..."
                            : formData.dataRate 
                              ? "Select stacking" 
                              : "Select data rate first"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingHsioStackings ? (
                        <div className="px-2 py-1.5 text-sm text-gray-500">Loading stackings...</div>
                      ) : availableStackings.length > 0 ? (
                        availableStackings.map(st => (
                          <SelectItem key={st.id} value={st.name}>{st.name}</SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1.5 text-sm text-gray-500">
                          {formData.dataRate ? "No stackings available" : "Select data rate first"}
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="product">Product</Label>
                  <Select
                    value={formData.product}
                    onValueChange={(value) => setFormData({ ...formData, product: value })}
                    disabled={loadingProducts || (isHSIO ? (!formData.formFactor || !formData.dataRate || !formData.stacking) : !formData.bu)}
                  >
                    <SelectTrigger id="product">
                      <SelectValue placeholder={
                        loadingProducts 
                          ? "Loading products..." 
                          : isHSIO
                            ? (!formData.formFactor || !formData.dataRate || !formData.stacking)
                              ? "Select form factor, data rate, and stacking first"
                              : availableProducts.length > 0
                                ? "Select product"
                                : "No products available"
                            : !formData.bu
                              ? "Select business unit first"
                              : availableProducts.length > 0
                                ? "Select product"
                                : "No products available"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingProducts ? (
                        <div className="px-2 py-1.5 text-sm text-gray-500">Loading products...</div>
                      ) : availableProducts.length > 0 ? (
                        availableProducts
                          .filter(product => product.id && product.name && product.id.trim() !== '' && product.name.trim() !== '')
                          .map(product => (
                            <SelectItem key={product.id} value={product.name}>{product.name}</SelectItem>
                          ))
                      ) : (
                        <div className="px-2 py-1.5 text-sm text-gray-500">
                          {isHSIO
                            ? (!formData.formFactor || !formData.dataRate || !formData.stacking)
                              ? "Select form factor, data rate, and stacking first"
                              : "No products available"
                            : !formData.bu
                              ? "Select business unit first"
                              : "No products available"}
                        </div>
                      )}
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
                  <Label htmlFor="productActive">Product Active/Inactive</Label>
                  <Select value={formData.productActive} onValueChange={(value) => setFormData({ ...formData, productActive: value })}>
                    <SelectTrigger id="productActive">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status || undefined} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select Status" />
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
                        <div className="px-2 py-1.5 text-sm text-gray-500">Loading...</div>
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
                        <div className="px-2 py-1.5 text-sm text-gray-500">Loading...</div>
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
                    <strong>Product Manager:</strong> {availableFormFactors.find(ff => ff.name === formData.formFactor)?.productManager || 'N/A'}
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
                        <div className="px-2 py-1.5 text-sm text-gray-500">Loading...</div>
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
                  <div className="space-y-1.5">
                    <Label htmlFor="2025-q1" className="text-xs">2025 Q1 (US $K)</Label>
                    <Input
                      id="2025-q1"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.yearlyData[2025].q1}
                      onChange={(e) => setFormData({
                        ...formData,
                        yearlyData: {
                          ...formData.yearlyData,
                          2025: { ...formData.yearlyData[2025], q1: Number(e.target.value) }
                        }
                      })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="2025-q2" className="text-xs">2025 Q2 (US $K)</Label>
                    <Input
                      id="2025-q2"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.yearlyData[2025].q2}
                      onChange={(e) => setFormData({
                        ...formData,
                        yearlyData: {
                          ...formData.yearlyData,
                          2025: { ...formData.yearlyData[2025], q2: Number(e.target.value) }
                        }
                      })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="2025-q3" className="text-xs">2025 Q3 (US $K)</Label>
                    <Input
                      id="2025-q3"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.yearlyData[2025].q3}
                      onChange={(e) => setFormData({
                        ...formData,
                        yearlyData: {
                          ...formData.yearlyData,
                          2025: { ...formData.yearlyData[2025], q3: Number(e.target.value) }
                        }
                      })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="2025-q4" className="text-xs">2025 Q4 (US $K)</Label>
                    <Input
                      id="2025-q4"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.yearlyData[2025].q4}
                      onChange={(e) => setFormData({
                        ...formData,
                        yearlyData: {
                          ...formData.yearlyData,
                          2025: { ...formData.yearlyData[2025], q4: Number(e.target.value) }
                        }
                      })}
                      placeholder="0"
                    />
                  </div>
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
                  <div className="space-y-1.5">
                    <Label htmlFor="2026-q1" className="text-xs">2026 Q1 (US $K)</Label>
                    <Input
                      id="2026-q1"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.yearlyData[2026].q1}
                      onChange={(e) => setFormData({
                        ...formData,
                        yearlyData: {
                          ...formData.yearlyData,
                          2026: { ...formData.yearlyData[2026], q1: Number(e.target.value) }
                        }
                      })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="2026-q2" className="text-xs">2026 Q2 (US $K)</Label>
                    <Input
                      id="2026-q2"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.yearlyData[2026].q2}
                      onChange={(e) => setFormData({
                        ...formData,
                        yearlyData: {
                          ...formData.yearlyData,
                          2026: { ...formData.yearlyData[2026], q2: Number(e.target.value) }
                        }
                      })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="2026-q3" className="text-xs">2026 Q3 (US $K)</Label>
                    <Input
                      id="2026-q3"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.yearlyData[2026].q3}
                      onChange={(e) => setFormData({
                        ...formData,
                        yearlyData: {
                          ...formData.yearlyData,
                          2026: { ...formData.yearlyData[2026], q3: Number(e.target.value) }
                        }
                      })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="2026-q4" className="text-xs">2026 Q4 (US $K)</Label>
                    <Input
                      id="2026-q4"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.yearlyData[2026].q4}
                      onChange={(e) => setFormData({
                        ...formData,
                        yearlyData: {
                          ...formData.yearlyData,
                          2026: { ...formData.yearlyData[2026], q4: Number(e.target.value) }
                        }
                      })}
                      placeholder="0"
                    />
                  </div>
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

          {/* SECTION 7: Action Buttons */}
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