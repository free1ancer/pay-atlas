'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type SalaryEntry = {
  id: string
  title: string
  total_compensation: number | null
  years_of_experience: number | null
  company: { name: string } | null
  function: string | null
}

export default function Explore() {
  const [entries, setEntries] = useState<SalaryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    function: '',
    company: '',
  })

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      
      let query = supabase
        .from('salary_entries')
        .select(`
          id,
          title,
          total_compensation,
          years_of_experience,
          function,
          company:companies(name)
        `)
        .not('total_compensation', 'is', null)
        .order('total_compensation', { ascending: false })
        .limit(500)

      if (filters.function) {
        query = query.eq('function', filters.function)
      }

      const { data } = await query
      setEntries(data || [])
      setLoading(false)
    }

    fetchData()
  }, [filters])

  const chartData = entries
    .filter(e => e.years_of_experience && e.total_compensation)
    .map(e => ({
      x: e.years_of_experience,
      y: e.total_compensation,
      title: e.title,
      company: e.company?.name || 'Unknown',
    }))

  const formatCurrency = (value: number) => 
    `$${(value / 1000).toFixed(0)}k`

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">Explore Salaries</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-8">
        <select
          value={filters.function}
          onChange={(e) => setFilters({ ...filters, function: e.target.value })}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">All Functions</option>
          <option value="engineering">Engineering</option>
          <option value="product">Product</option>
          <option value="design">Design</option>
          <option value="sales">Sales</option>
          <option value="finance">Finance</option>
        </select>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="font-semibold mb-4">Total Compensation vs Experience</h2>
        {loading ? (
          <div className="h-80 flex items-center justify-center text-gray-400">
            Loading...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-gray-400">
            No data yet. Be the first to contribute!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="x" 
                name="Years" 
                unit=" yrs"
                type="number"
                domain={[0, 'auto']}
              />
              <YAxis 
                dataKey="y" 
                name="Total Comp" 
                tickFormatter={formatCurrency}
                type="number"
                domain={[0, 'auto']}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(value) => `${value} years`}
                content={({ payload }) => {
                  if (!payload?.length) return null
                  const d = payload[0].payload
                  return (
                    <div className="bg-white border shadow-lg rounded-lg p-3 text-sm">
                      <div className="font-medium">{d.title}</div>
                      <div className="text-gray-600">{d.company}</div>
                      <div className="text-indigo-600 font-medium">
                        {formatCurrency(d.y)} TC
                      </div>
                      <div className="text-gray-500">{d.x} years exp</div>
                    </div>
                  )
                }}
              />
              <Scatter 
                data={chartData} 
                fill="#4f46e5"
                fillOpacity={0.6}
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Company</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Title</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Function</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">YOE</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Total Comp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.slice(0, 20).map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{entry.company?.name || '—'}</td>
                <td className="px-6 py-4 text-sm font-medium">{entry.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500 capitalize">{entry.function || '—'}</td>
                <td className="px-6 py-4 text-sm text-right">{entry.years_of_experience || '—'}</td>
                <td className="px-6 py-4 text-sm text-right font-medium text-indigo-600">
                  {entry.total_compensation ? formatCurrency(entry.total_compensation) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {entries.length === 0 && !loading && (
          <div className="px-6 py-12 text-center text-gray-400">
            No salary data yet. Be the first to contribute!
          </div>
        )}
      </div>
    </div>
  )
}
