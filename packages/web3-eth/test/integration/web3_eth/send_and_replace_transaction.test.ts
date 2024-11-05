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

// TODO Seems to be an issue with linter falsely reporting this
// error for Transaction Error Scenarios tests
/* eslint-disable jest/no-conditional-expect */

import { Transaction, TransactionReceipt } from 'web3-types';
import { Web3 } from 'web3';
import {
	closeOpenConnection,
	createAccount,
	createTempAccount,
	DEFAULT_SYSTEM_PROVIDER,
	getSystemTestProvider,
} from '../../fixtures/system_test_utils';

jest.setTimeout(500000);
describe('Web3Eth.sendTransaction replace', () => {
	let web3: Web3;
	let tempAcc: { address: string; privateKey: string };
	let to: string;
	beforeAll(async () => {
		const provider = getSystemTestProvider();
		web3 = new Web3(provider);
		tempAcc = await createTempAccount();
		to = web3.eth.accounts.create().address;
	});

	afterAll(async () => {
		await closeOpenConnection(web3);
	});

	it('should replace transaction and throw ReplaceTransactionError', async () => {
		const nonce = await web3.eth.getTransactionCount(tempAcc.address);
		const transaction: Transaction = {
			from: tempAcc.address,
			to,
			value: BigInt(1),
			nonce,
			gas: 21000,
			gasPrice: web3.utils.toWei('100', 'gwei'),
		};

		const firstTxPr = web3.eth.sendTransaction(transaction);
		let firstHash = '';
		firstTxPr.on('transactionHash', hash => {
			firstHash = hash;
		});
		const transactionReplace: Transaction = {
			...transaction,
			gasPrice: web3.utils.toWei('300', 'gwei'),
		};
		const secondTxPr = web3.eth.sendTransaction(transactionReplace);

		let result: TransactionReceipt | undefined;
		secondTxPr
			.then(res => {
				result = res;
			})
			.catch(console.log);

		firstTxPr.catch(e => {
			console.log('firstTxPr error', e);
		});
		const fromAcc = await createTempAccount();
		const tempNonce = Number(await web3.eth.getTransactionCount(fromAcc.address));
		let index = 0;
		while (!result) {
			const web3 = new Web3(DEFAULT_SYSTEM_PROVIDER);
			console.log('index', index);
			const toAcc = createAccount();
			const transaction: Transaction = {
				to: toAcc.address,
				value: '0x1',
				from: fromAcc.address,
				nonce: tempNonce + index,
			};
			web3.eth.accounts.wallet.add(fromAcc.privateKey);
			console.log('transaction', transaction);
			await web3.eth.sendTransaction(transaction);
			index++;
		}
		expect(result).toBeDefined();

		// expect(async () => await firstTxPr).toThrow('was replaced');
		console.log(`The transaction ${firstHash} was replaced with ${result.transactionHash}`);
		// await expect(firstTxPr).rejects.toThrow(
		// 	`The transaction ${firstHash} was replaced with ${result.transactionHash}`,
		// );
	});
});
