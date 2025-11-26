import React, { useState } from 'react';
import { createLink } from '../api';

export default function AddLinkForm({ onCreated }) {
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');

    if (!url.trim()) {
      setMessage('URL is required');
      return;
    }

    try {
      setLoading(true);
      const body = { url };
      if (code.trim()) body.code = code.trim();

      const res = await createLink(body);
      const createdCode = res.data.code;

      setUrl('');
      setCode('');
      setMessage(`Created short code: ${createdCode}`);

      if (onCreated) onCreated();
    } catch (err) {
      console.error(err);
      const apiError = err.response?.data?.error || 'Failed to create link';
      setMessage(apiError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <input
        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="https://example.com/long/url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <input
        className="w-full sm:w-60 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Custom code (optional, 6–8 chars)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button
        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? 'Adding…' : 'Add'}
      </button>

      {message && (
        <div className="text-xs sm:text-sm text-slate-600 sm:ml-2">{message}</div>
      )}
    </form>
  );
}
