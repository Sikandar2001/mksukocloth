import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-black/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="text-sm font-extrabold tracking-wide text-zinc-900">CUSTOMER SERVICE</div>
            <ul className="mt-3 space-y-2 text-sm text-zinc-800">
              {[
                "Track my order",
                "FAQ",
                "Find a store",
                "Jeans fit guide",
                "Certified tailors",
                "Gift cards",
                "Unidays",
              ].map((t) => (
                <li key={t}>
                  <Link href="#" className="hover:underline">
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-extrabold tracking-wide text-zinc-900">LEGAL</div>
            <ul className="mt-3 space-y-2 text-sm text-zinc-800">
              {[
                "Terms & conditions",
                "Privacy policy",
                "Terms of use",
                "Cookie statement",
                "Choose cookies",
                "Accessibility statement",
                "Brand protection",
                "Complaints",
                "Sitemap",
                "Contact details",
              ].map((t) => (
                <li key={t}>
                  <Link href="#" className="hover:underline">
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-extrabold tracking-wide text-zinc-900">COMPANY</div>
            <ul className="mt-3 space-y-2 text-sm text-zinc-800">
              {[
                "Get the app",
                "CLUB‑G",
                "Newsletter",
                "Stories",
                "Outlet",
                "About G‑STAR",
                "Sustainability",
                "Careers",
                "Press room",
              ].map((t) => (
                <li key={t}>
                  <Link href="#" className="hover:underline">
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-extrabold tracking-wide text-zinc-900">CLUB‑G JOIN AND GET 15% OFF</div>
            <p className="mt-2 text-sm text-zinc-700">
              Join the inner circle and unlock the doors to our world of denim. From personal gifts and giveaways, to exclusive events and special services.
            </p>
            <div className="mt-3 flex gap-2">
              <input
                type="email"
                placeholder="Enter your e-mail address"
                className="min-w-0 flex-1 rounded border border-black/20 px-3 py-2 text-sm outline-none placeholder:text-zinc-400"
              />
              <button className="rounded bg-black px-4 py-2 text-sm font-medium text-white">subscribe</button>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-black/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-4 text-zinc-700">
              <Link href="#" aria-label="LinkedIn" className="rounded p-1 hover:bg-black/5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M4.98 3.5C4.98 4.6 4.07 5.5 2.99 5.5S1 4.6 1 3.5C1 2.4 1.91 1.5 2.99 1.5S4.98 2.4 4.98 3.5zM1.2 8h3.6v12H1.2V8zM8.1 8h3.4v1.6h.1c.5-.9 1.7-1.8 3.5-1.8 3.7 0 4.4 2.4 4.4 5.5V20H16V14c0-1.4 0-3.2-1.9-3.2-1.9 0-2.2 1.5-2.2 3.1V20H8.1V8z" />
                </svg>
              </Link>
              <Link href="#" aria-label="YouTube" className="rounded p-1 hover:bg-black/5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.4.6A3 3 0 0 0 .5 6.2 31.1 31.1 0 0 0 0 12a31.1 31.1 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c2 .6 9.4.6 9.4.6s7.4 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.1 31.1 0 0 0 24 12a31.1 31.1 0 0 0-.5-5.8zM9.8 15.5v-7l6.4 3.5-6.4 3.5z" />
                </svg>
              </Link>
              <Link href="#" aria-label="Instagram" className="rounded p-1 hover:bg-black/5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm0 2a3 3 0 1 1-.001 6.001A3 3 0 0 1 12 9zm4.8-.9a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2z" />
                </svg>
              </Link>
              <Link href="#" aria-label="TikTok" className="rounded p-1 hover:bg-black/5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M20 8.2c-2 0-3.8-1-4.8-2.6v9.1A5.3 5.3 0 1 1 9.9 9.7v2.4A2.9 2.9 0 1 0 12.6 15V3h2.6a5.9 5.9 0 0 0 4.8 2.4v2.8z" />
                </svg>
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-700 sm:justify-end">
              {["iDEAL", "Klarna", "PayPal", "American Express", "Mastercard", "VISA", "Apple Pay"].map((p) => (
                <span key={p} className="rounded border border-black/15 px-2 py-1">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
