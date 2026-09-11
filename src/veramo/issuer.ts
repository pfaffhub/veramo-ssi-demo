import { agent } from './agent.js'

export async function createIssuer() {

  // Erstellt die DID des Issuers / der FH.
  const issuer = await agent.didManagerCreate()

  console.log('\n-----------------')
  console.log('Issuer / FH DID')
  console.log(issuer.did)
  console.log('-----------------')

  return issuer
}

export async function issueCredential(
  issuerDid: string,
  holderDid: string
) {

  // Die FH stellt dem Studenten ein
  // Verifiable Credential aus.
  const credential = await agent.createVerifiableCredential({

    credential: {

      // Wer stellt das Credential aus?
      issuer: {
        id: issuerDid,
      },

      // Über wen wird eine Aussage gemacht?
      credentialSubject: {

        // DID des Studenten
        id: holderDid,

        // Claims über den Studenten
        name: 'Max Mustermann',
        degree: 'IT-Security',
      },
    },

    // Das Credential wird als JWT signiert.
    proofFormat: 'jwt',
  })

  console.log('\n-----------------')
  console.log('Verifiable Credential')
  console.dir(credential, { depth: null })
  console.log('-----------------')

  return credential
}