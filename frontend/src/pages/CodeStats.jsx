import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLink } from '../api';

export default function CodeStats() {
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setErr('');
        const res = await getLink(code);
        setData(res.data);
      } catch (error) {
        console.error(error);
        const apiError = error.response?.data?.error || 'Not found';
        setErr(apiError);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [code]);

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 text-sm text-slate-500">
        Loading…
      </div>
    );
  }

  if (err) {
    return (
      <div className="bg-white border border-red-200 rounded-xl shadow-sm p-4 sm:p-6 text-sm text-red-700 bg-red-50">
        Error: {err}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 space-y-3">
      <h2 className="text-base sm:text-lg font-semibold text-slate-900">
        Stats for <span className="font-mono text-indigo-600">{code}</span>
      </h2>
      <div className="text-sm">
        <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Target URL</div>
        <a
          href={data.url}
          target="_blank"
          rel="noreferrer"
          className="break-all text-indigo-600 hover:text-indigo-800"
        >
          {data.url}
        </a>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 text-sm">
        <div className="space-y-1">
          <div className="text-xs text-slate-500 uppercase tracking-wide">Clicks</div>
          <div className="font-semibold text-slate-900">{data.clicks}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-slate-500 uppercase tracking-wide">Last clicked</div>
          <div className="text-slate-700">
            {data.last_clicked ? new Date(data.last_clicked).toLocaleString() : '–'}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-slate-500 uppercase tracking-wide">Created at</div>
          <div className="text-slate-700">
            {data.created_at ? new Date(data.created_at).toLocaleString() : '–'}
          </div>
        </div>
      </div>
    </div>
  );
}
