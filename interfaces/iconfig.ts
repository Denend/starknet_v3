import { network } from "../src/orbiter/bridgeData"

export interface Iconfig {
    stableSwap: boolean,
    jediSwap: boolean,
    jediSwap_liq: boolean,
    l0kswap: boolean,
    mySwap: boolean,
    dmail: boolean,
    stable_amount_to_swap: number[], 
    slippage: number,
    minGasPrice: number,
    Dmail_mails_count: number[],
    // batch_create_number: number,
    // starkgate: boolean,
    starkgate_amount: string,
    // starkgate_show_fee: boolean,
    upgrade: boolean,
    stableSwap_full_balance: boolean,
    jediSwap_liq_amount: number[],
    sleep_protocols: number[],
    sleep_account: number[],
    protocols: number[],
    refuel_threshold: string,
    orbiter_to_evm: boolean,
    orbiter_amount: string,
    orbiter_to_network: network,
    orbiter_to_evm_address?: string,
    okx_apiKey: string,
    okx_passPhrase: string,
    okx_secretKey: string,
    okx_amount: string,
    okx_sleep_min: number,
    okx_sleep_max: number,
}