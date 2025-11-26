// src/pages/Dashboard.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { listLinks, deleteLink } from '../api';
import AddLinkForm from '../components/AddLinkForm';
import LinkTable from '../components/LinkTable';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(''); // 🔍 search term

  async function loadLinks() {
    try {
      setLoading(true);
      setError('');
      const res = await listLinks();
      setLinks(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load links');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLinks();
  }, []);

  async function handleDelete(code) {
    try {
      await deleteLink(code);
      loadLinks();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  }

  // 🔍 Filtered links (by code OR URL)
  const filteredLinks = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return links;

    return links.filter((l) => {
      const code = (l.code || '').toLowerCase();
      const url = (l.url || '').toLowerCase();
      return code.includes(q) || url.includes(q);
    });
  }, [links, search]);

  return (
    <div className="space-y-6">
      {/* Create link */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
          Create new short link
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-4">
          Provide a long URL and an optional custom code to generate a short link.
        </p>
        <AddLinkForm onCreated={loadLinks} />
      </section>

      {/* List + search */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">
              All links
            </h2>
            {!loading && (
              <p className="text-xs text-slate-500 mt-1">
                Showing {filteredLinks.length} of {links.length} links
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* 🔁 Refresh button */}
            {!loading && (
              <button
                onClick={loadLinks}
                type="button"
                className="hidden sm:inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Refresh
              </button>
            )}

            {/* 🔍 Search box */}
            <div className="relative w-full sm:w-64">
              <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-slate-400 text-xs">
                🔍
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by code or URL"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 pl-7 pr-3 py-1.5 text-xs sm:text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-sm text-slate-500">Loading...</div>
        ) : filteredLinks.length === 0 ? (
          <div className="text-sm text-slate-500">
            No links match your search.
          </div>
        ) : (
          <LinkTable links={filteredLinks} onDelete={handleDelete} />
        )}
      </section>
    </div>
  );
}
