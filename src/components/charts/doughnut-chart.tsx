"use client";

import { Doughnut } from "react-chartjs-2";
import { fullPalette, defaultChartOptions } from "@/lib/charts";

interface DoughnutChartProps {
  labels: string[];
  data: number[];
  title?: string;
  centerText?: string;
  centerLabel?: string;
}

export function DoughnutChartComponent({ labels, data, title, centerText, centerLabel }: DoughnutChartProps) {
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

  const centerTextPlugin = centerText
    ? {
        id: "centerText",
        afterDraw: (chart: { width: number; height: number; ctx: CanvasRenderingContext2D }) => {
          const { width, ctx: context } = chart;
          context.save();
          const cx = width / 2;
          const cy = (chart.height as number) / 2 - 16;
          context.font = "bold 24px Montserrat";
          context.fillStyle = "#223468";
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.fillText(centerText, cx, cy);
          if (centerLabel) {
            context.font = "12px Montserrat";
            context.fillStyle = "#73716a";
            context.fillText(centerLabel, cx, cy + 22);
          }
          context.restore();
        },
      }
    : null;

  const options = {
    ...defaultChartOptions,
    cutout: "55%",
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

  const plugins = centerTextPlugin ? [centerTextPlugin] : [];

  return <Doughnut data={chartData} options={options} plugins={plugins} />;
}