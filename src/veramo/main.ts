import { agent } from './agent.js'
import { step } from './log.js'

import {
  createIssuer,
  issueCredential,
} from './issuer.js'

import {
  createHolder,
  createPresentation,
} from './holder.js'

import {
  verifyPresentation,
  testManipulation,
} from './verifier.js'


// DEMO: SSI am Beispiel eines E-Rezepts
// Ärztin (Issuer) -> Patient (Holder) -> Apotheke (Verifier)
// Die Nummerierung folgt dem Sequenzdiagramm der Folie.


// ==========================================================
// PHASE 1 - Verbindung aufbauen (Schritte 1-4)
// ==========================================================


// 1. Verbindungseinladung
step(
  1,
  'Verbindungseinladung',
  'Ärztin',
  'Patient',
  'Out-of-Band-Einladung per QR-Code / Link.',
  true
)


// 2. Verbindungsanfrage: Patient erzeugt DID + DID-Doc
step(
  2,
  'Verbindungsanfrage',
  'Patient',
  'Ärztin',
  'Patient erzeugt eine DID + DID-Dokument für die Beziehung.'
)
const holder = await createHolder()


// 3. Verbindungsantwort: Ärztin erzeugt DID + DID-Doc
step(
  3,
  'Verbindungsantwort',
  'Ärztin',
  'Patient',
  'Ärztin erzeugt ihrerseits eine DID + DID-Dokument.'
)
const issuer = await createIssuer()


// 4. Sicherer Kanal steht - beide DIDs sind ausgetauscht.
step(
  4,
  'Sicherer E2E-Kanal steht',
  'Patient',
  'Ärztin',
  'Beide DIDs ausgetauscht. Zur Kontrolle: das DID-Dokument der Ärztin.',
  true
)

const issuerResolution = await agent.resolveDid({
  didUrl: issuer.did,
})
console.dir(issuerResolution.didDocument, { depth: null })


// ==========================================================
// PHASE 2 - Rezept ausstellen & einlösen (Schritte 5-8)
// ==========================================================


// 5. Ärztin stellt dem Patienten ein E-Rezept aus
step(
  5,
  'Rezept ausstellen',
  'Ärztin',
  'Patient',
  'Ärztin stellt das E-Rezept als Verifiable Credential aus.'
)
const credential = await issueCredential(
  issuer.did,
  holder.did
)


// 6. Apotheke fragt die nötigen Attribute an
step(
  6,
  'Proof Request',
  'Apotheke',
  'Patient',
  'Apotheke fordert die nötigen Attribute an (Name, Medikament, Gültigkeit).',
  true
)


// 7. Patient legt eine Verifiable Presentation vor
step(
  7,
  'Verifiable Presentation',
  'Patient',
  'Apotheke',
  'Patient verpackt das Rezept in eine signierte Presentation.'
)
const presentation = await createPresentation(
  holder.did,
  credential
)


// 8. Apotheke prüft und gibt frei
step(
  8,
  'Genehmigung & Ausgabe',
  'Apotheke',
  'Patient',
  'Apotheke prüft die Signaturen (Patient + Ärztin) und gibt frei.'
)
const result = await verifyPresentation(presentation)

if (result.verified) {
  console.log('\n>> Signaturen gültig - Medikament wird ausgegeben. <<')
} else {
  console.log('\n>> Prüfung fehlgeschlagen - keine Ausgabe. <<')
}


// ==========================================================
// BONUS - Sicherheitstest (nicht Teil des Ablaufs)
// ==========================================================

console.log('\n############################################')
console.log('BONUS: Manipulationstest')
console.log('Ein verändertes Rezept darf NICHT verifizieren.')
console.log('############################################')

await testManipulation(credential)