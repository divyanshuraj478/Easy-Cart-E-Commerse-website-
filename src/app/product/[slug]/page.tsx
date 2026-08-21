'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  Star,
  CheckCircle2,
  Trash2,
  Edit2,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ProductType, ReviewType } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { StarRating } from '@/components/ui/StarRating';
import { ProductGrid } from '@/components/product/ProductGrid';
import { formatCurrency, formatDate } from '@/lib/formatters';
import toast from 'react-hot-toast';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);

  // Delivery Pincode checker state
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function fetchProductDetails() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();

        if (res.ok && data.product) {
          setProduct(data.product);

          // Fetch related products in same category
          if (data.product.categoryId) {
            const relRes = await fetch(`/api/products?category=${data.product.category?.slug}&limit=4`);
            const relData = await relRes.json();
            setRelatedProducts(
              (relData.products || []).filter((p: ProductType) => p.id !== data.product.id)
            );
          }
        } else {
          setProduct(null);
        }
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchProductDetails();
  }, [slug]);

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length >= 5) {
      setPincodeStatus('Available for express delivery by Tuesday!');
    } else {
      toast.error('Please enter a valid 5 or 6 digit pincode');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to write a review');
      router.push('/login');
      return;
    }

    if (!newComment) {
      toast.error('Please enter review comment');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product?.id,
          rating: newRating,
          title: newTitle,
          comment: newComment,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Review submitted successfully!');
        setNewTitle('');
        setNewComment('');
        // Refresh product to display new review
        const refreshRes = await fetch(`/api/products/${slug}`);
        const refreshData = await refreshRes.json();
        if (refreshData.product) setProduct(refreshData.product);
      } else {
        toast.error(data.message || 'Failed to submit review');
      }
    } catch (err) {
      toast.error('Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Review deleted');
        const refreshRes = await fetch(`/api/products/${slug}`);
        const refreshData = await refreshRes.json();
        if (refreshData.product) setProduct(refreshData.product);
      }
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent"></div>
        <p className="mt-2 text-xs font-bold text-gray-500">Loading Product Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Product Not Found</h2>
        <p className="mt-2 text-xs text-gray-500">The product you are looking for does not exist or has been removed.</p>
        <Link href="/shop" className="mt-6 inline-block rounded-2xl bg-brand-600 px-6 py-2.5 text-xs font-bold text-white shadow-md">
          Browse Shop
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const colorVariants = product.variants?.filter((v) => v.type === 'Color') || [];
  const sizeVariants = product.variants?.filter((v) => v.type === 'Size') || [];
  const images = product.images && product.images.length > 0 ? product.images : [{ id: '1', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80', isPrimary: true }];

  // Rating Distribution Calculation
  const reviews = product.reviews || [];
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Product Top Breadcrumb */}
      <nav className="flex text-xs text-gray-500 space-x-2 dark:text-gray-400">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand-600">Shop</Link>
        <span>/</span>
        <Link href={`/category/${product.category?.slug}`} className="hover:text-brand-600 capitalize">
          {product.category?.name}
        </Link>
        <span>/</span>
        <span className="font-bold text-gray-900 truncate max-w-xs dark:text-white">{product.name}</span>
      </nav>

      {/* Main Product Layout Grid */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left Column: Image Gallery & Zoom Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-gray-100 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <Image
              src={images[selectedImageIndex]?.url || images[0].url}
              alt={product.name}
              fill
              priority
              className="object-cover rounded-2xl transition-transform duration-300 hover:scale-105"
            />
            {product.discountPercent > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-rose-600 px-3.5 py-1 text-xs font-black text-white shadow-xl">
                -{product.discountPercent}% SAVINGS
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                    selectedImageIndex === idx ? 'border-brand-600 shadow-md' : 'border-transparent opacity-60'
                  }`}
                >
                  <Image src={img.url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Actions & Specs */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              {product.category?.name} • {product.brand || 'Easy-Cart'}
            </span>
            <h1 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars & Review Count */}
            <div className="mt-3 flex items-center space-x-3">
              <StarRating rating={product.rating} size={18} />
              <span className="text-sm font-black text-gray-900 dark:text-white">{product.rating}</span>
              <span className="text-xs text-gray-400">({product.reviewCount} customer reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100 dark:bg-gray-950 dark:border-gray-800 flex items-center justify-between">
            <div>
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-black text-brand-600 dark:text-brand-400">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-base font-semibold text-gray-400 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.originalPrice > product.price && (
                <p className="mt-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  You save {formatCurrency(product.originalPrice - product.price)} ({product.discountPercent}% off)
                </p>
              )}
            </div>

            <div className="text-right">
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                product.stock > 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800'
              }`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs leading-relaxed text-gray-600 sm:text-sm dark:text-gray-300">
            {product.description}
          </p>

          {/* Color Selection */}
          {colorVariants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-900 dark:text-white">
                Color Option: <span className="text-brand-600 font-bold">{selectedColor || 'Select'}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {colorVariants.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.value)}
                    className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
                      selectedColor === c.value
                        ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-sm dark:bg-brand-950 dark:text-brand-300'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {c.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {sizeVariants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-900 dark:text-white">
                Size Option: <span className="text-brand-600 font-bold">{selectedSize || 'Select'}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {sizeVariants.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSize(s.value)}
                    className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
                      selectedSize === s.value
                        ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-sm dark:bg-brand-950 dark:text-brand-300'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {s.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Action CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2.5 text-base font-bold hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  -
                </button>
                <span className="px-4 text-sm font-extrabold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2.5 text-base font-bold hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  +
                </button>
              </div>

              <button
                disabled={product.stock <= 0}
                onClick={() => addToCart(product, quantity, selectedColor, selectedSize)}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-brand-500/25 transition-all hover:bg-brand-700 disabled:opacity-50"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`rounded-2xl border p-3.5 transition-all ${
                  isWishlisted
                    ? 'border-rose-500 bg-rose-50 text-rose-500 dark:bg-rose-950/50'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300'
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            <button
              disabled={product.stock <= 0}
              onClick={() => {
                addToCart(product, quantity, selectedColor, selectedSize);
                router.push('/checkout');
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 py-3.5 text-sm font-extrabold text-gray-950 shadow-lg transition-all hover:bg-amber-300 disabled:opacity-50"
            >
              <Zap className="h-4 w-4" />
              Buy Now
            </button>
          </div>

          {/* Pincode & Delivery Availability Checker */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-3">
            <h4 className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              <MapPin className="h-4 w-4 text-brand-600" />
              Check Delivery Availability
            </h4>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Pincode / Postal Code"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="submit"
                className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-black dark:bg-gray-800"
              >
                Check
              </button>
            </form>

            {pincodeStatus && (
              <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                {pincodeStatus}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Product Specifications Table */}
      {product.specifications && (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
          <h3 className="text-lg font-black text-gray-900 dark:text-white">Technical Specifications</h3>
          <div className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
            {product.specifications.split('|').map((spec, i) => {
              const [key, val] = spec.split(':');
              return (
                <div key={i} className="grid grid-cols-3 py-2.5">
                  <span className="font-bold text-gray-500 dark:text-gray-400">{key?.trim()}</span>
                  <span className="col-span-2 font-medium text-gray-900 dark:text-white">{val ? val.trim() : key?.trim()}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-6 dark:border-gray-800">
          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">Customer Reviews</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Based on verified customer purchases</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-center">
              <span className="text-4xl font-black text-gray-900 dark:text-white">{product.rating}</span>
              <div className="mt-1"><StarRating rating={product.rating} size={14} /></div>
              <span className="text-[10px] text-gray-400">{product.reviewCount} Ratings</span>
            </div>
          </div>
        </div>

        {/* Rating Breakdown Bar Chart */}
        <div className="space-y-2 max-w-md">
          {[5, 4, 3, 2, 1].map((star, idx) => {
            const count = ratingCounts[idx];
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center space-x-3 text-xs">
                <span className="w-12 font-bold text-gray-600 dark:text-gray-400">{star} Stars</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-right font-medium text-gray-400">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Write a Review Form */}
        <div className="rounded-2xl bg-gray-50 p-5 border border-gray-100 dark:bg-gray-800/40 dark:border-gray-700/60 space-y-4">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">Write a Customer Review</h4>
          <form onSubmit={handleReviewSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Rating:</label>
              <div className="mt-1">
                <StarRating rating={newRating} interactive size={22} onRatingChange={setNewRating} />
              </div>
            </div>

            <input
              type="text"
              placeholder="Review Title (e.g., Amazing quality!)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />

            <textarea
              rows={3}
              required
              placeholder="Share your experience with this product..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />

            <button
              type="submit"
              disabled={submittingReview}
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-700 disabled:opacity-50"
            >
              {submittingReview ? 'Posting...' : 'Submit Review'}
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
          {reviews.length === 0 ? (
            <p className="text-xs text-gray-500 py-4">No reviews yet. Be the first to review this product!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 font-bold text-xs text-brand-700">
                      {rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-gray-900 dark:text-white">{rev.user?.name || 'Customer'}</h5>
                      <StarRating rating={rev.rating} size={12} />
                    </div>
                  </div>

                  <span className="text-[10px] text-gray-400">{formatDate(rev.createdAt)}</span>
                </div>

                {rev.title && <h6 className="text-xs font-bold text-gray-900 dark:text-white">{rev.title}</h6>}
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{rev.comment}</p>

                {user && (user.id === rev.userId || user.role === 'ADMIN') && (
                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="flex items-center gap-1 text-[11px] text-rose-500 hover:underline pt-1"
                  >
                    <Trash2 className="h-3 w-3" /> Delete Review
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Related Products Recommendation */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-black text-gray-900 dark:text-white">You Might Also Like</h3>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
