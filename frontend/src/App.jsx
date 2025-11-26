import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CodeStats from './pages/CodeStats';
import Health from './pages/Health';
import { Analytics } from "@vercel/analytics/react"

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              T
            </span>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">TinyLink</h1>
              <p className="text-xs text-slate-500">Simple URL shortener dashboard</p>
            </div>
          </div>

          <nav className="flex items-center gap-4 text-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-2 py-1 rounded-md ${
                  isActive
                    ? 'text-indigo-600 font-medium bg-indigo-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/health"
              className={({ isActive }) =>
                `px-2 py-1 rounded-md ${
                  isActive
                    ? 'text-indigo-600 font-medium bg-indigo-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              Health
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/code/:code" element={<CodeStats />} />
          <Route path="/health" element={<Health />} />
        </Routes>
      </main>
      <Analytics/>
    </div>
  );
}
