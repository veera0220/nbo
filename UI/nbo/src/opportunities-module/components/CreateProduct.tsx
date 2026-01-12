import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Package, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
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

export function CreateProduct() {
  const navigate = useNavigate();
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
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Mock existing products for validation
  const existingProducts: Product[] = [
    {
      id: '1',
      formFactor: 'QSFP',
      dataRate: '14G',
      stacking: '1x1',
      name: 'QSFP14 Standard Connector',
      productManager: 'Shih, Eason',
      status: 'Active',
    },
    // Add more as needed
  ];

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
    if (formData.formFactor && formData.dataRate && formData.stacking) {
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

    // In a real app, save to backend/context
    toast.success('Product created successfully');
    navigate('/products');
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/products')} title="Return to Products">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl">Create New Product</h1>
            <p className="text-sm text-gray-600 mt-1">
              Add a new product with form factor, data rate, and stacking configuration
            </p>
          </div>
        </div>

        {/* Issue Message */}
        {showIssue && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm text-red-700">
                    <strong>Issue:</strong> Product mapping is not present for the selected combination
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>Product Configuration</CardTitle>
                <CardDescription>
                  Configure the product details and specifications
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Form Factor, Data Rate, Stacking */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="formFactor">Form Factor *</Label>
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

              <div className="space-y-2">
                <Label htmlFor="dataRate">Data Rate *</Label>
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

              <div className="space-y-2">
                <Label htmlFor="stacking">CN. Cage, Stacked *</Label>
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
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={handleFindProduct}>
                <Search className="w-4 h-4 mr-2" />
                Find Existing Products
              </Button>
            </div>

            {/* Search Results */}
            {hasSearched && (
              <>
                <Separator />
                <div className="space-y-4">
                  {searchResults.length > 0 ? (
                    <>
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">
                          Found {searchResults.length} matching product{searchResults.length > 1 ? 's' : ''}
                        </h3>
                      </div>
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4">
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="border-b border-blue-300">
                                <tr>
                                  <th className="text-left py-2 px-3">Product Name</th>
                                  <th className="text-left py-2 px-3">Product Manager</th>
                                  <th className="text-left py-2 px-3">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {searchResults.map(product => (
                                  <tr key={product.id} className="border-b border-blue-200 last:border-0">
                                    <td className="py-2 px-3">{product.name}</td>
                                    <td className="py-2 px-3">{product.productManager}</td>
                                    <td className="py-2 px-3">
                                      <Badge variant={product.status === 'Active' ? 'default' : 'secondary'}>
                                        {product.status}
                                      </Badge>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <p className="text-xs text-blue-700 mt-3">
                            Products with this configuration already exist. You can still create a new one with a different name.
                          </p>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <p className="text-sm text-green-700">
                          ✓ No existing products found with this configuration. You can proceed to create a new product.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>
              Enter the product name and assign a product manager
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productManager">Product Manager *</Label>
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

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
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
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>Product Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Form Factor</p>
                <p className="font-medium">{formData.formFactor || '-'}</p>
              </div>
              <div>
                <p className="text-gray-600">Data Rate</p>
                <p className="font-medium">{formData.dataRate || '-'}</p>
              </div>
              <div>
                <p className="text-gray-600">Stacking</p>
                <p className="font-medium">{formData.stacking || '-'}</p>
              </div>
              <div>
                <p className="text-gray-600">Product Name</p>
                <p className="font-medium">{formData.name || '-'}</p>
              </div>
              <div>
                <p className="text-gray-600">Product Manager</p>
                <p className="font-medium">{formData.productManager || '-'}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <Badge variant={formData.status === 'Active' ? 'default' : 'secondary'}>
                  {formData.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pb-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Create Product
          </Button>
        </div>
      </div>
    </div>
  );
}
