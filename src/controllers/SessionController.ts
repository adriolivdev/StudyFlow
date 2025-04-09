import { StudySession } from "../models/SessionModel";

/**
 * Classe responsável por controlar as sessões de estudo.
 * Atua como o "Controller" no padrão MVC.
 */
export class SessionController {
  private sessions: StudySession[] = [];

  /**
   * Cria uma nova sessão com título, tempos, ciclos e categoria.
   * 
   * @param title - Título da sessão de estudo.
   * @param focusTime - Tempo de foco (em minutos).
   * @param breakTime - Tempo de pausa (em minutos).
   * @param totalCycles - Quantidade de ciclos Pomodoro (padrão: 1).
   * @param category - Categoria da sessão (ex: "Front-End", "Python").
   * @returns A sessão criada.
   */
  createSession(
    title: string,
    focusTime: number,
    breakTime: number,
    totalCycles: number = 1,
    category: string = ""
  ): StudySession {
    const newSession: StudySession = {
      id: crypto.randomUUID(),
      title,
      category, // ✅ nova propriedade incluída aqui
      focusTime,
      breakTime,
      completed: false,
      createdAt: new Date(),
      totalCycles,
      completedCycles: 0,
    };

    this.sessions.push(newSession);
    return newSession;
  }

  /**
   * Retorna todas as sessões cadastradas.
   */
  getAllSessions(): StudySession[] {
    return this.sessions;
  }

  /**
   * Marca uma sessão como concluída.
   */
  markAsCompleted(id: string): void {
    const session = this.sessions.find((s) => s.id === id);
    if (session) session.completed = true;
  }

  /**
   * Incrementa o número de ciclos concluídos.
   * Se todos os ciclos forem feitos, marca como concluída.
   */
  incrementCycle(id: string): void {
    const session = this.sessions.find((s) => s.id === id);
    if (!session || session.completed) return;

    session.completedCycles += 1;

    if (session.completedCycles >= session.totalCycles) {
      session.completed = true;
    }
  }

  /**
   * Deleta uma sessão da lista.
   */
  deleteSession(id: string): void {
    this.sessions = this.sessions.filter((s) => s.id !== id);
  }
}
