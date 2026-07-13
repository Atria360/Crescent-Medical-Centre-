"use client";

import { useState } from "react";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <div className="space-y-4">
      {faqs.map((faq) => {
        const isOpen = open === faq.id;
        return (
          <div key={faq.id} className="card overflow-hidden border border-gray-100">
            <button
              onClick={() => setOpen(isOpen ? null : faq.id)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="text-[15px] font-bold">{faq.question}</span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-transform ${
                  isOpen ? "rotate-180 bg-brand-red" : "bg-teal"
                }`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div className="bg-teal px-6 py-5 text-sm leading-relaxed text-white">
                <p className="whitespace-pre-line">{faq.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
