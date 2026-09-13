import { agent } from './agent.js'

export async function verifyPresentation(presentation: any) {

  // Die Apotheke prüft die vom Patienten vorgelegte
  // Verifiable Presentation. Dabei werden zwei Signaturen
  // geprüft: die des Patienten (Presentation) und die der
  // Ärztin (das enthaltene E-Rezept).
  const result = await agent.verifyPresentation({
    presentation,
  })

  console.log('\n-----------------')
  console.log('Presentation Verification (Apotheke)')
  console.dir(result, { depth: null })
  console.log('-----------------')

  return result
}

export async function verifyCredential(credential: any) {

  // Optional: nur das E-Rezept selbst prüfen (ohne Presentation).
  const result = await agent.verifyCredential({
    credential,
  })

  console.log('\n-----------------')
  console.log('Credential Verification (E-Rezept)')
  console.dir(result, { depth: null })
  console.log('-----------------')

  return result
}

export async function testManipulation(credential: any) {

  // Manipulationstest: Jemand versucht, nachträglich das
  // verschriebene Medikament auszutauschen.
  //
  // Wichtig: Bei JWT-Credentials steckt die eigentliche,
  // signierte Aussage im Token (proof.jwt). Es reicht daher
  // NICHT, nur das äußere Objekt zu ändern - der Token selbst
  // muss verändert werden, damit die Signaturprüfung anschlägt.

  const [header, payload, signature] = credential.proof.jwt.split('.')

  // Payload dekodieren und das Medikament heimlich austauschen.
  const decoded = JSON.parse(
    Buffer.from(payload, 'base64url').toString('utf8')
  )
  decoded.vc.credentialSubject.medikament = 'Oxycodon 80 mg'

  // Neuen Payload kodieren - aber die ALTE Signatur behalten.
  // Dadurch passt die Signatur nicht mehr zum Inhalt.
  const tamperedPayload = Buffer
    .from(JSON.stringify(decoded))
    .toString('base64url')

  const manipulatedJwt = `${header}.${tamperedPayload}.${signature}`

  const manipulatedCredential = {
    ...credential,
    proof: { ...credential.proof, jwt: manipulatedJwt },
  }

  const result = await agent.verifyCredential({
    credential: manipulatedCredential,
  })

  console.log('\n-----------------')
  console.log('Manipuliertes E-Rezept (Signatur ungültig)')
  console.dir(result, { depth: null })
  console.log('-----------------')

  return result
}