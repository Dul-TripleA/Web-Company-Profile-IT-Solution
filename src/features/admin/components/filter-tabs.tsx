import Link from 'next/link';

type Tab = { href: string; label: string; active: boolean; count?: number };

/** Filter berbentuk pil (tautan biasa, jadi bisa dibuka di tab baru dan dibagikan). */
export function FilterTabs({ tabs, label }: { tabs: Tab[]; label: string }) {
  return (
    <nav aria-label={label} className="-mx-1 overflow-x-auto px-1">
      <ul className="flex gap-2">
        {tabs.map((tab) => (
          <li key={tab.href}>
            <Link
              href={tab.href}
              aria-current={tab.active ? 'page' : undefined}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors pointer-coarse:min-h-11 ${
                tab.active
                  ? 'bg-forest-deep text-white'
                  : 'bg-white text-slate-800 ring-1 ring-slate-300 hover:bg-slate-50'
              }`}
            >
              {tab.label}
              {tab.count !== undefined ? (
                <span className={tab.active ? 'text-brand' : 'text-slate-600'}>{tab.count}</span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
