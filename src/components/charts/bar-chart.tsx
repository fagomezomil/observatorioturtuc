"use client";

import { Bar } from "react-chartjs-2";
import type { TooltipItem } from "chart.js";
import { fullPalette, defaultChartOptions } from "@/lib/charts";

interface BarChartProps {
  labels: string[];
  datasets: { label: string; data: number[]; color?: string }[];
  title?: string;
  horizontal?: boolean;
  unit?: "%" | "$" | "noches" | "personas";
}

export function BarChartComponent({ labels, datasets, title, horizontal = false, unit }: BarChartProps) {
  const data = {
    labels,
    datasets: datasets.map((ds, i) => ({
      label: ds.label,
      data: ds.data,
      backgroundColor: ds.color || fullPalette[i % fullPalette.length],
      borderRadius: 4,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? ("y" as const) : ("x" as const),
    plugins: {
      legend: defaultChartOptions.plugins.legend,
      title: title ? { ...defaultChartOptions.plugins.title, display: true, text: title } : { display: false },
      tooltip: {
        ...defaultChartOptions.plugins.tooltip,
        callbacks: unit
          ? {
              label: (ctx: TooltipItem<"bar">) => {
                const val = horizontal ? (ctx.parsed.x ?? 0) : (ctx.parsed.y ?? 0);
                const suffix = unit === "%" ? "%" : unit === "noches" ? " noches" : unit === "personas" ? "" : "";
                const prefix = unit === "$" ? "$" : "";
                return `${ctx.dataset.label ?? ""}: ${prefix}${val.toLocaleString("es-AR")}${suffix}`;
              },
            }
          : undefined,
      },
    },
    scales: {
      x: { beginAtZero: true, ticks: { font: { family: "Montserrat" } } },
      y: { beginAtZero: true, ticks: { font: { family: "Montserrat" } } },
    },
  };

  return <Bar data={data} options={options} />;
}