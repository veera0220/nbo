const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Product interfaces
export interface Product {
  id: string;
  formFactor: string;
  dataRate: string;
  stacking: string;
  name: string;
  productManager: string;
  status: 'Active' | 'Inactive';
  formFactorId?: string;
  dataRateId?: string;
  stackingId?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Products API
export const productsApi = {
  /**
   * Get active products by business unit ID
   */
  getActiveByBusinessUnit: (businessUnitId: string | number) =>
    apiCall<ApiResponse<Product[]>>(`/products/active-products-by-bu/${businessUnitId}`),
};

// Product Form Factor interfaces
export interface ProductFormFactor {
  id: string;
  name: string;
  productManager: string;
  businessUnitId?: string;
  status?: 'Active' | 'Inactive';
}

// Product Form Factors API
export const productFormFactorApi = {
  /**
   * Get active product form factors by business unit ID
   */
  getActiveByBusinessUnit: (businessUnitId: string | number) =>
    apiCall<ApiResponse<ProductFormFactor[]>>(`/product-form-factors/active/by-bu/${businessUnitId}`),
};

// Product Data Rate interfaces
export interface ProductDataRate {
  id: string;
  name: string;
  formFactorId?: string;
  status?: 'Active' | 'Inactive';
}

// Product Data Rates API
export const productDataRateApi = {
  /**
   * Get active product data rates by product form factor ID
   */
  getActiveByFormFactor: (formFactorId: string | number) =>
    apiCall<ApiResponse<ProductDataRate[]>>(`/product-data-rates/active/by-pf/${formFactorId}`),
};

// Product CN Cage (Stacking) interfaces
export interface ProductCNCage {
  id: string;
  name: string;
  dataRateId?: string;
  formFactorId?: string;
  status?: 'Active' | 'Inactive';
}

// Product CN Cages API
export const productCNCageApi = {
  /**
   * Get active product CN cages by product data rate ID
   */
  getActiveByDataRate: (dataRateId: string | number) =>
    apiCall<ApiResponse<ProductCNCage[]>>(`/product-cns/active/by-pd/${dataRateId}`),
};

// Product Fields Map interfaces
export interface ProductFieldsMap {
  [key: string]: any;
  product?: string;
  productId?: string | number;
  productName?: string;
  productValue?: string;
  pnProductDescription?: string;
  productDescription?: string;
  productActive?: 'Active' | 'Inactive';
  status?: string;
  risk?: string;
  type?: string;
  competition?: string;
}

// Product Fields Map API
export const productFieldsMapApi = {
  /**
   * Get product fields map by product form factor ID, product data rate ID, and product CN cage ID
   */
  getByCombination: (pfId: string | number, pdId: string | number, pcnId: string | number) =>
    apiCall<ApiResponse<ProductFieldsMap>>(`/product-fields-map?pfId=${pfId}&pdId=${pdId}&pcnId=${pcnId}`),
};

