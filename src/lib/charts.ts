import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/* Domain-derived palette — colors from Tucuman's landscape, not generic */
export const chartColors = {
  primary: "#006e66",   // Yungas teal
  secondary: "#e9721f", // Terracotta sun
  accent: "#223468",    // Mountain sky
  light: "#85bd77",     // Spring green
  earth: "#D4A574",    // Adobe earth
  red: "#e30612",       // Alert coral
  gray: "#73716a",      // Warm stone
};

export const fullPalette = [
  "#006e66", "#e9721f", "#223468", "#85bd77", "#D4A574",
  "#73716a", "#4a90d9", "#f5a623", "#e30612", "#50C8C6",
];

export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        font: { family: "Montserrat", size: 12 },
        padding: 16,
        usePointStyle: true,
        pointStyleWidth: 10,
      },
    },
    title: {
      display: true,
      font: { family: "Montserrat", size: 16, weight: "bold" as const },
      color: "#223468",
      padding: { bottom: 16 },
    },
    tooltip: {
      backgroundColor: "#223468",
      titleFont: { family: "Montserrat", size: 13 },
      bodyFont: { family: "Montserrat", size: 12 },
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      boxPadding: 4,
    },
  },
};

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-AR").format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}