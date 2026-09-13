import { agent } from './agent.js'

export async function createHolder() {

  // Erstellt die DID des Patienten.
  const holder = await agent.didManagerCreate()

  console.log('\n-----------------')
  console.log('Holder / Patient DID')
  console.log(holder.did)
  console.log('-----------------')

  return holder
}

export async function createPresentation(
  holderDid: string,
  credential: any
) {

  // Der Patient beantwortet den Proof Request der Apotheke:
  // Er verpackt das E-Rezept in eine Verifiable Presentation
  // und signiert diese mit seinem eigenen Schlüssel.
  const presentation = await agent.createVerifiablePresentation({

    presentation: {

      // Wer legt die Nachweise vor? -> der Patient
      holder: holderDid,

      // Die vorgelegten Credentials (hier: das E-Rezept)
      verifiableCredential: [credential],
    },

    // Auch die Presentation wird als JWT signiert.
    proofFormat: 'jwt',
  })

  console.log('\n-----------------')
  console.log('Verifiable Presentation (Antwort auf Proof Request)')
  console.dir(presentation, { depth: null })
  console.log('-----------------')

  return presentation
}