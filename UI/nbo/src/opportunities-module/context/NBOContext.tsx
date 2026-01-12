import React, { createContext, useContext, useState, useEffect } from 'react';
import { nboApi, formFactorApi, dataRateApi, stackingApi, pickListApi, PickListDTO, KeyValueDTO } from '../services/api';
import { toast } from 'sonner';

export interface NBO {
  id: string;
  // Basic Information
  salesRep?: string;
  appEng?: string;
  salesGroup?: string;
  customerName: string;
  region: string;
  country: string;
  bu: string;
  expectedDecisionDate?: string;
  massProductionStart?: string;
  parentEndUser?: string;
  orderingType?: string;
  orderingCEMCM?: string;
  orderingOEM?: string;
  orderingLocation?: string;
  program?: string;
  application: string;
  market?: string;
  product?: string;
  productLine: string;
  pnProductDescription?: string;
  status: 'New' | 'Open' | 'Won' | 'Lost' | 'On Hold';
  risk?: string;
  type?: string;
  competition?: string;
  
  // Financial
  tsyAt100MS?: number;
  tbvAt100MS?: number;
  assumedMarketShare?: number;
  expectedValue: number;
  
  // Year/Quarter data - stores all years dynamically
  yearlyData?: Record<number, {
    q1?: number;
    q2?: number;
    q3?: number;
    q4?: number;
    total?: number;
  }>;
  
  // HSIO specific fields (only when BU = HSIO Connectors)
  formFactor?: string;
  dataRate?: string;
  stacking?: string;
  productManager?: string;
  
  // Assumptions and Comments
  tsyAssumptions?: string;
  comments?: string;
  
  // Legacy fields for compatibility
  nboYear: number;
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  owner: string;
  projectName: string;
  description: string;
  winProbability: number;
  
  // System fields
  createdDate: string;
  updatedDate: string;
  isArchived: boolean;
}

export interface FormFactor {
  id: string;
  name: string;
  productManager: string;
}

export interface DataRate {
  id: string;
  name: string;
  formFactorId: string;
}

export interface Stacking {
  id: string;
  name: string;
  formFactorId: string;
  dataRateId: string;
}

