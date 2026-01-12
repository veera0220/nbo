import { useState, useMemo } from 'react';
import { useNBO } from '../context/NBOContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  BarChart,
  Bar,
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { 
  FileText, 
  FilePlus, 
  FileCheck, 
  Archive, 
  Building2, 
  Globe, 
  Calendar,
  Plus,
  TrendingUp,
  DollarSign,
  Target,
  Users,
  Package,
  AlertCircle,
  Award,
  XCircle,
  Briefcase
} from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#ef4444', '#06b6d4'];
const currentYear = new Date().getFullYear();
const availableYears = [2025, 2026, 2027, 2028];

export function Dashboard() {
  const { nbos } = useNBO();
  const activeNBOs = nbos.filter(nbo => !nbo.isArchived);
  
  // Filter states
  const [selectedBU, setSelectedBU] = useState<string>('All');
  const [chartYears, setChartYears] = useState<number[]>(availableYears);

  // Get all unique BUs
  const allBUs = ['All', ...new Set(activeNBOs.map(nbo => nbo.bu))];

  // Filter NBOs by selected BU
  const filteredNBOs = selectedBU === 'All' 
    ? activeNBOs 
    : activeNBOs.filter(nbo => nbo.bu === selectedBU);

  // Summary calculations
  const totalNBOs = filteredNBOs.length;
  const newNBOs = filteredNBOs.filter(nbo => nbo.status === 'New').length;
  const openNBOs = filteredNBOs.filter(nbo => nbo.status === 'Open').length;
  const wonNBOs = filteredNBOs.filter(nbo => nbo.status === 'Won').length;
  const lostNBOs = filteredNBOs.filter(nbo => nbo.status === 'Lost').length;
  const onHoldNBOs = filteredNBOs.filter(nbo => nbo.status === 'On Hold').length;
  const archivedNBOs = nbos.filter(nbo => nbo.isArchived).length;

  // Financial calculations
  const totalPipelineValue = filteredNBOs.reduce((sum, nbo) => sum + (nbo.expectedValue || 0), 0);
  const wonValue = filteredNBOs.filter(nbo => nbo.status === 'Won').reduce((sum, nbo) => sum + (nbo.expectedValue || 0), 0);
  const avgNBOValue = totalNBOs > 0 ? totalPipelineValue / totalNBOs : 0;
  const winRate = totalNBOs > 0 ? ((wonNBOs / (wonNBOs + lostNBOs)) * 100) || 0 : 0;

  // NBOs by Status
  const statusDistribution = [
    { name: 'New', value: newNBOs, color: '#3b82f6' },
    { name: 'Open', value: openNBOs, color: '#10b981' },
    { name: 'Won', value: wonNBOs, color: '#059669' },
    { name: 'Lost', value: lostNBOs, color: '#ef4444' },
    { name: 'On Hold', value: onHoldNBOs, color: '#f59e0b' },
  ].filter(item => item.value > 0);

  // NBO Count by Year (replacing revenue forecast)
  const nboCountByYear = useMemo(() => {
    const yearCounts: Record<number, number> = {};
    
    filteredNBOs.forEach(nbo => {
      const year = parseInt(nbo.nboYear);
      if (chartYears.includes(year)) {
        yearCounts[year] = (yearCounts[year] || 0) + 1;
      }
    });

    return chartYears.map(year => ({
      year: year.toString(),
      count: yearCounts[year] || 0,
    }));
  }, [filteredNBOs, chartYears]);

  // Top Opportunities by Value
  const topOpportunities = [...filteredNBOs]
    .sort((a, b) => (b.expectedValue || 0) - (a.expectedValue || 0))
    .slice(0, 5);

  // At Risk NBOs
  const atRiskNBOs = filteredNBOs.filter(nbo => 
    nbo.risk === 'High' || nbo.status === 'On Hold'
  ).slice(0, 5);

  const toggleChartYear = (year: number) => {
    setChartYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year].sort()
    );
  };

  const statusColors = {
    'New': 'bg-blue-100 text-blue-700',
    'Open': 'bg-green-100 text-green-700',
    'Won': 'bg-emerald-100 text-emerald-700',
    'Lost': 'bg-red-100 text-red-700',
    'On Hold': 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>NBO Dashboard</h1>
          <p className="text-gray-600">Comprehensive overview of all New Business Opportunities</p>
        </div>
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Building2 className="w-4 h-4 mr-2" />
                {selectedBU}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Business Unit</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allBUs.map(bu => (
                <DropdownMenuCheckboxItem
                  key={bu}
                  checked={selectedBU === bu}
                  onCheckedChange={() => setSelectedBU(bu)}
                >
                  {bu}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/nbos/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create NBO
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Total Pipeline Value</CardTitle>
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${(totalPipelineValue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-gray-500 mt-1">{totalNBOs} opportunities</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Won Value</CardTitle>
              <Award className="w-5 h-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${(wonValue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-gray-500 mt-1">{wonNBOs} won opportunities</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Win Rate</CardTitle>
              <Target className="w-5 h-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{winRate.toFixed(1)}%</div>
            <div className="mt-2">
              <Progress value={winRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Avg NBO Value</CardTitle>
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${(avgNBOValue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-gray-500 mt-1">Per opportunity</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total NBOs</p>
                <p className="text-xl">{totalNBOs}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">New</p>
                <p className="text-xl">{newNBOs}</p>
              </div>
              <FilePlus className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Open</p>
                <p className="text-xl">{openNBOs}</p>
              </div>
              <FileCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Won</p>
                <p className="text-xl">{wonNBOs}</p>
              </div>
              <Award className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Lost</p>
                <p className="text-xl">{lostNBOs}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">On Hold</p>
                <p className="text-xl">{onHoldNBOs}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NBOs Count by Year */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                NBOs by Year
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    {chartYears.length === availableYears.length 
                      ? 'All Years' 
                      : `${chartYears.length} Year${chartYears.length > 1 ? 's' : ''}`
                    }
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Select Years</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {availableYears.map(year => (
                    <DropdownMenuCheckboxItem
                      key={year}
                      checked={chartYears.includes(year)}
                      onCheckedChange={() => toggleChartYear(year)}
                    >
                      {year}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            {chartYears.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Please select at least one year
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={nboCountByYear}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis 
                    label={{ value: 'Number of NBOs', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    name="NBOs Count" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              NBO Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusDistribution.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <Tabs defaultValue="top" className="space-y-4">
        <TabsList>
          <TabsTrigger value="top">Top Opportunities</TabsTrigger>
          <TabsTrigger value="risk">At Risk</TabsTrigger>
        </TabsList>

        <TabsContent value="top">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Opportunities by Value</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>NBO ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>BU</TableHead>
                    <TableHead>Application</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expected Value</TableHead>
                    <TableHead>Owner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topOpportunities.map((nbo, index) => (
                    <TableRow key={nbo.id}>
                      <TableCell>
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          {index + 1}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link to={`/nbos/${nbo.id}`} className="text-blue-600 hover:underline">
                          {nbo.id}
                        </Link>
                      </TableCell>
                      <TableCell>{nbo.customerName}</TableCell>
                      <TableCell>{nbo.bu}</TableCell>
                      <TableCell>{nbo.application}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={statusColors[nbo.status]}>
                          {nbo.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${(nbo.expectedValue / 1000).toFixed(0)}K
                      </TableCell>
                      <TableCell>{nbo.owner}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                At Risk Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              {atRiskNBOs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No at-risk opportunities found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NBO ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>BU</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Expected Value</TableHead>
                      <TableHead>Owner</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {atRiskNBOs.map((nbo) => (
                      <TableRow key={nbo.id}>
                        <TableCell>
                          <Link to={`/nbos/${nbo.id}`} className="text-blue-600 hover:underline">
                            {nbo.id}
                          </Link>
                        </TableCell>
                        <TableCell>{nbo.customerName}</TableCell>
                        <TableCell>{nbo.bu}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={statusColors[nbo.status]}>
                            {nbo.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {nbo.risk && (
                            <Badge 
                              variant="secondary" 
                              className={
                                nbo.risk === 'High' 
                                  ? 'bg-red-100 text-red-700' 
                                  : nbo.risk === 'Medium'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-green-100 text-green-700'
                              }
                            >
                              {nbo.risk}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>${(nbo.expectedValue / 1000).toFixed(0)}K</TableCell>
                        <TableCell>{nbo.owner}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
