import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNBO, NBO } from '../context/NBOContext';
import { nboApi } from '../services/api';
import { ArrowLeft, Edit, Archive, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { toast } from 'sonner';

const statusColors = {
  'New': 'bg-blue-100 text-blue-700',
  'Open': 'bg-green-100 text-green-700',
  'Won': 'bg-emerald-100 text-emerald-700',
  'Lost': 'bg-red-100 text-red-700',
  'On Hold': 'bg-yellow-100 text-yellow-700',
};

// Helper function to convert backend NBO to frontend format
const convertBackendToFrontendNBO = (backendNBO: any): NBO => {
  return {
    ...backendNBO,
    id: (backendNBO.nboId || backendNBO.id || '').toString(),
    // Map backend IDs to form fields (convert to string for form compatibility)
    bu: backendNBO.buId ? backendNBO.buId.toString() : backendNBO.bu || '',
    salesGroup: backendNBO.salesGroupId ? backendNBO.salesGroupId.toString() : backendNBO.salesGroup || '',
    orderingType: backendNBO.orderingType ? backendNBO.orderingType.toString() : backendNBO.orderingType || '',
    status: backendNBO.nboStatusId ? backendNBO.nboStatusId.toString() : backendNBO.status || 'New',
    risk: backendNBO.riskId ? backendNBO.riskId.toString() : backendNBO.risk || '',
    type: backendNBO.typeId ? backendNBO.typeId.toString() : backendNBO.type || '',
    market: backendNBO.marketName || (backendNBO.marketId ? backendNBO.marketId.toString() : backendNBO.market || ''),
    yearlyData: backendNBO.yearlyData ? (typeof backendNBO.yearlyData === 'string' ? JSON.parse(backendNBO.yearlyData) : backendNBO.yearlyData) : undefined,
    expectedDecisionDate: backendNBO.expectedDecisionDate || undefined,
    massProductionStart: backendNBO.massProductionStart || backendNBO.orderStartDate || undefined,
    createdDate: backendNBO.createdDate || new Date().toISOString().split('T')[0],
    updatedDate: backendNBO.updatedDate || backendNBO.lastUpdatedDate || new Date().toISOString().split('T')[0],
    isArchived: backendNBO.isArchived || false,
  };
};

export function NBODetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { archiveNBO, deleteNBO, pickList } = useNBO();
  const [nbo, setNbo] = useState<NBO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNBO = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await nboApi.getById(id);
        const convertedNBO = convertBackendToFrontendNBO(response.data);
        setNbo(convertedNBO);
      } catch (err) {
        console.error('Error fetching NBO:', err);
        setError('Failed to load NBO details');
        toast.error('Failed to load NBO details');
      } finally {
        setLoading(false);
      }
    };

    fetchNBO();
  }, [id]);

  // Helper function to get display value from pick list
  const getDisplayValue = (value: string | undefined, pickListKey: 'businessUnits' | 'markets' | 'orderingTypes' | 'risks' | 'salesGroups' | 'statuses' | 'types' | 'salesReps' | 'appsEngs' | 'assumedMarketShares'): string => {
    if (!value || !pickList) return value || '-';
    // Ensure value is a string for comparison
    const stringValue = String(value);
    const list = pickList[pickListKey] || [];
    const item = list.find((item: { key: string; value: string }) => String(item.key) === stringValue);
    return item ? item.value : value;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/nbos')} title="Return to NBO List">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1>Loading NBO...</h1>
        </div>
        <p className="text-gray-600">Please wait while we load the NBO details.</p>
      </div>
    );
  }

  if (error || !nbo) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/nbos')} title="Return to NBO List">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1>NBO Not Found</h1>
        </div>
        <p className="text-gray-600">{error || 'The requested NBO could not be found.'}</p>
      </div>
    );
  }

  const handleArchive = () => {
    archiveNBO(id!);
    toast.success('NBO archived successfully');
    navigate('/nbos');
  };

  const handleDelete = () => {
    deleteNBO(id!);
    toast.success('NBO deleted successfully');
    navigate('/nbos');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/nbos')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1>NBO #{nbo.id}</h1>
              <Badge variant="secondary" className={statusColors[getDisplayValue(nbo.status, 'statuses') as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'}>
                {getDisplayValue(nbo.status, 'statuses')}
              </Badge>
            </div>
            <p className="text-gray-600">{nbo.customerName} - {nbo.projectName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/nbos/${id}/edit`}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Archive NBO?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will move the NBO to the archive. You can restore it later if needed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleArchive}>Archive</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* NBO Summary */}
      <Card>
        <CardHeader>
          <CardTitle>NBO Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Project Name</Label>
              <p>{nbo.projectName || '-'}</p>
            </div>
            <div>
              <Label>Application</Label>
              <p>{nbo.application || '-'}</p>
            </div>
          </div>
          {nbo.description && (
            <div>
              <Label>Description</Label>
              <p className="text-gray-700">{nbo.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer & Region */}
      <Card>
        <CardHeader>
          <CardTitle>Customer & Region</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label>Customer Name</Label>
              <p>{nbo.customerName || '-'}</p>
            </div>
            <div>
              <Label>Region</Label>
              <p>{nbo.region || '-'}</p>
            </div>
            <div>
              <Label>Country</Label>
              <p>{nbo.country || '-'}</p>
            </div>
            {nbo.parentEndUser && (
              <div>
                <Label>Parent End User</Label>
                <p>{nbo.parentEndUser}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Business Unit & Product */}
      <Card>
        <CardHeader>
          <CardTitle>Business Unit & Product Line</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Business Unit</Label>
              <p>{getDisplayValue(nbo.bu, 'businessUnits')}</p>
            </div>
            <div>
              <Label>Product Line</Label>
              <p>{nbo.productLine || '-'}</p>
            </div>
            {nbo.product && (
              <div>
                <Label>Product</Label>
                <p>{nbo.product}</p>
              </div>
            )}
            {nbo.pnProductDescription && (
              <div>
                <Label>Product Description</Label>
                <p>{nbo.pnProductDescription}</p>
              </div>
            )}
            {nbo.market && (
              <div>
                <Label>Market</Label>
                <p>{getDisplayValue(nbo.market, 'markets')}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* HSIO Technical Fields */}
      {nbo.formFactor && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle>HSIO Connector Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <Label>Form Factor</Label>
                <p>{nbo.formFactor}</p>
              </div>
              <div>
                <Label>Data Rate</Label>
                <p>{nbo.dataRate}</p>
              </div>
              <div>
                <Label>Stacking</Label>
                <p>{nbo.stacking}</p>
              </div>
              <div>
                <Label>Product Manager</Label>
                <p>{nbo.productManager}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline & Financial */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline & Financial Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <Label>NBO Year</Label>
              <p>{nbo.nboYear}</p>
            </div>
            <div>
              <Label>Quarter</Label>
              <p>{nbo.quarter || '-'}</p>
            </div>
            <div>
              <Label>Win Probability</Label>
              <p>{nbo.winProbability}%</p>
            </div>
            <div>
              <Label>Total Expected Value</Label>
              <p className="text-lg">${(nbo.expectedValue || 0).toLocaleString()}</p>
            </div>
          </div>

          <Separator />

          {nbo.yearlyData && Object.keys(nbo.yearlyData).length > 0 && (
            <div className="space-y-4">
              <Label>Revenue Breakdown by Year & Quarter</Label>
              
              {Object.entries(nbo.yearlyData)
                .sort(([yearA], [yearB]) => Number(yearA) - Number(yearB))
                .map(([year, data]) => (
                  <div key={year} className="border rounded-lg p-4 space-y-3">
                    <h4 className="text-sm">Year {year}</h4>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs">Q1</Label>
                        <p>${(data.q1 || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <Label className="text-xs">Q2</Label>
                        <p>${(data.q2 || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <Label className="text-xs">Q3</Label>
                        <p>${(data.q3 || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <Label className="text-xs">Q4</Label>
                        <p>${(data.q4 || 0).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <Label className="text-xs">Total</Label>
                      <p className="font-medium">${(data.total || 0).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sales & Team Information */}
      <Card>
        <CardHeader>
          <CardTitle>Sales & Team Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nbo.salesRep && (
              <div>
                <Label>Sales Rep</Label>
                <p>{getDisplayValue(nbo.salesRep, 'salesReps')}</p>
              </div>
            )}
            {nbo.appEng && (
              <div>
                <Label>Application Engineer</Label>
                <p>{getDisplayValue(nbo.appEng, 'appsEngs')}</p>
              </div>
            )}
            {nbo.salesGroup && (
              <div>
                <Label>Sales Group</Label>
                <p>{getDisplayValue(nbo.salesGroup, 'salesGroups')}</p>
              </div>
            )}
            <div>
              <Label>Owner</Label>
              <p>{nbo.owner || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ordering Information */}
      {(nbo.orderingType || nbo.orderingCEMCM || nbo.orderingOEM || nbo.orderingLocation) && (
        <Card>
          <CardHeader>
            <CardTitle>Ordering Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {nbo.orderingType && (
                <div>
                  <Label>Ordering Type</Label>
                  <p>{getDisplayValue(nbo.orderingType, 'orderingTypes')}</p>
                </div>
              )}
              {nbo.orderingCEMCM && (
                <div>
                  <Label>Ordering CEM/CM</Label>
                  <p>{nbo.orderingCEMCM}</p>
                </div>
              )}
              {nbo.orderingOEM && (
                <div>
                  <Label>Ordering OEM</Label>
                  <p>{nbo.orderingOEM}</p>
                </div>
              )}
              {nbo.orderingLocation && (
                <div>
                  <Label>Ordering Location</Label>
                  <p>{nbo.orderingLocation}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Program & Timeline */}
      {(nbo.program || nbo.expectedDecisionDate || nbo.massProductionStart) && (
        <Card>
          <CardHeader>
            <CardTitle>Program & Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {nbo.program && (
                <div>
                  <Label>Program</Label>
                  <p>{nbo.program}</p>
                </div>
              )}
              {nbo.expectedDecisionDate && (
                <div>
                  <Label>Expected Decision Date</Label>
                  <p>{new Date(nbo.expectedDecisionDate).toLocaleDateString()}</p>
                </div>
              )}
              {nbo.massProductionStart && (
                <div>
                  <Label>Mass Production Start</Label>
                  <p>{new Date(nbo.massProductionStart).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status & Risk Information */}
      <Card>
        <CardHeader>
          <CardTitle>Status & Risk Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nbo.risk && (
              <div>
                <Label>Risk</Label>
                <p>{getDisplayValue(nbo.risk, 'risks')}</p>
              </div>
            )}
            {nbo.type && (
              <div>
                <Label>Type</Label>
                <p>{getDisplayValue(nbo.type, 'types')}</p>
              </div>
            )}
            {nbo.competition && (
              <div>
                <Label>Competition</Label>
                <p>{nbo.competition}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Financial Details */}
      {(nbo.tsyAt100MS || nbo.tbvAt100MS || nbo.assumedMarketShare) && (
        <Card>
          <CardHeader>
            <CardTitle>Financial Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {nbo.tsyAt100MS !== undefined && (
                <div>
                  <Label>TSY at 100% Market Share</Label>
                  <p className="text-lg">${(nbo.tsyAt100MS || 0).toLocaleString()}</p>
                </div>
              )}
              {nbo.tbvAt100MS !== undefined && (
                <div>
                  <Label>TBV at 100% Market Share</Label>
                  <p className="text-lg">${(nbo.tbvAt100MS || 0).toLocaleString()}</p>
                </div>
              )}
              {nbo.assumedMarketShare !== undefined && (
                <div>
                  <Label>Assumed Market Share</Label>
                  <p className="text-lg">{getDisplayValue(nbo.assumedMarketShare?.toString(), 'assumedMarketShares')}%</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assumptions & Comments */}
      {(nbo.tsyAssumptions || nbo.comments) && (
        <Card>
          <CardHeader>
            <CardTitle>Assumptions & Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {nbo.tsyAssumptions && (
              <div>
                <Label>TSY Assumptions</Label>
                <p className="text-gray-700 whitespace-pre-wrap">{nbo.tsyAssumptions}</p>
              </div>
            )}
            {nbo.comments && (
              <div>
                <Label>Comments</Label>
                <p className="text-gray-700 whitespace-pre-wrap">{nbo.comments}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Ownership & Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Ownership & Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label>Owner</Label>
              <p>{nbo.owner || '-'}</p>
            </div>
            <div>
              <Label>Created Date</Label>
              <p>{nbo.createdDate ? new Date(nbo.createdDate).toLocaleDateString() : '-'}</p>
            </div>
            <div>
              <Label>Last Updated</Label>
              <p>{nbo.updatedDate ? new Date(nbo.updatedDate).toLocaleDateString() : '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p>Delete this NBO permanently</p>
              <p className="text-sm text-gray-600">This action cannot be undone.</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete NBO
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete NBO Permanently?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the NBO record.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-sm text-gray-500 mb-1 ${className}`}>{children}</div>;
}