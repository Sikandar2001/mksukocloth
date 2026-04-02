export default function Homep() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-black text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
              <path d="M4 16c0-5.523 3.582-10 8-10s8 4.477 8 10" />
              <path d="M6 18h12" />
            </svg>
          </span>
          <p className="text-sm font-medium text-black">Discover Classic Denim</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-black text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
              <path d="M6 6h15l-1.5 9H7.5L6 6Z" />
              <path d="M6 6H4" />
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
            </svg>
          </span>
          <p className="text-sm text-black">Free shipping for subscribers</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-black text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
              <path d="M3 7h18v12H3z" />
              <path d="M3 7l4-4h10l4 4" />
            </svg>
          </span>
          <p className="text-sm text-black">60-day return period for all orders</p>
        </div>
      </div>
    </main>
  );
}

