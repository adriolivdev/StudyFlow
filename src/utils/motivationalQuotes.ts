 /**
 * Lista de frases motivacionais aleatórias.
 * Pode crescer conforme o app evolui!
 */
export const quotes = [
    "Você está cada vez mais perto dos seus objetivos!",
    "Mandou muito bem nessa sessão!",
    "Orgulho da sua disciplina! Continue assim!",
    "Uma sessão por vez, um futuro brilhante à frente!",
    "Seu foco constrói seu sucesso! 🚀",
    "Você é capaz de muito mais, continue firme!",
    "Com cada minuto de foco, você vence o impossível!",
    "Essa vitória é sua! 🎯",
    "Você é incrível!",
    "Mais uma missão cumprida! 👏",
  ];
  
  /**
   * Função para sortear uma frase aleatória
   */
  export function getRandomQuote(): string {
    const index = Math.floor(Math.random() * quotes.length);
    return quotes[index];
  }
  