"use client";

import { Line } from "react-chartjs-2";
import type { TooltipItem } from "chart.js";
import { fullPalette, defaultChartOptions } from "@/lib/charts";

interface LineChartProps {
  labels: string[];
  datasets: { label: string; data: (number | null)[]; color?: string }[];
  title?: string;
  unit?: "%" | "$" | "noches" | "personas";
}

export function LineChartComponent({ labels, datasets, title, unit }: LineChartProps) {
  const data = {
    labels,
    datasets: datasets.map((ds, i) => ({
      label: ds.label,
      data: ds.data,
      borderColor: ds.color || fullPalette[i % fullPalette.length],
      backgroundColor: ds.color
        ? `${ds.color}20`
        : `${fullPalette[i % fullPalette.length]}20`,
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6,
      spanGaps: true,
      fill: datasets.length > 1 ? false : true,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: defaultChartOptions.plugins.legend,
      title: title ? { ...defaultChartOptions.plugins.title, display: true, text: title } : { display: false },
      tooltip: {
        ...defaultChartOptions.plugins.tooltip,
        callbacks: unit
          ? {
              label: (ctx: TooltipItem<"line">) => {
                const val = ctx.parsed.y ?? 0;
                const suffix = unit === "%" ? "%" : unit === "noches" ? " noches" : unit === "personas" ? "" : "";
                const prefix = unit === "$" ? "$" : "";
                return `${ctx.dataset.label ?? ""}: ${prefix}${val.toLocaleString("es-AR")}${suffix}`;
              },
            }
          : undefined,
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { font: { family: "Montserrat" } } },
      x: { ticks: { font: { family: "Montserrat" } } },
    },
  };

  return <Line data={data} options={options} />;
}