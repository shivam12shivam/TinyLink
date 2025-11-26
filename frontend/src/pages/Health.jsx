import React, { useEffect, useState } from 'react';
import { healthCheck } from '../api';

export default function Health() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setErr('');
        const res = await healthCheck();
        setData(res.data);
      } catch (e) {
        console.error(e);
        setErr('Failed to load health info');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 text-sm text-slate-500">
        Loading health info…
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
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 space-y-4">
      <h2 className="text-base sm:text-lg font-semibold text-slate-900">System Health</h2>
      <p className="text-xs sm:text-sm text-slate-500">
        Basic status, uptime and database connectivity information.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 text-sm">
        <div className="space-y-1">
          <div className="text-xs text-slate-500 uppercase tracking-wide">Status</div>
          <div className="font-medium">
            {data.ok ? 'Healthy' : 'Unhealthy'} ({data.version})
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-slate-500 uppercase tracking-wide">Environment</div>
          <div className="font-medium">{data.nodeEnv}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-slate-500 uppercase tracking-wide">Uptime (seconds)</div>
          <div className="font-medium">{data.uptimeSeconds}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-slate-500 uppercase tracking-wide">Database state</div>
          <div className="font-medium">
            {data.db?.stateText} ({data.db?.state})
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-3 text-xs text-slate-500">
        <div>Started at: {data.startedAt}</div>
        <div>Now: {data.now}</div>
      </div>
    </div>
  );
}
