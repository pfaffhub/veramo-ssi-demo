// Kleine Hilfsfunktion, um die Demo-Schritte nummeriert
// und passend zum Sequenzdiagramm auszugeben.

export function step(
  nr: number,
  title: string,
  from: string,
  to: string,
  detail: string,
  simuliert = false
) {

  // Schritte, die die Demo nicht als echtes DIDComm umsetzt,
  // werden ehrlich gekennzeichnet.
  const tag = simuliert ? '   [in dieser Demo simuliert]' : ''

  console.log('\n============================================')
  console.log(`SCHRITT ${nr}: ${title}${tag}`)
  console.log(`${from}  ->  ${to}`)
  console.log(detail)
  console.log('============================================')
}