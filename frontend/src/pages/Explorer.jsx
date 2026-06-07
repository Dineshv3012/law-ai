import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAllRights } from '../api'

const CATEGORIES = [
  { key: 'all', label: 'All Rights', icon: 'category' },
  { key: 'civil', label: 'Civil', icon: 'balance', color: 'text-primary' },
  { key: 'labor', label: 'Labor', icon: 'engineering', color: 'text-secondary' },
  { key: 'consumer', label: 'Consumer', icon: 'shopping_bag', color: 'text-tertiary' },
  { key: 'digital', label: 'Digital', icon: 'devices', color: 'text-primary' },
]

export default function Explorer() {
  const [searchParams] = useSearchParams()
  const [data, setData] = useState(null)
  const [activeCategory, setActiveCategory] = useState(searchParams.get('cat') || 'all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getAllRights().then(setData)
  }, [])

  const getArticles = () => {
    if (!data) return []
    const src = activeCategory === 'all'
      ? Object.entries(data.data).flatMap(([catKey, cat]) =>
          cat.articles.map(a => ({ ...a, category: cat.title, catKey, catColor: cat.color }))
        )
      : (data.data[activeCategory]?.articles || []).map(a => ({
          ...a,
          category: data.data[activeCategory].title,
          catKey: activeCategory,
          catColor: data.data[activeCategory].color,
        }))

    if (!search) return src
    return src.filter(a =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase()) ||
      a.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
    )
  }

  const articles = getArticles()

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <span className="material-symbols-outlined text-[14px]">explore</span>
            Rights Explorer
          </div>
          <h1 className="text-4xl font-bold text-inverse-surface font-headline mb-3">Know Your Rights</h1>
          <p className="text-on-surface-variant max-w-xl">Browse and search across all categories of citizen rights with plain-language explanations.</p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">search</span>
          <input
            type="text"
            placeholder="Search rights, topics, or keywords..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant/30 rounded-xl pl-12 pr-4 py-4 text-on-surface placeholder-outline focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                activeCategory === c.key
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-container border-outline-variant/20 text-on-surface-variant hover:border-primary/40 hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex gap-8">
          {/* Article list */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
            {!data && (
              <div className="col-span-2 text-center py-20 text-on-surface-variant">
                <span className="material-symbols-outlined text-5xl mb-3 block">hourglass_empty</span>
                Loading rights data...
              </div>
            )}
            {data && articles.length === 0 && (
              <div className="col-span-2 text-center py-20 text-on-surface-variant">
                <span className="material-symbols-outlined text-5xl mb-3 block">search_off</span>
                No results found for "{search}"
              </div>
            )}
            {articles.map(a => (
              <div
                key={a.id}
                onClick={() => setSelected(a)}
                className={`bg-surface-container rounded-xl p-6 border cursor-pointer card-hover ${
                  selected?.id === a.id ? 'border-primary/60' : 'border-outline-variant/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {a.category}
                  </span>
                </div>
                <h3 className="text-inverse-surface font-semibold font-headline mb-2">{a.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-3">{a.summary}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {a.tags?.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-surface-container-high text-outline border border-outline-variant/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-28 bg-surface-container rounded-xl border border-outline-variant/20 p-6">
                <button
                  onClick={() => setSelected(null)}
                  className="text-outline hover:text-on-surface mb-4 flex items-center gap-1 text-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span> Close
                </button>
                <div className="text-xs font-semibold text-primary mb-2">{selected.category}</div>
                <h2 className="text-xl font-bold text-inverse-surface font-headline mb-4">{selected.title}</h2>
                <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg mb-4">
                  <p className="text-on-surface-variant text-sm leading-relaxed">{selected.summary}</p>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selected.tags?.map(t => (
                    <span key={t} className="text-xs px-2 py-1 rounded-full bg-surface-container-high text-on-surface-variant border border-outline-variant/20">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary text-[14px] align-middle mr-1">info</span>
                  This is a simplified summary. Consult a legal professional for advice specific to your situation.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
