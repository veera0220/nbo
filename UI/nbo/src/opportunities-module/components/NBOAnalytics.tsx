import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Download, TrendingUp, TrendingDown, DollarSign, Award, Target } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export function NBOAnalytics() {
  const [filters, setFilters] = useState({
    bu: '',
    market: '',
    region: '',
    product: '',
    dateFrom: '',
    dateTo: '',
  });

  const handleExport = () => {
    toast.success('Exporting analytics report...');
  };

  // Sample data for charts
  const opportunityByStage = [
    { stage: 'Qualification', count: 24, value: 3200000 },
    { stage: 'Proposal', count: 18, value: 4500000 },
    { stage: 'Negotiation', count: 12, value: 6800000 },
    { stage: 'Closed Won', count: 15, value: 8200000 },
    { stage: 'Closed Lost', count: 8, value: 2100000 },
  ];

  const monthlyTrend = [
    { month: 'Jan', opportunities: 12, value: 1800000 },
    { month: 'Feb', opportunities: 15, value: 2200000 },
    { month: 'Mar', opportunities: 18, value: 2800000 },
    { month: 'Apr', opportunities: 22, value: 3400000 },
    { month: 'May', opportunities: 20, value: 3100000 },
    { month: 'Jun', opportunities: 25, value: 3800000 },
  ];

  const regionDistribution = [
    { name: 'North America', value: 35, amount: 8500000 },
    { name: 'Europe', value: 25, amount: 6200000 },
    { name: 'Asia Pacific', value: 28, amount: 7100000 },
    { name: 'China', value: 12, amount: 2800000 },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>NBO Analytics</h1>
          <p className="text-gray-600">Analyze opportunities with advanced metrics and visualizations</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter analytics by criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Label>Product</Label>
              <Select value={filters.product} onValueChange={(value) => setFilters({ ...filters, product: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="QSFP28">QSFP28</SelectItem>
                  <SelectItem value="QSFP-DD">QSFP-DD</SelectItem>
                  <SelectItem value="OSFP">OSFP</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Total Opportunities</CardDescription>
              <Target className="w-4 h-4 text-gray-500" />
            </div>
            <CardTitle className="text-3xl">77</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Wins</CardDescription>
              <Award className="w-4 h-4 text-green-600" />
            </div>
            <CardTitle className="text-3xl">15</CardTitle>
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
            <div className="flex items-center justify-between">
              <CardDescription>Losses</CardDescription>
              <TrendingDown className="w-4 h-4 text-red-600" />
            </div>
            <CardTitle className="text-3xl">8</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">10.4% loss rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Pipeline Value</CardDescription>
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <CardTitle className="text-3xl">$24.8M</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+8.3%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Avg Deal Size</CardDescription>
              <DollarSign className="w-4 h-4 text-purple-600" />
            </div>
            <CardTitle className="text-3xl">$322K</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Per opportunity</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Opportunities by Stage */}
        <Card>
          <CardHeader>
            <CardTitle>Opportunities by Stage</CardTitle>
            <CardDescription>Distribution across pipeline stages</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={opportunityByStage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  formatter={(value: number, name: string) => {
                    if (name === 'value') return `$${value.toLocaleString()}`;
                    return value;
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Count" />
                <Bar dataKey="value" fill="#8b5cf6" name="Value ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart - Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
            <CardDescription>Opportunity volume and value over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  formatter={(value: number, name: string) => {
                    if (name === 'value') return `$${value.toLocaleString()}`;
                    return value;
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="opportunities" stroke="#3b82f6" strokeWidth={2} name="Opportunities" />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} name="Value ($)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pie Chart - Regional Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Distribution</CardTitle>
          <CardDescription>Opportunities by region</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={regionDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {regionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-4">
              {regionDistribution.map((region, index) => (
                <div key={region.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{region.name}</span>
                  </div>
                  <div className="text-right">
                    <p>{region.value} opportunities</p>
                    <p className="text-sm text-gray-600">${(region.amount / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
