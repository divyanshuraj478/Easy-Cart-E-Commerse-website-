import React from 'react';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white">Terms & Conditions</h1>
      <p className="text-xs text-gray-500">Last updated: August 21, 2026</p>

      <div className="space-y-4 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
        <p>Welcome to Easy-Cart! By accessing or purchasing from our platform, you agree to be bound by these Terms and Conditions.</p>

        <h3 className="text-sm font-bold text-gray-900 dark:text-white">1. User Accounts</h3>
        <p>You are responsible for maintaining the confidentiality of your account login credentials and for restricting access to your computer or mobile device.</p>

        <h3 className="text-sm font-bold text-gray-900 dark:text-white">2. Product Pricing & Availability</h3>
        <p>All prices displayed on Easy-Cart are subject to change without notice. We reserve the right to modify or discontinue any product at any time.</p>
      </div>
    </div>
  );
}
