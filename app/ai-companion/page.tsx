'use client';

import { useState } from 'react';

export default function AICompanionPage() {
  const [currentShop, setCurrentShop] = useState('');
  const [newShop, setNewShop] = useState('');
  const [role, setRole] = useState('stylist');
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generatePlan() {
    setLoading(true);
    setPlan(null);

    const res = await fetch('/api/ai-companion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentShop, newShop, role }),
    });

    const data = await res.json();
    setPlan(data.plan);
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">AI Companion: Move Guide</h1>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Current Shop"
          value={currentShop}
          onChange={(e) => setCurrentShop(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="New Shop"
          value={newShop}
          onChange={(e) => setNewShop(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="stylist">Stylist</option>
          <option value="barber">Barber</option>
          <option value="salon owner">Salon Owner</option>
        </select>
        <button
          onClick={generatePlan}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          {loading ? 'Generating...' : 'Generate Guide'}
        </button>
      </div>

      {plan && (
        <div className="mt-8 p-6 border rounded-lg bg-gray-50 whitespace-pre-line">
          {plan}
        </div>
      )}
    </div>
  );
}
