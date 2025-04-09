/**
 * Interface que representa uma sessão de estudo no aplicativo.
 * Define o formato dos dados que o app vai usar para criar, exibir e manipular sessões.
 */
export interface StudySession {
  /**
   * Identificador único da sessão.
   * Usado para diferenciar cada sessão e manipular individualmente (como concluir ou deletar).
   */
  id: string;

  /**
   * Título da sessão de estudo.
   * Ex: "Estudar Matemática", "Projeto Front-End", etc.
   */
  title: string;

  /**
   * Categoria da sessão de estudo.
   * Ex: "Front-End", "Lógica de Programação", "Banco de Dados", etc.
   * Útil para organizar sessões e gerar relatórios ou gráficos por área.
   */
  category: string;

  /**
   * Tempo de foco da sessão em minutos.
   * Indica quanto tempo o usuário pretende estudar sem interrupções.
   */
  focusTime: number;

  /**
   * Tempo de pausa da sessão em minutos.
   * Indica quanto tempo o usuário vai descansar após o tempo de foco.
   */
  breakTime: number;

  /**
   * Indica se a sessão foi concluída ou não.
   * Usado para mostrar feedback visual e evitar duplicações.
   */
  completed: boolean;

  /**
   * Data e hora de criação da sessão.
   * Pode ser usado futuramente para gerar histórico ou gráficos.
   */
  createdAt: Date;

  /**
   * Número total de ciclos Pomodoro que o usuário deseja concluir na sessão.
   */
  totalCycles: number;

  /**
   * Quantos ciclos o usuário já completou nessa sessão.
   */
  completedCycles: number;
}
