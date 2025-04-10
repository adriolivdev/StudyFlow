import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { StudySession } from "../models/SessionModel";
import { getDay, getWeekOfMonth } from "date-fns";

interface Props {
  sessions: StudySession[];
}

const monthLabels = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

/**
 * Componente de gráfico unificado com UI/UX profissional.
 */
export default function UnifiedChart({ sessions }: Props) {
  const [viewMode, setViewMode] = useState("week");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const currentYear = new Date().getFullYear();
  const weekLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  let chartData: { label: string; minutos: number }[] = [];

  if (viewMode === "week") {
    const data = Array(7).fill(0).map((_, i) => ({ label: weekLabels[i], minutos: 0 }));
    sessions.forEach((session) => {
      const dia = getDay(new Date(session.createdAt));
      const minutos = session.focusTime * session.totalCycles;
      data[dia].minutos += minutos;
    });
    chartData = data;
  } else {
    const weeklyMap: { [week: number]: number } = {};
    sessions.forEach((session) => {
      const date = new Date(session.createdAt);
      const minutos = session.focusTime * session.totalCycles;
      if (date.getMonth() === selectedMonth && date.getFullYear() === currentYear) {
        const week = getWeekOfMonth(date, { weekStartsOn: 0 });
        weeklyMap[week] = (weeklyMap[week] || 0) + minutos;
      }
    });
    chartData = Object.entries(weeklyMap).map(([week, total]) => ({
      label: `Semana ${week} do mês`,
      minutos: total,
    }));
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 px-4 py-6 rounded-2xl bg-[#1a1a1a]/80 border border-[#2a2a2a] shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-2">
        <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
          📊 Estudo por {viewMode === "week" ? "Dia da Semana" : "Semana do Mês"}
        </h3>
        <div className="flex items-center gap-2">
          {viewMode === "month" && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="bg-[#2b2b2b] text-white text-sm px-2 py-1 rounded-md border border-[#444] focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {monthLabels.map((label, idx) => (
                <option key={idx} value={idx}>{label}</option>
              ))}
            </select>
          )}
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="bg-[#2b2b2b] text-white text-sm px-2 py-1 rounded-md border border-[#444] focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="week">📅 Dia da Semana</option>
            <option value="month">📆 Semana do Mês</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          barCategoryGap={30}
          barSize={40}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="label" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip
            wrapperStyle={{ outline: "none" }}
            cursor={{ fill: "transparent" }}
            contentStyle={{
              backgroundColor: "#111",
              border: "1px solid #333",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "0.875rem",
            }}
            labelStyle={{ color: "#13b83a" }}
          />
          <Legend wrapperStyle={{ color: "#13b83a" }} />
          <Bar
            dataKey="minutos"
            fill="#13b83a"
            name="Minutos"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
