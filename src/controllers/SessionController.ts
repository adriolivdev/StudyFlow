import { StudySession } from "../models/SessionModel";

/**
 * Classe responsável por controlar as sessões de estudo.
 * Atua como o "Controller" no padrão MVC.
 */
export class SessionController {
  // Lista onde as sessões serão armazenadas temporariamente (em memória)
  private sessions: StudySession[] = [];

  /**
   * Cria uma nova sessão de estudo e adiciona à lista.
   * 
   * @param title - Título da sessão (ex: "Estudo de JavaScript")
   * @param focusTime - Tempo de foco em minutos
   * @param breakTime - Tempo de pausa em minutos
   * @returns A nova sessão criada
   */
  createSession(title: string, focusTime: number, breakTime: number): StudySession {
    const newSession: StudySession = {
      id: crypto.randomUUID(), // Gera um ID único
      title,
      focusTime,
      breakTime,
      completed: false,
      createdAt: new Date()
    };

    this.sessions.push(newSession);
    return newSession;
  }

  /**
   * Retorna todas as sessões cadastradas até o momento.
   * 
   * @returns Lista de sessões de estudo
   */
  getAllSessions(): StudySession[] {
    return this.sessions;
  }

  /**
   * Marca uma sessão como concluída, com base no ID.
   * 
   * @param id - ID da sessão que foi concluída
   */
  markAsCompleted(id: string): void {
    const session = this.sessions.find(s => s.id === id);
    if (session) session.completed = true;
  }

  /**
   * Remove uma sessão da lista, com base no ID.
   * 
   * @param id - ID da sessão que deve ser removida
   */
  deleteSession(id: string): void {
    this.sessions = this.sessions.filter(s => s.id !== id);
  }
}
