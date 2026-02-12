'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function SubmitSalary() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [form, setForm] = useState({
    company: '',
    title: '',
    function: '',
    years_of_experience: '',
    city: '',
    country: 'USA',
    remote_status: 'hybrid',
    base_salary: '',
    bonus_target: '',
    equity_value: '',
    equity_type: 'RSU',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    
    // First, get or create company
    let { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('canonical_name', form.company.toLowerCase().trim())
      .single()

    if (!company) {
      const { data: newCompany } = await supabase
        .from('companies')
        .insert({ 
          name: form.company, 
          canonical_name: form.company.toLowerCase().trim() 
        })
        .select('id')
        .single()
      company = newCompany
    }

    // Insert salary entry
    const totalComp = 
      (parseInt(form.base_salary) || 0) + 
      (parseInt(form.bonus_target) || 0) + 
      (parseInt(form.equity_value) || 0)

    const { error } = await supabase.from('salary_entries').insert({
      company_id: company?.id,
      title: form.title,
      function: form.function,
      years_of_experience: parseFloat(form.years_of_experience) || null,
      city: form.city,
      country: form.country,
      remote_status: form.remote_status,
      base_salary: parseInt(form.base_salary) || null,
      bonus_target: parseInt(form.bonus_target) || null,
      equity_value: parseInt(form.equity_value) || null,
      equity_type: form.equity_type,
      total_compensation: totalComp || null,
      as_of_date: new Date().toISOString().split('T')[0],
    })

    setLoading(false)
    if (!error) setSuccess(true)
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold mb-2">Thanks for contributing!</h1>
        <p className="text-gray-600">Your data helps everyone make better decisions.</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">Add Your Salary</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company & Role */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              required
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Google"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Senior Engineer"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Function</label>
            <select
              value={form.function}
              onChange={(e) => setForm({ ...form, function: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select...</option>
              <option value="engineering">Engineering</option>
              <option value="product">Product</option>
              <option value="design">Design</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
              <option value="finance">Finance</option>
              <option value="operations">Operations</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
            <input
              type="number"
              step="0.5"
              value={form.years_of_experience}
              onChange={(e) => setForm({ ...form, years_of_experience: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="5"
            />
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="San Francisco"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remote</label>
            <select
              value={form.remote_status}
              onChange={(e) => setForm({ ...form, remote_status: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="onsite">Onsite</option>
              <option value="hybrid">Hybrid</option>
              <option value="remote">Remote</option>
            </select>
          </div>
        </div>

        {/* Compensation */}
        <div className="border-t pt-6">
          <h3 className="font-medium mb-4">Compensation (USD/year)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Salary</label>
              <input
                type="number"
                value={form.base_salary}
                onChange={(e) => setForm({ ...form, base_salary: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="150000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bonus (Target)</label>
              <input
                type="number"
                value={form.bonus_target}
                onChange={(e) => setForm({ ...form, bonus_target: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="30000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Equity (Annual)</label>
              <input
                type="number"
                value={form.equity_value}
                onChange={(e) => setForm({ ...form, equity_value: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="50000"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Salary'}
        </button>
      </form>
    </div>
  )
}
