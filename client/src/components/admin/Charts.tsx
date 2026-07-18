"use client";

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
} from "recharts";

export function AdminAreaChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#C4A265" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#C4A265" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.5 }} 
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.5 }}
          tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
          itemStyle={{ color: '#C4A265' }}
          formatter={(value: any) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
        />
        <Area 
          type="monotone" 
          dataKey="total" 
          stroke="#C4A265" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorTotal)" 
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}

export function AdminBarChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.5 }}
          dy={10} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.5 }}
        />
        <Tooltip 
          cursor={{ fill: 'currentColor', opacity: 0.05 }}
          contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
        />
        <Bar dataKey="sales" fill="#C4A265" radius={[4, 4, 0, 0]} barSize={32} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
