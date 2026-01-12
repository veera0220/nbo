import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { useNBO } from '../context/NBOContext';
import { toast } from 'sonner@2.0.3';

interface Product {
  id: string;
  formFactor: string;
  dataRate: string;
  stacking: string;
  name: string;
  productManager: string;
  status: 'Active' | 'Inactive';
}

interface EditProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onUpdate: (id: string, productData: Omit<Product, 'id'>) => void;
}

export function EditProductDialog({ isOpen, onClose, product, onUpdate }: EditProductDialogProps) {
  const { formFactors, dataRates, stackings } = useNBO();
  
  const [formData, setFormData] = useState({
    formFactor: '',
    dataRate: '',
    stacking: '',
    name: '',
    productManager: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  // Load product data when dialog opens
  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        formFactor: product.formFactor,
        dataRate: product.dataRate,
        stacking: product.stacking,
        name: product.name,
        productManager: product.productManager,
        status: product.status,
      });
    }
  }, [isOpen, product]);

  // Get available data rates based on selected form factor
  const availableDataRates = formData.formFactor
    ? dataRates.filter(dr => {
        const ff = formFactors.find(f => f.name === formData.formFactor);
        return ff && dr.formFactorId === ff.id;
      })
    : [];

  // Get available stackings based on selected form factor and data rate
  const availableStackings = formData.formFactor && formData.dataRate
    ? stackings.filter(st => {
        const ff = formFactors.find(f => f.name === formData.formFactor);
        const dr = dataRates.find(d => d.name === formData.dataRate && d.formFactorId === ff?.id);
        return ff && dr && st.formFactorId === ff.id && st.dataRateId === dr.id;
      })
    : [];

  // Auto-fill Product Manager when Form Factor is selected
  useEffect(() => {
    if (formData.formFactor) {
      const ff = formFactors.find(f => f.name === formData.formFactor);
      if (ff) {
        setFormData(prev => ({ ...prev, productManager: ff.productManager }));
      }
    }
  }, [formData.formFactor, formFactors]);

  const handleSave = () => {
    if (!formData.formFactor || !formData.dataRate || !formData.stacking || !formData.name || !formData.productManager) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!product) return;

    onUpdate(product.id, formData);
    toast.success('Product updated successfully');
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription className="sr-only">
            Edit product details including form factor, data rate, and stacking configuration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Form Factor */}
          <div className="space-y-4">
            <Label htmlFor="formFactor">Form Factor</Label>
            <Select
              value={formData.formFactor}
              onValueChange={(value) => setFormData({
                ...formData,
                formFactor: value,
                dataRate: '',
                stacking: '',
              })}
            >
              <SelectTrigger id="formFactor">
                <SelectValue placeholder="Select form factor" />
              </SelectTrigger>
              <SelectContent>
                {formFactors.map(ff => (
                  <SelectItem key={ff.id} value={ff.name}>{ff.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data Rate */}
          <div className="space-y-4">
            <Label htmlFor="dataRate">Data Rate</Label>
            <Select
              value={formData.dataRate}
              onValueChange={(value) => setFormData({
                ...formData,
                dataRate: value,
                stacking: '',
              })}
              disabled={!formData.formFactor}
            >
              <SelectTrigger id="dataRate">
                <SelectValue placeholder={formData.formFactor ? "Select data rate" : "Select form factor first"} />
              </SelectTrigger>
              <SelectContent>
                {availableDataRates.map(dr => (
                  <SelectItem key={dr.id} value={dr.name}>{dr.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* CN. Cage, Stacked */}
          <div className="space-y-4">
            <Label htmlFor="stacking">CN. Cage, Stacked</Label>
            <Select
              value={formData.stacking}
              onValueChange={(value) => setFormData({ ...formData, stacking: value })}
              disabled={!formData.dataRate}
            >
              <SelectTrigger id="stacking">
                <SelectValue placeholder={formData.dataRate ? "Select stacking" : "Select data rate first"} />
              </SelectTrigger>
              <SelectContent>
                {availableStackings.map(st => (
                  <SelectItem key={st.id} value={st.name}>{st.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Name */}
          <div className="space-y-4">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
            />
          </div>

          {/* Product Manager */}
          <div className="space-y-4">
            <Label htmlFor="productManager">Product Manager</Label>
            <Select
              value={formData.productManager}
              onValueChange={(value) => setFormData({ ...formData, productManager: value })}
            >
              <SelectTrigger id="productManager">
                <SelectValue placeholder="Select product manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Shih, Eason">Shih, Eason</SelectItem>
                <SelectItem value="Hao, Lily">Hao, Lily</SelectItem>
                <SelectItem value="Chen, Wei">Chen, Wei</SelectItem>
                <SelectItem value="Wang, Michael">Wang, Michael</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'Active' | 'Inactive') => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
