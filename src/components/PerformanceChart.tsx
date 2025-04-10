import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { StudySession } from "../models/SessionModel";

// Cores aleatórias (você pode padronizar depois)
const COLORS = ["#13b83a", "#36b3ff", "#facc15", "#ef4444", "#8b5cf6", "#10b981"];

interface Props {
  sessions: StudySession[];
}

/**
 * Componente que renderiza um gráfico de pizza mostrando o tempo total de estudo por categoria.
 */
export default function PerformanceChart({ sessions }: Props) {
  // Agrupa as sessões por categoria e soma o tempo total estudado
  const data = Object.values(
    sessions.reduce((acc: any, session) => {
      const category = session.category || "Sem Categoria";
      const totalFocus = session.focusTime * session.totalCycles;

      if (!acc[category]) {
        acc[category] = { name: category, value: totalFocus };
      } else {
        acc[category].value += totalFocus;
      }

      return acc;
    }, {})
  );

  return (
    <div className="w-full max-w-md mx-auto my-10">
      <h3 className="text-lg font-bold text-center mb-4 text-green-400">
        ⏱️ Tempo de Estudo por Categoria
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
