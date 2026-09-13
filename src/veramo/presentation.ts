import { agent } from './agent.js'

export async function createPresentation(
  holderDid: string,
  credential: any
) {

  // Der Holder / Student verpackt sein VC in eine
  // selbst signierte Verifiable Presentation.
  const presentation = await agent.createVerifiablePresentation({

    presentation: {

      // Wer präsentiert? (DID des Studenten)
      holder: holderDid,

      // Welche Credentials werden vorgezeigt?
      verifiableCredential: [credential],
    },

    // Die Presentation wird als JWT signiert.
    proofFormat: 'jwt',
  })

  console.log('\n-----------------')
  console.log('Verifiable Presentation (vom Holder signiert)')
  console.dir(presentation, { depth: null })
  console.log('-----------------')

  return presentation
}


export async function verifyPresentation(presentation: any) {

  // Der Verifier prüft die Signatur des Holders.
  // Die FH / der Issuer wird dabei NICHT kontaktiert.
  const result = await agent.verifyPresentation({
    presentation,
  })

  console.log('\n-----------------')
  console.log('Presentation Verification')
  console.log('verified:', result.verified)
  console.log('-----------------')

  return result
}