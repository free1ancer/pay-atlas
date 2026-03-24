'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type SalaryEntry = {
  id: string
  title: string
  total_compensation: number | null
  years_of_experience: number | null
  company: { name: string }[] | null
  function: string | null
  city: string | null
  country: string | null
  region: string | null
}

type Company = {
  id: string
  name: string
}

type SearchCategory = 'company' | 'education' | 'function'

const FUNCTIONS = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'product', label: 'Product' },
  { value: 'design', label: 'Design' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
  { value: 'data', label: 'Data Science' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'legal', label: 'Legal' },
]

const EDUCATION_TIERS = [
  { value: 'ivy_league', label: 'Ivy League', schools: ['Harvard', 'Yale', 'Princeton', 'Columbia', 'Penn', 'Brown', 'Dartmouth', 'Cornell'] },
  { value: 'top_cs', label: 'Top CS Programs', schools: ['MIT', 'Stanford', 'Carnegie Mellon', 'Berkeley', 'Georgia Tech'] },
  { value: 'top_mba', label: 'Top MBA Programs', schools: ['Harvard Business', 'Stanford GSB', 'Wharton', 'Kellogg', 'Booth'] },
  { value: 'state_schools', label: 'State Universities', schools: ['UCLA', 'Michigan', 'UT Austin', 'UW', 'UIUC'] },
]

const COUNTRIES = ['USA', 'United Kingdom', 'Canada', 'Germany', 'India', 'Australia', 'France', 'Netherlands', 'Singapore', 'Japan']
const REGIONS = ['West Coast', 'East Coast', 'Midwest', 'South', 'Europe', 'Asia Pacific', 'Remote']

