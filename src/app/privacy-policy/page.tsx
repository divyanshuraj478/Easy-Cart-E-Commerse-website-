import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white">Privacy Policy</h1>
      <p className="text-xs text-gray-500">Last updated: August 21, 2026</p>

      <div className="space-y-4 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
        <p>At Easy-Cart, we take your privacy seriously. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website or make purchases through our e-commerce platform.</p>

        <h3 className="text-sm font-bold text-gray-900 dark:text-white">1. Information We Collect</h3>
        <p>We collect personal information that you voluntarily provide to us when registering for an account, expressing interest in obtaining information about us or our products, participating in store activities, or making a purchase. This includes name, email address, phone number, shipping address, and payment confirmation details.</p>

        <h3 className="text-sm font-bold text-gray-900 dark:text-white">2. How We Use Your Information</h3>
        <p>We process your information to deliver orders, process payment transactions, maintain account security, communicate updates regarding your purchases, provide customer service, and send promotional notifications with your consent.</p>

        <h3 className="text-sm font-bold text-gray-900 dark:text-white">3. Data Security & Encryption</h3>
        <p>Easy-Cart implements robust technical and organizational security measures, including 256-bit SSL encryption and PCI-DSS compliant payment processing via Stripe. We never store raw payment card data on our servers.</p>
      </div>
    </div>
  );
}
