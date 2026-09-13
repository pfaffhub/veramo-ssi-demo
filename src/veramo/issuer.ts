import { agent } from './agent.js'

export async function createIssuer() {

  // Erstellt die DID der Ärztin (Issuer).
  const issuer = await agent.didManagerCreate()

  console.log('\n-----------------')
  console.log('Issuer / Ärztin DID')
  console.log(issuer.did)
  console.log('-----------------')

  return issuer
}

export async function issueCredential(
  issuerDid: string,
  holderDid: string
) {

  // Die Ärztin stellt dem Patienten ein E-Rezept
  // als Verifiable Credential aus.
  const credential = await agent.createVerifiableCredential({

    credential: {

      // Wer stellt das Rezept aus? -> die Ärztin
      issuer: {
        id: issuerDid,
      },

      // Eigener Credential-Typ für das Rezept.
      type: ['VerifiableCredential', 'EPrescription'],

      // Über wen wird eine Aussage gemacht? -> der Patient
      credentialSubject: {

        // DID des Patienten
        id: holderDid,

        // Claims des Rezepts
        patientName: 'Max Mustermann',
        medikament: 'Ibuprofen 400 mg',
        dosierung: '3x täglich 1 Tablette',
        gueltigBis: '2026-12-31',
        ausstellendeAerztin: 'Dr. Anna Berger',
      },
    },

    // Das Credential wird als JWT signiert.
    proofFormat: 'jwt',
  })

  console.log('\n-----------------')
  console.log('E-Rezept (Verifiable Credential)')
  console.dir(credential, { depth: null })
  console.log('-----------------')

  return credential
}