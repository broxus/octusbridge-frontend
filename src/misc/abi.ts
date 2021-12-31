/* eslint-disable max-classes-per-file */
import { AbiItem } from 'web3-utils'

export class DexAbi {

    static Root = {
        'ABI version': 2,
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: 'initial_owner', type: 'address' },
                    { name: 'initial_vault', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'installPlatformOnce',
                inputs: [
                    { name: 'code', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'installOrUpdateAccountCode',
                inputs: [
                    { name: 'code', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'installOrUpdatePairCode',
                inputs: [
                    { name: 'code', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'getAccountVersion',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint32' },
                ],
            },
            {
                name: 'getPairVersion',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint32' },
                ],
            },
            {
                name: 'setVaultOnce',
                inputs: [
                    { name: 'new_vault', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'getVault',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'setActive',
                inputs: [
                    { name: 'new_active', type: 'bool' },
                ],
                outputs: [],
            },
            {
                name: 'isActive',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'bool' },
                ],
            },
            {
                name: 'upgrade',
                inputs: [
                    { name: 'code', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'requestUpgradeAccount',
                inputs: [
                    { name: 'current_version', type: 'uint32' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'account_owner', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'forceUpgradeAccount',
                inputs: [
                    { name: 'account_owner', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'upgradePair',
                inputs: [
                    { name: 'left_root', type: 'address' },
                    { name: 'right_root', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'resetGas',
                inputs: [
                    { name: 'receiver', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'resetTargetGas',
                inputs: [
                    { name: 'target', type: 'address' },
                    { name: 'receiver', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'getOwner',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'dex_owner', type: 'address' },
                ],
            },
            {
                name: 'getPendingOwner',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'dex_pending_owner', type: 'address' },
                ],
            },
            {
                name: 'transferOwner',
                inputs: [
                    { name: 'new_owner', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'acceptOwner',
                inputs: [],
                outputs: [],
            },
            {
                name: 'getExpectedAccountAddress',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                    { name: 'account_owner', type: 'address' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'getExpectedPairAddress',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                    { name: 'left_root', type: 'address' },
                    { name: 'right_root', type: 'address' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'deployAccount',
                inputs: [
                    { name: 'account_owner', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'deployPair',
                inputs: [
                    { name: 'left_root', type: 'address' },
                    { name: 'right_root', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'onPairCreated',
                inputs: [
                    { name: 'left_root', type: 'address' },
                    { name: 'right_root', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'platform_code',
                inputs: [],
                outputs: [
                    { name: 'platform_code', type: 'cell' },
                ],
            },
            {
                name: 'account_code',
                inputs: [],
                outputs: [
                    { name: 'account_code', type: 'cell' },
                ],
            },
            {
                name: 'pair_code',
                inputs: [],
                outputs: [
                    { name: 'pair_code', type: 'cell' },
                ],
            },
        ],
        data: [
            { key: 1, name: '_nonce', type: 'uint32' },
        ],
        events: [
            {
                name: 'AccountCodeUpgraded',
                inputs: [
                    { name: 'version', type: 'uint32' },
                ],
                outputs: [],
            },
            {
                name: 'PairCodeUpgraded',
                inputs: [
                    { name: 'version', type: 'uint32' },
                ],
                outputs: [],
            },
            {
                name: 'RootCodeUpgraded',
                inputs: [],
                outputs: [],
            },
            {
                name: 'ActiveUpdated',
                inputs: [
                    { name: 'new_active', type: 'bool' },
                ],
                outputs: [],
            },
            {
                name: 'RequestedPairUpgrade',
                inputs: [
                    { name: 'left_root', type: 'address' },
                    { name: 'right_root', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'RequestedForceAccountUpgrade',
                inputs: [
                    { name: 'account_owner', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'RequestedOwnerTransfer',
                inputs: [
                    { name: 'old_owner', type: 'address' },
                    { name: 'new_owner', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'OwnerTransferAccepted',
                inputs: [
                    { name: 'old_owner', type: 'address' },
                    { name: 'new_owner', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'NewPairCreated',
                inputs: [
                    { name: 'left_root', type: 'address' },
                    { name: 'right_root', type: 'address' },
                ],
                outputs: [],
            },
        ],
    } as const

    static Pair = {
        'ABI version': 2,
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [],
                outputs: [],
            },
            {
                name: 'resetGas',
                inputs: [
                    { name: 'receiver', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'getRoot',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'dex_root', type: 'address' },
                ],
            },
            {
                name: 'getTokenRoots',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'left', type: 'address' },
                    { name: 'right', type: 'address' },
                    { name: 'lp', type: 'address' },
                ],
            },
            {
                name: 'getTokenWallets',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'left', type: 'address' },
                    { name: 'right', type: 'address' },
                    { name: 'lp', type: 'address' },
                ],
            },
            {
                name: 'getVersion',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'version', type: 'uint32' },
                ],
            },
            {
                name: 'getVault',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'dex_vault', type: 'address' },
                ],
            },
            {
                name: 'getVaultWallets',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'left', type: 'address' },
                    { name: 'right', type: 'address' },
                ],
            },
            {
                name: 'setFeeParams',
                inputs: [
                    { name: 'numerator', type: 'uint16' },
                    { name: 'denominator', type: 'uint16' },
                ],
                outputs: [],
            },
            {
                name: 'getFeeParams',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'numerator', type: 'uint16' },
                    { name: 'denominator', type: 'uint16' },
                ],
            },
            {
                name: 'isActive',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'bool' },
                ],
            },
            {
                name: 'getBalances',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    {
                        components: [{ name: 'lp_supply', type: 'uint128' }, {
                            name: 'left_balance',
                            type: 'uint128',
                        }, { name: 'right_balance', type: 'uint128' }],
                        name: 'value0',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'buildExchangePayload',
                inputs: [
                    { name: 'id', type: 'uint64' },
                    { name: 'deploy_wallet_grams', type: 'uint128' },
                    { name: 'expected_amount', type: 'uint128' },
                ],
                outputs: [
                    { name: 'value0', type: 'cell' },
                ],
            },
            {
                name: 'buildDepositLiquidityPayload',
                inputs: [
                    { name: 'id', type: 'uint64' },
                    { name: 'deploy_wallet_grams', type: 'uint128' },
                ],
                outputs: [
                    { name: 'value0', type: 'cell' },
                ],
            },
            {
                name: 'buildWithdrawLiquidityPayload',
                inputs: [
                    { name: 'id', type: 'uint64' },
                    { name: 'deploy_wallet_grams', type: 'uint128' },
                ],
                outputs: [
                    { name: 'value0', type: 'cell' },
                ],
            },
            {
                name: 'buildCrossPairExchangePayload',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                    { name: 'id', type: 'uint64' },
                    { name: 'deploy_wallet_grams', type: 'uint128' },
                    { name: 'expected_amount', type: 'uint128' },
                    {
                        components: [{ name: 'amount', type: 'uint128' }, { name: 'root', type: 'address' }],
                        name: 'steps',
                        type: 'tuple[]',
                    },
                ],
                outputs: [
                    { name: 'value0', type: 'cell' },
                ],
            },
            {
                name: 'tokensReceivedCallback',
                inputs: [
                    { name: 'token_wallet', type: 'address' },
                    { name: 'token_root', type: 'address' },
                    { name: 'tokens_amount', type: 'uint128' },
                    { name: 'sender_public_key', type: 'uint256' },
                    { name: 'sender_address', type: 'address' },
                    { name: 'sender_wallet', type: 'address' },
                    { name: 'original_gas_to', type: 'address' },
                    { name: 'value7', type: 'uint128' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'expectedDepositLiquidity',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                    { name: 'left_amount', type: 'uint128' },
                    { name: 'right_amount', type: 'uint128' },
                    { name: 'auto_change', type: 'bool' },
                ],
                outputs: [
                    {
                        components: [{ name: 'step_1_left_deposit', type: 'uint128' }, {
                            name: 'step_1_right_deposit',
                            type: 'uint128',
                        }, { name: 'step_1_lp_reward', type: 'uint128' }, {
                            name: 'step_2_left_to_right',
                            type: 'bool',
                        }, { name: 'step_2_right_to_left', type: 'bool' }, {
                            name: 'step_2_spent',
                            type: 'uint128',
                        }, { name: 'step_2_fee', type: 'uint128' }, {
                            name: 'step_2_received',
                            type: 'uint128',
                        }, { name: 'step_3_left_deposit', type: 'uint128' }, {
                            name: 'step_3_right_deposit',
                            type: 'uint128',
                        }, { name: 'step_3_lp_reward', type: 'uint128' }],
                        name: 'value0',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'depositLiquidity',
                inputs: [
                    { name: 'call_id', type: 'uint64' },
                    { name: 'left_amount', type: 'uint128' },
                    { name: 'right_amount', type: 'uint128' },
                    { name: 'expected_lp_root', type: 'address' },
                    { name: 'auto_change', type: 'bool' },
                    { name: 'account_owner', type: 'address' },
                    { name: 'value6', type: 'uint32' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'expectedWithdrawLiquidity',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                    { name: 'lp_amount', type: 'uint128' },
                ],
                outputs: [
                    { name: 'expected_left_amount', type: 'uint128' },
                    { name: 'expected_right_amount', type: 'uint128' },
                ],
            },
            {
                name: 'withdrawLiquidity',
                inputs: [
                    { name: 'call_id', type: 'uint64' },
                    { name: 'lp_amount', type: 'uint128' },
                    { name: 'expected_lp_root', type: 'address' },
                    { name: 'account_owner', type: 'address' },
                    { name: 'value4', type: 'uint32' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'expectedExchange',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'spent_token_root', type: 'address' },
                ],
                outputs: [
                    { name: 'expected_amount', type: 'uint128' },
                    { name: 'expected_fee', type: 'uint128' },
                ],
            },
            {
                name: 'expectedSpendAmount',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                    { name: 'receive_amount', type: 'uint128' },
                    { name: 'receive_token_root', type: 'address' },
                ],
                outputs: [
                    { name: 'expected_amount', type: 'uint128' },
                    { name: 'expected_fee', type: 'uint128' },
                ],
            },
            {
                name: 'exchange',
                inputs: [
                    { name: 'call_id', type: 'uint64' },
                    { name: 'spent_amount', type: 'uint128' },
                    { name: 'spent_token_root', type: 'address' },
                    { name: 'receive_token_root', type: 'address' },
                    { name: 'expected_amount', type: 'uint128' },
                    { name: 'account_owner', type: 'address' },
                    { name: 'value6', type: 'uint32' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'crossPairExchange',
                inputs: [
                    { name: 'id', type: 'uint64' },
                    { name: 'value1', type: 'uint32' },
                    { name: 'prev_pair_left_root', type: 'address' },
                    { name: 'prev_pair_right_root', type: 'address' },
                    { name: 'spent_token_root', type: 'address' },
                    { name: 'spent_amount', type: 'uint128' },
                    { name: 'sender_public_key', type: 'uint256' },
                    { name: 'sender_address', type: 'address' },
                    { name: 'original_gas_to', type: 'address' },
                    { name: 'deploy_wallet_grams', type: 'uint128' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [],
            },
            {
                name: 'checkPair',
                inputs: [
                    { name: 'call_id', type: 'uint64' },
                    { name: 'account_owner', type: 'address' },
                    { name: 'value2', type: 'uint32' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'upgrade',
                inputs: [
                    { name: 'code', type: 'cell' },
                    { name: 'new_version', type: 'uint32' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'afterInitialize',
                inputs: [
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'liquidityTokenRootDeployed',
                inputs: [
                    { name: 'lp_root_', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'liquidityTokenRootNotDeployed',
                inputs: [
                    { name: 'value0', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'expectedWalletAddressCallback',
                inputs: [
                    { name: 'wallet', type: 'address' },
                    { name: 'wallet_public_key', type: 'uint256' },
                    { name: 'owner_address', type: 'address' },
                ],
                outputs: [],
            },
            {
                name: 'platform_code',
                inputs: [],
                outputs: [
                    { name: 'platform_code', type: 'cell' },
                ],
            },
            {
                name: 'lp_wallet',
                inputs: [],
                outputs: [
                    { name: 'lp_wallet', type: 'address' },
                ],
            },
            {
                name: 'left_wallet',
                inputs: [],
                outputs: [
                    { name: 'left_wallet', type: 'address' },
                ],
            },
            {
                name: 'right_wallet',
                inputs: [],
                outputs: [
                    { name: 'right_wallet', type: 'address' },
                ],
            },
            {
                name: 'vault_left_wallet',
                inputs: [],
                outputs: [
                    { name: 'vault_left_wallet', type: 'address' },
                ],
            },
            {
                name: 'vault_right_wallet',
                inputs: [],
                outputs: [
                    { name: 'vault_right_wallet', type: 'address' },
                ],
            },
            {
                name: 'lp_root',
                inputs: [],
                outputs: [
                    { name: 'lp_root', type: 'address' },
                ],
            },
            {
                name: 'lp_supply',
                inputs: [],
                outputs: [
                    { name: 'lp_supply', type: 'uint128' },
                ],
            },
            {
                name: 'left_balance',
                inputs: [],
                outputs: [
                    { name: 'left_balance', type: 'uint128' },
                ],
            },
            {
                name: 'right_balance',
                inputs: [],
                outputs: [
                    { name: 'right_balance', type: 'uint128' },
                ],
            },
        ],
        data: [],
        events: [
            {
                name: 'PairCodeUpgraded',
                inputs: [
                    { name: 'version', type: 'uint32' },
                ],
                outputs: [],
            },
            {
                name: 'FeesParamsUpdated',
                inputs: [
                    { name: 'numerator', type: 'uint16' },
                    { name: 'denominator', type: 'uint16' },
                ],
                outputs: [],
            },
            {
                name: 'DepositLiquidity',
                inputs: [
                    { name: 'left', type: 'uint128' },
                    { name: 'right', type: 'uint128' },
                    { name: 'lp', type: 'uint128' },
                ],
                outputs: [],
            },
            {
                name: 'WithdrawLiquidity',
                inputs: [
                    { name: 'lp', type: 'uint128' },
                    { name: 'left', type: 'uint128' },
                    { name: 'right', type: 'uint128' },
                ],
                outputs: [],
            },
            {
                name: 'ExchangeLeftToRight',
                inputs: [
                    { name: 'left', type: 'uint128' },
                    { name: 'fee', type: 'uint128' },
                    { name: 'right', type: 'uint128' },
                ],
                outputs: [],
            },
            {
                name: 'ExchangeRightToLeft',
                inputs: [
                    { name: 'right', type: 'uint128' },
                    { name: 'fee', type: 'uint128' },
                    { name: 'left', type: 'uint128' },
                ],
                outputs: [],
            },
        ],
    } as const

}

export class StackingAbi {

    static Root = {
        'ABI version': 2,
        version: '2.1',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: '_admin', type: 'address' },
                    { name: '_dao_root', type: 'address' },
                    { name: '_rewarder', type: 'address' },
                    { name: '_rescuer', type: 'address' },
                    { name: '_bridge_event_config_eth_ton', type: 'address' },
                    { name: '_bridge_event_config_ton_eth', type: 'address' },
                    { name: '_tokenRoot', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'upgrade',
                inputs: [
                    { name: 'code', type: 'cell' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'linkRelayAccounts',
                inputs: [
                    { name: 'ton_pubkey', type: 'uint256' },
                    { name: 'eth_address', type: 'uint160' },
                ],
                outputs: [
                ],
            },
            {
                name: 'broxusBridgeCallback',
                inputs: [
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], name: 'eventData', type: 'tuple' },
                    { name: 'gasBackAddress', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'slashRelay',
                inputs: [
                    { name: 'relay_staker_addr', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'confirmSlash',
                inputs: [
                    { name: 'user', type: 'address' },
                    { name: 'user_rewards', type: 'uint128[]' },
                    { name: 'user_debts', type: 'uint128[]' },
                    { name: 'ban_token_balance', type: 'uint128' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'createOriginRelayRound',
                inputs: [
                    { name: 'staker_addrs', type: 'address[]' },
                    { name: 'ton_pubkeys', type: 'uint256[]' },
                    { name: 'eth_addrs', type: 'uint160[]' },
                    { name: 'staked_tokens', type: 'uint128[]' },
                    { name: 'ton_deposit', type: 'uint128' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'processBecomeRelayNextRound',
                inputs: [
                    { name: 'user', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'processGetRewardForRelayRound',
                inputs: [
                    { name: 'user', type: 'address' },
                    { name: 'round_num', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'startElectionOnNewRound',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'endElection',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'onElectionStarted',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'onElectionEnded',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'relay_requests_count', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'onRelayRoundDeployed',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'duplicate', type: 'bool' },
                ],
                outputs: [
                ],
            },
            {
                name: 'onRelayRoundInitialized',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'round_start_time', type: 'uint32' },
                    { name: 'round_end_time', type: 'uint32' },
                    { name: 'relays_count', type: 'uint32' },
                    { name: 'round_reward', type: 'uint128' },
                    { name: 'reward_round_num', type: 'uint32' },
                    { name: 'duplicate', type: 'bool' },
                    { name: 'eth_keys', type: 'uint160[]' },
                ],
                outputs: [
                ],
            },
            {
                name: 'installPlatformOnce',
                inputs: [
                    { name: 'code', type: 'cell' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'installOrUpdateUserDataCode',
                inputs: [
                    { name: 'code', type: 'cell' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'installOrUpdateElectionCode',
                inputs: [
                    { name: 'code', type: 'cell' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'installOrUpdateRelayRoundCode',
                inputs: [
                    { name: 'code', type: 'cell' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'upgradeUserData',
                inputs: [
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'forceUpgradeUserData',
                inputs: [
                    { name: 'user', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'upgradeElection',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'upgradeRelayRound',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getElectionAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'round_num', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'getRelayRoundAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'round_num', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'getRelayRoundAddressFromTimestamp',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'time', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                    { name: 'value1', type: 'uint32' },
                ],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'dao_root', type: 'address' }, { name: 'bridge_event_config_eth_ton', type: 'address' }, { name: 'bridge_event_config_ton_eth', type: 'address' }, { name: 'tokenRoot', type: 'address' }, { name: 'tokenWallet', type: 'address' }, { name: 'admin', type: 'address' }, { name: 'rescuer', type: 'address' }, { name: 'rewarder', type: 'address' }, { name: 'tokenBalance', type: 'uint128' }, { name: 'rewardTokenBalance', type: 'uint128' }, { name: 'lastRewardTime', type: 'uint32' }, { components: [{ name: 'accRewardPerShare', type: 'uint256' }, { name: 'rewardTokens', type: 'uint128' }, { name: 'totalReward', type: 'uint128' }, { name: 'startTime', type: 'uint32' }], name: 'rewardRounds', type: 'tuple[]' }, { name: 'emergency', type: 'bool' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'getCodeData',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'platform_code', type: 'cell' }, { name: 'has_platform_code', type: 'bool' }, { name: 'user_data_code', type: 'cell' }, { name: 'user_data_version', type: 'uint32' }, { name: 'election_code', type: 'cell' }, { name: 'election_version', type: 'uint32' }, { name: 'relay_round_code', type: 'cell' }, { name: 'relay_round_version', type: 'uint32' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'getRelayRoundsDetails',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'currentRelayRound', type: 'uint32' }, { name: 'currentRelayRoundStartTime', type: 'uint32' }, { name: 'currentRelayRoundEndTime', type: 'uint32' }, { name: 'currentElectionStartTime', type: 'uint32' }, { name: 'currentElectionEnded', type: 'bool' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'getRelayConfig',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'relayLockTime', type: 'uint32' }, { name: 'relayRoundTime', type: 'uint32' }, { name: 'electionTime', type: 'uint32' }, { name: 'timeBeforeElection', type: 'uint32' }, { name: 'minRoundGapTime', type: 'uint32' }, { name: 'relaysCount', type: 'uint16' }, { name: 'minRelaysCount', type: 'uint16' }, { name: 'minRelayDeposit', type: 'uint128' }, { name: 'relayInitialTonDeposit', type: 'uint128' }, { name: 'relayRewardPerSecond', type: 'uint128' }, { name: 'userRewardPerSecond', type: 'uint128' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'addDelegate',
                inputs: [
                    { name: 'addr', type: 'address' },
                    { name: 'callHash', type: 'uint256' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setDaoRoot',
                inputs: [
                    { name: 'new_dao_root', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setTonEventDeployValue',
                inputs: [
                    { name: 'new_value', type: 'uint128' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setBridgeEventEthTonConfig',
                inputs: [
                    { name: 'new_bridge_event_config_eth_ton', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setBridgeEventTonEthConfig',
                inputs: [
                    { name: 'new_bridge_event_config_ton_eth', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setAdmin',
                inputs: [
                    { name: 'new_admin', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setRescuer',
                inputs: [
                    { name: 'new_rescuer', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setRewarder',
                inputs: [
                    { name: 'new_rewarder', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setActive',
                inputs: [
                    { name: 'new_active', type: 'bool' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'isActive',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'bool' },
                ],
            },
            {
                name: 'setRelayConfig',
                inputs: [
                    { components: [{ name: 'relayLockTime', type: 'uint32' }, { name: 'relayRoundTime', type: 'uint32' }, { name: 'electionTime', type: 'uint32' }, { name: 'timeBeforeElection', type: 'uint32' }, { name: 'minRoundGapTime', type: 'uint32' }, { name: 'relaysCount', type: 'uint16' }, { name: 'minRelaysCount', type: 'uint16' }, { name: 'minRelayDeposit', type: 'uint128' }, { name: 'relayInitialTonDeposit', type: 'uint128' }, { name: 'relayRewardPerSecond', type: 'uint128' }, { name: 'userRewardPerSecond', type: 'uint128' }], name: 'new_relay_config', type: 'tuple' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'receiveTokenWalletAddress',
                inputs: [
                    { name: 'wallet', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'startNewRewardRound',
                inputs: [
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'tokensReceivedCallback',
                inputs: [
                    { name: 'value0', type: 'address' },
                    { name: 'value1', type: 'address' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'value3', type: 'uint256' },
                    { name: 'sender_address', type: 'address' },
                    { name: 'sender_wallet', type: 'address' },
                    { name: 'original_gas_to', type: 'address' },
                    { name: 'value7', type: 'uint128' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'revertDeposit',
                inputs: [
                    { name: '_deposit_nonce', type: 'uint64' },
                ],
                outputs: [
                ],
            },
            {
                name: 'finishDeposit',
                inputs: [
                    { name: '_deposit_nonce', type: 'uint64' },
                ],
                outputs: [
                ],
            },
            {
                name: 'withdraw',
                inputs: [
                    { name: 'amount', type: 'uint128' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'finishWithdraw',
                inputs: [
                    { name: 'user', type: 'address' },
                    { name: 'withdraw_amount', type: 'uint128' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'claimReward',
                inputs: [
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'finishClaimReward',
                inputs: [
                    { name: 'user', type: 'address' },
                    { name: 'rewards', type: 'uint128[]' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'pendingReward',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'user_token_balance', type: 'uint256' },
                    { components: [{ name: 'reward_balance', type: 'uint128' }, { name: 'reward_debt', type: 'uint128' }], name: 'user_reward_data', type: 'tuple[]' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint256' },
                ],
            },
            {
                name: 'getUserDataAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'user', type: 'address' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'castVote',
                inputs: [
                    { name: 'proposal_id', type: 'uint32' },
                    { name: 'support', type: 'bool' },
                ],
                outputs: [
                ],
            },
            {
                name: 'castVoteWithReason',
                inputs: [
                    { name: 'proposal_id', type: 'uint32' },
                    { name: 'support', type: 'bool' },
                    { name: 'reason', type: 'string' },
                ],
                outputs: [
                ],
            },
            {
                name: 'tryUnlockVoteTokens',
                inputs: [
                    { name: 'proposal_id', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'tryUnlockCastedVotes',
                inputs: [
                    { name: 'proposal_ids', type: 'uint32[]' },
                ],
                outputs: [
                ],
            },
            {
                name: 'withdrawTonsUserEmergency',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'withdrawTonsEmergency',
                inputs: [
                    { name: 'amount', type: 'uint128' },
                    { name: 'receiver', type: 'address' },
                    { name: 'all', type: 'bool' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'withdrawTokensEmergency',
                inputs: [
                    { name: 'amount', type: 'uint128' },
                    { name: 'receiver', type: 'address' },
                    { name: 'all', type: 'bool' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setEmergency',
                inputs: [
                    { name: '_emergency', type: 'bool' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'delegators',
                inputs: [
                ],
                outputs: [
                    { name: 'delegators', type: 'map(address,uint256[])' },
                ],
            },
        ],
        data: [
            { key: 1, name: 'deploy_nonce', type: 'uint32' },
            { key: 2, name: 'deployer', type: 'address' },
        ],
        events: [
            {
                name: 'RewardDeposit',
                inputs: [
                    { name: 'amount', type: 'uint128' },
                    { name: 'reward_round_num', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'Deposit',
                inputs: [
                    { name: 'user', type: 'address' },
                    { name: 'amount', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'Withdraw',
                inputs: [
                    { name: 'user', type: 'address' },
                    { name: 'amount', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RewardClaimed',
                inputs: [
                    { name: 'user', type: 'address' },
                    { name: 'reward_tokens', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'NewRewardRound',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ElectionStarted',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'election_start_time', type: 'uint32' },
                    { name: 'election_end_time', type: 'uint32' },
                    { name: 'election_addr', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ElectionEnded',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'relay_requests', type: 'uint32' },
                    { name: 'min_relays_ok', type: 'bool' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RelayRoundInitialized',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'round_start_time', type: 'uint32' },
                    { name: 'round_end_time', type: 'uint32' },
                    { name: 'round_addr', type: 'address' },
                    { name: 'relays_count', type: 'uint32' },
                    { name: 'duplicate', type: 'bool' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RelayRoundCreation',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'eth_keys', type: 'uint160[]' },
                    { name: 'round_end', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RelaySlashed',
                inputs: [
                    { name: 'user', type: 'address' },
                    { name: 'tokens_withdrawn', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'Emergency',
                inputs: [
                    { name: 'state', type: 'bool' },
                ],
                outputs: [
                ],
            },
            {
                name: 'DepositReverted',
                inputs: [
                    { name: 'user', type: 'address' },
                    { name: 'amount', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'DaoRootUpdated',
                inputs: [
                    { name: 'new_dao_root', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'BridgeEventEthTonConfigUpdated',
                inputs: [
                    { name: 'new_bridge_event_config_eth_ton', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'BridgeEventTonEthConfigUpdated',
                inputs: [
                    { name: 'new_bridge_event_config_ton_eth', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'TonEventDeployValueUpdated',
                inputs: [
                    { name: 'new_value', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'AdminUpdated',
                inputs: [
                    { name: 'new_admin', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RewarderUpdated',
                inputs: [
                    { name: 'new_rewarder', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RescuerUpdated',
                inputs: [
                    { name: 'new_rescuer', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ActiveUpdated',
                inputs: [
                    { name: 'active', type: 'bool' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RequestedUserDataUpgrade',
                inputs: [
                    { name: 'user', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RequestedElectionUpgrade',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RequestedRelayRoundUpgrade',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'UserDataCodeUpgraded',
                inputs: [
                    { name: 'code_version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ElectionCodeUpgraded',
                inputs: [
                    { name: 'code_version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RelayRoundCodeUpgraded',
                inputs: [
                    { name: 'code_version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RelayConfigUpdated',
                inputs: [
                    { components: [{ name: 'relayLockTime', type: 'uint32' }, { name: 'relayRoundTime', type: 'uint32' }, { name: 'electionTime', type: 'uint32' }, { name: 'timeBeforeElection', type: 'uint32' }, { name: 'minRoundGapTime', type: 'uint32' }, { name: 'relaysCount', type: 'uint16' }, { name: 'minRelaysCount', type: 'uint16' }, { name: 'minRelayDeposit', type: 'uint128' }, { name: 'relayInitialTonDeposit', type: 'uint128' }, { name: 'relayRewardPerSecond', type: 'uint128' }, { name: 'userRewardPerSecond', type: 'uint128' }], name: 'value0', type: 'tuple' },
                ],
                outputs: [
                ],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'delegators', type: 'map(address,uint256[])' },
            { name: 'deploy_nonce', type: 'uint32' },
            { name: 'deployer', type: 'address' },
            { name: 'active', type: 'bool' },
            { name: 'lastExtCall', type: 'uint32' },
            { components: [{ name: 'platform_code', type: 'cell' }, { name: 'has_platform_code', type: 'bool' }, { name: 'user_data_code', type: 'cell' }, { name: 'user_data_version', type: 'uint32' }, { name: 'election_code', type: 'cell' }, { name: 'election_version', type: 'uint32' }, { name: 'relay_round_code', type: 'cell' }, { name: 'relay_round_version', type: 'uint32' }], name: 'code_data', type: 'tuple' },
            { components: [{ name: 'currentRelayRound', type: 'uint32' }, { name: 'currentRelayRoundStartTime', type: 'uint32' }, { name: 'currentRelayRoundEndTime', type: 'uint32' }, { name: 'currentElectionStartTime', type: 'uint32' }, { name: 'currentElectionEnded', type: 'bool' }], name: 'round_details', type: 'tuple' },
            { components: [{ name: 'dao_root', type: 'address' }, { name: 'bridge_event_config_eth_ton', type: 'address' }, { name: 'bridge_event_config_ton_eth', type: 'address' }, { name: 'tokenRoot', type: 'address' }, { name: 'tokenWallet', type: 'address' }, { name: 'admin', type: 'address' }, { name: 'rescuer', type: 'address' }, { name: 'rewarder', type: 'address' }, { name: 'tokenBalance', type: 'uint128' }, { name: 'rewardTokenBalance', type: 'uint128' }, { name: 'lastRewardTime', type: 'uint32' }, { components: [{ name: 'accRewardPerShare', type: 'uint256' }, { name: 'rewardTokens', type: 'uint128' }, { name: 'totalReward', type: 'uint128' }, { name: 'startTime', type: 'uint32' }], name: 'rewardRounds', type: 'tuple[]' }, { name: 'emergency', type: 'bool' }], name: 'base_details', type: 'tuple' },
            { components: [{ name: 'relayLockTime', type: 'uint32' }, { name: 'relayRoundTime', type: 'uint32' }, { name: 'electionTime', type: 'uint32' }, { name: 'timeBeforeElection', type: 'uint32' }, { name: 'minRoundGapTime', type: 'uint32' }, { name: 'relaysCount', type: 'uint16' }, { name: 'minRelaysCount', type: 'uint16' }, { name: 'minRelayDeposit', type: 'uint128' }, { name: 'relayInitialTonDeposit', type: 'uint128' }, { name: 'relayRewardPerSecond', type: 'uint128' }, { name: 'userRewardPerSecond', type: 'uint128' }], name: 'relay_config', type: 'tuple' },
            { name: 'tonEventDeployValue', type: 'uint128' },
            { name: 'deposit_nonce', type: 'uint64' },
            { components: [{ name: 'user', type: 'address' }, { name: 'amount', type: 'uint128' }, { name: 'send_gas_to', type: 'address' }], name: 'deposits', type: 'map(uint64,tuple)' },
        ],
    } as const

}

export class DaoAbi {

    static Root = {
        'ABI version': 2,
        version: '2.1',
        header: ['time'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: 'platformCode_', type: 'cell' },
                    { components: [{ name: 'votingDelay', type: 'uint32' }, { name: 'votingPeriod', type: 'uint32' }, { name: 'quorumVotes', type: 'uint128' }, { name: 'timeLock', type: 'uint32' }, { name: 'threshold', type: 'uint128' }, { name: 'gracePeriod', type: 'uint32' }], name: 'proposalConfiguration_', type: 'tuple' },
                    { name: 'admin_', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getAdmin',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'getPendingAdmin',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'getProposalCount',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint32' },
                ],
            },
            {
                name: 'getStakingRoot',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'getEthereumActionEventConfiguration',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                    { name: 'value1', type: 'uint128' },
                ],
            },
            {
                name: 'expectedProposalAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'proposalId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'expectedStakingAccountAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'accountOwner', type: 'address' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'propose',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { components: [{ name: 'value', type: 'uint128' }, { name: 'target', type: 'address' }, { name: 'payload', type: 'cell' }], name: 'tonActions', type: 'tuple[]' },
                    { components: [{ name: 'value', type: 'uint256' }, { name: 'chainId', type: 'uint32' }, { name: 'target', type: 'uint160' }, { name: 'signature', type: 'string' }, { name: 'callData', type: 'bytes' }], name: 'ethActions', type: 'tuple[]' },
                    { name: 'description', type: 'string' },
                ],
                outputs: [
                ],
            },
            {
                name: 'deployProposal',
                inputs: [
                    { name: 'nonce', type: 'uint32' },
                    { name: 'accountOwner', type: 'address' },
                    { name: 'proposalData', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'onProposalSucceeded',
                inputs: [
                    { name: 'proposalId', type: 'uint32' },
                    { name: 'proposer', type: 'address' },
                    { components: [{ name: 'value', type: 'uint128' }, { name: 'target', type: 'address' }, { name: 'payload', type: 'cell' }], name: 'tonActions', type: 'tuple[]' },
                    { components: [{ name: 'value', type: 'uint256' }, { name: 'chainId', type: 'uint32' }, { name: 'target', type: 'uint160' }, { name: 'signature', type: 'string' }, { name: 'callData', type: 'bytes' }], name: 'ethActions', type: 'tuple[]' },
                ],
                outputs: [
                ],
            },
            {
                name: 'calcTonActionsValue',
                inputs: [
                    { components: [{ name: 'value', type: 'uint128' }, { name: 'target', type: 'address' }, { name: 'payload', type: 'cell' }], name: 'actions', type: 'tuple[]' },
                ],
                outputs: [
                    { name: 'totalValue', type: 'uint128' },
                ],
            },
            {
                name: 'calcEthActionsValue',
                inputs: [
                    { components: [{ name: 'value', type: 'uint256' }, { name: 'chainId', type: 'uint32' }, { name: 'target', type: 'uint160' }, { name: 'signature', type: 'string' }, { name: 'callData', type: 'bytes' }], name: 'actions', type: 'tuple[]' },
                ],
                outputs: [
                    { name: 'totalValue', type: 'uint128' },
                ],
            },
            {
                name: 'requestUpgradeProposal',
                inputs: [
                    { name: 'currentVersion', type: 'uint16' },
                    { name: 'sendGasTo', type: 'address' },
                    { name: 'proposalId', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setStakingRoot',
                inputs: [
                    { name: 'newStakingRoot', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'transferAdmin',
                inputs: [
                    { name: 'newAdmin', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'acceptAdmin',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'updateEthereumActionEventConfiguration',
                inputs: [
                    { name: 'newConfiguration', type: 'address' },
                    { name: 'newDeployEventValue', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'updateProposalCode',
                inputs: [
                    { name: 'code', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'updateQuorumVotes',
                inputs: [
                    { name: 'newQuorumVotes', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'updateThreshold',
                inputs: [
                    { name: 'newThreshold', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'updateTimeLock',
                inputs: [
                    { name: 'newTimeLock', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'updateVotingPeriod',
                inputs: [
                    { name: 'newVotingPeriod', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'updateVotingDelay',
                inputs: [
                    { name: 'newVotingDelay', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'updateGracePeriod',
                inputs: [
                    { name: 'newGracePeriod', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'updateProposalConfiguration',
                inputs: [
                    { components: [{ name: 'votingDelay', type: 'uint32' }, { name: 'votingPeriod', type: 'uint32' }, { name: 'quorumVotes', type: 'uint128' }, { name: 'timeLock', type: 'uint32' }, { name: 'threshold', type: 'uint128' }, { name: 'gracePeriod', type: 'uint32' }], name: 'newConfig', type: 'tuple' },
                ],
                outputs: [
                ],
            },
            {
                name: 'addDelegate',
                inputs: [
                    { name: 'addr', type: 'address' },
                    { name: 'callHash', type: 'uint256' },
                ],
                outputs: [
                ],
            },
            {
                name: 'upgrade',
                inputs: [
                    { name: 'code', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'encodeDaoEthereumActionData',
                inputs: [
                    { name: 'gasBackWid', type: 'int8' },
                    { name: 'gasBackAddress', type: 'uint256' },
                    { name: 'chainId', type: 'uint32' },
                    { components: [{ name: 'value', type: 'uint256' }, { name: 'target', type: 'uint160' }, { name: 'signature', type: 'string' }, { name: 'callData', type: 'bytes' }], name: 'actions', type: 'tuple[]' },
                ],
                outputs: [
                    { name: 'data', type: 'cell' },
                ],
            },
            {
                name: 'decodeDaoEthereumActionData',
                inputs: [
                    { name: 'data', type: 'cell' },
                ],
                outputs: [
                    { name: 'gasBackWid', type: 'int8' },
                    { name: 'gasBackAddress', type: 'uint256' },
                    { name: 'chainId', type: 'uint32' },
                    { components: [{ name: 'value', type: 'uint256' }, { name: 'target', type: 'uint160' }, { name: 'signature', type: 'string' }, { name: 'callData', type: 'bytes' }], name: 'actions', type: 'tuple[]' },
                ],
            },
            {
                name: 'delegators',
                inputs: [
                ],
                outputs: [
                    { name: 'delegators', type: 'map(address,uint256[])' },
                ],
            },
            {
                name: 'stakingRoot',
                inputs: [
                ],
                outputs: [
                    { name: 'stakingRoot', type: 'address' },
                ],
            },
            {
                name: 'ethereumActionEventConfiguration',
                inputs: [
                ],
                outputs: [
                    { name: 'ethereumActionEventConfiguration', type: 'address' },
                ],
            },
            {
                name: 'deployEventValue',
                inputs: [
                ],
                outputs: [
                    { name: 'deployEventValue', type: 'uint128' },
                ],
            },
            {
                name: 'proposalCount',
                inputs: [
                ],
                outputs: [
                    { name: 'proposalCount', type: 'uint32' },
                ],
            },
            {
                name: 'proposalConfiguration',
                inputs: [
                ],
                outputs: [
                    { components: [{ name: 'votingDelay', type: 'uint32' }, { name: 'votingPeriod', type: 'uint32' }, { name: 'quorumVotes', type: 'uint128' }, { name: 'timeLock', type: 'uint32' }, { name: 'threshold', type: 'uint128' }, { name: 'gracePeriod', type: 'uint32' }], name: 'proposalConfiguration', type: 'tuple' },
                ],
            },
            {
                name: 'proposalCode',
                inputs: [
                ],
                outputs: [
                    { name: 'proposalCode', type: 'cell' },
                ],
            },
            {
                name: 'platformCode',
                inputs: [
                ],
                outputs: [
                    { name: 'platformCode', type: 'cell' },
                ],
            },
            {
                name: 'proposalVersion',
                inputs: [
                ],
                outputs: [
                    { name: 'proposalVersion', type: 'uint16' },
                ],
            },
            {
                name: 'admin',
                inputs: [
                ],
                outputs: [
                    { name: 'admin', type: 'address' },
                ],
            },
            {
                name: 'pendingAdmin',
                inputs: [
                ],
                outputs: [
                    { name: 'pendingAdmin', type: 'address' },
                ],
            },
        ],
        data: [
            { key: 1, name: '_nonce', type: 'uint32' },
        ],
        events: [
            {
                name: 'EthActions',
                inputs: [
                    { name: 'gasBackWid', type: 'int8' },
                    { name: 'gasBackAddress', type: 'uint256' },
                    { name: 'chainId', type: 'uint32' },
                    { components: [{ name: 'value', type: 'uint256' }, { name: 'target', type: 'uint160' }, { name: 'signature', type: 'string' }, { name: 'callData', type: 'bytes' }], name: 'actions', type: 'tuple[]' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalCreated',
                inputs: [
                    { name: 'proposalId', type: 'uint32' },
                    { name: 'proposer', type: 'address' },
                    { components: [{ name: 'value', type: 'uint128' }, { name: 'target', type: 'address' }, { name: 'payload', type: 'cell' }], name: 'tonActions', type: 'tuple[]' },
                    { components: [{ name: 'value', type: 'uint256' }, { name: 'chainId', type: 'uint32' }, { name: 'target', type: 'uint160' }, { name: 'signature', type: 'string' }, { name: 'callData', type: 'bytes' }], name: 'ethActions', type: 'tuple[]' },
                    { name: 'description', type: 'string' },
                ],
                outputs: [
                ],
            },
            {
                name: 'StakingRootUpdated',
                inputs: [
                    { name: 'oldRoot', type: 'address' },
                    { name: 'newRoot', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RequestedAdminTransfer',
                inputs: [
                    { name: 'oldAdmin', type: 'address' },
                    { name: 'newAdmin', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'AdminTransferAccepted',
                inputs: [
                    { name: 'oldAdmin', type: 'address' },
                    { name: 'newAdmin', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'EthereumActionEventConfigurationUpdated',
                inputs: [
                    { name: 'oldConfiguration', type: 'address' },
                    { name: 'newConfiguration', type: 'address' },
                    { name: 'oldDeployEventValue', type: 'uint128' },
                    { name: 'newDeployEventValue', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalCodeUpgraded',
                inputs: [
                    { name: 'newVersion', type: 'uint16' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalConfigurationUpdated',
                inputs: [
                    { components: [{ name: 'votingDelay', type: 'uint32' }, { name: 'votingPeriod', type: 'uint32' }, { name: 'quorumVotes', type: 'uint128' }, { name: 'timeLock', type: 'uint32' }, { name: 'threshold', type: 'uint128' }, { name: 'gracePeriod', type: 'uint32' }], name: 'oldConfig', type: 'tuple' },
                    { components: [{ name: 'votingDelay', type: 'uint32' }, { name: 'votingPeriod', type: 'uint32' }, { name: 'quorumVotes', type: 'uint128' }, { name: 'timeLock', type: 'uint32' }, { name: 'threshold', type: 'uint128' }, { name: 'gracePeriod', type: 'uint32' }], name: 'newConfig', type: 'tuple' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalVotingDelayUpdated',
                inputs: [
                    { name: 'oldVotingDelay', type: 'uint32' },
                    { name: 'newVotingDelay', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalGracePeriodUpdated',
                inputs: [
                    { name: 'oldGracePeriod', type: 'uint32' },
                    { name: 'newGracePeriod', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalVotingPeriodUpdated',
                inputs: [
                    { name: 'oldVotingPeriod', type: 'uint32' },
                    { name: 'newVotingPeriod', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalThresholdUpdated',
                inputs: [
                    { name: 'oldThreshold', type: 'uint128' },
                    { name: 'newThreshold', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalQuorumVotesUpdated',
                inputs: [
                    { name: 'oldQuorumVotes', type: 'uint128' },
                    { name: 'newQuorumVotes', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalTimeLockUpdated',
                inputs: [
                    { name: 'oldTimeLock', type: 'uint32' },
                    { name: 'newTimeLock', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ExecutingTonActions',
                inputs: [
                    { name: 'proposalId', type: 'uint32' },
                    { components: [{ name: 'value', type: 'uint128' }, { name: 'target', type: 'address' }, { name: 'payload', type: 'cell' }], name: 'tonActions', type: 'tuple[]' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RootCodeUpgraded',
                inputs: [
                ],
                outputs: [
                ],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'delegators', type: 'map(address,uint256[])' },
            { name: '_nonce', type: 'uint32' },
            { name: 'stakingRoot', type: 'address' },
            { name: 'ethereumActionEventConfiguration', type: 'address' },
            { name: 'deployEventValue', type: 'uint128' },
            { name: 'proposalCount', type: 'uint32' },
            { components: [{ name: 'votingDelay', type: 'uint32' }, { name: 'votingPeriod', type: 'uint32' }, { name: 'quorumVotes', type: 'uint128' }, { name: 'timeLock', type: 'uint32' }, { name: 'threshold', type: 'uint128' }, { name: 'gracePeriod', type: 'uint32' }], name: 'proposalConfiguration', type: 'tuple' },
            { name: 'proposalCode', type: 'cell' },
            { name: 'platformCode', type: 'cell' },
            { name: 'proposalVersion', type: 'uint16' },
            { name: 'admin', type: 'address' },
            { name: 'pendingAdmin', type: 'address' },
        ],
    } as const

}

export class ProposalAbi {

    static Root = {
        'ABI version': 2,
        version: '2.1',
        header: ['time'],
        functions: [
            {
                name: 'getOverview',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'proposer_', type: 'address' },
                    { name: 'description_', type: 'string' },
                    { name: 'startTime_', type: 'uint32' },
                    { name: 'endTime_', type: 'uint32' },
                    { name: 'executionTime_', type: 'uint32' },
                    { name: 'forVotes_', type: 'uint128' },
                    { name: 'againstVotes_', type: 'uint128' },
                    { name: 'quorumVotes_', type: 'uint128' },
                    { name: 'state_', type: 'uint8' },
                ],
            },
            {
                name: 'getProposer',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'getActions',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'value', type: 'uint128' }, { name: 'target', type: 'address' }, { name: 'payload', type: 'cell' }], name: 'value0', type: 'tuple[]' },
                    { components: [{ name: 'value', type: 'uint256' }, { name: 'chainId', type: 'uint32' }, { name: 'target', type: 'uint160' }, { name: 'signature', type: 'string' }, { name: 'callData', type: 'bytes' }], name: 'value1', type: 'tuple[]' },
                ],
            },
            {
                name: 'getConfig',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'votingDelay', type: 'uint32' }, { name: 'votingPeriod', type: 'uint32' }, { name: 'quorumVotes', type: 'uint128' }, { name: 'timeLock', type: 'uint32' }, { name: 'threshold', type: 'uint128' }, { name: 'gracePeriod', type: 'uint32' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'getTimings',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint32' },
                    { name: 'value1', type: 'uint32' },
                    { name: 'value2', type: 'uint32' },
                ],
            },
            {
                name: 'getVotes',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint128' },
                    { name: 'value1', type: 'uint128' },
                    { name: 'value2', type: 'uint128' },
                ],
            },
            {
                name: 'getStatuses',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'bool' },
                    { name: 'value1', type: 'bool' },
                ],
            },
            {
                name: 'getState',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint8' },
                ],
            },
            {
                name: 'queue',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'execute',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'cancel',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'castVote',
                inputs: [
                    { name: 'value0', type: 'uint32' },
                    { name: 'voter', type: 'address' },
                    { name: 'votes', type: 'uint128' },
                    { name: 'support', type: 'bool' },
                    { name: 'reason', type: 'string' },
                ],
                outputs: [
                ],
            },
            {
                name: 'onActionsExecuted',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'unlockCastedVote',
                inputs: [
                    { name: 'accountOwner', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'unlockVoteTokens',
                inputs: [
                    { name: 'accountOwner', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'initialParams',
                inputs: [
                    { name: 'stakingRoot_', type: 'address' },
                    { name: 'proposer_', type: 'address' },
                    { name: 'description_', type: 'string' },
                    { components: [{ name: 'value', type: 'uint128' }, { name: 'target', type: 'address' }, { name: 'payload', type: 'cell' }], name: 'tonActions_', type: 'tuple[]' },
                    { components: [{ name: 'value', type: 'uint256' }, { name: 'chainId', type: 'uint32' }, { name: 'target', type: 'uint160' }, { name: 'signature', type: 'string' }, { name: 'callData', type: 'bytes' }], name: 'ethActions_', type: 'tuple[]' },
                    { components: [{ name: 'votingDelay', type: 'uint32' }, { name: 'votingPeriod', type: 'uint32' }, { name: 'quorumVotes', type: 'uint128' }, { name: 'timeLock', type: 'uint32' }, { name: 'threshold', type: 'uint128' }, { name: 'gracePeriod', type: 'uint32' }], name: 'config_', type: 'tuple' },
                    { name: 'proposalVersion_', type: 'uint16' },
                ],
                outputs: [
                ],
            },
            {
                name: 'requestUpgrade',
                inputs: [
                    { name: 'sendGasTo', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'upgrade',
                inputs: [
                    { name: 'code', type: 'cell' },
                    { name: 'newVersion', type: 'uint16' },
                    { name: 'sendGasTo', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'constructor',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'root',
                inputs: [
                ],
                outputs: [
                    { name: 'root', type: 'address' },
                ],
            },
            {
                name: 'platformCode',
                inputs: [
                ],
                outputs: [
                    { name: 'platformCode', type: 'cell' },
                ],
            },
            {
                name: 'id',
                inputs: [
                ],
                outputs: [
                    { name: 'id', type: 'uint32' },
                ],
            },
            {
                name: 'stakingRoot',
                inputs: [
                ],
                outputs: [
                    { name: 'stakingRoot', type: 'address' },
                ],
            },
            {
                name: 'proposer',
                inputs: [
                ],
                outputs: [
                    { name: 'proposer', type: 'address' },
                ],
            },
            {
                name: 'description',
                inputs: [
                ],
                outputs: [
                    { name: 'description', type: 'string' },
                ],
            },
            {
                name: 'tonActions',
                inputs: [
                ],
                outputs: [
                    { components: [{ name: 'value', type: 'uint128' }, { name: 'target', type: 'address' }, { name: 'payload', type: 'cell' }], name: 'tonActions', type: 'tuple[]' },
                ],
            },
            {
                name: 'ethActions',
                inputs: [
                ],
                outputs: [
                    { components: [{ name: 'value', type: 'uint256' }, { name: 'chainId', type: 'uint32' }, { name: 'target', type: 'uint160' }, { name: 'signature', type: 'string' }, { name: 'callData', type: 'bytes' }], name: 'ethActions', type: 'tuple[]' },
                ],
            },
            {
                name: 'proposalVersion',
                inputs: [
                ],
                outputs: [
                    { name: 'proposalVersion', type: 'uint16' },
                ],
            },
            {
                name: 'config',
                inputs: [
                ],
                outputs: [
                    { components: [{ name: 'votingDelay', type: 'uint32' }, { name: 'votingPeriod', type: 'uint32' }, { name: 'quorumVotes', type: 'uint128' }, { name: 'timeLock', type: 'uint32' }, { name: 'threshold', type: 'uint128' }, { name: 'gracePeriod', type: 'uint32' }], name: 'config', type: 'tuple' },
                ],
            },
            {
                name: 'startTime',
                inputs: [
                ],
                outputs: [
                    { name: 'startTime', type: 'uint32' },
                ],
            },
            {
                name: 'endTime',
                inputs: [
                ],
                outputs: [
                    { name: 'endTime', type: 'uint32' },
                ],
            },
            {
                name: 'executionTime',
                inputs: [
                ],
                outputs: [
                    { name: 'executionTime', type: 'uint32' },
                ],
            },
            {
                name: 'canceled',
                inputs: [
                ],
                outputs: [
                    { name: 'canceled', type: 'bool' },
                ],
            },
            {
                name: 'executed',
                inputs: [
                ],
                outputs: [
                    { name: 'executed', type: 'bool' },
                ],
            },
            {
                name: 'forVotes',
                inputs: [
                ],
                outputs: [
                    { name: 'forVotes', type: 'uint128' },
                ],
            },
            {
                name: 'againstVotes',
                inputs: [
                ],
                outputs: [
                    { name: 'againstVotes', type: 'uint128' },
                ],
            },
        ],
        data: [
        ],
        events: [
            {
                name: 'VoteCast',
                inputs: [
                    { name: 'voter', type: 'address' },
                    { name: 'support', type: 'bool' },
                    { name: 'votes', type: 'uint128' },
                    { name: 'reason', type: 'string' },
                ],
                outputs: [
                ],
            },
            {
                name: 'Queued',
                inputs: [
                    { name: 'executionTime', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'Executed',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'Canceled',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'CodeUpgradeRequested',
                inputs: [
                    { name: 'currentVersion', type: 'uint16' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalCodeUpgraded',
                inputs: [
                    { name: 'newVersion', type: 'uint16' },
                ],
                outputs: [
                ],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'root', type: 'address' },
            { name: 'platformCode', type: 'cell' },
            { name: 'id', type: 'uint32' },
            { name: 'stakingRoot', type: 'address' },
            { name: 'proposer', type: 'address' },
            { name: 'description', type: 'string' },
            { components: [{ name: 'value', type: 'uint128' }, { name: 'target', type: 'address' }, { name: 'payload', type: 'cell' }], name: 'tonActions', type: 'tuple[]' },
            { components: [{ name: 'value', type: 'uint256' }, { name: 'chainId', type: 'uint32' }, { name: 'target', type: 'uint160' }, { name: 'signature', type: 'string' }, { name: 'callData', type: 'bytes' }], name: 'ethActions', type: 'tuple[]' },
            { name: 'proposalVersion', type: 'uint16' },
            { components: [{ name: 'votingDelay', type: 'uint32' }, { name: 'votingPeriod', type: 'uint32' }, { name: 'quorumVotes', type: 'uint128' }, { name: 'timeLock', type: 'uint32' }, { name: 'threshold', type: 'uint128' }, { name: 'gracePeriod', type: 'uint32' }], name: 'config', type: 'tuple' },
            { name: 'startTime', type: 'uint32' },
            { name: 'endTime', type: 'uint32' },
            { name: 'executionTime', type: 'uint32' },
            { name: 'canceled', type: 'bool' },
            { name: 'executed', type: 'bool' },
            { name: 'forVotes', type: 'uint128' },
            { name: 'againstVotes', type: 'uint128' },
        ],
    } as const

}

export class UserDataAbi {

    static Root = {
        'ABI version': 2,
        version: '2.1',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'lockedTokens',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint128' },
                ],
            },
            {
                name: 'canWithdrawVotes',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'bool' },
                ],
            },
            {
                name: 'propose',
                inputs: [
                    { name: 'proposal_data', type: 'cell' },
                    { name: 'threshold', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'onProposalDeployed',
                inputs: [
                    { name: 'nonce', type: 'uint32' },
                    { name: 'proposal_id', type: 'uint32' },
                    { name: 'answer_id', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'castVote',
                inputs: [
                    { name: 'code_version', type: 'uint32' },
                    { name: 'proposal_id', type: 'uint32' },
                    { name: 'support', type: 'bool' },
                    { name: 'reason', type: 'string' },
                ],
                outputs: [
                ],
            },
            {
                name: 'voteCasted',
                inputs: [
                    { name: 'proposal_id', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'rejectVote',
                inputs: [
                    { name: 'proposal_id', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'tryUnlockVoteTokens',
                inputs: [
                    { name: 'code_version', type: 'uint32' },
                    { name: 'proposal_id', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'unlockVoteTokens',
                inputs: [
                    { name: 'proposal_id', type: 'uint32' },
                    { name: 'success', type: 'bool' },
                ],
                outputs: [
                ],
            },
            {
                name: 'tryUnlockCastedVotes',
                inputs: [
                    { name: 'code_version', type: 'uint32' },
                    { name: 'proposal_ids', type: 'uint32[]' },
                ],
                outputs: [
                ],
            },
            {
                name: 'unlockCastedVote',
                inputs: [
                    { name: 'proposal_id', type: 'uint32' },
                    { name: 'success', type: 'bool' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'token_balance', type: 'uint128' }, { name: 'relay_lock_until', type: 'uint32' }, { components: [{ name: 'reward_balance', type: 'uint128' }, { name: 'reward_debt', type: 'uint128' }], name: 'rewardRounds', type: 'tuple[]' }, { name: 'relay_eth_address', type: 'uint160' }, { name: 'eth_address_confirmed', type: 'bool' }, { name: 'relay_ton_pubkey', type: 'uint256' }, { name: 'ton_pubkey_confirmed', type: 'bool' }, { name: 'slashed', type: 'bool' }, { name: 'root', type: 'address' }, { name: 'user', type: 'address' }, { name: 'dao_root', type: 'address' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'slash',
                inputs: [
                    { components: [{ name: 'accRewardPerShare', type: 'uint256' }, { name: 'rewardTokens', type: 'uint128' }, { name: 'totalReward', type: 'uint128' }, { name: 'startTime', type: 'uint32' }], name: 'reward_rounds', type: 'tuple[]' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'processDeposit',
                inputs: [
                    { name: 'nonce', type: 'uint64' },
                    { name: '_tokens_to_deposit', type: 'uint128' },
                    { components: [{ name: 'accRewardPerShare', type: 'uint256' }, { name: 'rewardTokens', type: 'uint128' }, { name: 'totalReward', type: 'uint128' }, { name: 'startTime', type: 'uint32' }], name: 'reward_rounds', type: 'tuple[]' },
                    { name: 'code_version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'processClaimReward',
                inputs: [
                    { components: [{ name: 'accRewardPerShare', type: 'uint256' }, { name: 'rewardTokens', type: 'uint128' }, { name: 'totalReward', type: 'uint128' }, { name: 'startTime', type: 'uint32' }], name: 'reward_rounds', type: 'tuple[]' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'code_version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getRewardForRelayRound',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'processGetRewardForRelayRound2',
                inputs: [
                    { components: [{ name: 'accRewardPerShare', type: 'uint256' }, { name: 'rewardTokens', type: 'uint128' }, { name: 'totalReward', type: 'uint128' }, { name: 'startTime', type: 'uint32' }], name: 'reward_rounds', type: 'tuple[]' },
                    { name: 'round_num', type: 'uint32' },
                    { name: 'code_version', type: 'uint32' },
                    { name: 'relay_round_code_version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'receiveRewardForRelayRound',
                inputs: [
                    { name: 'relay_round_num', type: 'uint32' },
                    { name: 'reward_round_num', type: 'uint32' },
                    { name: 'reward', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'processLinkRelayAccounts',
                inputs: [
                    { name: 'ton_pubkey', type: 'uint256' },
                    { name: 'eth_address', type: 'uint160' },
                    { name: 'confirm', type: 'bool' },
                    { name: 'code_version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'confirmTonAccount',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'processConfirmEthAccount',
                inputs: [
                    { name: 'eth_address', type: 'uint160' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'becomeRelayNextRound',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'processBecomeRelayNextRound2',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'lock_time', type: 'uint32' },
                    { name: 'min_deposit', type: 'uint128' },
                    { name: 'code_version', type: 'uint32' },
                    { name: 'election_code_version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'relayMembershipRequestAccepted',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ton_pubkey', type: 'uint256' },
                    { name: 'eth_addr', type: 'uint160' },
                    { name: 'lock_time', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'processWithdraw',
                inputs: [
                    { name: '_tokens_to_withdraw', type: 'uint128' },
                    { components: [{ name: 'accRewardPerShare', type: 'uint256' }, { name: 'rewardTokens', type: 'uint128' }, { name: 'totalReward', type: 'uint128' }, { name: 'startTime', type: 'uint32' }], name: 'reward_rounds', type: 'tuple[]' },
                    { name: 'emergency', type: 'bool' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'code_version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'withdrawTons',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'upgrade',
                inputs: [
                    { name: 'code', type: 'cell' },
                    { name: 'new_version', type: 'uint32' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'current_version',
                inputs: [
                ],
                outputs: [
                    { name: 'current_version', type: 'uint32' },
                ],
            },
            {
                name: 'platform_code',
                inputs: [
                ],
                outputs: [
                    { name: 'platform_code', type: 'cell' },
                ],
            },
            {
                name: 'created_proposals',
                inputs: [
                ],
                outputs: [
                    { name: 'created_proposals', type: 'map(uint32,uint128)' },
                ],
            },
            {
                name: '_tmp_proposals',
                inputs: [
                ],
                outputs: [
                    { name: '_tmp_proposals', type: 'map(uint32,uint128)' },
                ],
            },
            {
                name: 'casted_votes',
                inputs: [
                ],
                outputs: [
                    { name: 'casted_votes', type: 'map(uint32,bool)' },
                ],
            },
        ],
        data: [
        ],
        events: [
            {
                name: 'RelayKeysUpdated',
                inputs: [
                    { name: 'ton_pubkey', type: 'uint256' },
                    { name: 'eth_address', type: 'uint160' },
                ],
                outputs: [
                ],
            },
            {
                name: 'TonPubkeyConfirmed',
                inputs: [
                    { name: 'ton_pubkey', type: 'uint256' },
                ],
                outputs: [
                ],
            },
            {
                name: 'EthAddressConfirmed',
                inputs: [
                    { name: 'eth_addr', type: 'uint160' },
                ],
                outputs: [
                ],
            },
            {
                name: 'UserDataCodeUpgraded',
                inputs: [
                    { name: 'code_version', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RelayMembershipRequested',
                inputs: [
                    { name: 'round_num', type: 'uint32' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ton_pubkey', type: 'uint256' },
                    { name: 'eth_address', type: 'uint160' },
                    { name: 'lock_until', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RelayRoundRewardClaimed',
                inputs: [
                    { name: 'relay_round_num', type: 'uint32' },
                    { name: 'reward_round_num', type: 'uint32' },
                    { name: 'reward', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'DepositProcessed',
                inputs: [
                    { name: 'tokens_deposited', type: 'uint128' },
                    { name: 'new_balance', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'VoteCast',
                inputs: [
                    { name: 'proposal_id', type: 'uint32' },
                    { name: 'support', type: 'bool' },
                    { name: 'votes', type: 'uint128' },
                    { name: 'reason', type: 'string' },
                ],
                outputs: [
                ],
            },
            {
                name: 'UnlockVotes',
                inputs: [
                    { name: 'proposal_id', type: 'uint32' },
                    { name: 'value', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'UnlockCastedVotes',
                inputs: [
                    { name: 'proposal_id', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalCreationRejected',
                inputs: [
                    { name: 'votes_available', type: 'uint128' },
                    { name: 'threshold', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProposalCodeUpgraded',
                inputs: [
                    { name: 'votes_available', type: 'uint128' },
                    { name: 'threshold', type: 'uint128' },
                ],
                outputs: [
                ],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'current_version', type: 'uint32' },
            { name: 'platform_code', type: 'cell' },
            { name: 'token_balance', type: 'uint128' },
            { name: 'relay_lock_until', type: 'uint32' },
            { components: [{ name: 'reward_balance', type: 'uint128' }, { name: 'reward_debt', type: 'uint128' }], name: 'rewardRounds', type: 'tuple[]' },
            { name: 'relay_eth_address', type: 'uint160' },
            { name: 'eth_address_confirmed', type: 'bool' },
            { name: 'relay_ton_pubkey', type: 'uint256' },
            { name: 'ton_pubkey_confirmed', type: 'bool' },
            { name: 'slashed', type: 'bool' },
            { name: 'root', type: 'address' },
            { name: 'user', type: 'address' },
            { name: 'dao_root', type: 'address' },
            { name: '_proposal_nonce', type: 'uint32' },
            { name: 'created_proposals', type: 'map(uint32,uint128)' },
            { name: '_tmp_proposals', type: 'map(uint32,uint128)' },
            { name: 'casted_votes', type: 'map(uint32,bool)' },
        ],
    } as const

}

export class TokenAbi {

    static Root = {
        'ABI version': 2,
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: 'root_public_key_', type: 'uint256' },
                    { name: 'root_owner_address_', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getVersion',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint32' },
                ],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    {
                        components: [
                            { name: 'name', type: 'bytes' },
                            { name: 'symbol', type: 'bytes' },
                            { name: 'decimals', type: 'uint8' },
                            { name: 'root_public_key', type: 'uint256' },
                            { name: 'root_owner_address', type: 'address' },
                            { name: 'total_supply', type: 'uint128' },
                        ],
                        name: 'value0',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'getTotalSupply',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint128' },
                ],
            },
            {
                name: 'getWalletCode',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'cell' },
                ],
            },
            {
                name: 'getWalletAddress',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                    { name: 'wallet_public_key_', type: 'uint256' },
                    { name: 'owner_address_', type: 'address' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'sendExpectedWalletAddress',
                inputs: [
                    { name: 'wallet_public_key_', type: 'uint256' },
                    { name: 'owner_address_', type: 'address' },
                    { name: 'to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'deployWallet',
                inputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'deploy_grams', type: 'uint128' },
                    { name: 'wallet_public_key_', type: 'uint256' },
                    { name: 'owner_address_', type: 'address' },
                    { name: 'gas_back_address', type: 'address' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'deployEmptyWallet',
                inputs: [
                    { name: 'deploy_grams', type: 'uint128' },
                    { name: 'wallet_public_key_', type: 'uint256' },
                    { name: 'owner_address_', type: 'address' },
                    { name: 'gas_back_address', type: 'address' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'mint',
                inputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'proxyBurn',
                inputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'sender_address', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'callback_address', type: 'address' },
                    { name: 'callback_payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'tokensBurned',
                inputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'sender_public_key', type: 'uint256' },
                    { name: 'sender_address', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'callback_address', type: 'address' },
                    { name: 'callback_payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'sendSurplusGas',
                inputs: [
                    { name: 'to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setPaused',
                inputs: [
                    { name: 'value', type: 'bool' },
                ],
                outputs: [
                ],
            },
            {
                name: 'sendPausedCallbackTo',
                inputs: [
                    { name: 'callback_id', type: 'uint64' },
                    { name: 'callback_addr', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'transferOwner',
                inputs: [
                    { name: 'root_public_key_', type: 'uint256' },
                    { name: 'root_owner_address_', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'name',
                inputs: [
                ],
                outputs: [
                    { name: 'name', type: 'bytes' },
                ],
            },
            {
                name: 'symbol',
                inputs: [
                ],
                outputs: [
                    { name: 'symbol', type: 'bytes' },
                ],
            },
            {
                name: 'decimals',
                inputs: [
                ],
                outputs: [
                    { name: 'decimals', type: 'uint8' },
                ],
            },
            {
                name: 'start_gas_balance',
                inputs: [
                ],
                outputs: [
                    { name: 'start_gas_balance', type: 'uint128' },
                ],
            },
            {
                name: 'paused',
                inputs: [
                ],
                outputs: [
                    { name: 'paused', type: 'bool' },
                ],
            },
        ],
        data: [
            { key: 1, name: '_randomNonce', type: 'uint256' },
            { key: 2, name: 'name', type: 'bytes' },
            { key: 3, name: 'symbol', type: 'bytes' },
            { key: 4, name: 'decimals', type: 'uint8' },
            { key: 5, name: 'wallet_code', type: 'cell' },
        ],
        events: [
        ],
    } as const

    static Wallet = {
        'ABI version': 2,
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'getVersion',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint32' },
                ],
            },
            {
                name: 'balance',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint128' },
                ],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    {
                        components: [{ name: 'root_address', type: 'address' },
                            { name: 'wallet_public_key', type: 'uint256' },
                            { name: 'owner_address', type: 'address' },
                            { name: 'balance', type: 'uint128' },
                            { name: 'receive_callback', type: 'address' },
                            { name: 'bounced_callback', type: 'address' },
                            { name: 'allow_non_notifiable', type: 'bool' }],
                        name: 'value0',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'getWalletCode',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'cell' },
                ],
            },
            {
                name: 'accept',
                inputs: [
                    { name: 'tokens', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'allowance',
                inputs: [
                    { name: '_answer_id', type: 'uint32' },
                ],
                outputs: [
                    {
                        components: [{ name: 'remaining_tokens', type: 'uint128' },
                            { name: 'spender', type: 'address' }],
                        name: 'value0',
                        type: 'tuple',
                    },
                ],
            },
            {
                name: 'approve',
                inputs: [
                    { name: 'spender', type: 'address' },
                    { name: 'remaining_tokens', type: 'uint128' },
                    { name: 'tokens', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'disapprove',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'transferToRecipient',
                inputs: [
                    { name: 'recipient_public_key', type: 'uint256' },
                    { name: 'recipient_address', type: 'address' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'deploy_grams', type: 'uint128' },
                    { name: 'transfer_grams', type: 'uint128' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'notify_receiver', type: 'bool' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'transfer',
                inputs: [
                    { name: 'to', type: 'address' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'grams', type: 'uint128' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'notify_receiver', type: 'bool' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'transferFrom',
                inputs: [
                    { name: 'from', type: 'address' },
                    { name: 'to', type: 'address' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'grams', type: 'uint128' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'notify_receiver', type: 'bool' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'internalTransfer',
                inputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'sender_public_key', type: 'uint256' },
                    { name: 'sender_address', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'notify_receiver', type: 'bool' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'internalTransferFrom',
                inputs: [
                    { name: 'to', type: 'address' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'notify_receiver', type: 'bool' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'burnByOwner',
                inputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'grams', type: 'uint128' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'callback_address', type: 'address' },
                    { name: 'callback_payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'burnByRoot',
                inputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'send_gas_to', type: 'address' },
                    { name: 'callback_address', type: 'address' },
                    { name: 'callback_payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setReceiveCallback',
                inputs: [
                    { name: 'receive_callback_', type: 'address' },
                    { name: 'allow_non_notifiable_', type: 'bool' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setBouncedCallback',
                inputs: [
                    { name: 'bounced_callback_', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'destroy',
                inputs: [
                    { name: 'gas_dest', type: 'address' },
                ],
                outputs: [
                ],
            },
        ],
        data: [
            { key: 1, name: 'root_address', type: 'address' },
            { key: 2, name: 'code', type: 'cell' },
            { key: 3, name: 'wallet_public_key', type: 'uint256' },
            { key: 4, name: 'owner_address', type: 'address' },
        ],
        events: [
        ],
    } as const

    static EthEventConfig = {
        'ABI version': 2,
        version: '2.1',
        header: ['time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: '_owner', type: 'address' },
                    { name: '_meta', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setMeta',
                inputs: [
                    { name: '_meta', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setEndBlockNumber',
                inputs: [
                    { name: 'endBlockNumber', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'deployEvent',
                inputs: [
                    { components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'eventVoteData', type: 'tuple' },
                ],
                outputs: [
                ],
            },
            {
                name: 'deriveEventAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'eventVoteData', type: 'tuple' },
                ],
                outputs: [
                    { name: 'eventContract', type: 'address' },
                ],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'eventABI', type: 'bytes' }, { name: 'staking', type: 'address' }, { name: 'eventInitialBalance', type: 'uint64' }, { name: 'eventCode', type: 'cell' }], name: '_basicConfiguration', type: 'tuple' },
                    { components: [{ name: 'chainId', type: 'uint32' }, { name: 'eventEmitter', type: 'uint160' }, { name: 'eventBlocksToConfirm', type: 'uint16' }, { name: 'proxy', type: 'address' }, { name: 'startBlockNumber', type: 'uint32' }, { name: 'endBlockNumber', type: 'uint32' }], name: '_networkConfiguration', type: 'tuple' },
                    { name: '_meta', type: 'cell' },
                ],
            },
            {
                name: 'getType',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: '_type', type: 'uint8' },
                ],
            },
            {
                name: 'broxusBridgeCallback',
                inputs: [
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], name: 'eventInitData', type: 'tuple' },
                    { name: 'gasBackAddress', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'transferOwnership',
                inputs: [
                    { name: 'newOwner', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'renounceOwnership',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'owner',
                inputs: [
                ],
                outputs: [
                    { name: 'owner', type: 'address' },
                ],
            },
            {
                name: 'basicConfiguration',
                inputs: [
                ],
                outputs: [
                    { components: [{ name: 'eventABI', type: 'bytes' }, { name: 'staking', type: 'address' }, { name: 'eventInitialBalance', type: 'uint64' }, { name: 'eventCode', type: 'cell' }], name: 'basicConfiguration', type: 'tuple' },
                ],
            },
            {
                name: 'networkConfiguration',
                inputs: [
                ],
                outputs: [
                    { components: [{ name: 'chainId', type: 'uint32' }, { name: 'eventEmitter', type: 'uint160' }, { name: 'eventBlocksToConfirm', type: 'uint16' }, { name: 'proxy', type: 'address' }, { name: 'startBlockNumber', type: 'uint32' }, { name: 'endBlockNumber', type: 'uint32' }], name: 'networkConfiguration', type: 'tuple' },
                ],
            },
            {
                name: 'meta',
                inputs: [
                ],
                outputs: [
                    { name: 'meta', type: 'cell' },
                ],
            },
        ],
        data: [
            {
                components: [{ name: 'eventABI', type: 'bytes' }, { name: 'staking', type: 'address' }, { name: 'eventInitialBalance', type: 'uint64' }, { name: 'eventCode', type: 'cell' }], key: 1, name: 'basicConfiguration', type: 'tuple',
            },
            {
                components: [{ name: 'chainId', type: 'uint32' }, { name: 'eventEmitter', type: 'uint160' }, { name: 'eventBlocksToConfirm', type: 'uint16' }, { name: 'proxy', type: 'address' }, { name: 'startBlockNumber', type: 'uint32' }, { name: 'endBlockNumber', type: 'uint32' }], key: 2, name: 'networkConfiguration', type: 'tuple',
            },
        ],
        events: [
            {
                name: 'OwnershipTransferred',
                inputs: [
                    { name: 'previousOwner', type: 'address' },
                    { name: 'newOwner', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'NewEventContract',
                inputs: [
                    { name: 'eventContract', type: 'address' },
                ],
                outputs: [
                ],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'owner', type: 'address' },
            { components: [{ name: 'eventABI', type: 'bytes' }, { name: 'staking', type: 'address' }, { name: 'eventInitialBalance', type: 'uint64' }, { name: 'eventCode', type: 'cell' }], name: 'basicConfiguration', type: 'tuple' },
            { components: [{ name: 'chainId', type: 'uint32' }, { name: 'eventEmitter', type: 'uint160' }, { name: 'eventBlocksToConfirm', type: 'uint16' }, { name: 'proxy', type: 'address' }, { name: 'startBlockNumber', type: 'uint32' }, { name: 'endBlockNumber', type: 'uint32' }], name: 'networkConfiguration', type: 'tuple' },
            { name: 'meta', type: 'cell' },
        ],
    } as const

    static TonEventConfig = {
        'ABI version': 2,
        version: '2.1',
        header: ['time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: '_owner', type: 'address' },
                    { name: '_meta', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setMeta',
                inputs: [
                    { name: '_meta', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setEndTimestamp',
                inputs: [
                    { name: 'endTimestamp', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'deployEvent',
                inputs: [
                    { components: [{ name: 'eventTransactionLt', type: 'uint64' }, { name: 'eventTimestamp', type: 'uint32' }, { name: 'eventData', type: 'cell' }], name: 'eventVoteData', type: 'tuple' },
                ],
                outputs: [
                ],
            },
            {
                name: 'deriveEventAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { components: [{ name: 'eventTransactionLt', type: 'uint64' }, { name: 'eventTimestamp', type: 'uint32' }, { name: 'eventData', type: 'cell' }], name: 'eventVoteData', type: 'tuple' },
                ],
                outputs: [
                    { name: 'eventContract', type: 'address' },
                ],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'eventABI', type: 'bytes' }, { name: 'staking', type: 'address' }, { name: 'eventInitialBalance', type: 'uint64' }, { name: 'eventCode', type: 'cell' }], name: '_basicConfiguration', type: 'tuple' },
                    { components: [{ name: 'eventEmitter', type: 'address' }, { name: 'proxy', type: 'uint160' }, { name: 'startTimestamp', type: 'uint32' }, { name: 'endTimestamp', type: 'uint32' }], name: '_networkConfiguration', type: 'tuple' },
                    { name: '_meta', type: 'cell' },
                ],
            },
            {
                name: 'getType',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: '_type', type: 'uint8' },
                ],
            },
            {
                name: 'transferOwnership',
                inputs: [
                    { name: 'newOwner', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'renounceOwnership',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'owner',
                inputs: [
                ],
                outputs: [
                    { name: 'owner', type: 'address' },
                ],
            },
            {
                name: 'basicConfiguration',
                inputs: [
                ],
                outputs: [
                    { components: [{ name: 'eventABI', type: 'bytes' }, { name: 'staking', type: 'address' }, { name: 'eventInitialBalance', type: 'uint64' }, { name: 'eventCode', type: 'cell' }], name: 'basicConfiguration', type: 'tuple' },
                ],
            },
            {
                name: 'networkConfiguration',
                inputs: [
                ],
                outputs: [
                    { components: [{ name: 'eventEmitter', type: 'address' }, { name: 'proxy', type: 'uint160' }, { name: 'startTimestamp', type: 'uint32' }, { name: 'endTimestamp', type: 'uint32' }], name: 'networkConfiguration', type: 'tuple' },
                ],
            },
            {
                name: 'meta',
                inputs: [
                ],
                outputs: [
                    { name: 'meta', type: 'cell' },
                ],
            },
        ],
        data: [
            {
                components: [{ name: 'eventABI', type: 'bytes' }, { name: 'staking', type: 'address' }, { name: 'eventInitialBalance', type: 'uint64' }, { name: 'eventCode', type: 'cell' }], key: 1, name: 'basicConfiguration', type: 'tuple',
            },
            {
                components: [{ name: 'eventEmitter', type: 'address' }, { name: 'proxy', type: 'uint160' }, { name: 'startTimestamp', type: 'uint32' }, { name: 'endTimestamp', type: 'uint32' }], key: 2, name: 'networkConfiguration', type: 'tuple',
            },
        ],
        events: [
            {
                name: 'OwnershipTransferred',
                inputs: [
                    { name: 'previousOwner', type: 'address' },
                    { name: 'newOwner', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'NewEventContract',
                inputs: [
                    { name: 'eventContract', type: 'address' },
                ],
                outputs: [
                ],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'owner', type: 'address' },
            { components: [{ name: 'eventABI', type: 'bytes' }, { name: 'staking', type: 'address' }, { name: 'eventInitialBalance', type: 'uint64' }, { name: 'eventCode', type: 'cell' }], name: 'basicConfiguration', type: 'tuple' },
            { components: [{ name: 'eventEmitter', type: 'address' }, { name: 'proxy', type: 'uint160' }, { name: 'startTimestamp', type: 'uint32' }, { name: 'endTimestamp', type: 'uint32' }], name: 'networkConfiguration', type: 'tuple' },
            { name: 'meta', type: 'cell' },
        ],
    } as const

    static TokenTransferEthEvent = {
        'ABI version': 2,
        version: '2.1',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: '_initializer', type: 'address' },
                    { name: '_meta', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], name: '_eventInitData', type: 'tuple' },
                    { name: '_status', type: 'uint8' },
                    { name: '_confirms', type: 'uint256[]' },
                    { name: '_rejects', type: 'uint256[]' },
                    { name: 'empty', type: 'uint256[]' },
                    { name: 'balance', type: 'uint128' },
                    { name: '_initializer', type: 'address' },
                    { name: '_meta', type: 'cell' },
                    { name: '_requiredVotes', type: 'uint32' },
                ],
            },
            {
                name: 'getDecodedData',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'wid', type: 'int8' },
                    { name: 'owner_addr', type: 'uint256' },
                    { name: 'owner_address', type: 'address' },
                ],
            },
            {
                name: 'getEventInitData',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'confirm',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'reject',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'receiveRoundAddress',
                inputs: [
                    { name: 'roundContract', type: 'address' },
                    { name: 'roundNum', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'receiveRoundRelays',
                inputs: [
                    { name: 'keys', type: 'uint256[]' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getVoters',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'vote', type: 'uint8' },
                ],
                outputs: [
                    { name: 'voters', type: 'uint256[]' },
                ],
            },
            {
                name: 'getVote',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'voter', type: 'uint256' },
                ],
                outputs: [
                    { name: 'vote', type: 'optional(uint8)' },
                ],
            },
            {
                name: 'encodeEthereumEventData',
                inputs: [
                    { name: 'tokens', type: 'uint256' },
                    { name: 'wid', type: 'int128' },
                    { name: 'owner_addr', type: 'uint256' },
                ],
                outputs: [
                    { name: 'data', type: 'cell' },
                ],
            },
            {
                name: 'decodeEthereumEventData',
                inputs: [
                    { name: 'data', type: 'cell' },
                ],
                outputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'wid', type: 'int8' },
                    { name: 'owner_addr', type: 'uint256' },
                ],
            },
            {
                name: 'encodeTonEventData',
                inputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'data', type: 'cell' },
                ],
            },
            {
                name: 'decodeTonEventData',
                inputs: [
                    { name: 'data', type: 'cell' },
                ],
                outputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
            },
            {
                name: 'status',
                inputs: [
                ],
                outputs: [
                    { name: 'status', type: 'uint8' },
                ],
            },
            {
                name: 'votes',
                inputs: [
                ],
                outputs: [
                    { name: 'votes', type: 'map(uint256,uint8)' },
                ],
            },
            {
                name: 'initializer',
                inputs: [
                ],
                outputs: [
                    { name: 'initializer', type: 'address' },
                ],
            },
            {
                name: 'meta',
                inputs: [
                ],
                outputs: [
                    { name: 'meta', type: 'cell' },
                ],
            },
            {
                name: 'requiredVotes',
                inputs: [
                ],
                outputs: [
                    { name: 'requiredVotes', type: 'uint32' },
                ],
            },
            {
                name: 'confirms',
                inputs: [
                ],
                outputs: [
                    { name: 'confirms', type: 'uint16' },
                ],
            },
            {
                name: 'rejects',
                inputs: [
                ],
                outputs: [
                    { name: 'rejects', type: 'uint16' },
                ],
            },
            {
                name: 'relay_round',
                inputs: [
                ],
                outputs: [
                    { name: 'relay_round', type: 'address' },
                ],
            },
            {
                name: 'round_number',
                inputs: [
                ],
                outputs: [
                    { name: 'round_number', type: 'uint32' },
                ],
            },
        ],
        data: [
            {
                components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], key: 1, name: 'eventInitData', type: 'tuple',
            },
        ],
        events: [
            {
                name: 'Confirm',
                inputs: [
                    { name: 'relay', type: 'uint256' },
                ],
                outputs: [
                ],
            },
            {
                name: 'Reject',
                inputs: [
                    { name: 'relay', type: 'uint256' },
                ],
                outputs: [
                ],
            },
            {
                name: 'Closed',
                inputs: [
                ],
                outputs: [
                ],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'status', type: 'uint8' },
            { name: 'votes', type: 'map(uint256,uint8)' },
            { name: 'initializer', type: 'address' },
            { name: 'meta', type: 'cell' },
            { name: 'requiredVotes', type: 'uint32' },
            { name: 'confirms', type: 'uint16' },
            { name: 'rejects', type: 'uint16' },
            { name: 'relay_round', type: 'address' },
            { name: 'round_number', type: 'uint32' },
            { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], name: 'eventInitData', type: 'tuple' },
        ],
    } as const

    static TokenTransferTonEvent = {
        'ABI version': 2,
        version: '2.1',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: '_initializer', type: 'address' },
                    { name: '_meta', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'close',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ components: [{ name: 'eventTransactionLt', type: 'uint64' }, { name: 'eventTimestamp', type: 'uint32' }, { name: 'eventData', type: 'cell' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }], name: '_eventInitData', type: 'tuple' },
                    { name: '_status', type: 'uint8' },
                    { name: '_confirms', type: 'uint256[]' },
                    { name: '_rejects', type: 'uint256[]' },
                    { name: 'empty', type: 'uint256[]' },
                    { name: '_signatures', type: 'bytes[]' },
                    { name: 'balance', type: 'uint128' },
                    { name: '_initializer', type: 'address' },
                    { name: '_meta', type: 'cell' },
                    { name: '_requiredVotes', type: 'uint32' },
                ],
            },
            {
                name: 'getDecodedData',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'owner_address', type: 'address' },
                    { name: 'chainId', type: 'uint32' },
                ],
            },
            {
                name: 'getEventInitData',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ components: [{ name: 'eventTransactionLt', type: 'uint64' }, { name: 'eventTimestamp', type: 'uint32' }, { name: 'eventData', type: 'cell' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'confirm',
                inputs: [
                    { name: 'signature', type: 'bytes' },
                ],
                outputs: [
                ],
            },
            {
                name: 'reject',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'receiveRoundAddress',
                inputs: [
                    { name: 'roundContract', type: 'address' },
                    { name: 'roundNum', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'receiveRoundRelays',
                inputs: [
                    { name: 'keys', type: 'uint256[]' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getVoters',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'vote', type: 'uint8' },
                ],
                outputs: [
                    { name: 'voters', type: 'uint256[]' },
                ],
            },
            {
                name: 'getVote',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'voter', type: 'uint256' },
                ],
                outputs: [
                    { name: 'vote', type: 'optional(uint8)' },
                ],
            },
            {
                name: 'encodeEthereumEventData',
                inputs: [
                    { name: 'tokens', type: 'uint256' },
                    { name: 'wid', type: 'int128' },
                    { name: 'owner_addr', type: 'uint256' },
                ],
                outputs: [
                    { name: 'data', type: 'cell' },
                ],
            },
            {
                name: 'decodeEthereumEventData',
                inputs: [
                    { name: 'data', type: 'cell' },
                ],
                outputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'wid', type: 'int8' },
                    { name: 'owner_addr', type: 'uint256' },
                ],
            },
            {
                name: 'encodeTonEventData',
                inputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'data', type: 'cell' },
                ],
            },
            {
                name: 'decodeTonEventData',
                inputs: [
                    { name: 'data', type: 'cell' },
                ],
                outputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
            },
            {
                name: 'status',
                inputs: [
                ],
                outputs: [
                    { name: 'status', type: 'uint8' },
                ],
            },
            {
                name: 'votes',
                inputs: [
                ],
                outputs: [
                    { name: 'votes', type: 'map(uint256,uint8)' },
                ],
            },
            {
                name: 'initializer',
                inputs: [
                ],
                outputs: [
                    { name: 'initializer', type: 'address' },
                ],
            },
            {
                name: 'meta',
                inputs: [
                ],
                outputs: [
                    { name: 'meta', type: 'cell' },
                ],
            },
            {
                name: 'requiredVotes',
                inputs: [
                ],
                outputs: [
                    { name: 'requiredVotes', type: 'uint32' },
                ],
            },
            {
                name: 'confirms',
                inputs: [
                ],
                outputs: [
                    { name: 'confirms', type: 'uint16' },
                ],
            },
            {
                name: 'rejects',
                inputs: [
                ],
                outputs: [
                    { name: 'rejects', type: 'uint16' },
                ],
            },
            {
                name: 'relay_round',
                inputs: [
                ],
                outputs: [
                    { name: 'relay_round', type: 'address' },
                ],
            },
            {
                name: 'round_number',
                inputs: [
                ],
                outputs: [
                    { name: 'round_number', type: 'uint32' },
                ],
            },
            {
                name: 'signatures',
                inputs: [
                ],
                outputs: [
                    { name: 'signatures', type: 'map(uint256,bytes)' },
                ],
            },
            {
                name: 'createdAt',
                inputs: [
                ],
                outputs: [
                    { name: 'createdAt', type: 'uint32' },
                ],
            },
        ],
        data: [
            {
                components: [{ components: [{ name: 'eventTransactionLt', type: 'uint64' }, { name: 'eventTimestamp', type: 'uint32' }, { name: 'eventData', type: 'cell' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }], key: 1, name: 'eventInitData', type: 'tuple',
            },
        ],
        events: [
            {
                name: 'Confirm',
                inputs: [
                    { name: 'relay', type: 'uint256' },
                    { name: 'signature', type: 'bytes' },
                ],
                outputs: [
                ],
            },
            {
                name: 'Reject',
                inputs: [
                    { name: 'relay', type: 'uint256' },
                ],
                outputs: [
                ],
            },
            {
                name: 'Closed',
                inputs: [
                ],
                outputs: [
                ],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'status', type: 'uint8' },
            { name: 'votes', type: 'map(uint256,uint8)' },
            { name: 'initializer', type: 'address' },
            { name: 'meta', type: 'cell' },
            { name: 'requiredVotes', type: 'uint32' },
            { name: 'confirms', type: 'uint16' },
            { name: 'rejects', type: 'uint16' },
            { name: 'relay_round', type: 'address' },
            { name: 'round_number', type: 'uint32' },
            { components: [{ components: [{ name: 'eventTransactionLt', type: 'uint64' }, { name: 'eventTimestamp', type: 'uint32' }, { name: 'eventData', type: 'cell' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }], name: 'eventInitData', type: 'tuple' },
            { name: 'signatures', type: 'map(uint256,bytes)' },
            { name: 'createdAt', type: 'uint32' },
        ],
    } as const

    static TokenTransferProxy = {
        'ABI version': 2,
        version: '2.1',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: 'owner_', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'broxusBridgeCallback',
                inputs: [
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], name: 'eventData', type: 'tuple' },
                    { name: 'gasBackAddress', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'burnCallback',
                inputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'payload', type: 'cell' },
                    { name: 'sender_public_key', type: 'uint256' },
                    { name: 'sender_address', type: 'address' },
                    { name: 'value4', type: 'address' },
                    { name: 'send_gas_to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'tonConfiguration', type: 'address' }, { name: 'ethereumConfigurations', type: 'address[]' }, { name: 'outdatedTokenRoots', type: 'address[]' }, { name: 'tokenRoot', type: 'address' }, { name: 'settingsDeployWalletGrams', type: 'uint128' }], name: 'value0', type: 'tuple' },
                    { name: 'value1', type: 'address' },
                    { name: 'value2', type: 'uint128' },
                    { name: 'value3', type: 'bool' },
                ],
            },
            {
                name: 'getTokenRoot',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'getConfiguration',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'tonConfiguration', type: 'address' }, { name: 'ethereumConfigurations', type: 'address[]' }, { name: 'outdatedTokenRoots', type: 'address[]' }, { name: 'tokenRoot', type: 'address' }, { name: 'settingsDeployWalletGrams', type: 'uint128' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'setConfiguration',
                inputs: [
                    { components: [{ name: 'tonConfiguration', type: 'address' }, { name: 'ethereumConfigurations', type: 'address[]' }, { name: 'outdatedTokenRoots', type: 'address[]' }, { name: 'tokenRoot', type: 'address' }, { name: 'settingsDeployWalletGrams', type: 'uint128' }], name: '_config', type: 'tuple' },
                    { name: 'gasBackAddress', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'withdrawExtraGasFromTokenRoot',
                inputs: [
                    { name: 'root', type: 'address' },
                    { name: 'to', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'transferTokenOwnership',
                inputs: [
                    { name: 'target', type: 'address' },
                    { name: 'external_owner_pubkey_', type: 'uint256' },
                    { name: 'internal_owner_address_', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setPaused',
                inputs: [
                    { name: 'value', type: 'bool' },
                ],
                outputs: [
                ],
            },
            {
                name: 'sendPausedCallbackTo',
                inputs: [
                    { name: 'callback_id', type: 'uint64' },
                    { name: 'callback_addr', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'transferOwnership',
                inputs: [
                    { name: 'newOwner', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'renounceOwnership',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'encodeEthereumEventData',
                inputs: [
                    { name: 'tokens', type: 'uint256' },
                    { name: 'wid', type: 'int128' },
                    { name: 'owner_addr', type: 'uint256' },
                ],
                outputs: [
                    { name: 'data', type: 'cell' },
                ],
            },
            {
                name: 'decodeEthereumEventData',
                inputs: [
                    { name: 'data', type: 'cell' },
                ],
                outputs: [
                    { name: 'tokens', type: 'uint128' },
                    { name: 'wid', type: 'int8' },
                    { name: 'owner_addr', type: 'uint256' },
                ],
            },
            {
                name: 'encodeTonEventData',
                inputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'data', type: 'cell' },
                ],
            },
            {
                name: 'decodeTonEventData',
                inputs: [
                    { name: 'data', type: 'cell' },
                ],
                outputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'ethereum_address', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
            },
            {
                name: '_randomNonce',
                inputs: [
                ],
                outputs: [
                    { name: '_randomNonce', type: 'uint256' },
                ],
            },
            {
                name: 'owner',
                inputs: [
                ],
                outputs: [
                    { name: 'owner', type: 'address' },
                ],
            },
        ],
        data: [
            { key: 1, name: '_randomNonce', type: 'uint256' },
        ],
        events: [
            {
                name: 'Withdraw',
                inputs: [
                    { name: 'wid', type: 'int8' },
                    { name: 'addr', type: 'uint256' },
                    { name: 'tokens', type: 'uint128' },
                    { name: 'eth_addr', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'OwnershipTransferred',
                inputs: [
                    { name: 'previousOwner', type: 'address' },
                    { name: 'newOwner', type: 'address' },
                ],
                outputs: [
                ],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: '_randomNonce', type: 'uint256' },
            { name: 'owner', type: 'address' },
            { components: [{ name: 'tonConfiguration', type: 'address' }, { name: 'ethereumConfigurations', type: 'address[]' }, { name: 'outdatedTokenRoots', type: 'address[]' }, { name: 'tokenRoot', type: 'address' }, { name: 'settingsDeployWalletGrams', type: 'uint128' }], name: 'config', type: 'tuple' },
            { name: 'burnedCount', type: 'uint128' },
            { name: 'paused', type: 'bool' },
        ],
    } as const

    static CreditProcessor = {
        'ABI version': 2,
        version: '2.1',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: 'fee', type: 'uint128' },
                    { name: 'deployer_', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'eventVoteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'amount', type: 'uint128' }, { components: [{ name: 'numerator', type: 'uint128' }, { name: 'denominator', type: 'uint128' }], name: 'slippage', type: 'tuple' }, { name: 'dexRoot', type: 'address' }, { name: 'wtonVault', type: 'address' }, { name: 'wtonRoot', type: 'address' }, { name: 'state', type: 'uint8' }, { name: 'eventState', type: 'uint8' }, { name: 'deployer', type: 'address' }, { name: 'debt', type: 'uint128' }, { name: 'fee', type: 'uint128' }, { name: 'eventAddress', type: 'address' }, { name: 'tokenRoot', type: 'address' }, { name: 'tokenWallet', type: 'address' }, { name: 'wtonWallet', type: 'address' }, { name: 'dexPair', type: 'address' }, { name: 'dexVault', type: 'address' }, { name: 'swapAttempt', type: 'uint64' }, { name: 'swapAmount', type: 'uint128' }, { name: 'unwrapAmount', type: 'uint128' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'getCreditEventData',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'amount', type: 'uint128' }, { name: 'user', type: 'address' }, { name: 'creditor', type: 'address' }, { name: 'recipient', type: 'address' }, { name: 'tokenAmount', type: 'uint128' }, { name: 'tonAmount', type: 'uint128' }, { name: 'swapType', type: 'uint8' }, { components: [{ name: 'numerator', type: 'uint128' }, { name: 'denominator', type: 'uint128' }], name: 'slippage', type: 'tuple' }, { name: 'layer3', type: 'cell' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'deriveEventAddress',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'onEventAddress',
                inputs: [
                    { name: 'value', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'deployEvent',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'requestEventConfigDetails',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'onEventConfigDetails',
                inputs: [
                    { components: [{ name: 'eventABI', type: 'bytes' }, { name: 'staking', type: 'address' }, { name: 'eventInitialBalance', type: 'uint64' }, { name: 'eventCode', type: 'cell' }], name: '_basicConfiguration', type: 'tuple' },
                    { components: [{ name: 'chainId', type: 'uint32' }, { name: 'eventEmitter', type: 'uint160' }, { name: 'eventBlocksToConfirm', type: 'uint16' }, { name: 'proxy', type: 'address' }, { name: 'startBlockNumber', type: 'uint32' }, { name: 'endBlockNumber', type: 'uint32' }], name: '_networkConfiguration', type: 'tuple' },
                    { name: 'value2', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'requestTokenEventProxyConfig',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'requestDexVault',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'requestDexPairAddress',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'onTokenEventProxyConfig',
                inputs: [
                    { components: [{ name: 'tonConfiguration', type: 'address' }, { name: 'ethereumConfigurations', type: 'address[]' }, { name: 'outdatedTokenRoots', type: 'address[]' }, { name: 'tokenRoot', type: 'address' }, { name: 'settingsDeployWalletGrams', type: 'uint128' }], name: 'value', type: 'tuple' },
                ],
                outputs: [
                ],
            },
            {
                name: 'onWtonWallet',
                inputs: [
                    { name: 'value', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'onTokenWallet',
                inputs: [
                    { name: 'value', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'onDexVault',
                inputs: [
                    { name: 'value', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'onPairAddress',
                inputs: [
                    { name: 'value', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'notifyEventStatusChanged',
                inputs: [
                    { name: 'eventState_', type: 'uint8' },
                ],
                outputs: [
                ],
            },
            {
                name: 'checkEventStatus',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'onEthereumEventDetails',
                inputs: [
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], name: 'value0', type: 'tuple' },
                    { name: '_status', type: 'uint8' },
                    { name: 'value2', type: 'uint256[]' },
                    { name: 'value3', type: 'uint256[]' },
                    { name: 'value4', type: 'uint256[]' },
                    { name: 'value5', type: 'uint128' },
                    { name: 'value6', type: 'address' },
                    { name: 'value7', type: 'cell' },
                    { name: 'value8', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'broxusBridgeCallback',
                inputs: [
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'voteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'staking', type: 'address' }, { name: 'chainId', type: 'uint32' }], name: 'eventInitData_', type: 'tuple' },
                    { name: 'value1', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'process',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'cancel',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'proxyTransferToRecipient',
                inputs: [
                    { name: 'tokenWallet_', type: 'address' },
                    { name: 'gasValue', type: 'uint128' },
                    { name: 'amount_', type: 'uint128' },
                    { name: 'recipient', type: 'address' },
                    { name: 'deployGrams', type: 'uint128' },
                    { name: 'gasBackAddress', type: 'address' },
                    { name: 'notifyReceiver', type: 'bool' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'sendGas',
                inputs: [
                    { name: 'to', type: 'address' },
                    { name: 'value_', type: 'uint128' },
                    { name: 'flag_', type: 'uint16' },
                ],
                outputs: [
                ],
            },
            {
                name: 'revertRemainderGas',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'onTokenWalletBalance',
                inputs: [
                    { name: 'balance', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'retryUnwrap',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'setSlippage',
                inputs: [
                    { components: [{ name: 'numerator', type: 'uint128' }, { name: 'denominator', type: 'uint128' }], name: 'slippage', type: 'tuple' },
                ],
                outputs: [
                ],
            },
            {
                name: 'retrySwap',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'onExpectedSpentAmount',
                inputs: [
                    { name: 'expectedSpentAmount', type: 'uint128' },
                    { name: 'value1', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'tokensReceivedCallback',
                inputs: [
                    { name: 'value0', type: 'address' },
                    { name: 'value1', type: 'address' },
                    { name: 'receivedAmount', type: 'uint128' },
                    { name: 'value3', type: 'uint256' },
                    { name: 'senderAddress', type: 'address' },
                    { name: 'value5', type: 'address' },
                    { name: 'value6', type: 'address' },
                    { name: 'value7', type: 'uint128' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'tokensBouncedCallback',
                inputs: [
                    { name: 'wallet_', type: 'address' },
                    { name: 'value1', type: 'address' },
                    { name: 'value2', type: 'uint128' },
                    { name: 'value3', type: 'address' },
                    { name: 'value4', type: 'uint128' },
                ],
                outputs: [
                ],
            },
        ],
        data: [
            {
                components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], key: 1, name: 'eventVoteData', type: 'tuple',
            },
            { key: 2, name: 'configuration', type: 'address' },
        ],
        events: [
            {
                name: 'CreditProcessorDeployed',
                inputs: [
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'eventVoteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'amount', type: 'uint128' }, { components: [{ name: 'numerator', type: 'uint128' }, { name: 'denominator', type: 'uint128' }], name: 'slippage', type: 'tuple' }, { name: 'dexRoot', type: 'address' }, { name: 'wtonVault', type: 'address' }, { name: 'wtonRoot', type: 'address' }, { name: 'state', type: 'uint8' }, { name: 'eventState', type: 'uint8' }, { name: 'deployer', type: 'address' }, { name: 'debt', type: 'uint128' }, { name: 'fee', type: 'uint128' }, { name: 'eventAddress', type: 'address' }, { name: 'tokenRoot', type: 'address' }, { name: 'tokenWallet', type: 'address' }, { name: 'wtonWallet', type: 'address' }, { name: 'dexPair', type: 'address' }, { name: 'dexVault', type: 'address' }, { name: 'swapAttempt', type: 'uint64' }, { name: 'swapAmount', type: 'uint128' }, { name: 'unwrapAmount', type: 'uint128' }], name: 'details', type: 'tuple' },
                ],
                outputs: [
                ],
            },
            {
                name: 'CreditProcessorStateChanged',
                inputs: [
                    { name: 'from', type: 'uint8' },
                    { name: 'to', type: 'uint8' },
                    { components: [{ components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'eventVoteData', type: 'tuple' }, { name: 'configuration', type: 'address' }, { name: 'amount', type: 'uint128' }, { components: [{ name: 'numerator', type: 'uint128' }, { name: 'denominator', type: 'uint128' }], name: 'slippage', type: 'tuple' }, { name: 'dexRoot', type: 'address' }, { name: 'wtonVault', type: 'address' }, { name: 'wtonRoot', type: 'address' }, { name: 'state', type: 'uint8' }, { name: 'eventState', type: 'uint8' }, { name: 'deployer', type: 'address' }, { name: 'debt', type: 'uint128' }, { name: 'fee', type: 'uint128' }, { name: 'eventAddress', type: 'address' }, { name: 'tokenRoot', type: 'address' }, { name: 'tokenWallet', type: 'address' }, { name: 'wtonWallet', type: 'address' }, { name: 'dexPair', type: 'address' }, { name: 'dexVault', type: 'address' }, { name: 'swapAttempt', type: 'uint64' }, { name: 'swapAmount', type: 'uint128' }, { name: 'unwrapAmount', type: 'uint128' }], name: 'details', type: 'tuple' },
                ],
                outputs: [
                ],
            },
            {
                name: 'DeriveEventAddressCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RequestTokenEventProxyConfigCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RequestDexPairAddressCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RequestDexVaultCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RequestEventConfigDetailsCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'CheckEventStatusCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'GasDonation',
                inputs: [
                    { name: 'sender', type: 'address' },
                    { name: 'value', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'DeployEventCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RetryUnwrapCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RetrySwapCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'SetSlippageCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'ProcessCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'CancelCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'RevertRemainderGasCalled',
                inputs: [
                    { name: 'sender', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'Reject',
                inputs: [
                    { name: 'relay', type: 'uint256' },
                ],
                outputs: [
                ],
            },
            {
                name: 'Closed',
                inputs: [
                ],
                outputs: [
                ],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'eventVoteData', type: 'tuple' },
            { name: 'configuration', type: 'address' },
            { components: [{ name: 'amount', type: 'uint128' }, { name: 'user', type: 'address' }, { name: 'creditor', type: 'address' }, { name: 'recipient', type: 'address' }, { name: 'tokenAmount', type: 'uint128' }, { name: 'tonAmount', type: 'uint128' }, { name: 'swapType', type: 'uint8' }, { components: [{ name: 'numerator', type: 'uint128' }, { name: 'denominator', type: 'uint128' }], name: 'slippage', type: 'tuple' }, { name: 'layer3', type: 'cell' }], name: 'eventData', type: 'tuple' },
            { name: 'amount', type: 'uint128' },
            { components: [{ name: 'numerator', type: 'uint128' }, { name: 'denominator', type: 'uint128' }], name: 'slippage_', type: 'tuple' },
            { name: 'state', type: 'uint8' },
            { name: 'prevState', type: 'uint8' },
            { name: 'eventState', type: 'uint8' },
            { name: 'deployer', type: 'address' },
            { name: 'debt', type: 'uint128' },
            { name: 'fee_', type: 'uint128' },
            { name: 'eventAddress', type: 'address' },
            { name: 'eventProxy', type: 'address' },
            { name: 'eventInitialBalance', type: 'uint128' },
            { name: 'tokenRoot', type: 'address' },
            { name: 'tokenWallet', type: 'address' },
            { name: 'wtonWallet', type: 'address' },
            { name: 'dexPair', type: 'address' },
            { name: 'dexVault', type: 'address' },
            { name: 'swapAttempt', type: 'uint64' },
            { name: 'swapAmount', type: 'uint128' },
            { name: 'unwrapAmount', type: 'uint128' },
        ],
    } as const

    static HiddenBridgeStrategyFactory = {
        'ABI version': 2,
        version: '2.1',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: 'code', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'deployStrategy',
                inputs: [
                    { name: 'tokenRoot', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'buildLayer3',
                inputs: [
                    { name: 'id', type: 'uint32' },
                    { name: 'proxy', type: 'address' },
                    { name: 'evmAddress', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'cell' },
                ],
            },
            {
                name: 'getStrategyAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { name: 'tokenRoot', type: 'address' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: '_randomNonce',
                inputs: [
                ],
                outputs: [
                    { name: '_randomNonce', type: 'uint256' },
                ],
            },
            {
                name: 'strategyCode',
                inputs: [
                ],
                outputs: [
                    { name: 'strategyCode', type: 'cell' },
                ],
            },
        ],
        data: [
            { key: 1, name: '_randomNonce', type: 'uint256' },
        ],
        events: [
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: '_randomNonce', type: 'uint256' },
            { name: 'strategyCode', type: 'cell' },
        ],
    } as const

    static HiddenBridgeStrategy = {
        'ABI version': 2,
        version: '2.1',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: 'deployer_', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'factory_', type: 'address' },
                    { name: 'tokenRoot_', type: 'address' },
                    { name: 'tokenWallet_', type: 'address' },
                ],
            },
            {
                name: 'onTokenWallet',
                inputs: [
                    { name: 'wallet', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'tokensReceivedCallback',
                inputs: [
                    { name: 'tokenWallet_', type: 'address' },
                    { name: 'tokenRoot_', type: 'address' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'senderPublicKey', type: 'uint256' },
                    { name: 'senderAddress', type: 'address' },
                    { name: 'senderWallet', type: 'address' },
                    { name: 'originalGasTo', type: 'address' },
                    { name: 'value7', type: 'uint128' },
                    { name: 'payload', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'buildLayer3',
                inputs: [
                    { name: 'id', type: 'uint32' },
                    { name: 'proxy', type: 'address' },
                    { name: 'evmAddress', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'cell' },
                ],
            },
            {
                name: 'onReceiveTONsFromBridgeCallback',
                inputs: [
                    { components: [{ name: 'amount', type: 'uint128' }, { name: 'user', type: 'address' }, { name: 'creditor', type: 'address' }, { name: 'recipient', type: 'address' }, { name: 'tokenAmount', type: 'uint128' }, { name: 'tonAmount', type: 'uint128' }, { name: 'swapType', type: 'uint8' }, { components: [{ name: 'numerator', type: 'uint128' }, { name: 'denominator', type: 'uint128' }], name: 'slippage', type: 'tuple' }, { name: 'layer3', type: 'cell' }], name: 'decodedEventData', type: 'tuple' },
                ],
                outputs: [
                ],
            },
            {
                name: 'factory',
                inputs: [
                ],
                outputs: [
                    { name: 'factory', type: 'address' },
                ],
            },
            {
                name: 'tokenRoot',
                inputs: [
                ],
                outputs: [
                    { name: 'tokenRoot', type: 'address' },
                ],
            },
            {
                name: 'tokenWallet',
                inputs: [
                ],
                outputs: [
                    { name: 'tokenWallet', type: 'address' },
                ],
            },
        ],
        data: [
            { key: 1, name: 'factory', type: 'address' },
            { key: 2, name: 'tokenRoot', type: 'address' },
        ],
        events: [
            {
                name: 'BurnTokens',
                inputs: [
                    { name: 'id', type: 'uint32' },
                    { name: 'user', type: 'address' },
                    { name: 'processor', type: 'address' },
                    { name: 'amount', type: 'uint128' },
                    { name: 'evmAddress', type: 'uint160' },
                    { name: 'chainId', type: 'uint32' },
                ],
                outputs: [
                ],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'factory', type: 'address' },
            { name: 'tokenRoot', type: 'address' },
            { name: 'tokenWallet', type: 'address' },
            { name: 'deployer', type: 'address' },
        ],
    } as const

    static CreditFactory = {
        'ABI version': 2,
        version: '2.1',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: 'owners_', type: 'uint256[]' },
                    { name: 'fee', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'setCreditProcessorCode',
                inputs: [
                    { name: 'value', type: 'cell' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getCreditProcessorCode',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { name: 'value0', type: 'cell' },
                ],
            },
            {
                name: 'setFee',
                inputs: [
                    { name: 'value', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getDetails',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                ],
                outputs: [
                    { components: [{ name: 'owners', type: 'uint256[]' }, { name: 'fee', type: 'uint128' }], name: 'value0', type: 'tuple' },
                ],
            },
            {
                name: 'deployProcessorForUser',
                inputs: [
                    { components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'eventVoteData', type: 'tuple' },
                    { name: 'configuration', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'deployProcessor',
                inputs: [
                    { components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'eventVoteData', type: 'tuple' },
                    { name: 'configuration', type: 'address' },
                    { name: 'grams', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getCreditProcessorAddress',
                inputs: [
                    { name: 'answerId', type: 'uint32' },
                    { components: [{ name: 'eventTransaction', type: 'uint256' }, { name: 'eventIndex', type: 'uint32' }, { name: 'eventData', type: 'cell' }, { name: 'eventBlockNumber', type: 'uint32' }, { name: 'eventBlock', type: 'uint256' }], name: 'eventVoteData', type: 'tuple' },
                    { name: 'configuration', type: 'address' },
                ],
                outputs: [
                    { name: 'value0', type: 'address' },
                ],
            },
            {
                name: 'sendGas',
                inputs: [
                    { name: 'to', type: 'address' },
                    { name: 'value_', type: 'uint128' },
                    { name: 'flag_', type: 'uint16' },
                ],
                outputs: [
                ],
            },
            {
                name: 'runRevertRemainderGas',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'runProcess',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'runDeriveEventAddress',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                    { name: 'grams', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'runRequestEventConfigDetails',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                    { name: 'grams', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'runDeployEvent',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                    { name: 'grams', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'runRequestTokenEventProxyConfig',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                    { name: 'grams', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'runRequestDexPairAddress',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                    { name: 'grams', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'runRequestDexVault',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                    { name: 'grams', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'runCheckEventStatus',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                    { name: 'grams', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'runRetryUnwrap',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                    { name: 'grams', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'runRetrySwap',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                    { name: 'grams', type: 'uint128' },
                ],
                outputs: [
                ],
            },
            {
                name: 'runSetSlippage',
                inputs: [
                    { name: 'creditProcessor', type: 'address' },
                    { name: 'grams', type: 'uint128' },
                    { components: [{ name: 'numerator', type: 'uint128' }, { name: 'denominator', type: 'uint128' }], name: 'slippage', type: 'tuple' },
                ],
                outputs: [
                ],
            },
            {
                name: 'addOwner',
                inputs: [
                    { name: 'newOwner', type: 'uint256' },
                ],
                outputs: [
                ],
            },
            {
                name: '_randomNonce',
                inputs: [
                ],
                outputs: [
                    { name: '_randomNonce', type: 'uint256' },
                ],
            },
            {
                name: 'owners',
                inputs: [
                ],
                outputs: [
                    { name: 'owners', type: 'uint256[]' },
                ],
            },
        ],
        data: [
            { key: 1, name: '_randomNonce', type: 'uint256' },
        ],
        events: [
            {
                name: 'OwnerAdded',
                inputs: [
                    { name: 'newOwner', type: 'uint256' },
                ],
                outputs: [
                ],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: '_randomNonce', type: 'uint256' },
            { name: 'owners', type: 'uint256[]' },
            { name: 'creditProcessorCode', type: 'cell' },
            { name: 'fee_', type: 'uint128' },
        ],
    } as const

}

export class TonAirdrop {

    static Airdrop = {
        'ABI version': 2,
        version: '2.1',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: '_token', type: 'address' },
                    { name: '_owner', type: 'address' },
                    { name: '_start_timestamp', type: 'uint32' },
                    { name: '_claim_period_in_seconds', type: 'uint32' },
                    { name: '_claim_periods_amount', type: 'uint32' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getDetails',
                inputs: [
                ],
                outputs: [
                    { name: '_token', type: 'address' },
                    { name: '_token_wallet', type: 'address' },
                    { name: '_claim_required_value', type: 'uint128' },
                    { name: '_transferred_count', type: 'uint128' },
                    { name: '_start_timestamp', type: 'uint32' },
                    { name: '_claim_period_in_seconds', type: 'uint32' },
                    { name: '_claim_periods_amount', type: 'uint32' },
                    { components: [{ name: 'start', type: 'uint32' }, { name: 'end', type: 'uint32' }, { name: 'id', type: 'uint32' }], name: '_periods', type: 'tuple[]' },
                ],
            },
            {
                name: 'receiveTokenWalletAddress',
                inputs: [
                    { name: 'wallet', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getReceiverDetails',
                inputs: [
                    { name: 'user', type: 'address' },
                ],
                outputs: [
                    { components: [{ name: 'last_claimed_period_id', type: 'uint32' }, { name: 'reward_per_period', type: 'uint128' }], name: 'receiver', type: 'tuple' },
                ],
            },
            {
                name: 'getCurrentClaimable',
                inputs: [
                    { name: 'user', type: 'address' },
                ],
                outputs: [
                    { name: '_amount', type: 'uint128' },
                    { name: '_last_claimed_period_id', type: 'uint32' },
                ],
            },
            {
                name: 'claim',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'setChunk',
                inputs: [
                    { name: '_users', type: 'address[]' },
                    { name: '_rewards_per_period', type: 'uint128[]' },
                ],
                outputs: [
                ],
            },
            {
                name: 'transferOwnership',
                inputs: [
                    { name: 'newOwner', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'renounceOwnership',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'owner',
                inputs: [
                ],
                outputs: [
                    { name: 'owner', type: 'address' },
                ],
            },
            {
                name: '_randomNonce',
                inputs: [
                ],
                outputs: [
                    { name: '_randomNonce', type: 'uint256' },
                ],
            },
        ],
        data: [
            { key: 1, name: '_randomNonce', type: 'uint256' },
        ],
        events: [
            {
                name: 'OwnershipTransferred',
                inputs: [
                    { name: 'previousOwner', type: 'address' },
                    { name: 'newOwner', type: 'address' },
                ],
                outputs: [
                ],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'owner', type: 'address' },
            { name: '_randomNonce', type: 'uint256' },
            { components: [{ name: 'last_claimed_period_id', type: 'uint32' }, { name: 'reward_per_period', type: 'uint128' }], name: 'receivers', type: 'map(address,tuple)' },
            { name: 'token', type: 'address' },
            { name: 'token_wallet', type: 'address' },
            { name: 'start_timestamp', type: 'uint32' },
            { name: 'claim_period_in_seconds', type: 'uint32' },
            { name: 'claim_periods_amount', type: 'uint32' },
            { name: 'transferred_count', type: 'uint128' },
            { components: [{ name: 'start', type: 'uint32' }, { name: 'end', type: 'uint32' }, { name: 'id', type: 'uint32' }], name: 'periods', type: 'tuple[]' },
        ],
    } as const

    static Wallet = {
        'ABI version': 2,
        version: '2.1',
        header: ['pubkey', 'time', 'expire'],
        functions: [
            {
                name: 'constructor',
                inputs: [
                    { name: '_token', type: 'address' },
                    { name: '_owner', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getDetails',
                inputs: [
                ],
                outputs: [
                    { name: '_token', type: 'address' },
                    { name: '_token_wallet', type: 'address' },
                    { name: '_claim_required_value', type: 'uint128' },
                    { name: '_transferred_count', type: 'uint128' },
                ],
            },
            {
                name: 'receiveTokenWalletAddress',
                inputs: [
                    { name: 'wallet', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'getClaimable',
                inputs: [
                    { name: 'user', type: 'address' },
                ],
                outputs: [
                    { name: 'value0', type: 'uint128' },
                ],
            },
            {
                name: 'claim',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'setChunk',
                inputs: [
                    { name: '_users', type: 'address[]' },
                    { name: '_amounts', type: 'uint128[]' },
                ],
                outputs: [
                ],
            },
            {
                name: 'transferOwnership',
                inputs: [
                    { name: 'newOwner', type: 'address' },
                ],
                outputs: [
                ],
            },
            {
                name: 'renounceOwnership',
                inputs: [
                ],
                outputs: [
                ],
            },
            {
                name: 'owner',
                inputs: [
                ],
                outputs: [
                    { name: 'owner', type: 'address' },
                ],
            },
            {
                name: '_randomNonce',
                inputs: [
                ],
                outputs: [
                    { name: '_randomNonce', type: 'uint256' },
                ],
            },
        ],
        data: [
            { key: 1, name: '_randomNonce', type: 'uint256' },
        ],
        events: [
            {
                name: 'OwnershipTransferred',
                inputs: [
                    { name: 'previousOwner', type: 'address' },
                    { name: 'newOwner', type: 'address' },
                ],
                outputs: [
                ],
            },
        ],
        fields: [
            { name: '_pubkey', type: 'uint256' },
            { name: '_timestamp', type: 'uint64' },
            { name: '_constructorFlag', type: 'bool' },
            { name: 'owner', type: 'address' },
            { name: '_randomNonce', type: 'uint256' },
            { name: 'receivers', type: 'map(address,uint128)' },
            { name: 'token', type: 'address' },
            { name: 'token_wallet', type: 'address' },
            { name: 'transferred_count', type: 'uint128' },
        ],
    } as const

}

export class EthAbi {

    static Bridge: AbiItem[] = [
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'relay',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'bool',
                    name: 'status',
                    type: 'bool',
                },
            ],
            name: 'BanRelay',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'bool',
                    name: 'active',
                    type: 'bool',
                },
            ],
            name: 'EmergencyShutdown',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'uint32',
                    name: 'round',
                    type: 'uint32',
                },
                {
                    components: [
                        {
                            internalType: 'uint32',
                            name: 'end',
                            type: 'uint32',
                        },
                        {
                            internalType: 'uint32',
                            name: 'ttl',
                            type: 'uint32',
                        },
                        {
                            internalType: 'uint32',
                            name: 'relays',
                            type: 'uint32',
                        },
                        {
                            internalType: 'uint32',
                            name: 'requiredSignatures',
                            type: 'uint32',
                        },
                    ],
                    indexed: false,
                    internalType: 'struct IBridge.Round',
                    name: 'meta',
                    type: 'tuple',
                },
            ],
            name: 'NewRound',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'previousOwner',
                    type: 'address',
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'newOwner',
                    type: 'address',
                },
            ],
            name: 'OwnershipTransferred',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
            ],
            name: 'Paused',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'uint32',
                    name: 'round',
                    type: 'uint32',
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'relay',
                    type: 'address',
                },
            ],
            name: 'RoundRelay',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
            ],
            name: 'Unpaused',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint32',
                    name: 'value',
                    type: 'uint32',
                },
            ],
            name: 'UpdateMinimumRequiredSignatures',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    components: [
                        {
                            internalType: 'int8',
                            name: 'wid',
                            type: 'int8',
                        },
                        {
                            internalType: 'uint256',
                            name: 'addr',
                            type: 'uint256',
                        },
                    ],
                    indexed: false,
                    internalType: 'struct IBridge.TONAddress',
                    name: 'configuration',
                    type: 'tuple',
                },
            ],
            name: 'UpdateRoundRelaysConfiguration',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_roundSubmitter',
                    type: 'address',
                },
            ],
            name: 'UpdateRoundSubmitter',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint32',
                    name: 'value',
                    type: 'uint32',
                },
            ],
            name: 'UpdateRoundTTL',
            type: 'event',
        },
        {
            inputs: [
                {
                    internalType: 'address[]',
                    name: '_relays',
                    type: 'address[]',
                },
            ],
            name: 'banRelays',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            name: 'blacklist',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bytes32',
                    name: '',
                    type: 'bytes32',
                },
            ],
            name: 'cache',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bytes',
                    name: 'payload',
                    type: 'bytes',
                },
            ],
            name: 'decodeRoundRelaysEventData',
            outputs: [
                {
                    internalType: 'uint32',
                    name: 'round',
                    type: 'uint32',
                },
                {
                    internalType: 'uint160[]',
                    name: '_relays',
                    type: 'uint160[]',
                },
                {
                    internalType: 'uint32',
                    name: 'roundEnd',
                    type: 'uint32',
                },
            ],
            stateMutability: 'pure',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bytes',
                    name: 'payload',
                    type: 'bytes',
                },
            ],
            name: 'decodeTonEvent',
            outputs: [
                {
                    components: [
                        {
                            internalType: 'uint64',
                            name: 'eventTransactionLt',
                            type: 'uint64',
                        },
                        {
                            internalType: 'uint32',
                            name: 'eventTimestamp',
                            type: 'uint32',
                        },
                        {
                            internalType: 'bytes',
                            name: 'eventData',
                            type: 'bytes',
                        },
                        {
                            internalType: 'int8',
                            name: 'configurationWid',
                            type: 'int8',
                        },
                        {
                            internalType: 'uint256',
                            name: 'configurationAddress',
                            type: 'uint256',
                        },
                        {
                            internalType: 'int8',
                            name: 'eventContractWid',
                            type: 'int8',
                        },
                        {
                            internalType: 'uint256',
                            name: 'eventContractAddress',
                            type: 'uint256',
                        },
                        {
                            internalType: 'address',
                            name: 'proxy',
                            type: 'address',
                        },
                        {
                            internalType: 'uint32',
                            name: 'round',
                            type: 'uint32',
                        },
                    ],
                    internalType: 'struct IBridge.TONEvent',
                    name: 'tonEvent',
                    type: 'tuple',
                },
            ],
            stateMutability: 'pure',
            type: 'function',
        },
        {
            inputs: [],
            name: 'emergencyShutdown',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint160[]',
                    name: '_relays',
                    type: 'uint160[]',
                },
                {
                    internalType: 'uint32',
                    name: 'roundEnd',
                    type: 'uint32',
                },
            ],
            name: 'forceRoundRelays',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'initialRound',
            outputs: [
                {
                    internalType: 'uint32',
                    name: '',
                    type: 'uint32',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_owner',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_roundSubmitter',
                    type: 'address',
                },
                {
                    internalType: 'uint32',
                    name: '_minimumRequiredSignatures',
                    type: 'uint32',
                },
                {
                    internalType: 'uint32',
                    name: '_roundTTL',
                    type: 'uint32',
                },
                {
                    internalType: 'uint32',
                    name: '_initialRound',
                    type: 'uint32',
                },
                {
                    internalType: 'uint32',
                    name: '_initialRoundEnd',
                    type: 'uint32',
                },
                {
                    internalType: 'uint160[]',
                    name: '_relays',
                    type: 'uint160[]',
                },
            ],
            name: 'initialize',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'candidate',
                    type: 'address',
                },
            ],
            name: 'isBanned',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint32',
                    name: 'round',
                    type: 'uint32',
                },
                {
                    internalType: 'address',
                    name: 'candidate',
                    type: 'address',
                },
            ],
            name: 'isRelay',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint32',
                    name: 'round',
                    type: 'uint32',
                },
            ],
            name: 'isRoundRotten',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'lastRound',
            outputs: [
                {
                    internalType: 'uint32',
                    name: '',
                    type: 'uint32',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'minimumRequiredSignatures',
            outputs: [
                {
                    internalType: 'uint32',
                    name: '',
                    type: 'uint32',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'owner',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'pause',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'paused',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bytes',
                    name: 'payload',
                    type: 'bytes',
                },
                {
                    internalType: 'bytes',
                    name: 'signature',
                    type: 'bytes',
                },
            ],
            name: 'recoverSignature',
            outputs: [
                {
                    internalType: 'address',
                    name: 'signer',
                    type: 'address',
                },
            ],
            stateMutability: 'pure',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint32',
                    name: '',
                    type: 'uint32',
                },
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            name: 'relays',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'renounceOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'roundRelaysConfiguration',
            outputs: [
                {
                    internalType: 'int8',
                    name: 'wid',
                    type: 'int8',
                },
                {
                    internalType: 'uint256',
                    name: 'addr',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'roundSubmitter',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'roundTTL',
            outputs: [
                {
                    internalType: 'uint32',
                    name: '',
                    type: 'uint32',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint32',
                    name: '',
                    type: 'uint32',
                },
            ],
            name: 'rounds',
            outputs: [
                {
                    internalType: 'uint32',
                    name: 'end',
                    type: 'uint32',
                },
                {
                    internalType: 'uint32',
                    name: 'ttl',
                    type: 'uint32',
                },
                {
                    internalType: 'uint32',
                    name: 'relays',
                    type: 'uint32',
                },
                {
                    internalType: 'uint32',
                    name: 'requiredSignatures',
                    type: 'uint32',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bytes',
                    name: 'payload',
                    type: 'bytes',
                },
                {
                    internalType: 'bytes[]',
                    name: 'signatures',
                    type: 'bytes[]',
                },
            ],
            name: 'setRoundRelays',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_roundSubmitter',
                    type: 'address',
                },
            ],
            name: 'setRoundSubmitter',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'newOwner',
                    type: 'address',
                },
            ],
            name: 'transferOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address[]',
                    name: '_relays',
                    type: 'address[]',
                },
            ],
            name: 'unbanRelays',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'unpause',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint32',
                    name: '_minimumRequiredSignatures',
                    type: 'uint32',
                },
            ],
            name: 'updateMinimumRequiredSignatures',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    components: [
                        {
                            internalType: 'int8',
                            name: 'wid',
                            type: 'int8',
                        },
                        {
                            internalType: 'uint256',
                            name: 'addr',
                            type: 'uint256',
                        },
                    ],
                    internalType: 'struct IBridge.TONAddress',
                    name: '_roundRelaysConfiguration',
                    type: 'tuple',
                },
            ],
            name: 'updateRoundRelaysConfiguration',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint32',
                    name: '_roundTTL',
                    type: 'uint32',
                },
            ],
            name: 'updateRoundTTL',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bytes',
                    name: 'payload',
                    type: 'bytes',
                },
                {
                    internalType: 'bytes[]',
                    name: 'signatures',
                    type: 'bytes[]',
                },
            ],
            name: 'verifySignedTonEvent',
            outputs: [
                {
                    internalType: 'uint32',
                    name: 'errorCode',
                    type: 'uint32',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
    ]

    static ERC20: AbiItem[] = [
        {
            constant: true,
            inputs: [],
            name: 'name',
            outputs: [
                {
                    name: '',
                    type: 'string',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    name: '_spender',
                    type: 'address',
                },
                {
                    name: '_value',
                    type: 'uint256',
                },
            ],
            name: 'approve',
            outputs: [
                {
                    name: '',
                    type: 'bool',
                },
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'totalSupply',
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    name: '_from',
                    type: 'address',
                },
                {
                    name: '_to',
                    type: 'address',
                },
                {
                    name: '_value',
                    type: 'uint256',
                },
            ],
            name: 'transferFrom',
            outputs: [
                {
                    name: '',
                    type: 'bool',
                },
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'decimals',
            outputs: [
                {
                    name: '',
                    type: 'uint8',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [
                {
                    name: '_owner',
                    type: 'address',
                },
            ],
            name: 'balanceOf',
            outputs: [
                {
                    name: 'balance',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: true,
            inputs: [],
            name: 'symbol',
            outputs: [
                {
                    name: '',
                    type: 'string',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            constant: false,
            inputs: [
                {
                    name: '_to',
                    type: 'address',
                },
                {
                    name: '_value',
                    type: 'uint256',
                },
            ],
            name: 'transfer',
            outputs: [
                {
                    name: '',
                    type: 'bool',
                },
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            constant: true,
            inputs: [
                {
                    name: '_owner',
                    type: 'address',
                },
                {
                    name: '_spender',
                    type: 'address',
                },
            ],
            name: 'allowance',
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
        {
            payable: true,
            stateMutability: 'payable',
            type: 'fallback',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    name: 'owner',
                    type: 'address',
                },
                {
                    indexed: true,
                    name: 'spender',
                    type: 'address',
                },
                {
                    indexed: false,
                    name: 'value',
                    type: 'uint256',
                },
            ],
            name: 'Approval',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    name: 'from',
                    type: 'address',
                },
                {
                    indexed: true,
                    name: 'to',
                    type: 'address',
                },
                {
                    indexed: false,
                    name: 'value',
                    type: 'uint256',
                },
            ],
            name: 'Transfer',
            type: 'event',
        },
    ]

    static Vault: AbiItem[] = [
        {
            name: 'Deposit',
            inputs: [
                {
                    name: 'amount',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'wid',
                    type: 'int128',
                    indexed: false,
                },
                {
                    name: 'addr',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'NewDeposit',
            inputs: [
                {
                    name: 'sender',
                    type: 'address',
                    indexed: false,
                },
                {
                    name: 'recipientWid',
                    type: 'int128',
                    indexed: false,
                },
                {
                    name: 'recipientAddr',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'amount',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'pendingWithdrawalRecipient',
                    type: 'address',
                    indexed: false,
                },
                {
                    name: 'pendingWithdrawalId',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'sendTransferToTon',
                    type: 'bool',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'InstantWithdrawal',
            inputs: [
                {
                    name: 'recipient',
                    type: 'address',
                    indexed: false,
                },
                {
                    name: 'payloadId',
                    type: 'bytes32',
                    indexed: false,
                },
                {
                    name: 'amount',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'CreatePendingWithdrawal',
            inputs: [
                {
                    name: 'recipient',
                    type: 'address',
                    indexed: false,
                },
                {
                    name: 'id',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'payloadId',
                    type: 'bytes32',
                    indexed: false,
                },
                {
                    name: 'amount',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'bounty',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdatePendingWithdrawalBounty',
            inputs: [
                {
                    name: 'recipient',
                    type: 'address',
                    indexed: false,
                },
                {
                    name: 'id',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'bounty',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'CancelPendingWithdrawal',
            inputs: [
                {
                    name: 'recipient',
                    type: 'address',
                    indexed: false,
                },
                {
                    name: 'id',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'amount',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'WithdrawPendingWithdrawal',
            inputs: [
                {
                    name: 'recipient',
                    type: 'address',
                    indexed: false,
                },
                {
                    name: 'id',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'requestedAmount',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'redeemedAmount',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'FillPendingWithdrawal',
            inputs: [
                {
                    name: 'recipient',
                    type: 'address',
                    indexed: false,
                },
                {
                    name: 'id',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateBridge',
            inputs: [
                {
                    name: 'bridge',
                    type: 'address',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateWrapper',
            inputs: [
                {
                    name: 'wrapper',
                    type: 'address',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateConfiguration',
            inputs: [
                {
                    name: 'wid',
                    type: 'int128',
                    indexed: false,
                },
                {
                    name: 'addr',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateTargetDecimals',
            inputs: [
                {
                    name: 'targetDecimals',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'ForceWithdraw',
            inputs: [
                {
                    name: 'recipient',
                    type: 'address',
                    indexed: false,
                },
                {
                    name: 'id',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateRewards',
            inputs: [
                {
                    name: 'wid',
                    type: 'int128',
                    indexed: false,
                },
                {
                    name: 'addr',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateStrategyRewards',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                    indexed: false,
                },
                {
                    name: 'wid',
                    type: 'int128',
                    indexed: false,
                },
                {
                    name: 'addr',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateDepositFee',
            inputs: [
                {
                    name: 'step',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'size',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateWithdrawFee',
            inputs: [
                {
                    name: 'step',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'size',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'StrategyAdded',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                    indexed: true,
                },
                {
                    name: 'debtRatio',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'minDebtPerHarvest',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'maxDebtPerHarvest',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'performanceFee',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'StrategyReported',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                    indexed: true,
                },
                {
                    name: 'gain',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'loss',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'debtPaid',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'totalGain',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'totalSkim',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'totalLoss',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'totalDebt',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'debtAdded',
                    type: 'uint256',
                    indexed: false,
                },
                {
                    name: 'debtRatio',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateGovernance',
            inputs: [
                {
                    name: 'governance',
                    type: 'address',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'NewPendingGovernance',
            inputs: [
                {
                    name: 'governance',
                    type: 'address',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateManagement',
            inputs: [
                {
                    name: 'management',
                    type: 'address',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateDepositLimit',
            inputs: [
                {
                    name: 'depositLimit',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdatePerformanceFee',
            inputs: [
                {
                    name: 'performanceFee',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateManagementFee',
            inputs: [
                {
                    name: 'managementFee',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateGuardian',
            inputs: [
                {
                    name: 'guardian',
                    type: 'address',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'EmergencyShutdown',
            inputs: [
                {
                    name: 'active',
                    type: 'bool',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'UpdateWithdrawalQueue',
            inputs: [
                {
                    name: 'queue',
                    type: 'address[20]',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'StrategyUpdateDebtRatio',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                    indexed: true,
                },
                {
                    name: 'debtRatio',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'StrategyUpdateMinDebtPerHarvest',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                    indexed: true,
                },
                {
                    name: 'minDebtPerHarvest',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'StrategyUpdateMaxDebtPerHarvest',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                    indexed: true,
                },
                {
                    name: 'maxDebtPerHarvest',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'StrategyUpdatePerformanceFee',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                    indexed: true,
                },
                {
                    name: 'performanceFee',
                    type: 'uint256',
                    indexed: false,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'StrategyMigrated',
            inputs: [
                {
                    name: 'oldVersion',
                    type: 'address',
                    indexed: true,
                },
                {
                    name: 'newVersion',
                    type: 'address',
                    indexed: true,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'StrategyRevoked',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                    indexed: true,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'StrategyRemovedFromQueue',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                    indexed: true,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            name: 'StrategyAddedToQueue',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                    indexed: true,
                },
            ],
            anonymous: false,
            type: 'event',
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'initialize',
            inputs: [
                {
                    name: 'token',
                    type: 'address',
                },
                {
                    name: 'governance',
                    type: 'address',
                },
                {
                    name: 'bridge',
                    type: 'address',
                },
                {
                    name: 'wrapper',
                    type: 'address',
                },
                {
                    name: 'guardian',
                    type: 'address',
                },
                {
                    name: 'management',
                    type: 'address',
                },
                {
                    name: 'targetDecimals',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 439965,
        },
        {
            stateMutability: 'pure',
            type: 'function',
            name: 'apiVersion',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'string',
                },
            ],
            gas: 5946,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setTargetDecimals',
            inputs: [
                {
                    name: 'targetDecimals',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 37505,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setDepositFee',
            inputs: [
                {
                    name: 'fee',
                    type: 'tuple',
                    components: [
                        {
                            name: 'step',
                            type: 'uint256',
                        },
                        {
                            name: 'size',
                            type: 'uint256',
                        },
                    ],
                },
            ],
            outputs: [],
            gas: 77144,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setWithdrawFee',
            inputs: [
                {
                    name: 'fee',
                    type: 'tuple',
                    components: [
                        {
                            name: 'step',
                            type: 'uint256',
                        },
                        {
                            name: 'size',
                            type: 'uint256',
                        },
                    ],
                },
            ],
            outputs: [],
            gas: 77174,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setWrapper',
            inputs: [
                {
                    name: 'wrapper',
                    type: 'address',
                },
            ],
            outputs: [],
            gas: 39045,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setConfiguration',
            inputs: [
                {
                    name: 'configuration',
                    type: 'tuple',
                    components: [
                        {
                            name: 'wid',
                            type: 'int128',
                        },
                        {
                            name: 'addr',
                            type: 'uint256',
                        },
                    ],
                },
            ],
            outputs: [],
            gas: 74719,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setGovernance',
            inputs: [
                {
                    name: 'governance',
                    type: 'address',
                },
            ],
            outputs: [],
            gas: 39101,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'acceptGovernance',
            inputs: [],
            outputs: [],
            gas: 39027,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setManagement',
            inputs: [
                {
                    name: 'management',
                    type: 'address',
                },
            ],
            outputs: [],
            gas: 39165,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setStrategyRewards',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
                {
                    name: 'rewards',
                    type: 'tuple',
                    components: [
                        {
                            name: 'wid',
                            type: 'int128',
                        },
                        {
                            name: 'addr',
                            type: 'uint256',
                        },
                    ],
                },
            ],
            outputs: [],
            gas: 83083,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setRewards',
            inputs: [
                {
                    name: 'rewards',
                    type: 'tuple',
                    components: [
                        {
                            name: 'wid',
                            type: 'int128',
                        },
                        {
                            name: 'addr',
                            type: 'uint256',
                        },
                    ],
                },
            ],
            outputs: [],
            gas: 74869,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setLockedProfitDegradation',
            inputs: [
                {
                    name: 'degradation',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 37909,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setDepositLimit',
            inputs: [
                {
                    name: 'limit',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 39185,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setPerformanceFee',
            inputs: [
                {
                    name: 'fee',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 39319,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setManagementFee',
            inputs: [
                {
                    name: 'fee',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 39349,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setGuardian',
            inputs: [
                {
                    name: 'guardian',
                    type: 'address',
                },
            ],
            outputs: [],
            gas: 41893,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setEmergencyShutdown',
            inputs: [
                {
                    name: 'active',
                    type: 'bool',
                },
            ],
            outputs: [],
            gas: 41964,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setWithdrawalQueue',
            inputs: [
                {
                    name: 'queue',
                    type: 'address[20]',
                },
            ],
            outputs: [],
            gas: 1349009,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'setPendingWithdrawalBounty',
            inputs: [
                {
                    name: 'id',
                    type: 'uint256',
                },
                {
                    name: 'bounty',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 41166,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'totalAssets',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 8638,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'deposit',
            inputs: [
                {
                    name: 'sender',
                    type: 'address',
                },
                {
                    name: 'recipient',
                    type: 'tuple',
                    components: [
                        {
                            name: 'wid',
                            type: 'int128',
                        },
                        {
                            name: 'addr',
                            type: 'uint256',
                        },
                    ],
                },
                {
                    name: '_amount',
                    type: 'uint256',
                },
                {
                    name: 'pendingWithdrawalId',
                    type: 'tuple',
                    components: [
                        {
                            name: 'recipient',
                            type: 'address',
                        },
                        {
                            name: 'id',
                            type: 'uint256',
                        },
                    ],
                },
                {
                    name: 'sendTransferToTon',
                    type: 'bool',
                },
            ],
            outputs: [],
            gas: 304743,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'saveWithdraw',
            inputs: [
                {
                    name: 'payloadId',
                    type: 'bytes32',
                },
                {
                    name: 'recipient',
                    type: 'address',
                },
                {
                    name: '_amount',
                    type: 'uint256',
                },
                {
                    name: 'bounty',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 346478,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'cancelPendingWithdrawal',
            inputs: [
                {
                    name: 'id',
                    type: 'uint256',
                },
                {
                    name: 'amount',
                    type: 'uint256',
                },
                {
                    name: 'recipient',
                    type: 'tuple',
                    components: [
                        {
                            name: 'wid',
                            type: 'int128',
                        },
                        {
                            name: 'addr',
                            type: 'uint256',
                        },
                    ],
                },
            ],
            outputs: [],
            gas: 151644,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'withdraw',
            inputs: [
                {
                    name: 'id',
                    type: 'uint256',
                },
                {
                    name: '_value',
                    type: 'uint256',
                },
            ],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'withdraw',
            inputs: [
                {
                    name: 'id',
                    type: 'uint256',
                },
                {
                    name: '_value',
                    type: 'uint256',
                },
                {
                    name: 'recipient',
                    type: 'address',
                },
            ],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'withdraw',
            inputs: [
                {
                    name: 'id',
                    type: 'uint256',
                },
                {
                    name: '_value',
                    type: 'uint256',
                },
                {
                    name: 'recipient',
                    type: 'address',
                },
                {
                    name: 'maxLoss',
                    type: 'uint256',
                },
            ],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'addStrategy',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
                {
                    name: 'debtRatio',
                    type: 'uint256',
                },
                {
                    name: 'minDebtPerHarvest',
                    type: 'uint256',
                },
                {
                    name: 'maxDebtPerHarvest',
                    type: 'uint256',
                },
                {
                    name: 'performanceFee',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 1638459,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'updateStrategyDebtRatio',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
                {
                    name: 'debtRatio',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 121715,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'updateStrategyMinDebtPerHarvest',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
                {
                    name: 'minDebtPerHarvest',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 47581,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'updateStrategyMaxDebtPerHarvest',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
                {
                    name: 'maxDebtPerHarvest',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 47611,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'updateStrategyPerformanceFee',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
                {
                    name: 'performanceFee',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 42824,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'migrateStrategy',
            inputs: [
                {
                    name: 'oldVersion',
                    type: 'address',
                },
                {
                    name: 'newVersion',
                    type: 'address',
                },
            ],
            outputs: [],
            gas: 1324307,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'revokeStrategy',
            inputs: [],
            outputs: [],
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'revokeStrategy',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
            ],
            outputs: [],
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'addStrategyToQueue',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
            ],
            outputs: [],
            gas: 1255584,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'removeStrategyFromQueue',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
            ],
            outputs: [],
            gas: 23636043,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'debtOutstanding',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'debtOutstanding',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
            ],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'creditAvailable',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'creditAvailable',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
            ],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'availableDepositLimit',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 21291,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'expectedReturn',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'expectedReturn',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
            ],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'report',
            inputs: [
                {
                    name: 'gain',
                    type: 'uint256',
                },
                {
                    name: 'loss',
                    type: 'uint256',
                },
                {
                    name: '_debtPayment',
                    type: 'uint256',
                },
            ],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 810204,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'sweep',
            inputs: [
                {
                    name: 'token',
                    type: 'address',
                },
            ],
            outputs: [],
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'sweep',
            inputs: [
                {
                    name: 'token',
                    type: 'address',
                },
                {
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            outputs: [],
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'emergencyWithdrawAndRevoke',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
            ],
            outputs: [],
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'emergencyWithdrawAndRevoke',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
                {
                    name: '_amountNeeded',
                    type: 'uint256',
                },
            ],
            outputs: [],
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'forceWithdraw',
            inputs: [
                {
                    name: 'recipient',
                    type: 'address',
                },
                {
                    name: 'id',
                    type: 'uint256',
                },
            ],
            outputs: [],
            gas: 103515,
        },
        {
            stateMutability: 'nonpayable',
            type: 'function',
            name: 'skim',
            inputs: [
                {
                    name: 'strategy',
                    type: 'address',
                },
            ],
            outputs: [],
            gas: 96522,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'token',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'address',
                },
            ],
            gas: 3678,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'governance',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'address',
                },
            ],
            gas: 3708,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'management',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'address',
                },
            ],
            gas: 3738,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'guardian',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'address',
                },
            ],
            gas: 3768,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'pendingWithdrawalsPerUser',
            inputs: [
                {
                    name: 'arg0',
                    type: 'address',
                },
            ],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 4013,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'pendingWithdrawals',
            inputs: [
                {
                    name: 'arg0',
                    type: 'address',
                },
                {
                    name: 'arg1',
                    type: 'uint256',
                },
            ],
            outputs: [
                {
                    name: 'amount',
                    type: 'uint256',
                },
                {
                    name: 'bounty',
                    type: 'uint256',
                },
                {
                    name: 'open',
                    type: 'bool',
                },
            ],
            gas: 8974,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'pendingWithdrawalsTotal',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 3858,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'withdrawIds',
            inputs: [
                {
                    name: 'arg0',
                    type: 'bytes32',
                },
            ],
            outputs: [
                {
                    name: '',
                    type: 'bool',
                },
            ],
            gas: 4003,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'wrapper',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'address',
                },
            ],
            gas: 3918,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'bridge',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'address',
                },
            ],
            gas: 3948,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'configuration',
            inputs: [],
            outputs: [
                {
                    name: 'wid',
                    type: 'int128',
                },
                {
                    name: 'addr',
                    type: 'uint256',
                },
            ],
            gas: 6512,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'rewards',
            inputs: [],
            outputs: [
                {
                    name: 'wid',
                    type: 'int128',
                },
                {
                    name: 'addr',
                    type: 'uint256',
                },
            ],
            gas: 6542,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'depositFee',
            inputs: [],
            outputs: [
                {
                    name: 'step',
                    type: 'uint256',
                },
                {
                    name: 'size',
                    type: 'uint256',
                },
            ],
            gas: 6572,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'withdrawFee',
            inputs: [],
            outputs: [
                {
                    name: 'step',
                    type: 'uint256',
                },
                {
                    name: 'size',
                    type: 'uint256',
                },
            ],
            gas: 6602,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'strategies',
            inputs: [
                {
                    name: 'arg0',
                    type: 'address',
                },
            ],
            outputs: [
                {
                    name: 'performanceFee',
                    type: 'uint256',
                },
                {
                    name: 'activation',
                    type: 'uint256',
                },
                {
                    name: 'debtRatio',
                    type: 'uint256',
                },
                {
                    name: 'minDebtPerHarvest',
                    type: 'uint256',
                },
                {
                    name: 'maxDebtPerHarvest',
                    type: 'uint256',
                },
                {
                    name: 'lastReport',
                    type: 'uint256',
                },
                {
                    name: 'totalDebt',
                    type: 'uint256',
                },
                {
                    name: 'totalGain',
                    type: 'uint256',
                },
                {
                    name: 'totalSkim',
                    type: 'uint256',
                },
                {
                    name: 'totalLoss',
                    type: 'uint256',
                },
                {
                    name: 'rewardsManager',
                    type: 'address',
                },
                {
                    name: 'rewards',
                    type: 'tuple',
                    components: [
                        {
                            name: 'wid',
                            type: 'int128',
                        },
                        {
                            name: 'addr',
                            type: 'uint256',
                        },
                    ],
                },
            ],
            gas: 32160,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'withdrawalQueue',
            inputs: [
                {
                    name: 'arg0',
                    type: 'uint256',
                },
            ],
            outputs: [
                {
                    name: '',
                    type: 'address',
                },
            ],
            gas: 4237,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'emergencyShutdown',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'bool',
                },
            ],
            gas: 4158,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'depositLimit',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 4188,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'debtRatio',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 4218,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'totalDebt',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 4248,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'lastReport',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 4278,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'activation',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 4308,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'lockedProfit',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 4338,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'lockedProfitDegradation',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 4368,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'managementFee',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 4398,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'performanceFee',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 4428,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'tokenDecimals',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 4458,
        },
        {
            stateMutability: 'view',
            type: 'function',
            name: 'targetDecimals',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                },
            ],
            gas: 4488,
        },
    ]

    static VaultWrapper: AbiItem[] = [
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint128',
                    name: 'amount',
                    type: 'uint128',
                },
                {
                    indexed: false,
                    internalType: 'int8',
                    name: 'wid',
                    type: 'int8',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'user',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'creditor',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'recipient',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint128',
                    name: 'tokenAmount',
                    type: 'uint128',
                },
                {
                    indexed: false,
                    internalType: 'uint128',
                    name: 'tonAmount',
                    type: 'uint128',
                },
                {
                    indexed: false,
                    internalType: 'uint8',
                    name: 'swapType',
                    type: 'uint8',
                },
                {
                    indexed: false,
                    internalType: 'uint128',
                    name: 'slippageNumerator',
                    type: 'uint128',
                },
                {
                    indexed: false,
                    internalType: 'uint128',
                    name: 'slippageDenominator',
                    type: 'uint128',
                },
                {
                    indexed: false,
                    internalType: 'bytes1',
                    name: 'separator',
                    type: 'bytes1',
                },
                {
                    indexed: false,
                    internalType: 'bytes',
                    name: 'level3',
                    type: 'bytes',
                },
            ],
            name: 'FactoryDeposit',
            type: 'event',
        },
        {
            inputs: [],
            name: 'apiVersion',
            outputs: [
                {
                    internalType: 'string',
                    name: 'api_version',
                    type: 'string',
                },
            ],
            stateMutability: 'pure',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bytes',
                    name: 'payload',
                    type: 'bytes',
                },
            ],
            name: 'decodeWithdrawEventData',
            outputs: [
                {
                    internalType: 'int8',
                    name: 'sender_wid',
                    type: 'int8',
                },
                {
                    internalType: 'uint256',
                    name: 'sender_addr',
                    type: 'uint256',
                },
                {
                    internalType: 'uint128',
                    name: 'amount',
                    type: 'uint128',
                },
                {
                    internalType: 'uint160',
                    name: '_recipient',
                    type: 'uint160',
                },
                {
                    internalType: 'uint32',
                    name: 'chainId',
                    type: 'uint32',
                },
            ],
            stateMutability: 'pure',
            type: 'function',
        },
        {
            inputs: [
                {
                    components: [
                        {
                            internalType: 'int128',
                            name: 'wid',
                            type: 'int128',
                        },
                        {
                            internalType: 'uint256',
                            name: 'addr',
                            type: 'uint256',
                        },
                    ],
                    internalType: 'struct IVault.TONAddress',
                    name: 'recipient',
                    type: 'tuple',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'deposit',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint128',
                    name: 'amount',
                    type: 'uint128',
                },
                {
                    internalType: 'int8',
                    name: 'wid',
                    type: 'int8',
                },
                {
                    internalType: 'uint256',
                    name: 'user',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'creditor',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'recipient',
                    type: 'uint256',
                },
                {
                    internalType: 'uint128',
                    name: 'tokenAmount',
                    type: 'uint128',
                },
                {
                    internalType: 'uint128',
                    name: 'tonAmount',
                    type: 'uint128',
                },
                {
                    internalType: 'uint8',
                    name: 'swapType',
                    type: 'uint8',
                },
                {
                    internalType: 'uint128',
                    name: 'slippageNumerator',
                    type: 'uint128',
                },
                {
                    internalType: 'uint128',
                    name: 'slippageDenominator',
                    type: 'uint128',
                },
                {
                    internalType: 'bytes',
                    name: 'level3',
                    type: 'bytes',
                },
            ],
            name: 'depositToFactory',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    components: [
                        {
                            internalType: 'int128',
                            name: 'wid',
                            type: 'int128',
                        },
                        {
                            internalType: 'uint256',
                            name: 'addr',
                            type: 'uint256',
                        },
                    ],
                    internalType: 'struct IVault.TONAddress',
                    name: 'recipient',
                    type: 'tuple',
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
                {
                    components: [
                        {
                            internalType: 'address',
                            name: 'recipient',
                            type: 'address',
                        },
                        {
                            internalType: 'uint256',
                            name: 'id',
                            type: 'uint256',
                        },
                    ],
                    internalType: 'struct IVault.PendingWithdrawalId[]',
                    name: 'pendingWithdrawalsIdsToFill',
                    type: 'tuple[]',
                },
            ],
            name: 'depositWithFillings',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    components: [
                        {
                            internalType: 'address',
                            name: 'recipient',
                            type: 'address',
                        },
                        {
                            internalType: 'uint256',
                            name: 'id',
                            type: 'uint256',
                        },
                    ],
                    internalType: 'struct IVault.PendingWithdrawalId[]',
                    name: 'pendingWithdrawalsIdsToWithdraw',
                    type: 'tuple[]',
                },
            ],
            name: 'forceWithdraw',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'getChainID',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_vault',
                    type: 'address',
                },
            ],
            name: 'initialize',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bytes',
                    name: 'payload',
                    type: 'bytes',
                },
                {
                    internalType: 'bytes[]',
                    name: 'signatures',
                    type: 'bytes[]',
                },
                {
                    internalType: 'uint256',
                    name: 'bounty',
                    type: 'uint256',
                },
            ],
            name: 'saveWithdraw',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'vault',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
    ]

    static StakingRelayVerifier: AbiItem[] = [
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint160',
                    name: 'eth_addr',
                    type: 'uint160',
                },
                {
                    indexed: false,
                    internalType: 'int8',
                    name: 'workchain_id',
                    type: 'int8',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'addr_body',
                    type: 'uint256',
                },
            ],
            name: 'RelayAddressVerified',
            type: 'event',
        },
        {
            inputs: [
                {
                    internalType: 'int8',
                    name: 'workchain_id',
                    type: 'int8',
                },
                {
                    internalType: 'uint256',
                    name: 'address_body',
                    type: 'uint256',
                },
            ],
            name: 'verify_relay_staker_address',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
    ];

}
