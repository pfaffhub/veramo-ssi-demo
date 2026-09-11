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

import { KeyManagementSystem } from '@veramo/kms-local'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
import { EthrDIDProvider } from '@veramo/did-provider-ethr'

import {
  CredentialPlugin,
  ICredentialIssuer,
  ICredentialVerifier,
} from '@veramo/credential-w3c'

import { CredentialProviderJWT } from '@veramo/credential-jwt'

// KEY MANAGER

// Verwaltet die kryptografischen Schlüssel,
// die später für DIDs und Signaturen benötigt werden.
const keyManager = new KeyManager({

  // Speichert Metadaten über die Keys im RAM.
  store: new MemoryKeyStore(),

  // KMS = Key Management System
  kms: {
    local: new KeyManagementSystem(

      // Speichert das geheime Private-Key-Material im RAM.
      new MemoryPrivateKeyStore()
    )
  }
})


// DID MANAGER

// Erstellt und verwaltet unsere DIDs.
const didManager = new DIDManager({

  // Verwaltete DIDs werden momentan nur im RAM gespeichert.
  store: new MemoryDIDStore(),

  // Standardmäßig verwenden wir did:ethr im Sepolia-Testnetz.
  defaultProvider: 'did:ethr:sepolia',

  providers: {
    'did:ethr:sepolia': new EthrDIDProvider({
      defaultKms: 'local',
      network: 'sepolia',
    }),
  },
})


// ======================================================
// DID RESOLVER
// ======================================================

// Löst eine did:ethr-DID in ein DID Document auf.
const didResolver = new DIDResolverPlugin({

  ...ethrDidResolver({
    networks: [{
      name: 'sepolia',

      // Chain-ID von Sepolia
      chainId: 11155111,

      // RPC-Schnittstelle zu einem Ethereum Node
      rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
    }]
  })
})


// ======================================================
// CREDENTIAL PLUGIN
// ======================================================

// Ermöglicht das Erstellen und Verifizieren
// von Verifiable Credentials.
const credentialPlugin = new CredentialPlugin([
  new CredentialProviderJWT()
])

// VERAMO AGENT

export const agent = createAgent<
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