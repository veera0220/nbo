import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronDown, ChevronRight, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { EditProductDialog } from './EditProductDialog';
import { useNBO } from '../context/NBOContext';

interface Product {
  id: string;
  formFactor: string;
  dataRate: string;
  stacking: string;
  name: string;
  productManager: string;
  status: 'Active' | 'Inactive';
}

export function Products() {
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    '12': true,
  });
  const { formFactors } = useNBO();

  // Mock product data organized by form factor
  const [products, setProducts] = useState<Product[]>([
    // SFP Products - <6G Flash
    {
      id: '1',
      formFactor: 'SFP',
      dataRate: '<6G',
      stacking: 'Flash',
      name: 'CFF2 1xN Gang (28G/56G)',
      productManager: 'Shih, Eason',
      status: 'Active',
    },
    {
      id: '2',
      formFactor: 'SFP',
      dataRate: '<6G',
      stacking: 'Flash',
      name: 'CFF Elevated SMT Connector (28G/56G)',
      productManager: 'Hao, Lily',
      status: 'Active',
    },
    {
      id: '3',
      formFactor: 'SFP',
      dataRate: '<6G',
      stacking: 'Flash',
      name: 'SFP+ 10G Flash Mount Connector',
      productManager: 'Chen, Wei',
      status: 'Active',
    },
    {
      id: '4',
      formFactor: 'SFP',
      dataRate: '<6G',
      stacking: 'Flash',
      name: 'SFP Compact Flash Connector',
      productManager: 'Wang, Michael',
      status: 'Inactive',
    },
    
    // SFP Products - <6G 1x1
    {
      id: '5',
      formFactor: 'SFP',
      dataRate: '<6G',
      stacking: '1x1',
      name: 'SFP Standard Single Port',
      productManager: 'Shih, Eason',
      status: 'Active',
    },
    {
      id: '6',
      formFactor: 'SFP',
      dataRate: '<6G',
      stacking: '1x1',
      name: 'SFP Enhanced Single Port',
      productManager: 'Hao, Lily',
      status: 'Active',
    },
    
    // QSFP Products - 28G 1x1
    {
      id: '7',
      formFactor: 'QSFP',
      dataRate: '28G',
      stacking: '1x1',
      name: 'QSFP28 Standard Connector',
      productManager: 'Shih, Eason',
      status: 'Active',
    },
    {
      id: '8',
      formFactor: 'QSFP',
      dataRate: '28G',
      stacking: '1x1',
      name: 'QSFP28 Enhanced Thermal Connector',
      productManager: 'Wang, Michael',
      status: 'Active',
    },
    {
      id: '9',
      formFactor: 'QSFP',
      dataRate: '28G',
      stacking: '1x1',
      name: 'QSFP28 Low Profile Connector',
      productManager: 'Shih, Eason',
      status: 'Inactive',
    },
    {
      id: '10',
      formFactor: 'QSFP',
      dataRate: '28G',
      stacking: '1x1',
      name: 'QSFP28 High Density Connector',
      productManager: 'Chen, Wei',
      status: 'Active',
    },
    {
      id: '11',
      formFactor: 'QSFP',
      dataRate: '28G',
      stacking: '1x1',
      name: 'QSFP28 Ruggedized Connector',
      productManager: 'Hao, Lily',
      status: 'Active',
    },
    
    // QSFP Products - 28G 2x1
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
    
    // QSFP Products - 56G 1x1
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
    
    // QSFP Products - 56G 2x1
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
    
    // QSFP-DD Products - 112G 1x1
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
    
    // QSFP-DD Products - 112G 2x1
    {
      id: '22',
      formFactor: 'QSFP-DD',
      dataRate: '112G',
      stacking: '2x1',
      name: 'QSFP-DD Dual Stack Standard',
      productManager: 'Wang, Michael',
      status: 'Active',
    },
    {
      id: '23',
      formFactor: 'QSFP-DD',
      dataRate: '112G',
      stacking: '2x1',
      name: 'QSFP-DD Dual Stack Enhanced',
      productManager: 'Shih, Eason',
      status: 'Active',
    },
    
    // OSFP Products - 112G 1x1
    {
      id: '24',
      formFactor: 'OSFP',
      dataRate: '112G',
      stacking: '1x1',
      name: 'OSFP 800G Connector',
      productManager: 'Chen, Wei',
      status: 'Active',
    },
    {
      id: '25',
      formFactor: 'OSFP',
      dataRate: '112G',
      stacking: '1x1',
      name: 'OSFP High Power Connector',
      productManager: 'Hao, Lily',
      status: 'Active',
    },
    {
      id: '26',
      formFactor: 'OSFP',
      dataRate: '112G',
      stacking: '1x1',
      name: 'OSFP Low Profile Connector',
      productManager: 'Wang, Michael',
      status: 'Active',
    },
    
    // OSFP Products - 224G 1x1
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
    
    // SFP-DD Products - 56G 1x1
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
  ]);

  // Group products by form factor
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.formFactor]) {
      acc[product.formFactor] = [];
    }
    acc[product.formFactor].push(product);
    return acc;
  }, {} as { [key: string]: Product[] });

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleUpdateProduct = (id: string, productData: Omit<Product, 'id'>) => {
    setProducts(products.map(p => p.id === id ? { ...productData, id } : p));
  };

  const handleOpenDetailsDialog = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  const handleOpenEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl">Products</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage product catalog and mappings
            </p>
          </div>
          <Button onClick={() => navigate('/products/new')} className="gap-2">
            <Plus className="w-4 h-4" />
            New Product
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Product Categories */}
          <div className="col-span-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Product Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {Object.entries(groupedProducts).map(([formFactor, prods]) => (
                    <div key={formFactor}>
                      <button
                        onClick={() => toggleCategory(formFactor)}
                        className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 text-left transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {expandedCategories[formFactor] ? (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          )}
                          <Package className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{formFactor}</span>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          {prods.length}
                        </span>
                      </button>
                      {expandedCategories[formFactor] && (
                        <div className="ml-6 space-y-1 pb-2">
                          {prods.map(product => (
                            <div
                              key={product.id}
                              onClick={() => handleOpenDetailsDialog(product)}
                              className="px-4 py-1.5 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer rounded transition-colors"
                            >
                              {product.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <Card className="mt-4">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Products</span>
                    <span className="font-semibold text-blue-600">{products.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Form Factors</span>
                    <span className="font-semibold text-blue-600">
                      {Object.keys(groupedProducts).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Active</span>
                    <span className="font-semibold text-green-600">
                      {products.filter(p => p.status === 'Active').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Product List */}
          <div className="col-span-9">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">All Products ({products.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(groupedProducts).map(([formFactor, prods]) => (
                    <div key={formFactor}>
                      <h3 className="font-medium text-gray-900 mb-3 pb-2 border-b">
                        {formFactor} ({prods.length})
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              <th className="text-left py-2 px-3">Product Name</th>
                              <th className="text-left py-2 px-3">Data Rate</th>
                              <th className="text-left py-2 px-3">CN. Cage, Stacked</th>
                              <th className="text-left py-2 px-3">Product Manager</th>
                              <th className="text-left py-2 px-3">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {prods.map(product => (
                              <tr key={product.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-3 cursor-pointer" onClick={() => handleOpenDetailsDialog(product)}>
                                  {product.name}
                                </td>
                                <td className="py-3 px-3">{product.dataRate}</td>
                                <td className="py-3 px-3">{product.stacking}</td>
                                <td className="py-3 px-3">{product.productManager}</td>
                                <td className="py-3 px-3">
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
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
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Product Dialog */}
      <EditProductDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        product={selectedProduct}
        onUpdate={handleUpdateProduct}
      />
    </div>
  );
}