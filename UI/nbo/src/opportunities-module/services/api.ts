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

// NBO API
export interface PaginationRequest {
  pageNo: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface PaginationResponse {
  count: number;
  data: any[];
}

export const nboApi = {
  getAll: (archived?: boolean) => {
    const params = archived !== undefined ? `?archived=${archived}` : '';
    return apiCall<ApiResponse<any[]>>(`/nbos/getnboswithnames${params}`);
  },
  getPaginated: (request: PaginationRequest) =>
    apiCall<PaginationResponse>('/nbos/getnboswithnames/filter', {
      method: 'POST',
      body: JSON.stringify(request),
    }),
  getById: (id: string) => apiCall<ApiResponse<any>>(`/nbos/editby/${id}`),
  create: (nbo: any) =>
    apiCall<ApiResponse<any>>('/nbos/createnbo', {
      method: 'POST',
      body: JSON.stringify(nbo),
    }),
  update: (id: string, nbo: any) =>
    apiCall<ApiResponse<any>>(`/nbos/editsubmit/${id}`, {
      method: 'PUT',
      body: JSON.stringify(nbo),
    }),
  delete: (id: string) =>
    apiCall<ApiResponse<void>>(`/nbos/delete/${id}`, {
      method: 'DELETE',
    }),
  archive: (id: string) =>
    apiCall<ApiResponse<any>>(`/nbos/${id}/archive`, {
      method: 'PUT',
    }),
  restore: (id: string) =>
    apiCall<ApiResponse<any>>(`/nbos/${id}/restore`, {
      method: 'PUT',
    }),
};

// FormFactor API
export const formFactorApi = {
  getAll: () => apiCall<ApiResponse<any[]>>('/form-factors'),
  getById: (id: string) => apiCall<ApiResponse<any>>(`/form-factors/${id}`),
  create: (formFactor: any) =>
    apiCall<ApiResponse<any>>('/form-factors', {
      method: 'POST',
      body: JSON.stringify(formFactor),
    }),
  update: (id: string, formFactor: any) =>
    apiCall<ApiResponse<any>>(`/form-factors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formFactor),
    }),
  delete: (id: string) =>
    apiCall<ApiResponse<void>>(`/form-factors/${id}`, {
      method: 'DELETE',
    }),
};

// DataRate API
export const dataRateApi = {
  getAll: () => apiCall<ApiResponse<any[]>>('/data-rates'),
  getByFormFactor: (formFactorId: string) =>
    apiCall<ApiResponse<any[]>>(`/data-rates/form-factor/${formFactorId}`),
  getById: (id: string) => apiCall<ApiResponse<any>>(`/data-rates/${id}`),
  create: (dataRate: any) =>
    apiCall<ApiResponse<any>>('/data-rates', {
      method: 'POST',
      body: JSON.stringify(dataRate),
    }),
  update: (id: string, dataRate: any) =>
    apiCall<ApiResponse<any>>(`/data-rates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dataRate),
    }),
  delete: (id: string) =>
    apiCall<ApiResponse<void>>(`/data-rates/${id}`, {
      method: 'DELETE',
    }),
};

// Stacking API
export const stackingApi = {
  getAll: () => apiCall<ApiResponse<any[]>>('/stackings'),
  getByFormFactor: (formFactorId: string) =>
    apiCall<ApiResponse<any[]>>(`/stackings/form-factor/${formFactorId}`),
  getByDataRate: (dataRateId: string) =>
    apiCall<ApiResponse<any[]>>(`/stackings/data-rate/${dataRateId}`),
  getByFormFactorAndDataRate: (formFactorId: string, dataRateId: string) =>
    apiCall<ApiResponse<any[]>>(`/stackings/form-factor/${formFactorId}/data-rate/${dataRateId}`),
  getById: (id: string) => apiCall<ApiResponse<any>>(`/stackings/${id}`),
  create: (stacking: any) =>
    apiCall<ApiResponse<any>>('/stackings', {
      method: 'POST',
      body: JSON.stringify(stacking),
    }),
  update: (id: string, stacking: any) =>
    apiCall<ApiResponse<any>>(`/stackings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(stacking),
    }),
  delete: (id: string) =>
    apiCall<ApiResponse<void>>(`/stackings/${id}`, {
      method: 'DELETE',
    }),
};

// Product API
export const productApi = {
  getAll: () => apiCall<any[]>('/products'),
  getById: (id: string) => apiCall<any>(`/products/${id}`),
  create: (product: any) =>
    apiCall<any>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }),
  update: (id: string, product: any) =>
    apiCall<any>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    }),
  delete: (id: string) =>
    apiCall<void>(`/products/${id}`, {
      method: 'DELETE',
    }),
};

// Pick List API for NBO
export interface KeyValueDTO {
  key: string;
  value: string;
}

export interface PickListDTO {
  businessUnits: KeyValueDTO[];
  markets: KeyValueDTO[];
  orderingTypes: KeyValueDTO[];
  risks: KeyValueDTO[];
  salesGroups: KeyValueDTO[];
  statuses: KeyValueDTO[];
  types: KeyValueDTO[];
  salesReps: KeyValueDTO[];
  appsEngs: KeyValueDTO[];
  assumedMarketShares: KeyValueDTO[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const pickListApi = {
  getAll: () => apiCall<ApiResponse<PickListDTO>>('/picklist'),
};

