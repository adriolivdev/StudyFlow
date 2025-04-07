import { StudySession } from "../models/SessionModel";

interface Props {
  session: StudySession;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onStart: (session: StudySession) => void;
}

/**
 * Componente visual de uma sessão de estudo.
 * Mostra título, tempos e botões de controle.
 */
export default function SessionCard({
  session,
  onComplete,
  onDelete,
  onStart,
}: Props) {
  return (
    <div className="p-4 border border-gray-700 rounded-2xl bg-black/70 backdrop-blur-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md transition-all">
      {/* Informações da sessão */}
      <div className="flex flex-col gap-1">
        <p className="text-lg font-bold text-[#13b83a] drop-shadow-neon">
          {session.title}
        </p>
        <p className="text-sm text-gray-400">
          Foco: {session.focusTime} min | Pausa: {session.breakTime} min
        </p>
        {session.completed && (
          <span className="text-[#13b83a] text-xs font-bold">✅ Concluída</span>
        )}
      </div>

      {/* Ações */}
      <div className="flex gap-2 flex-wrap">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-sm px-4 py-1.5 rounded-md transition"
          onClick={() => onStart(session)}
        >
          Iniciar
        </button>

        {!session.completed && (
          <button
            className="bg-[#13b83a] hover:bg-green-700 text-sm px-4 py-1.5 rounded-md transition"
            onClick={() => onComplete(session.id)}
          >
            Concluir
          </button>
        )}

        <button
          className="bg-red-600 hover:bg-red-700 text-sm px-4 py-1.5 rounded-md transition"
          onClick={() => onDelete(session.id)}
        >
          Deletar
        </button>
      </div>
    </div>
  );
}
