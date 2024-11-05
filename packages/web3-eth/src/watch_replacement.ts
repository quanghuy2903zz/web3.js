/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/

// Disabling because returnTypes must be last param to match 1.x params
/* eslint-disable default-param-last */

import {
	Address,
	Numbers,
	Transaction,
	TransactionHash,
	BlockHeaderOutput,
	TransactionInfo,
	EthExecutionAPI,
} from 'web3-types';
import { toHex } from 'web3-utils';
import { ethRpcMethods } from 'web3-rpc-methods';
import { Web3PromiEvent, Web3Context } from 'web3-core';
import { NewHeadsSubscription } from './web3_subscriptions.js';

/**
 *
 * The Web3Eth allows you to interact with an Ethereum blockchain.
 *
 * For using Web3 Eth functions, first install Web3 package using `npm i web3` or `yarn add web3` based on your package manager usage.
 * After that, Web3 Eth functions will be available as mentioned in following snippet.
 * ```ts
 * import { Web3 } from 'web3';
 * const web3 = new Web3('https://mainnet.infura.io/v3/<YOURPROJID>');
 *
 * const block = await web3.eth.getBlock(0);
 *
 * ```
 *
 * For using individual package install `web3-eth` package using `npm i web3-eth` or `yarn add web3-eth` and only import required functions.
 * This is more efficient approach for building lightweight applications.
 * ```ts
 * import { Web3Eth } from 'web3-eth';
 *
 * const eth = new Web3Eth('https://mainnet.infura.io/v3/<YOURPROJID>');
 * const block = await eth.getBlock(0);
 *
 * ```
 */
export class WatchReplacement {
	private readonly web3Context: Web3Context<EthExecutionAPI>;
	private headSubscription: NewHeadsSubscription | undefined;
	private headSubscriptionTimeout: NodeJS.Timeout | undefined;
	private replacementSupscriptions: {
		[key: string]: { nonce: Numbers; from: Address };
	};
	public constructor(web3Context: Web3Context<EthExecutionAPI>) {
		this.web3Context = web3Context;
		this.headSubscription = undefined;
		this.replacementSupscriptions = {};
	}

	async getSubscription(): Promise<NewHeadsSubscription> {
		if (!this.headSubscription) {
			try {
				this.headSubscription = await this.web3Context.subscriptionManager.subscribe(
					'newHeads',
				);
			} catch (e) {
				// this.headSubscription = pollNewBlocks(
				//     this,
				//     10,
				// ) as unknown as NewHeadsSubscription;
			}
		}
		return this.headSubscription!;
	}
	async offSubscription() {
		if (!this.headSubscription) {
			return;
		}
		if (this.headSubscriptionTimeout) {
			clearTimeout(this.headSubscriptionTimeout);
		}

		this.headSubscriptionTimeout = setTimeout(async () => {
			this.headSubscription?.unsubscribe();
		}, 1000);
	}
	public async watch(
		promiEvent: Web3PromiEvent<any, any>,
		tx: Transaction,
		transactionHash: TransactionHash,
	) {
		if (!this.headSubscription) {
			return;
		}
		if (!tx.nonce && tx.from) {
			tx.nonce = await ethRpcMethods.getTransactionCount(
				this.web3Context.requestManager,
				tx.from,
				'latest',
			);
		}
		this.replacementSupscriptions[transactionHash] = { from: tx.from!, nonce: tx.nonce! };

		(await this.getSubscription()).on('data', async (blockHeader: BlockHeaderOutput) => {
			if (blockHeader.number) {
				const block = await ethRpcMethods.getBlockByNumber(
					this.web3Context.requestManager,
					toHex(blockHeader.number),
					true,
				);
				const txes = Object.keys(this.replacementSupscriptions);
				for (const blockTx of block.transactions as TransactionInfo[]) {
					for (const transactionHash of txes) {
						const txData = this.replacementSupscriptions[transactionHash];
						console.log(
							`${blockTx.from} === ${txData.from} && ${blockTx.nonce} === ${txData.nonce}`,
						);
						if (blockTx.from === txData.from && blockTx.nonce === txData.nonce) {
							if (blockTx.hash !== transactionHash) {
								promiEvent.emit('replaced', {
									hash: transactionHash,
									replacedHash: String(blockTx.hash),
								});
							}
							await this.stop(transactionHash);
						}
					}
					console.log(
						`${blockTx.from} === ${tx.from} && ${blockTx.nonce} === ${tx.nonce}`,
					);
					if (blockTx.from === tx.from && blockTx.nonce === tx.nonce) {
						if (blockTx.hash !== transactionHash) {
							promiEvent.emit('replaced', {
								hash: transactionHash,
								replacedHash: String(blockTx.hash),
							});
						}
						await this.stop(transactionHash);
					}
				}
			}
		});
	}
	public async stop(transactionHash: string): Promise<void> {
		console.log('stopWatchingForReplacement', transactionHash);
		delete this.replacementSupscriptions[transactionHash];
		if (Object.keys(this.replacementSupscriptions).length === 0) {
			await this.offSubscription();
		}
	}
}
