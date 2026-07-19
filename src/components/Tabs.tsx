"use client";

import { useState } from "react";

export function Tabs({
  tabs,
}: {
  tabs: { id: string; label: string; content: React.ReactNode }[];
}) {
  const [active, setActive] = useState(tabs[0]?.id);
  const activeTab = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Property profile sections"
        className="flex gap-1 overflow-x-auto border-b border-border"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={tab.id === activeTab?.id}
            onClick={() => setActive(tab.id)}
            className={`shrink-0 whitespace-nowrap border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors ${
              tab.id === activeTab?.id
                ? "border-brand-700 text-brand-800"
                : "border-transparent text-muted hover:text-body"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-5">{activeTab?.content}</div>
    </div>
  );
}
