import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Mail, Phone, MapPin, ShieldCheck, Truck, RefreshCw, Headphones, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-900 text-gray-300 dark:border-gray-800 dark:bg-gray-950">
      {/* Top Features Banner */}
      <div className="border-b border-gray-800 bg-gray-900/50 py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 rounded-2xl bg-gray-800/40 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/20 text-brand-400">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Fast & Free Delivery</h4>
              <p className="text-xs text-gray-400">Free shipping on all orders over ₹1,499</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 rounded-2xl bg-gray-800/40 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Secure Payments</h4>
              <p className="text-xs text-gray-400">Encrypted checkout via Stripe & Cards</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 rounded-2xl bg-gray-800/40 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600/20 text-amber-400">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">30 Days Easy Returns</h4>
              <p className="text-xs text-gray-400">Hassle-free replacement & refund</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 rounded-2xl bg-gray-800/40 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400">
              <Headphones className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">24/7 Priority Support</h4>
              <p className="text-xs text-gray-400">Dedicated helpdesk assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Easy<span className="text-brand-400">-Cart</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-gray-400">
              Everything You Need. Just a Cart Away. Easy-Cart is your premier destination for high-quality electronics, modern fashion, beauty, household appliances, and everyday essential goods delivered straight to your doorstep.
            </p>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-400" />
                <span>100 Innovation Boulevard, Tech District, CA 94103</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-400" />
                <span>support@easycart.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-400" />
                <span>+1 (800) 555-EASY</span>
              </div>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div>
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">Popular Categories</h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li><Link href="/category/electronics" className="hover:text-brand-400 transition-colors">Electronics & Audio</Link></li>
              <li><Link href="/category/fashion" className="hover:text-brand-400 transition-colors">Fashion & Apparel</Link></li>
              <li><Link href="/category/beauty" className="hover:text-brand-400 transition-colors">Beauty & Skincare</Link></li>
              <li><Link href="/category/home-kitchen" className="hover:text-brand-400 transition-colors">Home & Kitchen</Link></li>
              <li><Link href="/category/grocery" className="hover:text-brand-400 transition-colors">Organic Grocery</Link></li>
              <li><Link href="/category/sports" className="hover:text-brand-400 transition-colors">Sports & Fitness</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">Customer Care</h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li><Link href="/account" className="hover:text-brand-400 transition-colors">My Account</Link></li>
              <li><Link href="/account?tab=orders" className="hover:text-brand-400 transition-colors">Order Tracking</Link></li>
              <li><Link href="/wishlist" className="hover:text-brand-400 transition-colors">My Wishlist</Link></li>
              <li><Link href="/cart" className="hover:text-brand-400 transition-colors">Shopping Cart</Link></li>
              <li><Link href="/help" className="hover:text-brand-400 transition-colors">FAQ & Support</Link></li>
              <li><Link href="/contact" className="hover:text-brand-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">Legal & Policies</h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li><Link href="/privacy-policy" className="hover:text-brand-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-brand-400 transition-colors">Shipping Policy</Link></li>
              <li><Link href="/return-policy" className="hover:text-brand-400 transition-colors">Return & Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-800 pt-8 sm:flex-row">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Easy-Cart Inc. All rights reserved. Built with precision and care.
          </p>

          <div className="mt-4 flex items-center space-x-3 sm:mt-0">
            <span className="rounded bg-gray-800 px-2 py-1 text-[10px] font-bold text-gray-300">VISA</span>
            <span className="rounded bg-gray-800 px-2 py-1 text-[10px] font-bold text-gray-300">MASTERCARD</span>
            <span className="rounded bg-gray-800 px-2 py-1 text-[10px] font-bold text-gray-300">AMEX</span>
            <span className="rounded bg-gray-800 px-2 py-1 text-[10px] font-bold text-gray-300">STRIPE</span>
            <span className="rounded bg-gray-800 px-2 py-1 text-[10px] font-bold text-gray-300">UPI</span>
            <span className="rounded bg-gray-800 px-2 py-1 text-[10px] font-bold text-gray-300">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
