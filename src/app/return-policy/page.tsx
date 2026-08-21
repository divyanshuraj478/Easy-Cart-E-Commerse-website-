import React from 'react';

export default function ReturnPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white">Return & Refund Policy</h1>

      <div className="space-y-4 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">30-Day Money Back Guarantee</h3>
        <p>If you are not 100% satisfied with your purchase, you may return eligible products within 30 days of delivery for a full refund or exchange.</p>

        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Refund Processing</h3>
        <p>Once your returned item is received and inspected, funds will be refunded back to your original payment method within 3-5 business days.</p>
      </div>
    </div>
  );
}
