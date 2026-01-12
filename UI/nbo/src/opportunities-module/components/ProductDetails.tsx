import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Edit, Trash2, Package } from 'lucide-react';
import { Label } from './ui/label';
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
} from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';

interface Product {
  id: string;
  formFactor: string;
  dataRate: string;
  stacking: string;
  name: string;
  productManager: string;
  status: string;
}

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    // In a real app, fetch product by ID from an API or context
    // For now, using mock data
    const mockProducts: Product[] = [
      {
        id: '1',
        formFactor: 'QSFP',
        dataRate: '14G',
        stacking: '1x1',
        name: 'QSFP14 Standard Connector',
        productManager: 'Shih, Eason',
        status: 'Active',
      },
      {
        id: '2',
        formFactor: 'QSFP',
        dataRate: '14G',
        stacking: '1x1',
        name: 'QSFP14 Enhanced Connector',
        productManager: 'Hao, Lily',
        status: 'Active',
      },
      {
        id: '3',
        formFactor: 'QSFP',
        dataRate: '14G',
        stacking: '1x1',
        name: 'QSFP14 Low Profile',
        productManager: 'Chen, Wei',
        status: 'Active',
      },
      {
        id: '4',
        formFactor: 'QSFP',
        dataRate: '14G',
        stacking: '2x1',
        name: 'QSFP14 Dual Stack Connector',
        productManager: 'Wang, Michael',
        status: 'Active',
      },
      {
        id: '5',
        formFactor: 'QSFP',
        dataRate: '14G',
        stacking: '2x1',
        name: 'QSFP14 Dual Stack High Density',
        productManager: 'Hao, Lily',
        status: 'Active',
      },
      {
        id: '6',
        formFactor: 'QSFP',
        dataRate: '14G',
        stacking: '2x1',
        name: 'QSFP14 Dual Stack Enhanced',
        productManager: 'Shih, Eason',
        status: 'Inactive',
      },
      {
        id: '7',
        formFactor: 'QSFP',
        dataRate: '28G',
        stacking: '1x1',
        name: 'QSFP28 Standard',
        productManager: 'Chen, Wei',
        status: 'Active',
      },
      {
        id: '8',
        formFactor: 'QSFP',
        dataRate: '28G',
        stacking: '1x1',
        name: 'QSFP28 Enhanced Thermal',
        productManager: 'Wang, Michael',
        status: 'Active',
      },
      {
        id: '9',
        formFactor: 'QSFP',
        dataRate: '28G',
        stacking: '1x1',
        name: 'QSFP28 High Performance',
        productManager: 'Hao, Lily',
        status: 'Active',
      },
      {
        id: '10',
        formFactor: 'QSFP',
        dataRate: '28G',
        stacking: '1x1',
        name: 'QSFP28 Compact',
        productManager: 'Shih, Eason',
        status: 'Active',
      },
      {
        id: '11',
        formFactor: 'QSFP',
        dataRate: '28G',
        stacking: '2x1',
        name: 'QSFP28 Dual Stack',
        productManager: 'Chen, Wei',
        status: 'Active',
      },
      {
        id: '12',
        formFactor: 'QSFP',
        dataRate: '28G',
        stacking: '2x1',
        name: 'QSFP28 Dual Stack Standard',
        productManager: 'Shih, Eason',
        status: 'Active',
      },
      {
        id: '13',
        formFactor: 'QSFP',
        dataRate: '28G',
        stacking: '2x1',
        name: 'QSFP28 Dual Stack Enhanced',
        productManager: 'Wang, Michael',
        status: 'Active',
      },
      {
        id: '14',
        formFactor: 'QSFP',
        dataRate: '56G',
        stacking: '1x1',
        name: 'QSFP56 Standard Connector',
        productManager: 'Hao, Lily',
        status: 'Active',
      },
      {
        id: '15',
        formFactor: 'QSFP',
        dataRate: '56G',
        stacking: '1x1',
        name: 'QSFP56 Enhanced Connector',
        productManager: 'Chen, Wei',
        status: 'Active',
      },
      {
        id: '16',
        formFactor: 'QSFP',
        dataRate: '56G',
        stacking: '2x1',
        name: 'QSFP56 Dual Connector',
        productManager: 'Hao, Lily',
        status: 'Active',
      },
      {
        id: '17',
        formFactor: 'QSFP',
        dataRate: '56G',
        stacking: '2x1',
        name: 'QSFP56 Dual Stack High Performance',
        productManager: 'Shih, Eason',
        status: 'Active',
      },
      {
        id: '18',
        formFactor: 'QSFP',
        dataRate: '56G',
        stacking: '2x1',
        name: 'QSFP56 Dual Stack Compact',
        productManager: 'Wang, Michael',
        status: 'Inactive',
      },
      {
        id: '19',
        formFactor: 'QSFP-DD',
        dataRate: '112G',
        stacking: '1x1',
        name: 'QSFP-DD Standard',
        productManager: 'Shih, Eason',
        status: 'Active',
      },
      {
        id: '20',
        formFactor: 'QSFP-DD',
        dataRate: '112G',
        stacking: '1x1',
        name: 'QSFP-DD High Speed Connector',
        productManager: 'Hao, Lily',
        status: 'Active',
      },
      {
        id: '21',
        formFactor: 'QSFP-DD',
        dataRate: '112G',
        stacking: '1x1',
        name: 'QSFP-DD Enhanced Thermal Management',
        productManager: 'Chen, Wei',
        status: 'Active',
      },
      {
        id: '22',
        formFactor: 'QSFP-DD',
        dataRate: '112G',
        stacking: '2x1',
        name: 'QSFP-DD Dual Stack',
        productManager: 'Wang, Michael',
        status: 'Active',
      },
      {
        id: '23',
        formFactor: 'QSFP-DD',
        dataRate: '112G',
        stacking: '2x1',
        name: 'QSFP-DD Dual Stack Enhanced',
        productManager: 'Hao, Lily',
        status: 'Active',
      },
      {
        id: '24',
        formFactor: 'OSFP',
        dataRate: '224G',
        stacking: '1x1',
        name: 'OSFP Standard',
        productManager: 'Shih, Eason',
        status: 'Active',
      },
      {
        id: '25',
        formFactor: 'OSFP',
        dataRate: '224G',
        stacking: '1x1',
        name: 'OSFP Enhanced Connector',
        productManager: 'Chen, Wei',
        status: 'Active',
      },
      {
        id: '26',
        formFactor: 'OSFP',
        dataRate: '224G',
        stacking: '1x1',
        name: 'OSFP 800G Optimized',
        productManager: 'Wang, Michael',
        status: 'Active',
      },
      {
        id: '27',
        formFactor: 'OSFP',
        dataRate: '224G',
        stacking: '1x1',
        name: 'OSFP 1.6T Standard Connector',
        productManager: 'Shih, Eason',
        status: 'Active',
      },
      {
        id: '28',
        formFactor: 'OSFP',
        dataRate: '224G',
        stacking: '1x1',
        name: 'OSFP 1.6T Enhanced Connector',
        productManager: 'Chen, Wei',
        status: 'Active',
      },
      {
        id: '29',
        formFactor: 'SFP-DD',
        dataRate: '56G',
        stacking: '1x1',
        name: 'SFP-DD Standard Connector',
        productManager: 'Hao, Lily',
        status: 'Active',
      },
      {
        id: '30',
        formFactor: 'SFP-DD',
        dataRate: '56G',
        stacking: '1x1',
        name: 'SFP-DD Enhanced Connector',
        productManager: 'Wang, Michael',
        status: 'Active',
      },
    ];

    const foundProduct = mockProducts.find(p => p.id === id);
    setProduct(foundProduct || null);
  }, [id]);

  const handleEdit = () => {
    toast.info('Edit functionality to be implemented');
  };

  const handleDelete = () => {
    toast.success('Product deleted successfully');
    navigate('/products');
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">Product not found</p>
              <Button onClick={() => navigate('/products')} className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
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
            <Button variant="outline" size="icon" onClick={() => navigate('/products')} title="Return to Products">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl">Product Details</h1>
              <p className="text-sm text-gray-600 mt-1">
                View complete product information
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="w-4 h-4 mr-2 text-red-600" />
              Delete
            </Button>
          </div>
        </div>

        {/* Product Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>{product.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Product ID: {product.id}</p>
                </div>
              </div>
              <Badge variant={product.status === 'Active' ? 'default' : 'secondary'}>
                {product.status}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Product Details */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-600">Form Factor</Label>
                <p className="mt-1">{product.formFactor}</p>
              </div>
              <div>
                <Label className="text-gray-600">Data Rate</Label>
                <p className="mt-1">{product.dataRate}</p>
              </div>
              <div>
                <Label className="text-gray-600">Stacking</Label>
                <p className="mt-1">{product.stacking}</p>
              </div>
              <div>
                <Label className="text-gray-600">Product Manager</Label>
                <p className="mt-1">{product.productManager}</p>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-gray-600">Product Name</Label>
              <p className="mt-1">{product.name}</p>
            </div>

            <Separator />

            <div>
              <Label className="text-gray-600">Status</Label>
              <div className="mt-2">
                <Badge variant={product.status === 'Active' ? 'default' : 'secondary'}>
                  {product.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm">
                  This product is configured with {product.formFactor} form factor at {product.dataRate} data rate
                  with {product.stacking} stacking configuration. It is managed by {product.productManager} and
                  is currently {product.status.toLowerCase()}.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Form Factor</p>
                  <p className="mt-1">{product.formFactor}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Data Rate</p>
                  <p className="mt-1">{product.dataRate}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Stacking</p>
                  <p className="mt-1">{product.stacking}</p>
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
                <h3 className="font-medium">Need to make changes?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Edit this product or manage its status
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Product
                </Button>
                <Button variant="outline" onClick={() => navigate('/products')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Product Catalog
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{product.name}"? This action cannot be undone.
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
  );
}