"use client";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface TrendChartProps {
  data: any[];
}

export default function TrendChart({ data }: TrendChartProps) {
  return (
    <ResponsiveContainer>
      <LineChart data={data}>
        <CartesianGrid stroke="#EAE6E1" strokeDasharray="4 4" />
        <XAxis dataKey="day" stroke="#1A1A1A" fontWeight="700" fontSize={12} />
        <YAxis stroke="#1A1A1A" fontSize={12} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "2px solid #1A1A1A" }} />
        <Line type="monotone" dataKey="revenue" stroke="#F26B1F" strokeWidth={3} dot={{ r: 5, fill: "#FFC93C", stroke: "#1A1A1A", strokeWidth: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
