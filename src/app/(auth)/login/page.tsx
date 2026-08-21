'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await login(email, password);
    setSubmitting(false);
    if (success) {
      router.push('/');
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@easycart.com');
    setPassword('admin123');
  };

  const handleFillDemoUser = () => {
    setEmail('user@easycart.com');
    setPassword('user123');
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg">
            <ShoppingBag className="h-6 w-6" />
          </Link>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Welcome Back</h2>
          <p className="text-xs text-gray-500">Sign in to your Easy-Cart account</p>
        </div>

        {/* Demo Quick Login Buttons */}
        <div className="rounded-2xl bg-brand-50/60 p-3 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900 space-y-2">
          <span className="text-[11px] font-bold text-brand-700 dark:text-brand-300 block text-center">
            ⚡ Demo Accounts Quick Fill:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={handleFillDemoUser}
              type="button"
              className="rounded-xl bg-white py-1.5 font-bold text-brand-600 shadow-sm hover:bg-brand-50 dark:bg-gray-800 dark:text-brand-300"
            >
              Customer User
            </button>
            <button
              onClick={handleFillDemoAdmin}
              type="button"
              className="rounded-xl bg-amber-400 py-1.5 font-bold text-gray-950 shadow-sm hover:bg-amber-300"
            >
              Store Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-xs text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Password</label>
              <Link href="/forgot-password" className="text-[11px] font-bold text-brand-600 hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-xs text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-700 disabled:opacity-50"
          >
            {submitting ? 'Signing In...' : 'Sign In'} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <Link href="/signup" className="font-bold text-brand-600 hover:underline dark:text-brand-400">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
