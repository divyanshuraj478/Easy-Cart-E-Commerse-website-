'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  Lock,
  Plus,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Building,
  Wallet,
  Banknote,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { AddressType } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, discountAmount, coupon, clearCart } = useCart();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Address State
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Step 2: Shipping Option
  const [shippingSpeed, setShippingSpeed] = useState<'standard' | 'express'>('standard');
  const shippingFee = subtotal >= 1499 ? 0 : shippingSpeed === 'express' ? 299 : 149;

  // Step 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'UPI' | 'NET_BANKING' | 'WALLET' | 'COD'>('CARD');

  // Card details state
  const [cardName, setCardName] = useState('Alex Johnson');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');

  const [processing, setProcessing] = useState(false);

  // Computations
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Number((taxableAmount * 0.08).toFixed(2));
  const grandTotal = Number((taxableAmount + shippingFee + taxAmount).toFixed(2));

  useEffect(() => {
    if (user) {
      fetch('/api/addresses')
        .then((res) => res.json())
        .then((data) => {
          if (data.addresses && data.addresses.length > 0) {
            setAddresses(data.addresses);
            const defaultAddr = data.addresses.find((a: any) => a.isDefault) || data.addresses[0];
            setSelectedAddressId(defaultAddr.id);
          } else {
            setShowAddressForm(true);
          }
        });
    } else {
      setShowAddressForm(true);
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500">Please add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => router.push('/shop')}
          className="rounded-2xl bg-brand-600 px-6 py-2.5 text-xs font-bold text-white shadow-md"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const getActiveShippingAddress = () => {
    if (showAddressForm || !selectedAddressId) {
      return newAddress;
    }
    const found = addresses.find((a) => a.id === selectedAddressId);
    return found ? {
      fullName: found.fullName,
      phone: found.phone,
      streetAddress: found.streetAddress,
      city: found.city,
      state: found.state,
      postalCode: found.postalCode,
      country: found.country,
    } : newAddress;
  };

  const handlePlaceOrder = async () => {
    const finalAddress = getActiveShippingAddress();
    if (!finalAddress.fullName || !finalAddress.streetAddress || !finalAddress.city) {
      toast.error('Please complete your shipping address');
      setStep(1);
      return;
    }

    setProcessing(true);
    try {
      // Create payment session
      const payRes = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: grandTotal,
          paymentMethod,
        }),
      });
      const payData = await payRes.json();

      // Create Order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingAddress: finalAddress,
          paymentMethod,
          totalAmount: subtotal,
          discountAmount,
          shippingFee,
          taxAmount,
          grandTotal,
          couponCode: coupon?.code,
          stripePaymentIntentId: payData.paymentIntentId,
        }),
      });

      const orderData = await orderRes.json();

      if (orderRes.ok && orderData.order) {
        clearCart();
        toast.success('Order placed successfully! 🎉');
        router.push(`/order/${orderData.order.id}`);
      } else {
        toast.error(orderData.message || 'Failed to place order');
      }
    } catch (err) {
      toast.error('An error occurred while placing order');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Checkout Progress Stepper */}
      <div className="flex items-center justify-center space-x-4 max-w-xl mx-auto text-xs font-bold">
        {[
          { num: 1, label: 'Address' },
          { num: 2, label: 'Delivery' },
          { num: 3, label: 'Payment' },
          { num: 4, label: 'Review' },
        ].map((s) => (
          <div key={s.num} className="flex items-center space-x-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs transition-colors ${
                step >= s.num
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-500 dark:bg-gray-800'
              }`}
            >
              {step > s.num ? <CheckCircle2 className="h-4 w-4" /> : s.num}
            </div>
            <span className={step >= s.num ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: ADDRESS */}
          {step === 1 && (
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white">
                <MapPin className="h-5 w-5 text-brand-600" /> Step 1: Select Delivery Address
              </h2>

              {addresses.length > 0 && !showAddressForm && (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex cursor-pointer items-start space-x-3 rounded-2xl border p-4 transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40'
                          : 'border-gray-200 dark:border-gray-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 h-4 w-4 text-brand-600"
                      />
                      <div className="text-xs space-y-1">
                        <span className="font-bold text-gray-900 dark:text-white">{addr.fullName}</span>
                        <p className="text-gray-500">{addr.streetAddress}, {addr.city}, {addr.state} {addr.postalCode}</p>
                        <p className="text-gray-500">Phone: {addr.phone}</p>
                      </div>
                    </label>
                  ))}

                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
                  >
                    <Plus className="h-4 w-4" /> Add New Address
                  </button>
                </div>
              )}

              {(showAddressForm || addresses.length === 0) && (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Street Address"
                    value={newAddress.streetAddress}
                    onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Postal Code"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 rounded-2xl bg-brand-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-brand-700"
                >
                  Continue to Delivery <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DELIVERY */}
          {step === 2 && (
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white">
                <Truck className="h-5 w-5 text-brand-600" /> Step 2: Choose Shipping Speed
              </h2>

              <div className="space-y-3">
                <label
                  onClick={() => setShippingSpeed('standard')}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                    shippingSpeed === 'standard'
                      ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40'
                      : 'border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input type="radio" checked={shippingSpeed === 'standard'} readOnly className="h-4 w-4 text-brand-600" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">Standard Delivery (3-5 Business Days)</h4>
                      <p className="text-[11px] text-gray-500">Reliable doorstep courier delivery</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-gray-900 dark:text-white">
                    {subtotal >= 1499 ? 'FREE' : formatCurrency(149)}
                  </span>
                </label>

                <label
                  onClick={() => setShippingSpeed('express')}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                    shippingSpeed === 'express'
                      ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40'
                      : 'border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input type="radio" checked={shippingSpeed === 'express'} readOnly className="h-4 w-4 text-brand-600" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">Priority Express (1-2 Business Days)</h4>
                      <p className="text-[11px] text-gray-500">Fastest air express shipping option</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-gray-900 dark:text-white">{formatCurrency(299)}</span>
                </label>
              </div>

              <div className="pt-4 flex justify-between">
                <button onClick={() => setStep(1)} className="text-xs font-bold text-gray-500 hover:underline">
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 rounded-2xl bg-brand-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-brand-700"
                >
                  Continue to Payment <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT */}
          {step === 3 && (
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-6">
              <h2 className="flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white">
                <CreditCard className="h-5 w-5 text-brand-600" /> Step 3: Payment Method
              </h2>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {[
                  { id: 'CARD', label: 'Card / Stripe', icon: CreditCard },
                  { id: 'UPI', label: 'UPI Instant', icon: Smartphone },
                  { id: 'NET_BANKING', label: 'Net Banking', icon: Building },
                  { id: 'WALLET', label: 'Wallets', icon: Wallet },
                  { id: 'COD', label: 'Cash on Delivery', icon: Banknote },
                ].map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentMethod(p.id as any)}
                      className={`flex flex-col items-center justify-center rounded-2xl border p-3.5 text-center transition-all ${
                        paymentMethod === p.id
                          ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-md dark:bg-brand-950 dark:text-brand-300'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-800 dark:text-gray-400'
                      }`}
                    >
                      <Icon className="h-5 w-5 mb-1 text-brand-600 dark:text-brand-400" />
                      <span className="text-[11px] font-bold">{p.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Payment Details Subform */}
              {paymentMethod === 'CARD' && (
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-3 dark:border-gray-800 dark:bg-gray-800/40 text-xs">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">
                    🔒 256-bit Encrypted Checkout via Stripe Integration
                  </span>
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="rounded-xl border border-gray-200 bg-white p-2.5 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="CVC / CVV"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="rounded-xl border border-gray-200 bg-white p-2.5 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'UPI' && (
                <div className="rounded-2xl bg-gray-50 p-4 text-xs dark:bg-gray-800/40">
                  <p className="font-bold text-gray-900 dark:text-white">Pay via UPI QR Code / ID</p>
                  <p className="text-gray-500 mt-1">GPay, PhonePe, Paytm, BHIM supported. Scan QR upon order placement.</p>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button onClick={() => setStep(2)} className="text-xs font-bold text-gray-500 hover:underline">
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex items-center gap-2 rounded-2xl bg-brand-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-brand-700"
                >
                  Review Order <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & PLACE ORDER */}
          {step === 4 && (
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-6">
              <h2 className="flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white">
                <ShieldCheck className="h-5 w-5 text-brand-600" /> Step 4: Final Order Review
              </h2>

              {/* Items summary */}
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 text-xs">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{item.product.name}</p>
                      <p className="text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold">{formatCurrency(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-between">
                <button onClick={() => setStep(3)} className="text-xs font-bold text-gray-500 hover:underline">
                  Back to Payment
                </button>
                <button
                  disabled={processing}
                  onClick={handlePlaceOrder}
                  className="flex items-center gap-2 rounded-2xl bg-amber-400 px-8 py-3.5 text-sm font-extrabold text-gray-950 shadow-xl transition-all hover:bg-amber-300 disabled:opacity-50"
                >
                  {processing ? 'Processing Order...' : `Pay & Place Order (${formatCurrency(grandTotal)})`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Summary Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
            <h3 className="text-base font-black text-gray-900 dark:text-white border-b border-gray-100 pb-3 dark:border-gray-800">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between font-bold text-emerald-600">
                  <span>Coupon Discount</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Shipping ({shippingSpeed})</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax (8%)</span>
                <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-black text-gray-900 dark:border-gray-800 dark:text-white">
                <span>Grand Total</span>
                <span className="text-brand-600 dark:text-brand-400">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
