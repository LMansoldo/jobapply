export function formatJobCount(total: number): string {
  return total === 1 ? '1 vaga encontrada' : `${total} vagas encontradas`
}
