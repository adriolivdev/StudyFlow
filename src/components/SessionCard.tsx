import { StudySession } from "../models/SessionModel";

interface Props {
  session: StudySession;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onStart: (session: StudySession) => void; // nova prop
}

/**
 * Componente visual para uma sessão de estudo.
 * Exibe ações de iniciar, concluir e deletar.
 */
export default function SessionCard({ session, onComplete, onDelete, onStart }: Props) {
  return (
    <div className="p-4 border border-gray-700 rounded-xl bg-gray-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md">
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold text-green-300">{session.title}</p>
        <p className="text-sm text-gray-400">
          Foco: {session.focusTime} min | Pausa: {session.breakTime} min
        </p>
        {session.completed && (
          <span className="text-green-400 text-xs font-bold">✅ Concluída</span>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1 rounded"
          onClick={() => onStart(session)}
        >
          Iniciar
        </button>

        {!session.completed && (
          <button
            className="bg-green-600 hover:bg-green-700 text-sm px-3 py-1 rounded"
            onClick={() => onComplete(session.id)}
          >
            Concluir
          </button>
        )}
        <button
          className="bg-red-600 hover:bg-red-700 text-sm px-3 py-1 rounded"
          onClick={() => onDelete(session.id)}
        >
          Deletar
        </button>
      </div>
    </div>
  );
}
