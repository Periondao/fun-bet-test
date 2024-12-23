/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/fanplay.json`.
 */
export type Fanplay = {
  address: 'iLEPWontSkuaCDeg8psrxB3mVHAA39fWWRtinSJcrtJ'
  metadata: {
    name: 'fanplay'
    version: '0.1.0'
    spec: '0.1.0'
    description: 'Created with Anchor'
  }
  instructions: [
    {
      name: 'createPool'
      discriminator: [233, 146, 209, 142, 207, 104, 64, 188]
      accounts: [
        {
          name: 'poolAdmin'
          writable: true
          signer: true
        },
        {
          name: 'poolAccount'
          writable: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'poolId'
          type: 'string'
        },
        {
          name: 'gameId'
          type: 'u32'
        }
      ]
    },
    {
      name: 'payout'
      discriminator: [149, 140, 194, 236, 174, 189, 6, 239]
      accounts: [
        {
          name: 'poolAccount'
          writable: true
        },
        {
          name: 'tokenAccount'
          writable: true
        },
        {
          name: 'poolAdmin'
          writable: true
          signer: true
        },
        {
          name: 'adminTokenAccount'
          writable: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
        {
          name: 'tokenProgram'
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
        }
      ]
      args: [
        {
          name: 'rake'
          type: 'u64'
        },
        {
          name: 'poolBump'
          type: 'u8'
        },
        {
          name: 'payoutList'
          type: {
            vec: {
              defined: {
                name: 'payoutItem'
              }
            }
          }
        }
      ]
    },
    {
      name: 'placePick'
      discriminator: [3, 215, 3, 176, 155, 59, 179, 108]
      accounts: [
        {
          name: 'poolAccount'
          writable: true
        },
        {
          name: 'tokenAccount'
          writable: true
        },
        {
          name: 'userAta'
          writable: true
        },
        {
          name: 'user'
          signer: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
        {
          name: 'tokenProgram'
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
        }
      ]
      args: [
        {
          name: 'pickSpec'
          type: 'string'
        },
        {
          name: 'amount'
          type: 'u64'
        }
      ]
    }
  ]
  accounts: [
    {
      name: 'poolAccount'
      discriminator: [116, 210, 187, 119, 196, 196, 52, 137]
    }
  ]
  types: [
    {
      name: 'payoutItem'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'userTokenAccount'
            type: 'pubkey'
          },
          {
            name: 'userKey'
            type: 'pubkey'
          },
          {
            name: 'amount'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'poolAccount'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'poolId'
            type: 'string'
          },
          {
            name: 'gameId'
            type: 'u32'
          },
          {
            name: 'pickCount'
            type: 'u32'
          },
          {
            name: 'picksHash'
            type: 'u32'
          }
        ]
      }
    }
  ]
}
