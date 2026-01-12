import { Button } from './ui/button';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Badge } from './ui/badge';

interface Product {
  id: string;
  formFactor: string;
  dataRate: string;
  stacking: string;
  name: string;
  productManager: string;
  status: 'Active' | 'Inactive';
}

interface ProductDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit?: (product: Product) => void;
}

export function ProductDetailsDialog({ isOpen, onClose, product, onEdit }: ProductDetailsDialogProps) {
  if (!product) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(product);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription className="sr-only">
            View detailed information about the selected product
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header Section */}
          <div className="flex items-start justify-between pb-4 border-b">
            <div>
              <h3 className="text-lg font-medium">{product.name}</h3>
              <p className="text-sm text-gray-600 mt-1">Product ID: {product.id}</p>
            </div>
            <Badge 
              className={
                product.status === 'Active'
                  ? 'bg-green-100 text-green-700 hover:bg-green-100'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
              }
            >
              {product.status}
            </Badge>
          </div>

          {/* Product Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-600">Form Factor</Label>
              <div className="text-sm font-medium">{product.formFactor}</div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-600">Data Rate</Label>
              <div className="text-sm font-medium">{product.dataRate}</div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-600">CN. Cage, Stacked</Label>
              <div className="text-sm font-medium">{product.stacking}</div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-600">Product Manager</Label>
              <div className="text-sm font-medium">{product.productManager}</div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Additional Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <Label className="text-gray-600">Created Date</Label>
                <div>Nov 24, 2025</div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600">Last Modified</Label>
                <div>Nov 24, 2025</div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600">Category</Label>
                <div>High-Speed I/O Connectors</div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600">Associated NBOs</Label>
                <div className="text-blue-600">3 NBOs</div>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Technical Specifications</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Form Factor Type:</span>
                <span className="font-medium">{product.formFactor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Maximum Data Rate:</span>
                <span className="font-medium">{product.dataRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Configuration:</span>
                <span className="font-medium">{product.stacking}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Connector Type:</span>
                <span className="font-medium">HSIO Standard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleEdit}>
            Edit Product
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}