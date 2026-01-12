import { useState, useMemo } from 'react';
import { useNBO } from '../context/NBOContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  RotateCcw, 
  Trash2, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  ChevronDown,
  AlertTriangle,
  Archive as ArchiveIcon,
  Home,
  ChevronRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner@2.0.3';

const statusColors = {
  'New': 'bg-blue-100 text-blue-700',
  'Open': 'bg-green-100 text-green-700',
  'Won': 'bg-emerald-100 text-emerald-700',
  'Lost': 'bg-red-100 text-red-700',
  'On Hold': 'bg-yellow-100 text-yellow-700',
};

const riskColors = {
  'Low': 'bg-green-100 text-green-700',
  'Medium': 'bg-yellow-100 text-yellow-700',
  'High': 'bg-red-100 text-red-700',
};

const defaultColumns = {
  nboId: true,
  salesRep: true,
  appEng: true,
  salesGroup: true,
  date: true,
  region: true,
  quarter: true,
  parentEndUser: true,
  cemCmOdm: true,
  bu: true,
  product: true,
  program: true,
  pnProductDescription: true,
  tsyAt100MS: true,
  value: true,
  stage: false,
  status: true,
  competition: false,
  market: true,
  type: false,
  risk: true,
  formFactor: false,
  dataRate: false,
  stacking: false,
};