export default function Explore() {
  const [entries, setEntries] = useState<SalaryEntry[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  
  const [searchCategory, setSearchCategory] = useState<SearchCategory>('company')
  const [searchQuery, setSearchQuery] = useState('')
  
  const [filters, setFilters] = useState({
    company: '',
    function: '',
    education: '',
    country: '',
    region: '',
    city: '',
  })

  // Fetch companies for search
  useEffect(() => {
    async function fetchCompanies() {
      const supabase = createClient()
      const { data } = await supabase
        .from('companies')
        .select('id, name')
        .order('name')
      setCompanies(data || [])
    }
    fetchCompanies()
  }, [])

  // Fetch salary data
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const supabase = createClient()
      
      let query = supabase
        .from('salary_entries')
        .select(`
          id,
          title,
          total_compensation,
          years_of_experience,
          function,
          city,
          country,
          region,
          company:companies(name)
        `)
        .not('total_compensation', 'is', null)
        .order('total_compensation', { ascending: false })
        .limit(500)

      if (filters.function) {
        query = query.eq('function', filters.function)
      }
      if (filters.country) {
        query = query.eq('country', filters.country)
      }
      if (filters.region) {
        query = query.eq('region', filters.region)
      }
      if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`)
      }

      const { data } = await query
      setEntries((data as SalaryEntry[]) || [])
      setLoading(false)
    }

    fetchData()
  }, [filters])

  // Filter entries based on search
  const filteredEntries = useMemo(() => {
    if (!searchQuery) return entries
    
    const query = searchQuery.toLowerCase()
    
    return entries.filter(entry => {
      if (searchCategory === 'company') {
        return entry.company?.[0]?.name?.toLowerCase().includes(query)
      }
      if (searchCategory === 'function') {
        return entry.function?.toLowerCase().includes(query) || 
               entry.title?.toLowerCase().includes(query)
      }
      // Education filter would need additional data
      return true
    })
  }, [entries, searchQuery, searchCategory])

  // Search suggestions
  const searchSuggestions = useMemo(() => {
    if (searchCategory === 'company') {
      return companies
        .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5)
        .map(c => c.name)
    }
    if (searchCategory === 'function') {
      return FUNCTIONS
        .filter(f => f.label.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(f => f.label)
    }
    if (searchCategory === 'education') {
      return EDUCATION_TIERS
        .filter(e => e.label.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(e => e.label)
    }
    return []
  }, [searchQuery, searchCategory, companies])

  const chartData = filteredEntries
    .filter(e => e.years_of_experience && e.total_compensation)
    .map(e => ({
      x: e.years_of_experience,
      y: e.total_compensation,
      title: e.title,
      company: e.company?.[0]?.name || 'Unknown',
    }))

  const formatCurrency = (value: number) => 
    `$${(value / 1000).toFixed(0)}k`

  const handleCategorySelect = (value: string) => {
    setSearchQuery(value)
    if (searchCategory === 'function') {
      const func = FUNCTIONS.find(f => f.label === value)
      if (func) {
        setFilters(prev => ({ ...prev, function: func.value }))
      }
    }
  }

  const clearFilters = () => {
    setFilters({
      company: '',
      function: '',
      education: '',
      country: '',
      region: '',
      city: '',
    })
    setSearchQuery('')
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (searchQuery ? 1 : 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground">Explore Salaries</h1>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear filters ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setSearchCategory('company'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              searchCategory === 'company'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            By Company
          </button>
          <button
            onClick={() => { setSearchCategory('education'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              searchCategory === 'education'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            By University / Degree
          </button>
          <button
            onClick={() => { setSearchCategory('function'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              searchCategory === 'function'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            By Function
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              searchCategory === 'company' ? 'Search companies (e.g., Google, Meta, Apple)...' :
              searchCategory === 'education' ? 'Search universities or degree programs...' :
              'Search job functions (e.g., Engineering, Product, Design)...'
            }
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          
          {/* Search Suggestions Dropdown */}
          {searchQuery && searchSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
              {searchSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCategorySelect(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-muted text-sm text-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Select for current category */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3">
            {searchCategory === 'company' && 'Popular Companies'}
            {searchCategory === 'education' && 'Education Categories'}
            {searchCategory === 'function' && 'Job Functions'}
          </p>
          <div className="flex flex-wrap gap-2">
            {searchCategory === 'company' && (
              <>
                {['Google', 'Meta', 'Apple', 'Amazon', 'Microsoft', 'Netflix', 'Stripe', 'Airbnb'].map(company => (
                  <button
                    key={company}
                    onClick={() => setSearchQuery(company)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      searchQuery === company
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-foreground border-border hover:border-primary'
                    }`}
                  >
                    {company}
                  </button>
                ))}
              </>
            )}
            {searchCategory === 'education' && (
              <>
                {EDUCATION_TIERS.map(tier => (
                  <button
                    key={tier.value}
                    onClick={() => setSearchQuery(tier.label)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      searchQuery === tier.label
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-foreground border-border hover:border-primary'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </>
            )}
            {searchCategory === 'function' && (
              <>
                {FUNCTIONS.slice(0, 8).map(func => (
                  <button
                    key={func.value}
                    onClick={() => {
                      setSearchQuery(func.label)
                      setFilters(prev => ({ ...prev, function: func.value }))
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      filters.function === func.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-foreground border-border hover:border-primary'
                    }`}
                  >
                    {func.label}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Geographic Filters */}
        <div className="border-t border-border pt-6">
          <p className="text-sm text-muted-foreground mb-3">Filter by Location</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Country</label>
              <select
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground text-sm"
              >
                <option value="">All Countries</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Region</label>
              <select
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground text-sm"
              >
                <option value="">All Regions</option>
                {REGIONS.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">City</label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                placeholder="e.g., San Francisco"
                className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground text-sm placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredEntries.length}</span> results
          {searchQuery && (
            <span> for &quot;{searchQuery}&quot;</span>
          )}
        </p>
      </div>

      {/* Chart */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-8">
        <h2 className="font-semibold mb-4 text-foreground">Total Compensation vs Experience</h2>
        {loading ? (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            Loading...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            No data matches your filters. Try broadening your search.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey="x" 
                name="Years" 
                unit=" yrs"
                type="number"
                domain={[0, 'auto']}
                tick={{ fill: 'var(--muted-foreground)' }}
              />
              <YAxis 
                dataKey="y" 
                name="Total Comp" 
                tickFormatter={formatCurrency}
                type="number"
                domain={[0, 'auto']}
                tick={{ fill: 'var(--muted-foreground)' }}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(value) => `${value} years`}
                content={({ payload }) => {
                  if (!payload?.length) return null
                  const d = payload[0].payload
                  return (
                    <div className="bg-card border border-border shadow-lg rounded-lg p-3 text-sm">
                      <div className="font-medium text-foreground">{d.title}</div>
                      <div className="text-muted-foreground">{d.company}</div>
                      <div className="text-primary font-medium">
                        {formatCurrency(d.y)} TC
                      </div>
                      <div className="text-muted-foreground">{d.x} years exp</div>
                    </div>
                  )
                }}
              />
              <Scatter 
                data={chartData} 
                fill="var(--primary)"
                fillOpacity={0.6}
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Company</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Title</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Function</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Location</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">YOE</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">Total Comp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredEntries.slice(0, 20).map((entry) => (
              <tr key={entry.id} className="hover:bg-muted/50">
                <td className="px-6 py-4 text-sm text-foreground">{entry.company?.[0]?.name || '—'}</td>
                <td className="px-6 py-4 text-sm font-medium text-foreground">{entry.title}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground capitalize">{entry.function || '—'}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {[entry.city, entry.country].filter(Boolean).join(', ') || '—'}
                </td>
                <td className="px-6 py-4 text-sm text-right text-foreground">{entry.years_of_experience || '—'}</td>
                <td className="px-6 py-4 text-sm text-right font-medium text-primary">
                  {entry.total_compensation ? formatCurrency(entry.total_compensation) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredEntries.length === 0 && !loading && (
          <div className="px-6 py-12 text-center text-muted-foreground">
            No salary data matches your filters. Try adjusting your search criteria.
          </div>
        )}
        {filteredEntries.length > 20 && (
          <div className="px-6 py-4 bg-muted text-center text-sm text-muted-foreground">
            Showing 20 of {filteredEntries.length} results. Refine your search to see more specific data.
          </div>
        )}
      </div>
    </div>
  )
}
