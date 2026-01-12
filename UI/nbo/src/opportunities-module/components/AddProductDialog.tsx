import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
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

interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: {
    formFactor: string;
    dataRate: string;
    stacking: string;
    name: string;
    productManager: string;
  }) => void;
  existingProducts?: Array<{
    id: string;
    formFactor: string;
    dataRate: string;
    stacking: string;
    name: string;
    productManager: string;
    status: 'Active' | 'Inactive';
  }>;
}

export function AddProductDialog({ isOpen, onClose, onAdd, existingProducts = [] }: AddProductDialogProps) {
  const { formFactors, dataRates, stackings } = useNBO();
  
  const [formData, setFormData] = useState({
    formFactor: '',
    dataRate: '',
    stacking: '',
    name: '',
    productManager: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const [showIssue, setShowIssue] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof existingProducts>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        formFactor: '',
        dataRate: '',
        stacking: '',
        name: '',
        productManager: '',
        status: 'Active' as 'Active' | 'Inactive',
      });
      setShowIssue(false);
      setSearchResults([]);
      setHasSearched(false);
    }
  }, [isOpen]);

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

  const handleFindProduct = () => {
    // Check if product mapping exists for the selected combination
    if (formData.formFactor && formData.dataRate && formData.stacking) {
      // Search for matching products
      const matches = existingProducts.filter(
        product =>
          product.formFactor === formData.formFactor &&
          product.dataRate === formData.dataRate &&
          product.stacking === formData.stacking
      );
      
      setSearchResults(matches);
      setHasSearched(true);
      
      if (matches.length > 0) {
        toast.info(`Found ${matches.length} matching product${matches.length > 1 ? 's' : ''}`);
      } else {
        toast.success('No existing products found with this configuration');
      }
    } else {
      toast.error('Please select Form Factor, Data Rate, and CN. Cage, Stacked first');
    }
  };

  const handleSave = () => {
    if (!formData.formFactor || !formData.dataRate || !formData.stacking || !formData.name || !formData.productManager) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check for duplicate product
    const isDuplicate = existingProducts.some(product => 
      product.formFactor === formData.formFactor &&
      product.dataRate === formData.dataRate &&
      product.stacking === formData.stacking &&
      product.name === formData.name &&
      product.productManager === formData.productManager
    );

    if (isDuplicate) {
      toast.error('Product already exists');
      return;
    }

    onAdd(formData);
    toast.success('Product added successfully');
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Product</DialogTitle>
          <DialogDescription className="sr-only">
            Add a new product with form factor, data rate, and stacking configuration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Issue Message */}
          {showIssue && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-700">
                <strong>Issue:</strong> Product mapping is not present for the selected combination
              </p>
            </div>
          )}

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

          {/* Search Results */}
          {hasSearched && (
            <div className="space-y-4">
              {searchResults.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-700">
                      Found {searchResults.length} matching product{searchResults.length > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="max-h-40 overflow-y-auto border rounded-md bg-blue-50">
                    <table className="w-full text-xs">
                      <thead className="border-b bg-blue-100 sticky top-0">
                        <tr>
                          <th className="text-left py-2 px-3">Product Name</th>
                          <th className="text-left py-2 px-3">Product Manager</th>
                          <th className="text-left py-2 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {searchResults.map(product => (
                          <tr key={product.id} className="border-b last:border-0 hover:bg-blue-50">
                            <td className="py-2 px-3">{product.name}</td>
                            <td className="py-2 px-3">{product.productManager}</td>
                            <td className="py-2 px-3">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full ${
                                  product.status === 'Active'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {product.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-600">
                    Products with this configuration already exist. You can still create a new one with a different name.
                  </p>
                </>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-sm text-green-700">
                    ✓ No existing products found with this configuration. You can proceed to create a new product.
                  </p>
                </div>
              )}
            </div>
          )}

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
          <Button variant="outline" onClick={handleFindProduct}>
            <Search className="mr-2" />
            Find Product
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}