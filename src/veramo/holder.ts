import { agent } from './agent.js'

export async function createHolder() {

  // Erstellt die DID des Studenten.
  const holder = await agent.didManagerCreate()

  console.log('\n-----------------')
  console.log('Holder / Student')
  console.log(holder.did)
  console.log('-----------------')

  return holder
}