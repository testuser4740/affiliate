"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#F26B1F", "#FFC93C"];

interface AnalyticsBarChartProps {
  data: any[];
  frequency: string;
}

interface AnalyticsPieChartProps {
  data: { name: string; value: number }[];
}

export function AnalyticsBarChart({ data, frequency }: AnalyticsBarChartProps) {
  return (
    <div className="gajab-card p-5 lg:col-span-2">
      <h3 className="font-display text-lg mb-3">Revenue trend ({frequency})</h3>
      <div className="h-72">
        <ResponsiveContainer>
          <BarChart data={data.length ? data : []}>
            <CartesianGrid stroke="#EFEAE0" strokeDasharray="4 4" />
            <XAxis dataKey="day" stroke="#1B2D54" fontWeight="700" />
            <YAxis stroke="#1B2D54" />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EFEAE0" }} />
            <Bar dataKey="revenue" fill="#F26B1F" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function AnalyticsPieChart({ data }: AnalyticsPieChartProps) {
  return (
    <div className="gajab-card p-5">
      <h3 className="font-display text-lg mb-3">Conversion comparison</h3>
      <div className="h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i]} stroke="#1B2D54" strokeWidth={2} />)}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
