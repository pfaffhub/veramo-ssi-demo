import { agent } from './agent.js'

import {
  createIssuer,
  issueCredential,
} from './issuer.js'

import { createHolder } from './holder.js'

import {
  verifyCredential,
  testManipulation,
} from './verifier.js'


// DEMO


// 1. FH / Issuer erzeugen
const issuer = await createIssuer()


// 2. Student / Holder erzeugen
const holder = await createHolder()


// 3. DID Document des Issuers anzeigen
const issuerResolution = await agent.resolveDid({
  didUrl: issuer.did,
})

console.log('\n-----------------')
console.log('Issuer DID Document')
console.dir(issuerResolution.didDocument, { depth: null })
console.log('-----------------')


// 4. FH stellt Student ein Credential aus
const credential = await issueCredential(
  issuer.did,
  holder.did
)


// 5. Credential überprüfen
await verifyCredential(credential)


// 6. Credential manipulieren und erneut überprüfen
await testManipulation(credential)