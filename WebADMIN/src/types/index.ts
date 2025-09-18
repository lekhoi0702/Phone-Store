export interface Brand {
  brandId: number;
  brandName: string;
  brandLogo?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface CreateBrandRequest {
  brandName: string;
  brandLogo?: string;
  description?: string;
  isActive: boolean;
}

export interface UpdateBrandRequest extends CreateBrandRequest {
  brandId: number;
}

export interface CreateCategoryRequest {
  categoryName: string;
  description?: string;
  isActive: boolean;
}

export interface UpdateCategoryRequest extends CreateCategoryRequest {
  categoryId: number;
}
