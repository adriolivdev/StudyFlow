import { StudySession } from "../models/SessionModel";

/**
 * Classe responsável por controlar as sessões de estudo.
 * Atua como o "Controller" no padrão MVC.
 */
export class SessionController {
  private sessions: StudySession[] = [];

  /**
   * Cria uma nova sessão com título, tempos e ciclos.
   */
  createSession(
    title: string,
    focusTime: number,
    breakTime: number,
    totalCycles: number = 1
  ): StudySession {
    const newSession: StudySession = {
      id: crypto.randomUUID(),
      title,
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
