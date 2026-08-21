import React from 'react';

export default function HelpPage() {
  const faqs = [
    {
      q: 'How long does shipping take?',
      a: 'Standard shipping takes 3-5 business days. Express shipping delivers within 1-2 business days.',
    },
    {
      q: 'How can I track my order?',
      a: 'Once your order is shipped, you will receive a tracking ID in your account under "My Orders".',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept Credit/Debit Cards via Stripe, UPI, Net Banking, Mobile Wallets, and Cash on Delivery (COD).',
    },
    {
      q: 'How do I return a product?',
      a: 'Navigate to My Orders in your account dashboard and click "Request Return" on eligible orders within 30 days of delivery.',
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white">Frequently Asked Questions (FAQ)</h1>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{faq.q}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
