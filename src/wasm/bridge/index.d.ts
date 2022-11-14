/* tslint:disable */
/* eslint-disable */
/**
* @param {string} funder_pubkey
* @param {string} initializer_pubkey
* @param {string} guardian
* @param {string} withdrawal_manager
* @returns {any}
*/
export function initializeSettings(funder_pubkey: string, initializer_pubkey: string, guardian: string, withdrawal_manager: string): any;
/**
* @param {string} funder_pubkey
* @param {string} initializer_pubkey
* @param {string} name
* @param {number} ever_decimals
* @param {number} solana_decimals
* @param {bigint} deposit_limit
* @param {bigint} withdrawal_limit
* @param {bigint} withdrawal_daily_limit
* @returns {any}
*/
export function initializeMint(funder_pubkey: string, initializer_pubkey: string, name: string, ever_decimals: number, solana_decimals: number, deposit_limit: bigint, withdrawal_limit: bigint, withdrawal_daily_limit: bigint): any;
/**
* @param {string} funder_pubkey
* @param {string} initializer_pubkey
* @param {string} mint_pubkey
* @param {string} name
* @param {number} ever_decimals
* @param {bigint} deposit_limit
* @param {bigint} withdrawal_limit
* @param {bigint} withdrawal_daily_limit
* @returns {any}
*/
export function initializeVault(funder_pubkey: string, initializer_pubkey: string, mint_pubkey: string, name: string, ever_decimals: number, deposit_limit: bigint, withdrawal_limit: bigint, withdrawal_daily_limit: bigint): any;
/**
* @param {string} funder_pubkey
* @param {string} author_pubkey
* @param {string} name
* @param {number} event_timestamp
* @param {bigint} event_transaction_lt
* @param {string} event_configuration
* @param {string} sender_address
* @param {string} recipient_address
* @param {string} amount
* @param {number} round_number
* @returns {any}
*/
export function withdrawalRequest(funder_pubkey: string, author_pubkey: string, name: string, event_timestamp: number, event_transaction_lt: bigint, event_configuration: string, sender_address: string, recipient_address: string, amount: string, round_number: number): any;
/**
* @param {string} authority_pubkey
* @param {string} to_pubkey
* @param {string} name
* @param {string} withdrawal_pubkey
* @returns {any}
*/
export function approveWithdrawalEver(authority_pubkey: string, to_pubkey: string, name: string, withdrawal_pubkey: string): any;
/**
* @param {string} authority_pubkey
* @param {string} to_pubkey
* @param {string} name
* @param {string} withdrawal_pubkey
* @returns {any}
*/
export function approveWithdrawalEverByOwner(authority_pubkey: string, to_pubkey: string, name: string, withdrawal_pubkey: string): any;
/**
* @param {string} authority_pubkey
* @param {string} mint_pubkey
* @param {string} name
* @param {string} withdrawal_pubkey
* @param {string} to_pubkey
* @returns {any}
*/
export function approveWithdrawalSol(authority_pubkey: string, mint_pubkey: string, name: string, withdrawal_pubkey: string, to_pubkey: string): any;
/**
* @param {string} authority_pubkey
* @param {string} mint_pubkey
* @param {string} name
* @param {string} withdrawal_pubkey
* @param {string} to_pubkey
* @returns {any}
*/
export function approveWithdrawalSolByOwner(authority_pubkey: string, mint_pubkey: string, name: string, withdrawal_pubkey: string, to_pubkey: string): any;
/**
* @param {string} to_pubkey
* @param {string} name
* @param {string} withdrawal_pubkey
* @returns {any}
*/
export function withdrawalEver(to_pubkey: string, name: string, withdrawal_pubkey: string): any;
/**
* @param {string} to_pubkey
* @param {string} mint_pubkey
* @param {string} withdrawal_pubkey
* @param {string} name
* @returns {any}
*/
export function withdrawalSol(to_pubkey: string, mint_pubkey: string, withdrawal_pubkey: string, name: string): any;
/**
* @param {string} funder_pubkey
* @param {string} author_pubkey
* @param {string} withdrawal_pubkey
* @param {string} deposit_seed
* @param {string} name
* @param {string | undefined} recipient_address
* @returns {any}
*/
export function cancelWithdrawalSol(funder_pubkey: string, author_pubkey: string, withdrawal_pubkey: string, deposit_seed: string, name: string, recipient_address?: string): any;
/**
* @param {string} funder_pubkey
* @param {string} author_pubkey
* @param {string} to_pubkey
* @param {string} mint_pubkey
* @param {string} withdrawal_pubkey
* @param {string} name
* @param {string} deposit_seed
* @param {string} recipient_address
* @returns {any}
*/
export function fillWithdrawalSol(funder_pubkey: string, author_pubkey: string, to_pubkey: string, mint_pubkey: string, withdrawal_pubkey: string, name: string, deposit_seed: string, recipient_address: string): any;
/**
* @param {string} funder_pubkey
* @param {string} authority_pubkey
* @param {string} author_token_pubkey
* @param {string} name
* @param {string} deposit_seed
* @param {string} recipient_address
* @param {bigint} amount
* @returns {any}
*/
export function depositEver(funder_pubkey: string, authority_pubkey: string, author_token_pubkey: string, name: string, deposit_seed: string, recipient_address: string, amount: bigint): any;
/**
* @param {string} funder_pubkey
* @param {string} author_pubkey
* @param {string} mint_pubkey
* @param {string} author_token_pubkey
* @param {string} name
* @param {string} deposit_seed
* @param {string} recipient_address
* @param {bigint} amount
* @returns {any}
*/
export function depositSol(funder_pubkey: string, author_pubkey: string, mint_pubkey: string, author_token_pubkey: string, name: string, deposit_seed: string, recipient_address: string, amount: bigint): any;
/**
* @param {string} authority_pubkey
* @param {string} withdrawal_pubkey
* @param {number} round_number
* @returns {any}
*/
export function voteForWithdrawRequest(authority_pubkey: string, withdrawal_pubkey: string, round_number: number): any;
/**
* @param {string} authority_pubkey
* @param {string} new_guardian
* @returns {any}
*/
export function changeGuardian(authority_pubkey: string, new_guardian: string): any;
/**
* @param {string} authority_pubkey
* @param {string} new_withdrawal_manager
* @returns {any}
*/
export function changeWithdrawalManager(authority_pubkey: string, new_withdrawal_manager: string): any;
/**
* @param {string} author_pubkey
* @param {string} withdrawal_pubkey
* @param {bigint} bounty
* @returns {any}
*/
export function changeBounty(author_pubkey: string, withdrawal_pubkey: string, bounty: bigint): any;
/**
* @param {string} authority_pubkey
* @param {string} name
* @param {bigint} new_deposit_limit
* @returns {any}
*/
export function changeDepositLimit(authority_pubkey: string, name: string, new_deposit_limit: bigint): any;
/**
* @param {string} authority_pubkey
* @param {string} name
* @param {bigint | undefined} new_withdrawal_limit
* @param {bigint | undefined} new_withdrawal_daily_limit
* @returns {any}
*/
export function changeWithdrawalLimits(authority_pubkey: string, name: string, new_withdrawal_limit?: bigint, new_withdrawal_daily_limit?: bigint): any;
/**
* @param {string} authority_pubkey
* @returns {any}
*/
export function enableEmergency(authority_pubkey: string): any;
/**
* @param {string} authority_pubkey
* @returns {any}
*/
export function enableEmergencyByOwner(authority_pubkey: string): any;
/**
* @param {string} authority_pubkey
* @returns {any}
*/
export function disableEmergency(authority_pubkey: string): any;
/**
* @param {string} authority_pubkey
* @param {string} token_name
* @returns {any}
*/
export function enableTokenEmergency(authority_pubkey: string, token_name: string): any;
/**
* @param {string} authority_pubkey
* @param {string} token_name
* @returns {any}
*/
export function enableTokenEmergencyByOwner(authority_pubkey: string, token_name: string): any;
/**
* @param {string} authority_pubkey
* @param {string} token_name
* @returns {any}
*/
export function disableTokenEmergency(authority_pubkey: string, token_name: string): any;
/**
* @param {Uint8Array} data
* @returns {any}
*/
export function unpackSettings(data: Uint8Array): any;
/**
* @param {Uint8Array} data
* @returns {any}
*/
export function unpackTokenSettings(data: Uint8Array): any;
/**
* @param {Uint8Array} data
* @returns {any}
*/
export function unpackWithdrawal(data: Uint8Array): any;
/**
* @param {Uint8Array} data
* @returns {any}
*/
export function unpackDeposit(data: Uint8Array): any;
/**
* @param {string} token_settings
* @param {number} round_number
* @param {number} event_timestamp
* @param {bigint} event_transaction_lt
* @param {string} event_configuration
* @param {string} sender_address
* @param {string} recipient_address
* @param {string} amount
* @returns {any}
*/
export function getProposalAddress(token_settings: string, round_number: number, event_timestamp: number, event_transaction_lt: bigint, event_configuration: string, sender_address: string, recipient_address: string, amount: string): any;
/**
* Initialize Javascript logging and panic handler
*/
export function init(): void;
/**
*/
export class Hash {
  free(): void;
/**
* Create a new Hash object
*
* * `value` - optional hash as a base58 encoded string, `Uint8Array`, `[number]`
* @param {any} value
*/
  constructor(value: any);
/**
* Return the base58 string representation of the hash
* @returns {string}
*/
  toString(): string;
/**
* Checks if two `Hash`s are equal
* @param {Hash} other
* @returns {boolean}
*/
  equals(other: Hash): boolean;
/**
* Return the `Uint8Array` representation of the hash
* @returns {Uint8Array}
*/
  toBytes(): Uint8Array;
}
/**
* A directive for a single invocation of a Solana program.
*
* An instruction specifies which program it is calling, which accounts it may
* read or modify, and additional data that serves as input to the program. One
* or more instructions are included in transactions submitted by Solana
* clients. Instructions are also used to describe [cross-program
* invocations][cpi].
*
* [cpi]: https://docs.solana.com/developing/programming-model/calling-between-programs
*
* During execution, a program will receive a list of account data as one of
* its arguments, in the same order as specified during `Instruction`
* construction.
*
* While Solana is agnostic to the format of the instruction data, it has
* built-in support for serialization via [`borsh`] and [`bincode`].
*
* [`borsh`]: https://docs.rs/borsh/latest/borsh/
* [`bincode`]: https://docs.rs/bincode/latest/bincode/
*
* # Specifying account metadata
*
* When constructing an [`Instruction`], a list of all accounts that may be
* read or written during the execution of that instruction must be supplied as
* [`AccountMeta`] values.
*
* Any account whose data may be mutated by the program during execution must
* be specified as writable. During execution, writing to an account that was
* not specified as writable will cause the transaction to fail. Writing to an
* account that is not owned by the program will cause the transaction to fail.
*
* Any account whose lamport balance may be mutated by the program during
* execution must be specified as writable. During execution, mutating the
* lamports of an account that was not specified as writable will cause the
* transaction to fail. While _subtracting_ lamports from an account not owned
* by the program will cause the transaction to fail, _adding_ lamports to any
* account is allowed, as long is it is mutable.
*
* Accounts that are not read or written by the program may still be specified
* in an `Instruction`'s account list. These will affect scheduling of program
* execution by the runtime, but will otherwise be ignored.
*
* When building a transaction, the Solana runtime coalesces all accounts used
* by all instructions in that transaction, along with accounts and permissions
* required by the runtime, into a single account list. Some accounts and
* account permissions required by the runtime to process a transaction are
* _not_ required to be included in an `Instruction`s account list. These
* include:
*
* - The program ID &mdash; it is a separate field of `Instruction`
* - The transaction's fee-paying account &mdash; it is added during [`Message`]
*   construction. A program may still require the fee payer as part of the
*   account list if it directly references it.
*
* [`Message`]: crate::message::Message
*
* Programs may require signatures from some accounts, in which case they
* should be specified as signers during `Instruction` construction. The
* program must still validate during execution that the account is a signer.
*/
export class Instruction {
  free(): void;
}
/**
*/
export class Instructions {
  free(): void;
/**
*/
  constructor();
/**
* @param {Instruction} instruction
*/
  push(instruction: Instruction): void;
}
/**
* A Solana transaction message (legacy).
*
* See the [`message`] module documentation for further description.
*
* [`message`]: crate::message
*
* Some constructors accept an optional `payer`, the account responsible for
* paying the cost of executing a transaction. In most cases, callers should
* specify the payer explicitly in these constructors. In some cases though,
* the caller is not _required_ to specify the payer, but is still allowed to:
* in the `Message` structure, the first account is always the fee-payer, so if
* the caller has knowledge that the first account of the constructed
* transaction's `Message` is both a signer and the expected fee-payer, then
* redundantly specifying the fee-payer is not strictly required.
*/
export class Message {
  free(): void;
/**
* The id of a recent ledger entry.
*/
  recent_blockhash: Hash;
}
/**
*/
export class Pubkey {
  free(): void;
/**
* Create a new Pubkey object
*
* * `value` - optional public key as a base58 encoded string, `Uint8Array`, `[number]`
* @param {any} value
*/
  constructor(value: any);
/**
* Return the base58 string representation of the public key
* @returns {string}
*/
  toString(): string;
/**
* Check if a `Pubkey` is on the ed25519 curve.
* @returns {boolean}
*/
  isOnCurve(): boolean;
/**
* Checks if two `Pubkey`s are equal
* @param {Pubkey} other
* @returns {boolean}
*/
  equals(other: Pubkey): boolean;
/**
* Return the `Uint8Array` representation of the public key
* @returns {Uint8Array}
*/
  toBytes(): Uint8Array;
/**
* Derive a Pubkey from another Pubkey, string seed, and a program id
* @param {Pubkey} base
* @param {string} seed
* @param {Pubkey} owner
* @returns {Pubkey}
*/
  static createWithSeed(base: Pubkey, seed: string, owner: Pubkey): Pubkey;
/**
* Derive a program address from seeds and a program id
* @param {any[]} seeds
* @param {Pubkey} program_id
* @returns {Pubkey}
*/
  static createProgramAddress(seeds: any[], program_id: Pubkey): Pubkey;
/**
* Find a valid program address
*
* Returns:
* * `[PubKey, number]` - the program address and bump seed
* @param {any[]} seeds
* @param {Pubkey} program_id
* @returns {any}
*/
  static findProgramAddress(seeds: any[], program_id: Pubkey): any;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly initializeSettings: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly initializeMint: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number) => void;
  readonly initializeVault: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => void;
  readonly withdrawalRequest: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number, r: number) => void;
  readonly approveWithdrawalEver: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly approveWithdrawalEverByOwner: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly approveWithdrawalSol: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => void;
  readonly approveWithdrawalSolByOwner: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => void;
  readonly withdrawalEver: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly withdrawalSol: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly cancelWithdrawalSol: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => void;
  readonly fillWithdrawalSol: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number) => void;
  readonly depositEver: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number) => void;
  readonly depositSol: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number) => void;
  readonly voteForWithdrawRequest: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly changeGuardian: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly changeWithdrawalManager: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly changeBounty: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly changeDepositLimit: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly changeWithdrawalLimits: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly enableEmergency: (a: number, b: number, c: number) => void;
  readonly enableEmergencyByOwner: (a: number, b: number, c: number) => void;
  readonly disableEmergency: (a: number, b: number, c: number) => void;
  readonly enableTokenEmergency: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly enableTokenEmergencyByOwner: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly disableTokenEmergency: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly unpackSettings: (a: number, b: number, c: number) => void;
  readonly unpackTokenSettings: (a: number, b: number, c: number) => void;
  readonly unpackWithdrawal: (a: number, b: number, c: number) => void;
  readonly unpackDeposit: (a: number, b: number, c: number) => void;
  readonly getProposalAddress: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number) => void;
  readonly hash_constructor: (a: number, b: number) => void;
  readonly hash_toString: (a: number, b: number) => void;
  readonly hash_equals: (a: number, b: number) => number;
  readonly hash_toBytes: (a: number, b: number) => void;
  readonly init: () => void;
  readonly __wbg_pubkey_free: (a: number) => void;
  readonly pubkey_constructor: (a: number, b: number) => void;
  readonly pubkey_toString: (a: number, b: number) => void;
  readonly pubkey_isOnCurve: (a: number) => number;
  readonly pubkey_equals: (a: number, b: number) => number;
  readonly pubkey_toBytes: (a: number, b: number) => void;
  readonly pubkey_createWithSeed: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly pubkey_createProgramAddress: (a: number, b: number, c: number, d: number) => void;
  readonly pubkey_findProgramAddress: (a: number, b: number, c: number, d: number) => void;
  readonly __wbg_instructions_free: (a: number) => void;
  readonly instructions_constructor: () => number;
  readonly instructions_push: (a: number, b: number) => void;
  readonly __wbg_instruction_free: (a: number) => void;
  readonly __wbg_hash_free: (a: number) => void;
  readonly __wbg_message_free: (a: number) => void;
  readonly __wbg_get_message_recent_blockhash: (a: number) => number;
  readonly __wbg_set_message_recent_blockhash: (a: number, b: number) => void;
  readonly systeminstruction_createAccount: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly systeminstruction_createAccountWithSeed: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
  readonly systeminstruction_assign: (a: number, b: number) => number;
  readonly systeminstruction_assignWithSeed: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly systeminstruction_transfer: (a: number, b: number, c: number) => number;
  readonly systeminstruction_transferWithSeed: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly systeminstruction_allocate: (a: number, b: number) => number;
  readonly systeminstruction_allocateWithSeed: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly systeminstruction_createNonceAccount: (a: number, b: number, c: number, d: number) => number;
  readonly systeminstruction_advanceNonceAccount: (a: number, b: number) => number;
  readonly systeminstruction_withdrawNonceAccount: (a: number, b: number, c: number, d: number) => number;
  readonly systeminstruction_authorizeNonceAccount: (a: number, b: number, c: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
