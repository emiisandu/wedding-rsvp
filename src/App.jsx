import { Parallax } from 'react-scroll-parallax';
import { motion } from 'framer-motion';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100">
      {/* Hero section */}
      <header className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight mb-4">
          Alex &amp; Sam
        </h1>
        <p className="text-lg sm:text-xl opacity-80 mb-2">
          We&apos;re getting married!
        </p>
        <p className="text-sm sm:text-base opacity-60 mb-8">
          21 June 2025 · Bucharest, Romania
        </p>

        <a
          href="#rsvp"
          className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-medium bg-white text-slate-900 hover:bg-slate-200 transition"
        >
          RSVP
        </a>
      </header>

      {/* Info section */}
      <section id="details" className="px-6 py-16 max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold mb-2">Wedding Details</h2>
        <p className="opacity-80">
          Here you can add information about the ceremony, reception, dress code,
          and anything else your guests should know.
        </p>
      </section>

      {/* RSVP section */}
      <section
        id="rsvp"
        className="px-6 py-16 max-w-xl mx-auto border-t border-slate-800"
      >
        <h2 className="text-2xl font-semibold mb-4">RSVP</h2>
        <p className="opacity-80 mb-6">
          Please let us know if you&apos;ll be joining us.
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="guests">
              Number of guests (including you)
            </label>
            <input
              id="guests"
              name="guests"
              type="number"
              min="1"
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="notes">
              Notes (allergies, song requests, etc.)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-medium bg-white text-slate-900 hover:bg-slate-200 transition"
          >
            Send RSVP
          </button>
        </form>
      </section>
    </div>
  );
}

export default App;