export function Archive() {
  const { nbos, restoreNBO, deleteNBO } = useNBO();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState(defaultColumns);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<'single' | 'multiple'>('single');
  const [singleDeleteId, setSingleDeleteId] = useState<string | null>(null);

  const archivedNBOs = nbos.filter(nbo => nbo.isArchived);

  // Search and filter
  const filteredNBOs = useMemo(() => {
    return archivedNBOs.filter(nbo => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableFields = [
          nbo.id,
          nbo.customerName,
          nbo.parentEndUser,
          nbo.region,
          nbo.bu,
          nbo.product,
          nbo.status,
          nbo.salesRep,
          nbo.appEng,
          nbo.program,
          nbo.pnProductDescription,
          nbo.market,
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchableFields.includes(query)) return false;
      }
      return true;
    });
  }, [archivedNBOs, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredNBOs.length / itemsPerPage);
  const paginatedNBOs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNBOs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNBOs, currentPage, itemsPerPage]);

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(paginatedNBOs.map(nbo => nbo.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelection = new Set(selectedRows);
    if (checked) {
      newSelection.add(id);
    } else {
      newSelection.delete(id);
    }
    setSelectedRows(newSelection);
  };

  const handleRestoreSelected = () => {
    selectedRows.forEach(id => restoreNBO(id));
    toast.success(`${selectedRows.size} NBO(s) restored successfully`);
    setSelectedRows(new Set());
  };

  const handleDeleteSelected = () => {
    selectedRows.forEach(id => deleteNBO(id));
    toast.success(`${selectedRows.size} NBO(s) deleted permanently`);
    setSelectedRows(new Set());
    setShowDeleteDialog(false);
  };

  const handleRestore = (id: string) => {
    restoreNBO(id);
    toast.success('NBO restored successfully');
  };

  const handleDeleteSingle = () => {
    if (singleDeleteId) {
      deleteNBO(singleDeleteId);
      toast.success('NBO deleted permanently');
      setSingleDeleteId(null);
      setShowDeleteDialog(false);
    }
  };

  const openDeleteDialog = (type: 'single' | 'multiple', id?: string) => {
    setDeleteTarget(type);
    if (type === 'single' && id) {
      setSingleDeleteId(id);
    }
    setShowDeleteDialog(true);
  };

  const handleExport = () => {
    const headers = Object.entries(visibleColumns)
      .filter(([_, visible]) => visible)
      .map(([key]) => key);
    
    const csvContent = [
      headers.join(','),
      ...filteredNBOs.map(nbo => 
        headers.map(header => {
          switch(header) {
            case 'nboId': return nbo.id;
            case 'salesRep': return nbo.salesRep || '';
            case 'appEng': return nbo.appEng || '';
            case 'salesGroup': return nbo.salesGroup || '';
            case 'date': return nbo.createdDate;
            case 'region': return nbo.region;
            case 'quarter': return nbo.quarter || '';
            case 'parentEndUser': return nbo.parentEndUser || '';
            case 'cemCmOdm': return nbo.orderingCEMCM || '';
            case 'bu': return nbo.bu;
            case 'product': return nbo.product || '';
            case 'program': return nbo.program || '';
            case 'pnProductDescription': return nbo.pnProductDescription || '';
            case 'tsyAt100MS': return nbo.tsyAt100MS || 0;
            case 'value': return nbo.expectedValue;
            case 'status': return nbo.status;
            case 'competition': return nbo.competition || '';
            case 'market': return nbo.market || '';
            case 'type': return nbo.type || '';
            case 'risk': return nbo.risk || '';
            case 'formFactor': return nbo.formFactor || '';
            case 'dataRate': return nbo.dataRate || '';
            case 'stacking': return nbo.stacking || '';
            default: return '';
          }
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `archived-nbos-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Export completed');
  };

  const isAllSelected = paginatedNBOs.length > 0 && selectedRows.size === paginatedNBOs.length;
  const isSomeSelected = selectedRows.size > 0 && selectedRows.size < paginatedNBOs.length;

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/nbos">NBOs</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Archive</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2">
              <ArchiveIcon className="w-7 h-7" />
              Archived NBO Records
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredNBOs.length} archived {filteredNBOs.length === 1 ? 'record' : 'records'}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
          <Link to="/nbos">
            <Button variant="outline">
              Back to NBO List
            </Button>
          </Link>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by NBO ID, Customer, Region, Product, Status..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            {/* Show/Hide Columns */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Columns
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 max-h-96 overflow-y-auto">
                <DropdownMenuLabel>Show/Hide Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(defaultColumns).map(([key, defaultValue]) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={visibleColumns[key as keyof typeof defaultColumns]}
                    onCheckedChange={(checked) => 
                      setVisibleColumns(prev => ({ ...prev, [key]: checked }))
                    }
                  >
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Export CSV */}
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>

            {/* Restore Selected */}
            {selectedRows.size > 0 && (
              <>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleRestoreSelected}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restore Selected ({selectedRows.size})
                </Button>

                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => openDeleteDialog('multiple')}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected ({selectedRows.size})
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Table */}
        {filteredNBOs.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ArchiveIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg mb-2">No archived NBO records found</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-md text-center">
                {searchQuery 
                  ? `No results match your search for "${searchQuery}"`
                  : "There are currently no archived NBOs in the system"
                }
              </p>
              <Link to="/nbos">
                <Button>
                  Back to NBO List
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block border rounded-lg bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-gray-50 z-10">
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={isAllSelected}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
                      {visibleColumns.nboId && <TableHead className="sticky left-0 bg-gray-50 z-10">NBO ID</TableHead>}
                      {visibleColumns.salesRep && <TableHead>Sales Rep</TableHead>}
                      {visibleColumns.appEng && <TableHead>App Eng</TableHead>}
                      {visibleColumns.salesGroup && <TableHead>Sales Group</TableHead>}
                      {visibleColumns.date && <TableHead>Date</TableHead>}
                      {visibleColumns.region && <TableHead>Region</TableHead>}
                      {visibleColumns.quarter && <TableHead>Quarter</TableHead>}
                      {visibleColumns.parentEndUser && <TableHead>Parent/End User</TableHead>}
                      {visibleColumns.cemCmOdm && <TableHead>CEM/CM/ODM</TableHead>}
                      {visibleColumns.bu && <TableHead>Business Unit</TableHead>}
                      {visibleColumns.product && <TableHead>Product</TableHead>}
                      {visibleColumns.program && <TableHead>Program</TableHead>}
                      {visibleColumns.pnProductDescription && <TableHead>P/N or Product Desc</TableHead>}
                      {visibleColumns.tsyAt100MS && <TableHead>TSY (100% MS)</TableHead>}
                      {visibleColumns.value && <TableHead>Value</TableHead>}
                      {visibleColumns.stage && <TableHead>Stage</TableHead>}
                      {visibleColumns.status && <TableHead>Status</TableHead>}
                      {visibleColumns.competition && <TableHead>Competition</TableHead>}
                      {visibleColumns.market && <TableHead>Market</TableHead>}
                      {visibleColumns.type && <TableHead>Type</TableHead>}
                      {visibleColumns.risk && <TableHead>Risk</TableHead>}
                      {visibleColumns.formFactor && <TableHead>Form Factor</TableHead>}
                      {visibleColumns.dataRate && <TableHead>Data Rate</TableHead>}
                      {visibleColumns.stacking && <TableHead>Stacking</TableHead>}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedNBOs.map((nbo) => (
                      <TableRow 
                        key={nbo.id} 
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => navigate(`/nbos/${nbo.id}`)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedRows.has(nbo.id)}
                            onCheckedChange={(checked) => handleSelectRow(nbo.id, checked as boolean)}
                            aria-label={`Select ${nbo.id}`}
                          />
                        </TableCell>
                        {visibleColumns.nboId && (
                          <TableCell className="sticky left-0 bg-white font-medium">
                            <span className="text-blue-600">
                              {nbo.id}
                            </span>
                          </TableCell>
                        )}
                        {visibleColumns.salesRep && <TableCell>{nbo.salesRep || '-'}</TableCell>}
                        {visibleColumns.appEng && <TableCell>{nbo.appEng || '-'}</TableCell>}
                        {visibleColumns.salesGroup && <TableCell>{nbo.salesGroup || '-'}</TableCell>}
                        {visibleColumns.date && <TableCell>{nbo.createdDate}</TableCell>}
                        {visibleColumns.region && <TableCell>{nbo.region}</TableCell>}
                        {visibleColumns.quarter && <TableCell>{nbo.quarter || '-'}</TableCell>}
                        {visibleColumns.parentEndUser && (
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help">
                                    {nbo.parentEndUser 
                                      ? nbo.parentEndUser.length > 20 
                                        ? `${nbo.parentEndUser.substring(0, 20)}...` 
                                        : nbo.parentEndUser
                                      : '-'
                                    }
                                  </span>
                                </TooltipTrigger>
                                {nbo.parentEndUser && nbo.parentEndUser.length > 20 && (
                                  <TooltipContent>
                                    <p>{nbo.parentEndUser}</p>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        )}
                        {visibleColumns.cemCmOdm && <TableCell>{nbo.orderingCEMCM || '-'}</TableCell>}
                        {visibleColumns.bu && <TableCell>{nbo.bu}</TableCell>}
                        {visibleColumns.product && <TableCell>{nbo.product || '-'}</TableCell>}
                        {visibleColumns.program && <TableCell>{nbo.program || '-'}</TableCell>}
                        {visibleColumns.pnProductDescription && (
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help">
                                    {nbo.pnProductDescription 
                                      ? nbo.pnProductDescription.length > 25 
                                        ? `${nbo.pnProductDescription.substring(0, 25)}...` 
                                        : nbo.pnProductDescription
                                      : '-'
                                    }
                                  </span>
                                </TooltipTrigger>
                                {nbo.pnProductDescription && nbo.pnProductDescription.length > 25 && (
                                  <TooltipContent>
                                    <p className="max-w-xs">{nbo.pnProductDescription}</p>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        )}
                        {visibleColumns.tsyAt100MS && (
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help">
                                    ${nbo.tsyAt100MS ? `${(nbo.tsyAt100MS / 1000).toFixed(0)}K` : '0K'}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Total Serviceable Year at 100% Market Share</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        )}
                        {visibleColumns.value && (
                          <TableCell className="font-semibold">
                            ${(nbo.expectedValue / 1000).toFixed(0)}K
                          </TableCell>
                        )}
                        {visibleColumns.stage && <TableCell>-</TableCell>}
                        {visibleColumns.status && (
                          <TableCell>
                            <Badge variant="secondary" className={statusColors[nbo.status]}>
                              {nbo.status}
                            </Badge>
                          </TableCell>
                        )}
                        {visibleColumns.competition && <TableCell>{nbo.competition || '-'}</TableCell>}
                        {visibleColumns.market && <TableCell>{nbo.market || '-'}</TableCell>}
                        {visibleColumns.type && <TableCell>{nbo.type || '-'}</TableCell>}
                        {visibleColumns.risk && (
                          <TableCell>
                            {nbo.risk ? (
                              <Badge 
                                variant="secondary" 
                                className={riskColors[nbo.risk as keyof typeof riskColors]}
                              >
                                {nbo.risk}
                              </Badge>
                            ) : '-'}
                          </TableCell>
                        )}
                        {visibleColumns.formFactor && <TableCell>{nbo.formFactor || '-'}</TableCell>}
                        {visibleColumns.dataRate && <TableCell>{nbo.dataRate || '-'}</TableCell>}
                        {visibleColumns.stacking && <TableCell>{nbo.stacking || '-'}</TableCell>}
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-1 justify-end">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRestore(nbo.id)}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <RotateCcw className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Restore</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openDeleteDialog('single', nbo.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete Permanently</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {paginatedNBOs.map((nbo) => (
                <Card key={nbo.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedRows.has(nbo.id)}
                          onCheckedChange={(checked) => handleSelectRow(nbo.id, checked as boolean)}
                        />
                        <div>
                          <Link to={`/nbos/${nbo.id}`} className="text-blue-600 hover:underline">
                            {nbo.id}
                          </Link>
                          <p className="text-sm text-gray-600 mt-1">{nbo.customerName}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className={statusColors[nbo.status]}>
                        {nbo.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">BU:</span>
                        <span>{nbo.bu}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Value:</span>
                        <span className="font-semibold">${(nbo.expectedValue / 1000).toFixed(0)}K</span>
                      </div>
                      {nbo.risk && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Risk:</span>
                          <Badge 
                            variant="secondary" 
                            className={riskColors[nbo.risk as keyof typeof riskColors]}
                          >
                            {nbo.risk}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4 pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(nbo.id)}
                        className="flex-1"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Restore
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog('single', nbo.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Show</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span>
                  of {filteredNBOs.length} {filteredNBOs.length === 1 ? 'record' : 'records'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600 px-2">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Delete NBO Permanently?
              </AlertDialogTitle>
              <AlertDialogDescription>
                {deleteTarget === 'multiple' ? (
                  <>
                    This action cannot be undone. This will permanently delete{' '}
                    <strong>{selectedRows.size} NBO record{selectedRows.size > 1 ? 's' : ''}</strong>{' '}
                    from the system.
                  </>
                ) : (
                  <>
                    This action cannot be undone. This will permanently delete this NBO record from the system.
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setShowDeleteDialog(false);
                setSingleDeleteId(null);
              }}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteTarget === 'multiple' ? handleDeleteSelected : handleDeleteSingle}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}