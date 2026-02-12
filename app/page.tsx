import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Hero */}
      <section className="py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Know Your Worth
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Crowdsourced salary data from real professionals. 
          Benchmark your compensation, negotiate better, make informed career decisions.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/explore"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700"
          >
            Explore Salaries
          </Link>
          <Link 
            href="/submit"
            className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-50"
          >
            Add Your Salary
          </Link>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-3xl mb-4">📊</div>
          <h3 className="text-lg font-semibold mb-2">Rich Data</h3>
          <p className="text-gray-600">
            Base, bonus, equity, benefits — the full picture, not just base salary.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-3xl mb-4">🏢</div>
          <h3 className="text-lg font-semibold mb-2">Company Levels</h3>
          <p className="text-gray-600">
            See how titles map across companies and what each level pays.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-3xl mb-4">🎓</div>
          <h3 className="text-lg font-semibold mb-2">Education Analytics</h3>
          <p className="text-gray-600">
            Does an MBA pay off? Compare outcomes by school and degree.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center bg-indigo-50 rounded-2xl mb-16">
        <h2 className="text-2xl font-bold mb-4">Transparency benefits everyone</h2>
        <p className="text-gray-600 mb-6">
          The more data we have, the better insights for all. Contribute anonymously.
        </p>
        <Link 
          href="/submit"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700"
        >
          Add Your Salary →
        </Link>
      </section>
    </div>
  )
}
