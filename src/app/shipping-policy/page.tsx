import React from 'react';

export default function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white">Shipping Policy</h1>

      <div className="space-y-4 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Free Standard Shipping</h3>
        <p>We offer Free Standard Shipping on all orders totaling ₹1,499 or more. Standard delivery typically arrives within 3-5 business days.</p>

        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Express Delivery</h3>
        <p>Priority Express Shipping is available for a flat rate of ₹299, delivering packages within 1-2 business days with priority dispatch.</p>
      </div>
    </div>
  );
}