interface NBOContextType {
  nbos: NBO[];
  formFactors: FormFactor[];
  dataRates: DataRate[];
  stackings: Stacking[];
  pickList: PickListDTO | null;
  loading: boolean;
  addNBO: (nbo: Omit<NBO, 'id' | 'createdDate' | 'updatedDate'>) => Promise<void>;
  updateNBO: (id: string, nbo: Partial<NBO>) => Promise<void>;
  deleteNBO: (id: string) => Promise<void>;
  archiveNBO: (id: string) => Promise<void>;
  restoreNBO: (id: string) => Promise<void>;
  getNBOById: (id: string) => NBO | undefined;
  addFormFactor: (formFactor: Omit<FormFactor, 'id'>) => Promise<void>;
  updateFormFactor: (id: string, formFactor: Partial<FormFactor>) => Promise<void>;
  deleteFormFactor: (id: string) => Promise<void>;
  addDataRate: (dataRate: Omit<DataRate, 'id'>) => Promise<void>;
  updateDataRate: (id: string, dataRate: Partial<DataRate>) => Promise<void>;
  deleteDataRate: (id: string) => Promise<void>;
  addStacking: (stacking: Omit<Stacking, 'id'>) => Promise<void>;
  updateStacking: (id: string, stacking: Partial<Stacking>) => Promise<void>;
  deleteStacking: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const NBOContext = createContext<NBOContextType | undefined>(undefined);

// Mock data
const currentYear = new Date().getFullYear();

const mockNBOs: NBO[] = [
  {
    id: '1',
    salesRep: 'Sarah Johnson',
    appEng: 'Michael Chen',
    customerName: 'Cisco Systems',
    region: 'Americas',
    country: 'USA',
    bu: 'HSIO Connectors',
    expectedDecisionDate: '2025-06-15',
    massProductionStart: '2025-09-01',
    parentEndUser: 'Cisco Systems Inc.',
    orderingType: 'Direct',
    orderingOEM: 'Cisco',
    orderingLocation: 'San Jose, CA',
    program: 'Next-Gen Router',
    application: 'Network Switch',
    market: 'Networking',
    product: 'QSFP-DD Connectors',
    productLine: 'High Speed',
    pnProductDescription: 'QSFP-DD 400G Connector Assembly',
    status: 'Open',
    risk: 'Medium',
    competition: 'TE Connectivity, Molex',
    tbvAt100MS: 3000000,
    assumedMarketShare: 83,
    expectedValue: 2500000,
    projectName: 'Next-Gen Router Platform',
    description: 'High-speed connector solution for next generation routing equipment',
    winProbability: 75,
    nboYear: currentYear,
    quarter: 'Q2',
    yearlyData: {
      [currentYear]: { q1: 0, q2: 500000, q3: 750000, q4: 500000 },
      [currentYear + 1]: { q1: 250000, q2: 250000, q3: 150000, q4: 100000 },
      [currentYear + 2]: { total: 0 },
      [currentYear + 3]: { total: 0 },
    },
    formFactor: 'QSFP-DD',
    dataRate: '400G',
    stacking: '2x',
    productManager: 'John Smith',
    owner: 'Sarah Johnson',
    comments: '',
    createdDate: '2025-01-15',
    updatedDate: '2025-01-20',
    isArchived: false,
  },
  {
    id: '2',
    salesRep: 'Michael Chen',
    appEng: 'Lisa Wang',
    customerName: 'Huawei Technologies',
    region: 'APAC',
    country: 'China',
    bu: 'Power',
    expectedDecisionDate: '2025-08-20',
    massProductionStart: '2025-11-01',
    parentEndUser: 'Huawei',
    orderingType: 'OEM',
    orderingOEM: 'Huawei',
    orderingLocation: 'Shenzhen',
    program: 'Cloud Server Gen5',
    application: 'Server',
    market: 'Data Center',
    product: 'Power Distribution',
    productLine: 'Power Connectors',
    pnProductDescription: 'High Current Power Connectors',
    status: 'New',
    risk: 'High',
    competition: 'Amphenol, FCI',
    tbvAt100MS: 2100000,
    assumedMarketShare: 85,
    expectedValue: 1800000,
    projectName: 'Cloud Server Gen5',
    description: 'Power distribution solution for high-density server applications',
    winProbability: 60,
    nboYear: currentYear,
    quarter: 'Q3',
    yearlyData: {
      [currentYear]: { q1: 0, q2: 0, q3: 400000, q4: 600000 },
      [currentYear + 1]: { q1: 300000, q2: 300000, q3: 200000, q4: 0 },
      [currentYear + 2]: { total: 0 },
      [currentYear + 3]: { total: 0 },
    },
    owner: 'Michael Chen',
    comments: '',
    createdDate: '2025-02-01',
    updatedDate: '2025-02-01',
    isArchived: false,
  },
  {
    id: '3',
    salesRep: 'Robert Martinez',
    customerName: 'Dell Technologies',
    region: 'Americas',
    country: 'USA',
    bu: 'HSIO Connectors',
    productLine: 'High Speed',
    application: 'Storage',
    projectName: 'Enterprise SAN Upgrade',
    description: 'High-bandwidth storage interconnect solution',
    status: 'Won',
    winProbability: 100,
    expectedValue: 3200000,
    nboYear: currentYear,
    quarter: 'Q1',
    yearlyData: {
      [currentYear]: { q1: 800000, q2: 800000, q3: 800000, q4: 800000 },
      [currentYear + 1]: { q1: 0, q2: 0, q3: 0, q4: 0 },
      [currentYear + 2]: { total: 0 },
      [currentYear + 3]: { total: 0 },
    },
    formFactor: 'OSFP',
    dataRate: '800G',
    stacking: '1x',
    productManager: 'Emily Davis',
    owner: 'Robert Martinez',
    createdDate: '2024-11-10',
    updatedDate: '2025-01-05',
    isArchived: false,
  },
  {
    id: '4',
    salesRep: 'Sarah Johnson',
    customerName: 'Arista Networks',
    region: 'Americas',
    country: 'USA',
    bu: 'HSIO Connectors',
    productLine: 'High Speed',
    application: 'Data Center Switch',
    projectName: 'CloudVision Platform',
    description: 'Multi-rate connector platform for cloud networking',
    status: 'Open',
    winProbability: 80,
    expectedValue: 4500000,
    nboYear: currentYear + 1,
    quarter: 'Q1',
    yearlyData: {
      [currentYear]: { q1: 0, q2: 0, q3: 0, q4: 0 },
      [currentYear + 1]: { q1: 1000000, q2: 1500000, q3: 1000000, q4: 1000000 },
      [currentYear + 2]: { total: 0 },
      [currentYear + 3]: { total: 0 },
    },
    formFactor: 'QSFP-DD',
    dataRate: '400G',
    stacking: '4x',
    productManager: 'John Smith',
    owner: 'Sarah Johnson',
    createdDate: '2025-01-25',
    updatedDate: '2025-02-10',
    isArchived: false,
  },
  {
    id: '5',
    salesRep: 'Anna Korhonen',
    customerName: 'Nokia',
    region: 'EMEA',
    country: 'Finland',
    bu: 'RF/Antenna',
    productLine: 'RF Connectors',
    application: '5G Base Station',
    projectName: '5G RAN Expansion',
    description: 'RF connector solution for 5G radio access network',
    status: 'Open',
    winProbability: 70,
    expectedValue: 2200000,
    nboYear: currentYear,
    quarter: 'Q4',
    yearlyData: {
      [currentYear]: { q1: 0, q2: 0, q3: 0, q4: 800000 },
      [currentYear + 1]: { q1: 400000, q2: 400000, q3: 300000, q4: 300000 },
      [currentYear + 2]: { total: 0 },
      [currentYear + 3]: { total: 0 },
    },
    owner: 'Anna Korhonen',
    createdDate: '2025-02-05',
    updatedDate: '2025-02-12',
    isArchived: false,
  },
];

const mockFormFactors: FormFactor[] = [
  { id: '1', name: 'QSFP-DD', productManager: 'John Smith' },
  { id: '2', name: 'OSFP', productManager: 'Emily Davis' },
  { id: '3', name: 'QSFP28', productManager: 'John Smith' },
  { id: '4', name: 'SFP-DD', productManager: 'Michael Brown' },
];

const mockDataRates: DataRate[] = [
  { id: '1', name: '400G', formFactorId: '1' },
  { id: '2', name: '200G', formFactorId: '1' },
  { id: '3', name: '800G', formFactorId: '2' },
  { id: '4', name: '100G', formFactorId: '3' },
  { id: '5', name: '100G', formFactorId: '4' },
];

// Helper functions to convert between backend and frontend formats
export const convertBackendToFrontendNBO = (backendNBO: any): NBO => {
  // Convert yearly data from API format (year0Q1Dec, year1Q1Dec, etc.) to yearlyData structure
  const convertYearlyData = (backendNBO: any): Record<number, any> => {
    // If yearlyData is already in the correct format (object with year keys), return it
    if (backendNBO.yearlyData && typeof backendNBO.yearlyData === 'object' && !Array.isArray(backendNBO.yearlyData)) {
      // Check if it's already in the format we want (has numeric year keys)
      const keys = Object.keys(backendNBO.yearlyData);
      if (keys.length > 0 && !isNaN(Number(keys[0]))) {
        return backendNBO.yearlyData;
      }
      // If it's a string, try to parse it
      if (typeof backendNBO.yearlyData === 'string') {
        try {
          return JSON.parse(backendNBO.yearlyData);
        } catch {
          // If parsing fails, continue with quarter conversion
        }
      }
    }
    
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
    // Prioritize name over ID for filtering purposes
    bu: backendNBO.buName || backendNBO.bu || (backendNBO.buId ? backendNBO.buId.toString() : ''),
    // Prioritize names over IDs for filtering purposes
    salesRep: backendNBO.salesRepName || backendNBO.salesRep || (backendNBO.salesRepId ? backendNBO.salesRepId.toString() : ''),
    appEng: backendNBO.appsEngName || backendNBO.appEng || (backendNBO.appsEngId ? backendNBO.appsEngId.toString() : ''),
    salesGroup: backendNBO.salesGroupName || backendNBO.salesGroup || (backendNBO.salesGroupId ? backendNBO.salesGroupId.toString() : ''),
    orderingType: backendNBO.orderingTypeName || backendNBO.orderingType || (backendNBO.orderingTypeId ? backendNBO.orderingTypeId.toString() : ''),
    status: backendNBO.statusName || backendNBO.status || (backendNBO.nboStatusId ? backendNBO.nboStatusId.toString() : 'New'),
    risk: backendNBO.riskName || backendNBO.risk || (backendNBO.riskId ? backendNBO.riskId.toString() : ''),
    type: backendNBO.typeName || backendNBO.type || (backendNBO.typeId ? backendNBO.typeId.toString() : ''),
    market: backendNBO.marketName || backendNBO.market || (backendNBO.marketId ? backendNBO.marketId.toString() : ''),
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
    expectedValue: backendNBO.expectedValue || (() => {
      // Calculate from year totals if available
      let total = 0;
      for (let year = 0; year <= 11; year++) {
        const yearTotal = backendNBO[`year${year}Total`];
        if (yearTotal !== null && yearTotal !== undefined) {
          total += parseFloat(yearTotal) || 0;
        }
      }
      return total > 0 ? total : (backendNBO.assumedMsValue || 0);
    })(),
    productManager: backendNBO.productManager || '',
    createdDate: formatDate(backendNBO.createdDate) || new Date().toISOString().split('T')[0],
    updatedDate: formatDate(backendNBO.updatedDate || backendNBO.lastUpdatedDate) || new Date().toISOString().split('T')[0],
    isArchived: backendNBO.isArchived || false,
  };
};

const convertFrontendToBackendNBO = (frontendNBO: any): any => {
  // Helper function to convert date string to LocalDate format (YYYY-MM-DD)
  const toLocalDate = (dateStr: string | undefined | null): string | null => {
    if (!dateStr || dateStr.trim() === '') return null;
    // If already in YYYY-MM-DD format, return as is
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
    // Try to parse and format
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().split('T')[0];
  };

  // Helper function to convert to number or null
  const toNumberOrNull = (value: any): number | null => {
    if (value === null || value === undefined || value === '') return null;
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    return isNaN(num) ? null : num;
  };

  // Helper function to convert to Long (integer) or null
  const toLongOrNull = (value: any): number | null => {
    if (value === null || value === undefined || value === '') return null;
    const num = typeof value === 'string' ? parseInt(value) : Number(value);
    return isNaN(num) ? null : num;
  };

  // Helper function to convert string to string or null (empty strings become null)
  const toStringOrNull = (value: string | undefined | null): string | null => {
    if (value === null || value === undefined || value.trim() === '') return null;
    return value;
  };

  // Convert yearly data to individual quarter fields
  const convertYearlyData = (yearlyData: any) => {
    if (!yearlyData || typeof yearlyData !== 'object') return {};
    
    const result: any = {};
    const years = Object.keys(yearlyData).map(Number).sort((a, b) => a - b);
    
    // Map years to year0, year1, etc. (year0 is the first year)
    years.forEach((year, index) => {
      if (index > 9) return; // Backend only supports year0-year9
      
      const yearData = yearlyData[year];
      if (yearData) {
        if ('q1' in yearData || 'q2' in yearData || 'q3' in yearData || 'q4' in yearData) {
          result[`year${index}Q1Dec`] = toNumberOrNull(yearData.q1);
          result[`year${index}Q2Dec`] = toNumberOrNull(yearData.q2);
          result[`year${index}Q3Dec`] = toNumberOrNull(yearData.q3);
          result[`year${index}Q4Dec`] = toNumberOrNull(yearData.q4);
          
          // Calculate year total
          const total = (toNumberOrNull(yearData.q1) || 0) + 
                       (toNumberOrNull(yearData.q2) || 0) + 
                       (toNumberOrNull(yearData.q3) || 0) + 
                       (toNumberOrNull(yearData.q4) || 0);
          result[`year${index}Total`] = total > 0 ? total : null;
        } else if ('total' in yearData) {
          // For years with only total (like 2027, 2028)
          const total = toNumberOrNull(yearData.total);
          result[`year${index}Total`] = total;
          // Set quarters to null if only total is provided
          result[`year${index}Q1Dec`] = null;
          result[`year${index}Q2Dec`] = null;
          result[`year${index}Q3Dec`] = null;
          result[`year${index}Q4Dec`] = null;
        }
      }
    });
    
    return result;
  };

  // Calculate year totals for years 0-11
  const calculateYearTotals = (yearlyData: any) => {
    if (!yearlyData || typeof yearlyData !== 'object') return {};
    
    const result: any = {};
    const years = Object.keys(yearlyData).map(Number).sort((a, b) => a - b);
    
    years.forEach((year, index) => {
      if (index > 11) return; // Backend supports year0Total-year11Total
      
      const yearData = yearlyData[year];
      if (yearData) {
        if ('total' in yearData) {
          result[`year${index}Total`] = toNumberOrNull(yearData.total);
        } else {
          const total = (toNumberOrNull(yearData.q1) || 0) + 
                       (toNumberOrNull(yearData.q2) || 0) + 
                       (toNumberOrNull(yearData.q3) || 0) + 
                       (toNumberOrNull(yearData.q4) || 0);
          result[`year${index}Total`] = total > 0 ? total : null;
        }
      }
    });
    
    return result;
  };

  const yearlyDataConverted = convertYearlyData(frontendNBO.yearlyData);
  const yearTotals = calculateYearTotals(frontendNBO.yearlyData);

  // Build the backend NBO object matching the exact backend structure
  return {
    nboId: toLongOrNull(frontendNBO.id),
    salesRepId: toLongOrNull(frontendNBO.salesRep),
    appsEngId: toLongOrNull(frontendNBO.appEng),
    plOwnerId: toLongOrNull(frontendNBO.plOwnerId), // May not be in frontend yet
    salesGroupId: toLongOrNull(frontendNBO.salesGroup),
    buId: toLongOrNull(frontendNBO.bu),
    orderStartDate: toLocalDate(frontendNBO.massProductionStart),
    expectedDecisionDate: toLocalDate(frontendNBO.expectedDecisionDate),
    parentEndUser: toStringOrNull(frontendNBO.parentEndUser),
    ordering: toStringOrNull(frontendNBO.orderingCEMCM),
    orderingLocation: toStringOrNull(frontendNBO.orderingLocation),
    program: toStringOrNull(frontendNBO.program),
    application: toStringOrNull(frontendNBO.application),
    market: toLongOrNull(frontendNBO.market),
    productId: toLongOrNull(frontendNBO.productId), // May need to be mapped from product string
    productText: toStringOrNull(frontendNBO.pnProductDescription),
    partNum: toStringOrNull(frontendNBO.partNum),
    orderingType: toLongOrNull(frontendNBO.orderingType),
    tsyDec: toNumberOrNull(frontendNBO.tsyAt100MS),
    // Yearly quarter data (year0-year9)
    year0Q1Dec: yearlyDataConverted.year0Q1Dec ?? null,
    year0Q2Dec: yearlyDataConverted.year0Q2Dec ?? null,
    year0Q3Dec: yearlyDataConverted.year0Q3Dec ?? null,
    year0Q4Dec: yearlyDataConverted.year0Q4Dec ?? null,
    year1Q1Dec: yearlyDataConverted.year1Q1Dec ?? null,
    year1Q2Dec: yearlyDataConverted.year1Q2Dec ?? null,
    year1Q3Dec: yearlyDataConverted.year1Q3Dec ?? null,
    year1Q4Dec: yearlyDataConverted.year1Q4Dec ?? null,
    year2Q1Dec: yearlyDataConverted.year2Q1Dec ?? null,
    year2Q2Dec: yearlyDataConverted.year2Q2Dec ?? null,
    year2Q3Dec: yearlyDataConverted.year2Q3Dec ?? null,
    year2Q4Dec: yearlyDataConverted.year2Q4Dec ?? null,
    year3Q1Dec: yearlyDataConverted.year3Q1Dec ?? null,
    year3Q2Dec: yearlyDataConverted.year3Q2Dec ?? null,
    year3Q3Dec: yearlyDataConverted.year3Q3Dec ?? null,
    year3Q4Dec: yearlyDataConverted.year3Q4Dec ?? null,
    year4Q1Dec: yearlyDataConverted.year4Q1Dec ?? null,
    year4Q2Dec: yearlyDataConverted.year4Q2Dec ?? null,
    year4Q3Dec: yearlyDataConverted.year4Q3Dec ?? null,
    year4Q4Dec: yearlyDataConverted.year4Q4Dec ?? null,
    year5Q1Dec: yearlyDataConverted.year5Q1Dec ?? null,
    year5Q2Dec: yearlyDataConverted.year5Q2Dec ?? null,
    year5Q3Dec: yearlyDataConverted.year5Q3Dec ?? null,
    year5Q4Dec: yearlyDataConverted.year5Q4Dec ?? null,
    year6Q1Dec: yearlyDataConverted.year6Q1Dec ?? null,
    year6Q2Dec: yearlyDataConverted.year6Q2Dec ?? null,
    year6Q3Dec: yearlyDataConverted.year6Q3Dec ?? null,
    year6Q4Dec: yearlyDataConverted.year6Q4Dec ?? null,
    year7Q1Dec: yearlyDataConverted.year7Q1Dec ?? null,
    year7Q2Dec: yearlyDataConverted.year7Q2Dec ?? null,
    year7Q3Dec: yearlyDataConverted.year7Q3Dec ?? null,
    year7Q4Dec: yearlyDataConverted.year7Q4Dec ?? null,
    year8Q1Dec: yearlyDataConverted.year8Q1Dec ?? null,
    year8Q2Dec: yearlyDataConverted.year8Q2Dec ?? null,
    year8Q3Dec: yearlyDataConverted.year8Q3Dec ?? null,
    year8Q4Dec: yearlyDataConverted.year8Q4Dec ?? null,
    year9Q1Dec: yearlyDataConverted.year9Q1Dec ?? null,
    year9Q2Dec: yearlyDataConverted.year9Q2Dec ?? null,
    year9Q3Dec: yearlyDataConverted.year9Q3Dec ?? null,
    year9Q4Dec: yearlyDataConverted.year9Q4Dec ?? null,
    assumedMs: toLongOrNull(frontendNBO.assumedMarketShare),
    nboStatusId: toLongOrNull(frontendNBO.status),
    riskId: toLongOrNull(frontendNBO.risk),
    typeId: toLongOrNull(frontendNBO.type),
    competition: toStringOrNull(frontendNBO.competition),
    tsyAssumptions: toStringOrNull(frontendNBO.tsyAssumptions),
    comments: toStringOrNull(frontendNBO.comments),
    altRecordType: toLongOrNull(frontendNBO.altRecordType),
    altRecord: toStringOrNull(frontendNBO.altRecord),
    designWinDate: toLocalDate(frontendNBO.designWinDate),
    discoveryDate: toLocalDate(frontendNBO.discoveryDate),
    pendingDate: toLocalDate(frontendNBO.pendingDate),
    productionWinDate: toLocalDate(frontendNBO.productionWinDate),
    cancelledDate: toLocalDate(frontendNBO.cancelledDate),
    lostDate: toLocalDate(frontendNBO.lostDate),
    createdBy: toStringOrNull(frontendNBO.createdBy),
    createdDate: frontendNBO.createdDate ? new Date(frontendNBO.createdDate).toISOString() : null,
    lastUpdatedBy: toStringOrNull(frontendNBO.lastUpdatedBy),
    lastUpdatedDate: frontendNBO.lastUpdatedDate ? new Date(frontendNBO.lastUpdatedDate).toISOString() : null,
    // Year totals (year0-year11)
    year0Total: yearTotals.year0Total ?? null,
    year1Total: yearTotals.year1Total ?? null,
    year2Total: yearTotals.year2Total ?? null,
    year3Total: yearTotals.year3Total ?? null,
    year4Total: yearTotals.year4Total ?? null,
    year5Total: yearTotals.year5Total ?? null,
    year6Total: yearTotals.year6Total ?? null,
    year7Total: yearTotals.year7Total ?? null,
    year8Total: yearTotals.year8Total ?? null,
    year9Total: yearTotals.year9Total ?? null,
    year10Total: yearTotals.year10Total ?? null,
    year11Total: yearTotals.year11Total ?? null,
    productf1: toLongOrNull(frontendNBO.productf1),
    productf2: toLongOrNull(frontendNBO.productf2),
    productf3: toLongOrNull(frontendNBO.productf3),
    buGroup: toStringOrNull(frontendNBO.buGroup),
    orderingDisti: toStringOrNull(frontendNBO.orderingDisti),
    orderingDistiOther: toStringOrNull(frontendNBO.orderingDistiOther),
  };
};

const convertBackendToFrontendFormFactor = (backend: any): FormFactor => ({
  ...backend,
  id: (backend.id || '').toString(),
});

const convertBackendToFrontendDataRate = (backend: any): DataRate => ({
  ...backend,
  id: (backend.id || '').toString(),
  formFactorId: (backend.formFactorId || '').toString(),
});

const convertBackendToFrontendStacking = (backend: any): Stacking => ({
  ...backend,
  id: (backend.id || '').toString(),
  formFactorId: (backend.formFactorId || '').toString(),
  dataRateId: (backend.dataRateId || '').toString(),
});

export function NBOProvider({ children }: { children: React.ReactNode }) {
  const [nbos, setNBOs] = useState<NBO[]>([]);
  const [formFactors, setFormFactors] = useState<FormFactor[]>([]);
  const [dataRates, setDataRates] = useState<DataRate[]>([]);
  const [stackings, setStackings] = useState<Stacking[]>([]);
  const [pickList, setPickList] = useState<PickListDTO | null>(null);
  const [loading, setLoading] = useState(true);

  // Load initial data from API
  const loadData = async () => {
    try {
      setLoading(true);
      const [nbosResponse, formFactorsResponse, dataRatesResponse, stackingsResponse, pickListResponse] = await Promise.all([
        nboApi.getAll(false).catch(() => null),
        formFactorApi.getAll().catch(() => null),
        dataRateApi.getAll().catch(() => null),
        stackingApi.getAll().catch(() => null),
        pickListApi.getAll().catch(() => null),
      ]);

      // Extract data from ApiResponse wrappers
      const nbosData = nbosResponse?.data || [];
      const formFactorsData = formFactorsResponse?.data || [];
      const dataRatesData = dataRatesResponse?.data || [];
      const stackingsData = stackingsResponse?.data || [];

      setNBOs(Array.isArray(nbosData) ? nbosData.map(convertBackendToFrontendNBO) : []);
      setFormFactors(Array.isArray(formFactorsData) ? formFactorsData.map(convertBackendToFrontendFormFactor) : []);
      setDataRates(Array.isArray(dataRatesData) ? dataRatesData.map(convertBackendToFrontendDataRate) : []);
      setStackings(Array.isArray(stackingsData) ? stackingsData.map(convertBackendToFrontendStacking) : []);
      
      // Extract pick list data from API response
      if (pickListResponse && pickListResponse.data) {
        setPickList(pickListResponse.data);
      } else {
        // Set empty pick list if API fails to prevent undefined errors
        setPickList({
          businessUnits: [],
          markets: [],
          orderingTypes: [],
          risks: [],
          salesGroups: [],
          statuses: [],
          types: [],
          salesReps: [],
          appsEngs: [],
          assumedMarketShares: [],
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data from server');
      // Set empty pick list on error to prevent undefined errors
      setPickList({
        businessUnits: [],
        markets: [],
        orderingTypes: [],
        risks: [],
        salesGroups: [],
        statuses: [],
        types: [],
        salesReps: [],
        appsEngs: [],
        assumedMarketShares: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addNBO = async (nbo: Omit<NBO, 'id' | 'createdDate' | 'updatedDate'>) => {
    try {
      const backendNBO = convertFrontendToBackendNBO(nbo);
      const createdResponse = await nboApi.create(backendNBO);
      const frontendNBO = convertBackendToFrontendNBO(createdResponse.data);
      setNBOs([...nbos, frontendNBO]);
      toast.success('NBO created successfully');
    } catch (error) {
      console.error('Error creating NBO:', error);
      toast.error('Failed to create NBO');
      throw error;
    }
  };

  const updateNBO = async (id: string, updates: Partial<NBO>) => {
    try {
      const backendUpdates = convertFrontendToBackendNBO(updates);
      const updatedResponse = await nboApi.update(id, backendUpdates);
      const frontendNBO = convertBackendToFrontendNBO(updatedResponse.data);
      setNBOs(nbos.map(nbo => nbo.id === id ? frontendNBO : nbo));
      toast.success('NBO updated successfully');
    } catch (error) {
      console.error('Error updating NBO:', error);
      toast.error('Failed to update NBO');
      throw error;
    }
  };

  const deleteNBO = async (id: string) => {
    try {
      await nboApi.delete(id);
      setNBOs(nbos.filter(nbo => nbo.id !== id));
      toast.success('NBO deleted successfully');
    } catch (error) {
      console.error('Error deleting NBO:', error);
      toast.error('Failed to delete NBO');
      throw error;
    }
  };

  const archiveNBO = async (id: string) => {
    try {
      const archivedResponse = await nboApi.archive(id);
      const frontendNBO = convertBackendToFrontendNBO(archivedResponse.data);
      setNBOs(nbos.map(nbo => nbo.id === id ? frontendNBO : nbo));
      toast.success('NBO archived successfully');
    } catch (error) {
      console.error('Error archiving NBO:', error);
      toast.error('Failed to archive NBO');
      throw error;
    }
  };

  const restoreNBO = async (id: string) => {
    try {
      const restoredResponse = await nboApi.restore(id);
      const frontendNBO = convertBackendToFrontendNBO(restoredResponse.data);
      setNBOs(nbos.map(nbo => nbo.id === id ? frontendNBO : nbo));
      toast.success('NBO restored successfully');
    } catch (error) {
      console.error('Error restoring NBO:', error);
      toast.error('Failed to restore NBO');
      throw error;
    }
  };

  const getNBOById = (id: string) => {
    return nbos.find(nbo => nbo.id === id);
  };

  const addFormFactor = async (formFactor: Omit<FormFactor, 'id'>) => {
    try {
      const createdResponse = await formFactorApi.create(formFactor);
      const frontendFF = convertBackendToFrontendFormFactor(createdResponse.data);
      setFormFactors([...formFactors, frontendFF]);
      toast.success('Form Factor created successfully');
    } catch (error) {
      console.error('Error creating Form Factor:', error);
      toast.error('Failed to create Form Factor');
      throw error;
    }
  };

  const updateFormFactor = async (id: string, updates: Partial<FormFactor>) => {
    try {
      const updatedResponse = await formFactorApi.update(id, updates);
      const frontendFF = convertBackendToFrontendFormFactor(updatedResponse.data);
      setFormFactors(formFactors.map(ff => ff.id === id ? frontendFF : ff));
      toast.success('Form Factor updated successfully');
    } catch (error) {
      console.error('Error updating Form Factor:', error);
      toast.error('Failed to update Form Factor');
      throw error;
    }
  };

  const deleteFormFactor = async (id: string) => {
    try {
      await formFactorApi.delete(id);
      setFormFactors(formFactors.filter(ff => ff.id !== id));
      setDataRates(dataRates.filter(dr => dr.formFactorId !== id));
      setStackings(stackings.filter(s => s.formFactorId !== id));
      toast.success('Form Factor deleted successfully');
    } catch (error) {
      console.error('Error deleting Form Factor:', error);
      toast.error('Failed to delete Form Factor');
      throw error;
    }
  };

  const addDataRate = async (dataRate: Omit<DataRate, 'id'>) => {
    try {
      const backendDataRate = {
        ...dataRate,
        formFactorId: parseInt(dataRate.formFactorId),
      };
      const createdResponse = await dataRateApi.create(backendDataRate);
      const frontendDR = convertBackendToFrontendDataRate(createdResponse.data);
      setDataRates([...dataRates, frontendDR]);
      toast.success('Data Rate created successfully');
    } catch (error) {
      console.error('Error creating Data Rate:', error);
      toast.error('Failed to create Data Rate');
      throw error;
    }
  };

  const updateDataRate = async (id: string, updates: Partial<DataRate>) => {
    try {
      const backendUpdates = {
        ...updates,
        formFactorId: updates.formFactorId ? parseInt(updates.formFactorId) : undefined,
      };
      const updatedResponse = await dataRateApi.update(id, backendUpdates);
      const frontendDR = convertBackendToFrontendDataRate(updatedResponse.data);
      setDataRates(dataRates.map(dr => dr.id === id ? frontendDR : dr));
      toast.success('Data Rate updated successfully');
    } catch (error) {
      console.error('Error updating Data Rate:', error);
      toast.error('Failed to update Data Rate');
      throw error;
    }
  };

  const deleteDataRate = async (id: string) => {
    try {
      await dataRateApi.delete(id);
      setDataRates(dataRates.filter(dr => dr.id !== id));
      setStackings(stackings.filter(s => s.dataRateId !== id));
      toast.success('Data Rate deleted successfully');
    } catch (error) {
      console.error('Error deleting Data Rate:', error);
      toast.error('Failed to delete Data Rate');
      throw error;
    }
  };

  const addStacking = async (stacking: Omit<Stacking, 'id'>) => {
    try {
      const backendStacking = {
        ...stacking,
        formFactorId: parseInt(stacking.formFactorId),
        dataRateId: parseInt(stacking.dataRateId),
      };
      const createdResponse = await stackingApi.create(backendStacking);
      const frontendS = convertBackendToFrontendStacking(createdResponse.data);
      setStackings([...stackings, frontendS]);
      toast.success('Stacking created successfully');
    } catch (error) {
      console.error('Error creating Stacking:', error);
      toast.error('Failed to create Stacking');
      throw error;
    }
  };

  const updateStacking = async (id: string, updates: Partial<Stacking>) => {
    try {
      const backendUpdates = {
        ...updates,
        formFactorId: updates.formFactorId ? parseInt(updates.formFactorId) : undefined,
        dataRateId: updates.dataRateId ? parseInt(updates.dataRateId) : undefined,
      };
      const updatedResponse = await stackingApi.update(id, backendUpdates);
      const frontendS = convertBackendToFrontendStacking(updatedResponse.data);
      setStackings(stackings.map(s => s.id === id ? frontendS : s));
      toast.success('Stacking updated successfully');
    } catch (error) {
      console.error('Error updating Stacking:', error);
      toast.error('Failed to update Stacking');
      throw error;
    }
  };

  const deleteStacking = async (id: string) => {
    try {
      await stackingApi.delete(id);
      setStackings(stackings.filter(s => s.id !== id));
      toast.success('Stacking deleted successfully');
    } catch (error) {
      console.error('Error deleting Stacking:', error);
      toast.error('Failed to delete Stacking');
      throw error;
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  return (
    <NBOContext.Provider
      value={{
        nbos,
        formFactors,
        dataRates,
        stackings,
        pickList,
        loading,
        addNBO,
        updateNBO,
        deleteNBO,
        archiveNBO,
        restoreNBO,
        getNBOById,
        addFormFactor,
        updateFormFactor,
        deleteFormFactor,
        addDataRate,
        updateDataRate,
        deleteDataRate,
        addStacking,
        updateStacking,
        deleteStacking,
        refreshData,
      }}
    >
      {children}
    </NBOContext.Provider>
  );
}

export function useNBO() {
  const context = useContext(NBOContext);
  if (!context) {
    throw new Error('useNBO must be used within NBOProvider');
  }
  return context;
}
