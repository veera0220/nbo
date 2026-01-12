import { useParams, useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Edit } from 'lucide-react';
import { Label } from './ui/label';
import { Separator } from './ui/separator';

interface MarketshareRecord {
  id: string;
  customer: string;
  competitor: string;
  product: string;
  region: string;
  marketValue: number;
  gainedShare: number;
  gainDate: string;
  status: 'Active' | 'Archived';
  owner: string;
  comments: string;
}

// Mock data - in a real app, this would come from context or API
const mockRecords: MarketshareRecord[] = [
  {
    id: '1',
    customer: 'ACME Corporation',
    competitor: 'Competitor A',
    product: 'QSFP28 Standard Connector',
    region: 'North America',
    marketValue: 1200000,
    gainedShare: 15,
    gainDate: '2025-01-15',
    status: 'Active',
    owner: 'John Smith',
    comments: 'Won major data center contract',
  },
  {
    id: '2',
    customer: 'TechCo Industries',
    competitor: 'Competitor B',
    product: 'QSFP-DD High Speed Connector',
    region: 'Europe',
    marketValue: 850000,
    gainedShare: 12,
    gainDate: '2025-02-20',
    status: 'Active',
    owner: 'Sarah Johnson',
    comments: 'Displaced competitor in network upgrade',
  },
  {
    id: '3',
    customer: 'GlobalTel Communications',
    competitor: 'Competitor C',
    product: 'OSFP 800G Connector',
    region: 'Asia Pacific',
    marketValue: 2100000,
    gainedShare: 20,
    gainDate: '2024-12-10',
    status: 'Archived',
    owner: 'Mike Chen',
    comments: '5G infrastructure win',
  },
  {
    id: '4',
    customer: 'DataNet Solutions',
    competitor: 'Competitor A',
    product: 'SFP+ 10G Flash Mount Connector',
    region: 'North America',
    marketValue: 450000,
    gainedShare: 8,
    gainDate: '2025-03-05',
    status: 'Active',
    owner: 'Lisa Wang',
    comments: 'Strategic partnership established',
  },
];

export function MarketshareGainDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const record = mockRecords.find(r => r.id === id);

  if (!record) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate('/marketshare')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketshare Gains
          </Button>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Marketshare gain record not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/marketshare')} title="Return to Marketshare Gains List">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1>Marketshare Gain Details</h1>
            <p className="text-gray-600">Detailed information about this competitive win</p>
          </div>
        </div>
        <Badge 
          className={
            record.status === 'Active'
              ? 'bg-green-100 text-green-700 hover:bg-green-100'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
          }
        >
          {record.status}
        </Badge>
      </div>

      {/* Main Details Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Record ID: {record.id}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="font-medium mb-4 pb-2 border-b">Customer Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-600">Customer Name</Label>
                <p className="text-lg font-medium">{record.customer}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600">Region</Label>
                <p className="text-lg font-medium">{record.region}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Competitive Information */}
          <div>
            <h3 className="font-medium mb-4 pb-2 border-b">Competitive Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-600">Competitor Displaced</Label>
                <p className="text-lg font-medium">{record.competitor}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600">Product</Label>
                <p className="text-lg font-medium">{record.product}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Financial & Impact */}
          <div>
            <h3 className="font-medium mb-4 pb-2 border-b">Financial Impact</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-600">Market Value</Label>
                <p className="text-2xl font-semibold text-blue-600">
                  ${record.marketValue.toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600">Share Gained</Label>
                <Badge className="bg-green-100 text-green-700 text-lg px-3 py-1 mt-2">
                  +{record.gainedShare}%
                </Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600">Gain Date</Label>
                <p className="text-lg font-medium">{record.gainDate}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Ownership & Management */}
          <div>
            <h3 className="font-medium mb-4 pb-2 border-b">Ownership & Management</h3>
            <div className="space-y-2">
              <Label className="text-gray-600">Record Owner</Label>
              <p className="text-lg font-medium">{record.owner}</p>
            </div>
          </div>

          <Separator />

          {/* Comments & Notes */}
          <div>
            <h3 className="font-medium mb-4 pb-2 border-b">Comments & Notes</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{record.comments}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <Label className="text-gray-600">Created Date</Label>
              <p>Nov 24, 2025</p>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600">Last Modified</Label>
              <p>Nov 25, 2025</p>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600">Created By</Label>
              <p>System Administrator</p>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600">Modified By</Label>
              <p>{record.owner}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}