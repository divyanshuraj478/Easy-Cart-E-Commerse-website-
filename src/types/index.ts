export interface ProductType {
  id: string;
  name: string;
  slug: string;
  description: string;
  specifications?: string | null;
  price: number;
  originalPrice: number;
  discountPercent: number;
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isFlashDeal: boolean;
  flashDealEnd?: string | null;
  brand?: string | null;
  categoryId: string;
  category?: CategoryType;
  images: { id: string; url: string; isPrimary: boolean }[];
  variants?: { id: string; type: string; value: string; priceAdjustment: number; stock: number }[];
  reviews?: ReviewType[];
  createdAt: string;
}

export interface CategoryType {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
}

export interface CartItemType {
  id: string;
  productId: string;
  product: ProductType;
  selectedColor?: string | null;
  selectedSize?: string | null;
  quantity: number;
}

export interface WishlistItemType {
  id: string;
  productId: string;
  product: ProductType;
}

export interface UserType {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
  role: 'CUSTOMER' | 'ADMIN';
  status: 'ACTIVE' | 'DISABLED';
  createdAt: string;
}

export interface AddressType {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface OrderItemType {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  selectedColor?: string | null;
  selectedSize?: string | null;
  quantity: number;
  subtotal: number;
  product?: ProductType;
}

export interface OrderType {
  id: string;
  orderNumber: string;
  userId: string;
  user?: UserType;
  status: 'ORDER_PLACED' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'RETURN_REQUESTED' | 'RETURNED';
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  grandTotal: number;
  paymentMethod: 'CARD' | 'UPI' | 'NET_BANKING' | 'WALLET' | 'COD';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  shippingAddress: string;
  trackingNumber?: string | null;
  estimatedDelivery?: string | null;
  createdAt: string;
  items: OrderItemType[];
}

export interface ReviewType {
  id: string;
  productId: string;
  userId: string;
  user?: { name: string; image?: string | null };
  rating: number;
  title?: string | null;
  comment: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  createdAt: string;
}

export interface CouponType {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number | null;
  expiryDate?: string | null;
  usageLimit?: number | null;
  usedCount: number;
  isActive: boolean;
}
