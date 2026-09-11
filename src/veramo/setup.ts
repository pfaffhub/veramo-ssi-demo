
//Grundfunktion und Interface von Veramo Agents
import {
  createAgent,
  IDIDManager,
  IKeyManager,
  IResolver
} from '@veramo/core'

//Verwaltung von DIDs
import {
  DIDManager,
  MemoryDIDStore,
} from '@veramo/did-manager'

//Verwaltung kryptografischer Schlüssel
import {
  KeyManager,
  MemoryKeyStore,
  MemoryPrivateKeyStore,
} from '@veramo/key-manager'

//local Key Managment
import { KeyManagementSystem } from '@veramo/kms-local'
//Etherium DID Methode
import { DIDResolverPlugin } from '@veramo/did-resolver'
//DID  Resolution
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
import { EthrDIDProvider } from '@veramo/did-provider-ethr'

//Verifiable Credentials
import {
  CredentialPlugin,
  ICredentialIssuer,
  ICredentialVerifier,
} from '@veramo/credential-w3c'

//JWT als Proof für das Verifiable Credentials
import { CredentialProviderJWT } from '@veramo/credential-jwt'

// Key Manager verwalter die Schlüssel die dann für die Signatur benötigt werden

const keyManager = new KeyManager ({ 
    // Speichert informationen über unsere Keys im RAM
    store: new MemoryKeyStore(),
    // kms = KeyManagementSystem "local" = name von localen KMS
    kms: {                          
        local: new KeyManagementSystem(
            //private key erzeugt 
            new MemoryPrivateKeyStore  
        )
    }
})

// DID Manger verwaltet die DIDs
const didManager = new DIDManager({
    //locale verwaltung der DIDs
    store: new MemoryDIDStore(),
    //wenn nix angeben wird verwendet man das Sepolia Testnetz
    defaultProvider: 'did:ethr:sepolia',

    providers: {
        'did:ethr:sepolia': new EthrDIDProvider({
        defaultKms: 'local',
        network: 'sepolia',
    }),
  },
})

// DID Resolver nimmt eine Did (did:ethr:seopolia:0x03...) und erzeugt dann ein DID Document
//
const didResolver = new DIDResolverPlugin({
    ...ethrDidResolver({
        networks: [{
            //Etherium Test-netz
            name: 'sepolia',
            //Chein ID von Sepolia
            chainId: 11155111,
            //RPC ist die Schnittstelle zu einem Etherium Node und der Resolver kann daten aus dem Netz lesen
            rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
        }]
    })
})

//Credential Plugin
//Erstellung und Überprüfen von VC

//JWT wird als Proof format verwendet
const credentialPlugin = new CredentialPlugin([
  new CredentialProviderJWT()
])

//Agent  verbindet alle Plugins
//Schlüssel verwalten, DID erstellen, DIDs auflösen, VC erstellen, VC überprüfen
const agent = createAgent<
  IKeyManager &
  IDIDManager &
  IResolver &
  ICredentialIssuer &
  ICredentialVerifier
>({
  plugins: [
    keyManager,
    didManager,
    didResolver,
    credentialPlugin,
  ],
})

// Test zwei Rollen Issuer und Holder 

const issuer = await agent.didManagerCreate()
const holder = await agent.didManagerCreate()

console.log("\n-----------------")
console.log("Isuer / FH DID")
console.log(issuer.did)
console.log("-----------------")

console.log("\n-----------------")
console.log("Holder / Student")
console.log(holder.did)

console.log("-----------------")

// Dokument vom Issuer
const issuerResolution = await agent.resolveDid({
    didUrl: issuer.did,
})


console.log("\n-----------------")
console.log("Issuer DID Document")
console.dir(issuerResolution.didDocument, {depth:null})
console.log("-----------------")
//VC Austellen 
const credential = await agent.createVerifiableCredential({
  credential: {
    //Wer stellt das Credential aus
    issuer: {
      id: issuer.did,       //DID behauptet austeller zu sein
    },
    //Um welches DID geht es
    credentialSubject: {
        //Student DID
      id: holder.did,
      //Ausagen/Claims über den Holder
      name: 'Max Mustermann',
      degree: 'IT-Security',
    },
  },
  //Credential wird als mit JWT token signiert
  proofFormat: 'jwt',
})

console.log("\n-----------------")
console.log("Verifiable Credential")
console.dir(credential, { depth: null })
console.log("-----------------")

// Credential Verification
const verificationResult = await agent.verifyCredential({
  credential: credential,
})


console.log("\n-----------------")
console.log("------------- Verifiable Credential -------------")
console.dir(verificationResult, { depth: null })
console.log("-----------------")

const manipulatedCredential = {
  ...credential,
  credentialSubject: {
    ...credential.credentialSubject,
    degree: 'Professor für IT-Security',
  },
}

const manipulatedResult = await agent.verifyCredential({
  credential: manipulatedCredential,
})


console.log("\n-----------------")
console.log(" Manipuliertes Credential")
console.dir(manipulatedResult, { depth: null })

console.log("-----------------")