import { useParams, useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { ArrowLeft } from 'lucide-react';

interface DesignWin {
  id: string;
  customer: string;
  product: string;
  winDate: string;
  value: number;
  region: string;
  bu: string;
  status: 'Active' | 'Archived';
  owner: string;
  description: string;
  projectedVolume: number;
  competitorDisplaced?: string;
}

export function DesignWinDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, this would fetch from API/context
  const designWins: DesignWin[] = [
    {
      id: '1',
      customer: 'ACME Corporation',
      product: 'QSFP28 Standard Connector',
      winDate: '2025-01-15',
      value: 1500000,
      region: 'North America',
      bu: 'HSIO Connectors',
      status: 'Active',
      owner: 'John Smith',
      description: 'Major data center deployment win',
      projectedVolume: 50000,
      competitorDisplaced: 'Competitor A',
    },
    {
      id: '2',
      customer: 'TechCo Industries',
      product: 'QSFP-DD High Speed Connector',
      winDate: '2025-02-10',
      value: 2200000,
      region: 'Europe',
      bu: 'HSIO Connectors',
      status: 'Active',
      owner: 'Sarah Johnson',
      description: 'Next-gen network infrastructure',
      projectedVolume: 75000,
      competitorDisplaced: 'Competitor B',
    },
    {
      id: '3',
      customer: 'GlobalTel Communications',
      product: 'OSFP 800G Connector',
      winDate: '2024-11-20',
      value: 3100000,
      region: 'Asia Pacific',
      bu: 'HSIO Connectors',
      status: 'Active',
      owner: 'Mike Chen',
      description: '5G infrastructure rollout',
      projectedVolume: 100000,
      competitorDisplaced: 'Competitor C',
    },
    {
      id: '4',
      customer: 'DataNet Solutions',
      product: 'SFP+ 10G Flash Mount Connector',
      winDate: '2024-10-05',
      value: 650000,
      region: 'North America',
      bu: 'HSIO Connectors',
      status: 'Archived',
      owner: 'Lisa Wang',
      description: 'Enterprise network upgrade',
      projectedVolume: 30000,
    },
    {
      id: '5',
      customer: 'CloudNet Systems',
      product: 'QSFP28 Enhanced Thermal Connector',
      winDate: '2025-03-01',
      value: 1800000,
      region: 'China',
      bu: 'HSIO Connectors',
      status: 'Active',
      owner: 'David Lee',
      description: 'Hyperscale data center deployment',
      projectedVolume: 60000,
      competitorDisplaced: 'Competitor A',
    },
  ];

  const win = designWins.find(w => w.id === id);

  if (!win) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p>Design win not found</p>
            <Button onClick={() => navigate('/design-wins')} className="mt-4">
              Back to Design Wins
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/design-wins')} title="Return to Design Wins List">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1>Design Win Details</h1>
          <p className="text-gray-600">Complete information about this design win</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{win.customer}</CardTitle>
              <p className="text-gray-600 mt-1">{win.product}</p>
            </div>
            <Badge variant={win.status === 'Active' ? 'default' : 'secondary'}>
              {win.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>Win Date</Label>
              <p className="text-lg mt-1">{win.winDate}</p>
            </div>
            <div>
              <Label>Region</Label>
              <p className="text-lg mt-1">{win.region}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>Business Unit</Label>
              <div className="mt-1">
                <Badge variant="outline">{win.bu}</Badge>
              </div>
            </div>
            <div>
              <Label>Owner</Label>
              <p className="text-lg mt-1">{win.owner}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>Win Value</Label>
              <p className="text-2xl mt-1">${win.value.toLocaleString()}</p>
            </div>
            <div>
              <Label>Projected Volume</Label>
              <p className="text-2xl mt-1">{win.projectedVolume.toLocaleString()} units</p>
            </div>
          </div>

          <Separator />

          {win.competitorDisplaced && (
            <>
              <div>
                <Label>Competitor Displaced</Label>
                <p className="text-lg mt-1">{win.competitorDisplaced}</p>
              </div>
              <Separator />
            </>
          )}

          <div>
            <Label>Description</Label>
            <p className="text-gray-700 mt-2 leading-relaxed">{win.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}