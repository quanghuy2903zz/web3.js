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

import { EthExecutionAPI, Web3APISpec } from 'web3-types';
import { HttpProviderOptions } from 'web3-providers-http';
import { Network, SocketOptions, Transport } from './types.js';
import { Web3ExternalProvider } from './web3_provider.js';

const isValid = (str: string) => str !== undefined && str.trim().length > 0;

export class InfuraProvider<
	API extends Web3APISpec = EthExecutionAPI,
> extends Web3ExternalProvider<API> {
	// eslint-disable-next-line default-param-last
	public constructor(
		network: Network = Network.ETH_MAINNET,
		transport: Transport = Transport.HTTPS,
		token = '',
		host = '',
		providerConfigOptions?: HttpProviderOptions | SocketOptions,
	) {
		super(network, transport, token, host, providerConfigOptions);
	}
	public static readonly networkHostMap: { [key: string]: string } = {
		[Network.PALM_MAINNET]: 'palm-mainnet',
		[Network.PALM_TESTNET]: 'palm-testnet',
		[Network.BLAST_MAINNET]: 'blast-mainnet',
		[Network.BLAST_SEPOLIA]: 'blast-sepolia',
		[Network.AVALANCHE_MAINNET]: 'avalanche-mainnet',
		[Network.AVALANCHE_FUJI]: 'avalanche-fuji',
		[Network.STARKNET_MAINNET]: 'starknet-mainnet',
		[Network.STARKNET_SEPOLIA]: 'starknet-sepolia',
		[Network.ZKSYNC_MAINNET]: 'zksync-mainnet',
		[Network.ZKSYNC_SEPOLIA]: 'zksync-sepolia',
		[Network.CELO_MAINNET]: 'celo-mainnet',
		[Network.CELO_ALFAJORES]: 'celo-alfajores',
		[Network.BSC_MAINNET]: 'bsc-mainnet',
		[Network.BSC_TESTNET]: 'bsc-testnet',
		[Network.MANTLE_MAINNET]: 'mantle-mainnet',
		[Network.MANTLE_SEPOLIA]: 'mantle-sepolia',
		[Network.ETH_MAINNET]: 'mainnet',
		[Network.ETH_HOLESKY]: 'holesky',
		[Network.ETH_SEPOLIA]: 'sepolia',
		[Network.ARBITRUM_MAINNET]: 'arbitrum-mainnet',
		[Network.ARBITRUM_SEPOLIA]: 'arbitrum-sepolia',
		[Network.BASE_MAINNET]: 'base-mainnet',
		[Network.BASE_SEPOLIA]: 'base-sepolia',
		[Network.BNB_MAINNET]: 'opbnb-mainnet',
		[Network.BNB_TESTNET]: 'opbnb-testnet',
		[Network.LINEA_MAINNET]: 'linea-mainnet',
		[Network.LINEA_SEPOLIA]: 'linea-sepolia',
		[Network.POLYGON_MAINNET]: 'polygon-mainnet',
		[Network.POLYGON_AMOY]: 'polygon-amoy',
		[Network.OPTIMISM_MAINNET]: 'optimism-mainnet',
		[Network.OPTIMISM_SEPOLIA]: 'optimism-sepolia',
	};
	// eslint-disable-next-line class-methods-use-this
	public getRPCURL(network: Network, transport: Transport, token: string, _host: string) {
		if (!InfuraProvider.networkHostMap[network]) {
			throw new Error('Network info not avalible.');
		}
		const defaultHost = `${InfuraProvider.networkHostMap[network]}.infura.io`;
		const host = isValid(_host) ? _host : defaultHost;

		return `${transport}://${host}/${
			transport === Transport.WebSocket ? 'ws/' : ''
		}v3/${token}`;
	}
}
