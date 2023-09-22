import { Contract, uint256 } from "starknet";
import { Protocol } from "../protocol";
import { ABI } from "./ABI";
import { Tokens } from "../tokens/tokens";
import { logger } from "../../logger/logger";
import { checkPayText, getMinBridgeAmount, getPayTextId, getPayTextValue, getWithHoldingFee, network } from "./bridgeData";
import { ethers } from "ethers";


/**
 * Класс для бриджа ИЗ старкнета
 */
export class Orbiter extends Protocol {

    private method = 'transferERC20'

    private async getAvailableEth(toNetwork: network, contractAddress: string, evmAddress: string) {
        
        const minimumAmount = getMinBridgeAmount('starknet')
        const balance = await this.getBalanceOf(this.tokens.ETH)

        if(minimumAmount > balance) {
            throw logger.error(`Недостаточно ETH для бриджа. Минимальное количество для бриджа ${ethers.formatEther(minimumAmount)}`, this.account.address, this.taskName)
        }

        const allowance = await this.getAllowance(this.tokens.ETH, contractAddress)
        if(balance > allowance) {
            await this.approve(this.tokens.ETH, uint256.bnToUint256(balance), contractAddress)
        }

        const contract = new Contract(ABI, contractAddress, this.account)

        const _token = this.tokens.ETH.contractAddress
        const _to = '0x64a24243f2aabae8d2148fa878276e6e6e452e3941b417f3c33b1649ea83e11'
        const _amount = uint256.bnToUint256(minimumAmount)
        const _ext = ethers.getAddress(evmAddress)

        const callData = [
            _token,
            _to,
            _amount,
            _ext,
        ]
        
        const executionFee = await this.estimateFee(contract, this.method, callData)
        const withHoldingFee = getWithHoldingFee(toNetwork)

        const availableEth = balance - executionFee - withHoldingFee
        return availableEth
    }

    async bridge(amount: bigint, toNetwork: network, evmAddress: string) {

        logger.info(`Начали выполнять бридж`, this.account.address, this.taskName)

        const contractAddress = '0x0173f81c529191726c6e7287e24626fe24760ac44dae2a1f7e02080230f8458b'

        if(amount === 0n) {
            logger.info(`Делаем бридж всего эфира`, this.account.address, this.taskName)
            amount = await this.getAvailableEth(toNetwork, contractAddress, evmAddress)
        }

        const withHoldingFee = getWithHoldingFee(toNetwork)
        amount += withHoldingFee

        const balance = await this.getBalanceOf(this.tokens.ETH)

        if(amount > balance) {
            throw logger.error(`Недостаточно ETH для бриджа`, this.account.address, this.taskName)
        }

        const allowance = await this.getAllowance(this.tokens.ETH, contractAddress)

        if(amount > allowance) {
            await this.approve(this.tokens.ETH, uint256.bnToUint256(amount), contractAddress)
        }

        const contract = new Contract(ABI, contractAddress, this.account)

        const payTextId = getPayTextId('arbitrum')
        const payTextValue = getPayTextValue(amount, payTextId)
        
        const _token = this.tokens.ETH.contractAddress
        const _to = '0x64a24243f2aabae8d2148fa878276e6e6e452e3941b417f3c33b1649ea83e11'
        const _amount = uint256.bnToUint256(payTextValue)
        const _ext = ethers.getAddress(evmAddress)

        const callData = [
            _token,
            _to,
            _amount,
            _ext,
        ]

        checkPayText(uint256.uint256ToBN(_amount).toString(), payTextValue)

        const executionFee = await this.estimateFee(contract, this.method, callData)

        if(payTextValue+executionFee > balance) {
            throw logger.error(`Недостаточно ETH для бриджа`, this.account.address, this.taskName)
        }

        try {
            const receipt = await this.sendTransaction(contract, this.method, callData)
            logger.success(`Выполнен бридж в ${toNetwork} ${receipt.transaction_hash}`, this.account.address, this.taskName)
        } catch(e) {
            logger.error(`Не удалось бридж в ${toNetwork} ${e}`, this.account.address, this.taskName)
        }
    }
}