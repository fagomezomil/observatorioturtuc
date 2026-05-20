"use client";

import { Pie } from "react-chartjs-2";
import { fullPalette, defaultChartOptions } from "@/lib/charts";

interface PieChartProps {
  labels: string[];
  data: number[];
  title?: string;
}

export function PieChartComponent({ labels, data, title }: PieChartProps) {
  const chartData = {
    labels,
    datasets: [{
      data,
      backgroundColor: fullPalette.slice(0, labels.length),
      borderWidth: 2,
      borderColor: "#fff",
      hoverOffset: 8,
    }],
  };

  const options = {
    ...defaultChartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      ...(title ? { title: { ...defaultChartOptions.plugins.title, display: true, text: title } } : {}),
      tooltip: {
        ...defaultChartOptions.plugins.tooltip,
        callbacks: {
          label: (ctx: { label: string; parsed: number; dataset: { data: number[] } }) => {
            const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : "0";
            return `${ctx.label}: ${pct}%`;
          },
        },
      },
    },
  };

  return <Pie data={chartData} options={options} />;
}