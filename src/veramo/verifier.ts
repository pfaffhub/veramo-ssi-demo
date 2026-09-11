import { agent } from './agent.js'

export async function verifyCredential(credential: any) {

  // Prüft die Signatur des Credentials.
  const result = await agent.verifyCredential({
    credential,
  })

  console.log('\n-----------------')
  console.log('Credential Verification')
  console.dir(result, { depth: null })
  console.log('-----------------')

  return result
}

export async function testManipulation(credential: any) {

  // Nachträgliche Veränderung eines Claims.
  const manipulatedCredential = {
    ...credential,

    credentialSubject: {
      ...credential.credentialSubject,

      degree: 'Professor für IT-Security',
    },
  }

  const result = await agent.verifyCredential({
    credential: manipulatedCredential,
  })

  console.log('\n-----------------')
  console.log('Manipuliertes Credential')
  console.dir(result, { depth: null })
  console.log('-----------------')

  return result
}