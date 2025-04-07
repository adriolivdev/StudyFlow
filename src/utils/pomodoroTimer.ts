/**
 * Converte minutos e segundos em milissegundos
 * @param minutes - minutos
 * @param seconds - segundos
 * @returns tempo em milissegundos
 */
export function convertToMilliseconds(minutes: number, seconds: number): number {
    return (minutes * 60 + seconds) * 1000;
  }
  
  /**
   * Formata os números para string com dois dígitos (ex: 05)
   * @param value - número a ser formatado
   * @returns string formatada
   */
  export function formatTime(value: number): string {
    return String(value).padStart(2, "0");
  }
  
  /**
   * Verifica se o tempo chegou ao fim
   */
  export function isTimeOver(minutes: number, seconds: number): boolean {
    return minutes === 0 && seconds === 0;
  }
  