import React from 'react';
import { Link } from 'react-router-dom';

const SHORT_BASE =
  import.meta.env.VITE_SHORT_BASE ||
  import.meta.env.VITE_API_BASE ||
  'http://localhost:4000';

function normalizeBase(url) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function truncated(url, limit = 60) {
  if (!url) return '';
  return url.length > limit ? url.slice(0, limit - 3) + '…' : url;
}

export default function LinkTable({ links, onDelete }) {
  function getShortUrl(code) {
    return `${normalizeBase(SHORT_BASE)}/${code}`;
  }

  function handleCopy(code) {
    const shortUrl = getShortUrl(code);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shortUrl);
    } else {
      window.prompt('Copy this URL:', shortUrl);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-3 py-2">Code</th>
            <th className="px-3 py-2">Target</th>
            <th className="px-3 py-2">Clicks</th>
            <th className="px-3 py-2">Last clicked</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {links.map((l) => (
            <tr key={l.code} className="hover:bg-slate-50">
              <td className="px-3 py-2">
                <a
                  href={getShortUrl(l.code)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs sm:text-sm text-indigo-600 hover:text-indigo-800"
                >
                  {l.code}
                </a>
              </td>
              <td className="px-3 py-2 text-xs text-slate-700" title={l.url}>
                {truncated(l.url)}
              </td>
              <td className="px-3 py-2 text-slate-800">{l.clicks}</td>
              <td className="px-3 py-2 text-xs text-slate-500">
                {l.last_clicked ? new Date(l.last_clicked).toLocaleString() : '–'}
              </td>
              <td className="px-3 py-2">
                <div className="flex justify-end gap-2">
                  <Link
                    to={`/code/${l.code}`}
                    className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Stats
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleCopy(l.code)}
                    className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(l.code)}
                    className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
