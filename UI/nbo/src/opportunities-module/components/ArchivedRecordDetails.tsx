import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, RotateCcw, Archive as ArchiveIcon, Calendar, User, DollarSign } from 'lucide-react';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';

interface ArchivedRecord {
  id: string;
  type: 'NBO' | 'Opportunity' | 'Design Win' | 'Marketshare';
  name: string;
  customer: string;
  bu: string;
  value: number;
  archivedDate: string;
  archivedBy: string;
  originalDate: string;
  status: string;
}

export function ArchivedRecordDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<ArchivedRecord | null>(null);

  useEffect(() => {
    // Mock data - in a real app, fetch from API or context
    const mockRecords: ArchivedRecord[] = [
      {
        id: '1',
        type: 'NBO',
        name: 'Data Center Server Project',
        customer: 'TechCorp Industries',
        bu: 'HSIO Connectors',
        value: 850000,
        archivedDate: '2024-11-15',
        archivedBy: 'John Smith',
        originalDate: '2024-08-20',
        status: 'Archived',
      },
      {
        id: '2',
        type: 'Opportunity',
        name: 'Network Switch Upgrade',
        customer: 'GlobalNet Solutions',
        bu: 'HSIO Connectors',
        value: 1200000,
        archivedDate: '2024-11-10',
        archivedBy: 'Sarah Johnson',
        originalDate: '2024-07-15',
        status: 'Archived',
      },
      {
        id: '3',
        type: 'Design Win',
        name: '5G Infrastructure Build',
        customer: 'Telecom Innovations',
        bu: 'HSIO Connectors',
        value: 2500000,
        archivedDate: '2024-11-05',
        archivedBy: 'Mike Chen',
        originalDate: '2024-06-10',
        status: 'Archived',
      },
      {
        id: '4',
        type: 'Marketshare',
        name: 'Enterprise Router Win',
        customer: 'NetGear Systems',
        bu: 'HSIO Connectors',
        value: 950000,
        archivedDate: '2024-10-28',
        archivedBy: 'Lisa Wong',
        originalDate: '2024-05-22',
        status: 'Archived',
      },
      {
        id: '5',
        type: 'NBO',
        name: 'AI Training Server Platform',
        customer: 'CloudCompute Inc',
        bu: 'HSIO Connectors',
        value: 1800000,
        archivedDate: '2024-10-20',
        archivedBy: 'David Lee',
        originalDate: '2024-04-18',
        status: 'Archived',
      },
    ];

    const foundRecord = mockRecords.find(r => r.id === id);
    setRecord(foundRecord || null);
  }, [id]);

  const handleRestore = () => {
    toast.success('Record restored successfully');
    navigate('/manage-archive');
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      'NBO': 'bg-blue-100 text-blue-700',
      'Opportunity': 'bg-purple-100 text-purple-700',
      'Design Win': 'bg-green-100 text-green-700',
      'Marketshare': 'bg-orange-100 text-orange-700',
    };
    return (
      <Badge className={colors[type] || 'bg-gray-100 text-gray-700'}>
        {type}
      </Badge>
    );
  };

  if (!record) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">Archived record not found</p>
              <Button onClick={() => navigate('/manage-archive')} className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Archive
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate('/manage-archive')} title="Return to Archive Management">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl">Archived Record Details</h1>
              <p className="text-sm text-gray-600 mt-1">
                View complete archived record information
              </p>
            </div>
          </div>
          <Button onClick={handleRestore}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Restore Record
          </Button>
        </div>

        {/* Record Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <ArchiveIcon className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <CardTitle>{record.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Record ID: {record.id}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {getTypeBadge(record.type)}
                <Badge variant="outline">{record.status}</Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-600">Record Type</Label>
                <div className="mt-2">
                  {getTypeBadge(record.type)}
                </div>
              </div>
              <div>
                <Label className="text-gray-600">Status</Label>
                <div className="mt-2">
                  <Badge variant="outline">{record.status}</Badge>
                </div>
              </div>
              <div>
                <Label className="text-gray-600">Customer</Label>
                <p className="mt-1">{record.customer}</p>
              </div>
              <div>
                <Label className="text-gray-600">Business Unit</Label>
                <p className="mt-1">{record.bu}</p>
              </div>
              <div>
                <Label className="text-gray-600">Value</Label>
                <p className="mt-1 flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  {record.value.toLocaleString()}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Original Date</Label>
                <p className="mt-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {record.originalDate}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Archive Information */}
        <Card>
          <CardHeader>
            <CardTitle>Archive Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-600">Archived Date</Label>
                <p className="mt-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {record.archivedDate}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Archived By</Label>
                <p className="mt-1 flex items-center gap-1">
                  <User className="w-4 h-4 text-gray-500" />
                  {record.archivedBy}
                </p>
              </div>
            </div>

            <Separator />

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex gap-2">
                <ArchiveIcon className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm">
                    This {record.type.toLowerCase()} was archived on {record.archivedDate} by {record.archivedBy}.
                    You can restore this record to make it active again in the system.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Record Details */}
        <Card>
          <CardHeader>
            <CardTitle>Record Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-600">Record Name</Label>
                <p className="mt-1">{record.name}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="mt-1">{record.type}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="mt-1 truncate">{record.customer}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Value</p>
                  <p className="mt-1">${(record.value / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Need to restore this record?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Restore this archived record to make it active in the system
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleRestore}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restore Record
                </Button>
                <Button variant="outline" onClick={() => navigate('/manage-archive')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Archive
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}