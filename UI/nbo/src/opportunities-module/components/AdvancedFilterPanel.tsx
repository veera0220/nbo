import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { NBO, useNBO } from '../context/NBOContext';

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

interface Props {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClose: () => void;
  nbos: NBO[];
}

export function AdvancedFilterPanel({ filters, onFiltersChange, onClose, nbos }: Props) {
  const [localFilters, setLocalFilters] = useState(filters);
  const { pickList } = useNBO();

  // Static data for Customer, Region, Country, Product Line
  const uniqueCustomers = [
    'Cisco Systems',
    'Huawei Technologies',
    'Dell Technologies',
    'Arista Networks',
    'Nokia',
    'Ericsson',
    'Juniper Networks',
    'Hewlett Packard Enterprise',
    'IBM',
    'Microsoft',
    'Amazon Web Services',
    'Google Cloud',
    'Oracle',
    'Intel',
    'AMD',
    'NVIDIA',
    'Broadcom',
    'Qualcomm',
    'Apple',
    'Samsung',
  ].sort();

  const uniqueRegions = [
    'Americas',
    'EMEA',
    'APAC',
    'North America',
    'South America',
    'Europe',
    'Middle East',
    'Africa',
    'Asia Pacific',
    'China',
    'Japan',
    'India',
  ].sort();

  const uniqueCountries = [
    'USA',
    'Canada',
    'Mexico',
    'Brazil',
    'Germany',
    'France',
    'United Kingdom',
    'Italy',
    'Spain',
    'Netherlands',
    'Sweden',
    'Finland',
    'China',
    'Japan',
    'India',
    'South Korea',
    'Singapore',
    'Australia',
    'Taiwan',
    'Israel',
    'United Arab Emirates',
    'Saudi Arabia',
  ].sort();

  const uniqueProductLines = [
    'High Speed',
    'Power Connectors',
    'RF Connectors',
    'HSIO Connectors',
    'Data Center',
    'Automotive',
    'Industrial',
    'Medical',
    'Aerospace',
    'Consumer Electronics',
    'Telecommunications',
    'Networking',
  ].sort();

  // Extract unique values from NBOs (for dynamic data not in picklist)
  const uniqueApplications = [...new Set(nbos.map(n => n.application).filter(Boolean))].sort();
  const uniqueFormFactors = [...new Set(nbos.map(n => n.formFactor).filter(Boolean))].sort();
  const uniqueDataRates = [...new Set(nbos.map(n => n.dataRate).filter(Boolean))].sort();
  const uniqueStackings = [...new Set(nbos.map(n => n.stacking).filter(Boolean))].sort();

  // Use picklist data from API for master data
  const uniqueBUs = pickList?.businessUnits?.map(item => item.value).sort() || [];
  const uniqueStatuses = pickList?.statuses?.map(item => item.value).sort() || [];
  const uniqueSalesReps = pickList?.salesReps?.map(item => item.value).sort() || [];
  const uniqueAppsEngs = pickList?.appsEngs?.map(item => item.value).sort() || [];
  const uniqueMarkets = pickList?.markets?.map(item => item.value).sort() || [];
  const uniqueOrderingTypes = pickList?.orderingTypes?.map(item => item.value).sort() || [];
  const uniqueRisks = pickList?.risks?.map(item => item.value).sort() || [];
  const uniqueTypes = pickList?.types?.map(item => item.value).sort() || [];
  const uniqueSalesGroups = pickList?.salesGroups?.map(item => item.value).sort() || [];

  // Extract owners from NBOs (salesRep field) - fallback to pickList if available
  const uniqueOwners = uniqueSalesReps.length > 0 
    ? uniqueSalesReps 
    : [...new Set(nbos.map(n => n.owner).filter(Boolean))].sort();

  // Static time-based filters
  const uniqueYears = [2025, 2026, 2027, 2028];
  const uniqueQuarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClear = () => {
    const emptyFilters: FilterState = {
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
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const handleSaveFilter = () => {
    const filterName = prompt('Enter a name for this filter:');
    if (filterName) {
      const savedFilters = JSON.parse(localStorage.getItem('savedNBOFilters') || '{}');
      savedFilters[filterName] = localFilters;
      localStorage.setItem('savedNBOFilters', JSON.stringify(savedFilters));
      alert('Filter saved successfully!');
    }
  };

  const toggleArrayFilter = (key: keyof FilterState, value: string | number) => {
    setLocalFilters(prev => {
      const current = prev[key] as any[];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  return (
    <Card className="border-2 border-blue-200 bg-blue-50/50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Advanced Filters</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[500px] overflow-y-auto px-6 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Customer */}
            <div className="space-y-4">
              <Label>Customer</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-white">
                {uniqueCustomers.map(customer => (
                  <div key={customer} className="flex items-center gap-2">
                    <Checkbox
                      id={`customer-${customer}`}
                      checked={localFilters.customers.includes(customer)}
                      onCheckedChange={() => toggleArrayFilter('customers', customer)}
                    />
                    <label htmlFor={`customer-${customer}`} className="text-sm cursor-pointer">
                      {customer}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Region */}
            <div className="space-y-4">
              <Label>Region</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-white">
                {uniqueRegions.map(region => (
                  <div key={region} className="flex items-center gap-2">
                    <Checkbox
                      id={`region-${region}`}
                      checked={localFilters.regions.includes(region)}
                      onCheckedChange={() => toggleArrayFilter('regions', region)}
                    />
                    <label htmlFor={`region-${region}`} className="text-sm cursor-pointer">
                      {region}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Country */}
            <div className="space-y-4">
              <Label>Country</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-white">
                {uniqueCountries.map(country => (
                  <div key={country} className="flex items-center gap-2">
                    <Checkbox
                      id={`country-${country}`}
                      checked={localFilters.countries.includes(country)}
                      onCheckedChange={() => toggleArrayFilter('countries', country)}
                    />
                    <label htmlFor={`country-${country}`} className="text-sm cursor-pointer">
                      {country}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Unit */}
            <div className="space-y-4">
              <Label>Business Unit</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-white">
                {uniqueBUs.length > 0 ? (
                  uniqueBUs.map(bu => (
                    <div key={bu} className="flex items-center gap-2">
                      <Checkbox
                        id={`bu-${bu}`}
                        checked={localFilters.bus.includes(bu)}
                        onCheckedChange={() => toggleArrayFilter('bus', bu)}
                      />
                      <label htmlFor={`bu-${bu}`} className="text-sm cursor-pointer">
                        {bu}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No business units available</p>
                )}
              </div>
            </div>

            {/* Product Line */}
            <div className="space-y-4">
              <Label>Product Line</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-white">
                {uniqueProductLines.map(pl => (
                  <div key={pl} className="flex items-center gap-2">
                    <Checkbox
                      id={`pl-${pl}`}
                      checked={localFilters.productLines.includes(pl)}
                      onCheckedChange={() => toggleArrayFilter('productLines', pl)}
                    />
                    <label htmlFor={`pl-${pl}`} className="text-sm cursor-pointer">
                      {pl}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Application */}
            <div className="space-y-4">
              <Label>Application</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-white">
                {uniqueApplications.map(app => (
                  <div key={app} className="flex items-center gap-2">
                    <Checkbox
                      id={`app-${app}`}
                      checked={localFilters.applications.includes(app)}
                      onCheckedChange={() => toggleArrayFilter('applications', app)}
                    />
                    <label htmlFor={`app-${app}`} className="text-sm cursor-pointer">
                      {app}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <Label>Status</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-white">
                {uniqueStatuses.length > 0 ? (
                  uniqueStatuses.map(status => (
                    <div key={status} className="flex items-center gap-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={localFilters.statuses.includes(status)}
                        onCheckedChange={() => toggleArrayFilter('statuses', status)}
                      />
                      <label htmlFor={`status-${status}`} className="text-sm cursor-pointer">
                        {status}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No statuses available</p>
                )}
              </div>
            </div>

            {/* NBO Year */}
            <div className="space-y-4">
              <Label>NBO Year</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-white">
                {uniqueYears.map(year => (
                  <div key={year} className="flex items-center gap-2">
                    <Checkbox
                      id={`year-${year}`}
                      checked={localFilters.years.includes(year)}
                      onCheckedChange={() => toggleArrayFilter('years', year)}
                    />
                    <label htmlFor={`year-${year}`} className="text-sm cursor-pointer">
                      {year}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Quarter */}
            <div className="space-y-4">
              <Label>Quarter</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-white">
                {uniqueQuarters.map(quarter => (
                  <div key={quarter} className="flex items-center gap-2">
                    <Checkbox
                      id={`quarter-${quarter}`}
                      checked={localFilters.quarters.includes(quarter)}
                      onCheckedChange={() => toggleArrayFilter('quarters', quarter)}
                    />
                    <label htmlFor={`quarter-${quarter}`} className="text-sm cursor-pointer">
                      {quarter}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Owner (Sales Rep) */}
            <div className="space-y-4">
              <Label>Owner (Sales Rep)</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-white">
                {uniqueOwners.length > 0 ? (
                  uniqueOwners.map(owner => (
                    <div key={owner} className="flex items-center gap-2">
                      <Checkbox
                        id={`owner-${owner}`}
                        checked={localFilters.owners.includes(owner)}
                        onCheckedChange={() => toggleArrayFilter('owners', owner)}
                      />
                      <label htmlFor={`owner-${owner}`} className="text-sm cursor-pointer">
                        {owner}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No sales reps available</p>
                )}
              </div>
            </div>

            {/* Market */}
            {uniqueMarkets.length > 0 && (
              <div className="space-y-4">
                <Label>Market</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-white">
                  {uniqueMarkets.map(market => (
                    <div key={market} className="flex items-center gap-2">
                      <Checkbox
                        id={`market-${market}`}
                        checked={localFilters.markets?.includes(market) || false}
                        onCheckedChange={() => {
                          const markets = localFilters.markets || [];
                          const updated = markets.includes(market)
                            ? markets.filter(m => m !== market)
                            : [...markets, market];
                          setLocalFilters(prev => ({ ...prev, markets: updated }));
                        }}
                      />
                      <label htmlFor={`market-${market}`} className="text-sm cursor-pointer">
                        {market}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ordering Type */}
            {uniqueOrderingTypes.length > 0 && (
              <div className="space-y-4">
                <Label>Ordering Type</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-white">
                  {uniqueOrderingTypes.map(orderingType => (
                    <div key={orderingType} className="flex items-center gap-2">
                      <Checkbox
                        id={`orderingType-${orderingType}`}
                        checked={localFilters.orderingTypes?.includes(orderingType) || false}
                        onCheckedChange={() => {
                          const orderingTypes = localFilters.orderingTypes || [];
                          const updated = orderingTypes.includes(orderingType)
                            ? orderingTypes.filter(ot => ot !== orderingType)
                            : [...orderingTypes, orderingType];
                          setLocalFilters(prev => ({ ...prev, orderingTypes: updated }));
                        }}
                      />
                      <label htmlFor={`orderingType-${orderingType}`} className="text-sm cursor-pointer">
                        {orderingType}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risk */}
            {uniqueRisks.length > 0 && (
              <div className="space-y-4">
                <Label>Risk</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-white">
                  {uniqueRisks.map(risk => (
                    <div key={risk} className="flex items-center gap-2">
                      <Checkbox
                        id={`risk-${risk}`}
                        checked={localFilters.risks?.includes(risk) || false}
                        onCheckedChange={() => {
                          const risks = localFilters.risks || [];
                          const updated = risks.includes(risk)
                            ? risks.filter(r => r !== risk)
                            : [...risks, risk];
                          setLocalFilters(prev => ({ ...prev, risks: updated }));
                        }}
                      />
                      <label htmlFor={`risk-${risk}`} className="text-sm cursor-pointer">
                        {risk}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Type */}
            {uniqueTypes.length > 0 && (
              <div className="space-y-4">
                <Label>Type</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-white">
                  {uniqueTypes.map(type => (
                    <div key={type} className="flex items-center gap-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={localFilters.types?.includes(type) || false}
                        onCheckedChange={() => {
                          const types = localFilters.types || [];
                          const updated = types.includes(type)
                            ? types.filter(t => t !== type)
                            : [...types, type];
                          setLocalFilters(prev => ({ ...prev, types: updated }));
                        }}
                      />
                      <label htmlFor={`type-${type}`} className="text-sm cursor-pointer">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sales Group */}
            {uniqueSalesGroups.length > 0 && (
              <div className="space-y-4">
                <Label>Sales Group</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-white">
                  {uniqueSalesGroups.map(salesGroup => (
                    <div key={salesGroup} className="flex items-center gap-2">
                      <Checkbox
                        id={`salesGroup-${salesGroup}`}
                        checked={localFilters.salesGroups?.includes(salesGroup) || false}
                        onCheckedChange={() => {
                          const salesGroups = localFilters.salesGroups || [];
                          const updated = salesGroups.includes(salesGroup)
                            ? salesGroups.filter(sg => sg !== salesGroup)
                            : [...salesGroups, salesGroup];
                          setLocalFilters(prev => ({ ...prev, salesGroups: updated }));
                        }}
                      />
                      <label htmlFor={`salesGroup-${salesGroup}`} className="text-sm cursor-pointer">
                        {salesGroup}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Form Factor (HSIO only) */}
            {uniqueFormFactors.length > 0 && (
              <div className="space-y-4">
                <Label>Form Factor (HSIO)</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-white">
                  {uniqueFormFactors.map(ff => (
                    <div key={ff} className="flex items-center gap-2">
                      <Checkbox
                        id={`ff-${ff}`}
                        checked={localFilters.formFactors.includes(ff)}
                        onCheckedChange={() => toggleArrayFilter('formFactors', ff)}
                      />
                      <label htmlFor={`ff-${ff}`} className="text-sm cursor-pointer">
                        {ff}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Data Rate (HSIO only) */}
            {uniqueDataRates.length > 0 && (
              <div className="space-y-4">
                <Label>Data Rate (HSIO)</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-white">
                  {uniqueDataRates.map(dr => (
                    <div key={dr} className="flex items-center gap-2">
                      <Checkbox
                        id={`dr-${dr}`}
                        checked={localFilters.dataRates.includes(dr)}
                        onCheckedChange={() => toggleArrayFilter('dataRates', dr)}
                      />
                      <label htmlFor={`dr-${dr}`} className="text-sm cursor-pointer">
                        {dr}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stacking (HSIO only) */}
            {uniqueStackings.length > 0 && (
              <div className="space-y-4">
                <Label>Stacking (HSIO)</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-white">
                  {uniqueStackings.map(st => (
                    <div key={st} className="flex items-center gap-2">
                      <Checkbox
                        id={`st-${st}`}
                        checked={localFilters.stackings.includes(st)}
                        onCheckedChange={() => toggleArrayFilter('stackings', st)}
                      />
                      <label htmlFor={`st-${st}`} className="text-sm cursor-pointer">
                        {st}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Value Range */}
            <div className="space-y-4">
              <Label>Expected Value Range ($)</Label>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Min value"
                  value={localFilters.valueMin || ''}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    valueMin: e.target.value ? Number(e.target.value) : undefined
                  }))}
                />
                <Input
                  type="number"
                  placeholder="Max value"
                  value={localFilters.valueMax || ''}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    valueMax: e.target.value ? Number(e.target.value) : undefined
                  }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 px-6 py-4 border-t bg-white sticky bottom-0">
          <Button onClick={handleApply} className="flex-1 min-w-[140px]">
            Apply Filter
          </Button>
          <Button onClick={handleClear} variant="outline">
            Clear All
          </Button>
          <Button onClick={handleSaveFilter} variant="outline">
            Save Filter
          </Button>
          <Button onClick={onClose} variant="ghost">
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}