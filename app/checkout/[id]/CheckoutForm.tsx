'use client'

import React, { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Listing {
  id: string
  title: string
  shop: string
  location: string
  price: number
}

interface CheckoutFormInnerProps {
  listing: Listing
}

function CheckoutFormInner({ listing }: CheckoutFormInnerProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!stripe || !elements) return

    if (!startTime || !endTime) {
      setError('Please select start and end times')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listing.id,
          start_time: startTime,
          end_time: endTime,
          price: listing.price,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Booking failed')

      const clientSecret = data.clientSecret
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) throw new Error('Card element not found')

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      })

      if (stripeError) {
        setError(stripeError.message || 'Payment failed')
        setLoading(false)
        return
      }

      if (paymentIntent?.status === 'succeeded') {
        router.push('/booking-success')
      }
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-6 border rounded">
      <h1 className="text-2xl font-semibold">{listing.title}</h1>
      <p className="text-gray-600">{listing.shop} · {listing.location}</p>
      <p className="text-blue-600 font-medium">${listing.price}</p>

      <label>
        Start Time
        <input
          type="datetime-local"
          value={startTime}
          onChange={e => setStartTime(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          required
        />
      </label>

      <label>
        End Time
        <input
          type="datetime-local"
          value={endTime}
          onChange={e => setEndTime(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          required
        />
      </label>

      <label>
        Payment Details
        <div className="border rounded p-3 mt-1">
          <CardElement />
        </div>
      </label>

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay & Book'}
      </button>
    </form>
  )
}

interface CheckoutFormProps {
  listing: Listing
}

export default function CheckoutForm({ listing }: CheckoutFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormInner listing={listing} />
    </Elements>
  )
}
