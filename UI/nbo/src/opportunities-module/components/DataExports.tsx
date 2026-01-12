import { useState } from 'react';
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
import { Download, FileText, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface ExportRequest {
  id: string;
  exportName: string;
  filters: string;
  requestedBy: string;
  requestedOn: string;
  status: 'Processing' | 'Completed' | 'Failed';
  downloadUrl?: string;
}

export function DataExports() {
  const [exports, setExports] = useState<ExportRequest[]>([
    {
      id: '1',
      exportName: 'All Active Opportunities - Q1 2025',
      filters: 'BU: HSIO Connectors, Stage: Active, Date: Q1 2025',
      requestedBy: 'John Smith',
      requestedOn: '2025-11-24 14:30',
      status: 'Completed',
      downloadUrl: '#',
    },
    {
      id: '2',
      exportName: 'Won Opportunities - 2024',
      filters: 'Stage: Won, Year: 2024',
      requestedBy: 'Sarah Johnson',
      requestedOn: '2025-11-24 10:15',
      status: 'Completed',
      downloadUrl: '#',
    },
    {
      id: '3',
      exportName: 'All NBOs with Revenue Breakdown',
      filters: 'All NBOs, Include Revenue Data',
      requestedBy: 'Mike Chen',
      requestedOn: '2025-11-25 09:00',
      status: 'Processing',
    },
    {
      id: '4',
      exportName: 'Regional Analysis - APAC',
      filters: 'Region: Asia Pacific, All Data',
      requestedBy: 'Lisa Wang',
      requestedOn: '2025-11-23 16:45',
      status: 'Failed',
    },
    {
      id: '5',
      exportName: 'Customer Segmentation Report',
      filters: 'All Customers, Group by BU and Market',
      requestedBy: 'David Lee',
      requestedOn: '2025-11-25 08:30',
      status: 'Processing',
    },
  ]);

  const handleDownload = (exportItem: ExportRequest) => {
    if (exportItem.status === 'Completed') {
      toast.success(`Downloading ${exportItem.exportName}...`);
    } else {
      toast.error('Export is not ready for download');
    }
  };

  const handleRetry = (exportItem: ExportRequest) => {
    toast.success('Export request resubmitted');
    setExports(prev =>
      prev.map(item =>
        item.id === exportItem.id ? { ...item, status: 'Processing' as const } : item
      )
    );
  };

  const getStatusBadge = (status: ExportRequest['status']) => {
    const styles = {
      Processing: 'bg-blue-100 text-blue-700',
      Completed: 'bg-green-100 text-green-700',
      Failed: 'bg-red-100 text-red-700',
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Data Exports</h1>
        <p className="text-gray-600">View and download exported data files</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Background Processing</AlertTitle>
        <AlertDescription>
          Large data exports run in the background. You will receive an email notification once your export is ready for download.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Export Requests</CardTitle>
          <CardDescription>
            {exports.length} total export requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Export Name</TableHead>
                <TableHead>Filters Used</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Requested On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exports.map((exportItem) => (
                <TableRow key={exportItem.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span>{exportItem.exportName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                    {exportItem.filters}
                  </TableCell>
                  <TableCell>{exportItem.requestedBy}</TableCell>
                  <TableCell>{exportItem.requestedOn}</TableCell>
                  <TableCell>{getStatusBadge(exportItem.status)}</TableCell>
                  <TableCell className="text-right">
                    {exportItem.status === 'Completed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(exportItem)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    )}
                    {exportItem.status === 'Processing' && (
                      <span className="text-sm text-gray-500 flex items-center justify-end gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Processing...
                      </span>
                    )}
                    {exportItem.status === 'Failed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRetry(exportItem)}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
