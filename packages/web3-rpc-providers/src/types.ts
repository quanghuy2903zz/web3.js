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

import { ClientOptions, ClientRequestArgs } from 'web3-providers-ws';
import { ReconnectOptions } from 'web3-utils';

export enum Transport {
	HTTPS = 'https',
	WebSocket = 'wss',
}

export enum Network {
	ETH_MAINNET = 'eth_mainnet',
	ETH_SEPOLIA = 'eth_sepolia',
	ETH_GOERLI = 'eth_goerli',
	ETH_HOLESKY = 'eth_holesky',

	PALM_MAINNET = 'palm_mainnet',
	PALM_TESTNET = 'palm_testnet',

	BLAST_MAINNET = 'blast_mainnet',
	BLAST_SEPOLIA = 'blast_sepolia',

	STARKNET_MAINNET = 'starknet_mainnet',
	STARKNET_SEPOLIA = 'starknet_sepolia',

	ZKSYNC_MAINNET = 'zksync_mainnet',
	ZKSYNC_SEPOLIA = 'zksync_sepolia',

	CELO_MAINNET = 'celo_mainnet',
	CELO_ALFAJORES = 'celo_alfajores',

	AVALANCHE_MAINNET = 'avalanche_mainnet',
	AVALANCHE_FUJI = 'avalanche_fuji',

	POLYGON_MAINNET = 'polygon_mainnet',

	POLYGON_AMOY = 'polygon_amoy',
	AVALANCHE_C_MAINNET = 'avalanche_c_mainnet',
	AVALANCHE_P_MAINNET = 'avalanche_p_mainnet',
	AVALANCHE_X_MAINNET = 'avalanche_x_mainnet',

	ARBITRUM_MAINNET = 'arbitrum_mainnet',
	ARBITRUM_SEPOLIA = 'arbitrum_sepolia',
	ARBITRUM_GOERLI = 'arbitrum_goerli',

	BASE_MAINNET = 'base_mainnet',
	BASE_SEPOLIA = 'base_sepolia',
	BASE_GOERLI = 'base_foerli',

	OPTIMISM_MAINNET = 'optimism_mainnet',
	OPTIMISM_SEPOLIA = 'optimism_sepolia',
	OPTIMISM_GOERLI = 'optimism_goerli',

	FANTOM_MAINNET = 'fantom_mainnet',
	FANTOM_TESTNET = 'fantom_testnet',

	DYMENSION_MAINNET = 'dymension_mainnet',
	DYMENSION_TESTNET = 'dymension_testnet',

	BNB_MAINNET = 'bnb_mainnet',
	BNB_TESTNET = 'bnb_testnet',

	BSC_MAINNET = 'bsc_mainnet',
	BSC_TESTNET = 'bsc_testnet',

	MANTLE_SEPOLIA = 'mantle_sepolia',

	LINEA_MAINNET = 'linea_mainnet',
	LINEA_SEPOLIA = 'linea_sepolia',
	LINEA_GOERLI = 'linea_goerli',
	ARBITRUM_ONE = 'arbitrum_one',
	ARBITRUM_NOVA = 'arbitrum_nova',
	AVALANCHE_FUJI_C = 'avalanche_fuji_c',
	AVALANCHE_FUJI_P = 'avalanche_fuji_p',
	AVALANCHE_FUJI_X = 'avalanche_fuji_x',
	OPBNB_MAINNET = 'opbnb_mainnet',
	OPBNB_TESTNET = 'opbnb_testnet',
	GNOSIS_MAINNET = 'gnosis_mainnet',
	GNOSIS_CHIADO = 'gnosis_chiado',
	PULSECHAIN_MAINNET = 'pulsechain_mainnet',
	PULSECHAIN_TESTNET = 'pulsechain_testnet',
	KAVA_MAINNET = 'kava_mainnet',
	CRONOS_MAINNET = 'cronos_mainnet',
	MANTLE_MAINNET = 'mantle_mainnet',
	CHILIZ_MAINNET = 'chiliz_mainnet',
	CHILIZ_SPICY = 'chiliz_spicy',
	MOONBEAM_MAINNET = 'moonbeam_mainnet',
	TAIKO_MAINNET = 'taiko_mainnet',
	TAIKO_HEKLA = 'taiko_hekla',
	BAHAMUT_MAINNET = 'bahamut_mainnet',
	SCROLL_MAINNET = 'scroll_mainnet',
	SCROLL_SEPOLIA = 'scroll_sepolia',
	TRON_MAINNET = 'tron_mainnet',
	SYSCOIN_MAINNET = 'syscoin_mainnet',
	SYSCOIN_TANENBAUM = 'syscoin_tanenbaum',
	MOONRIVER_MAINNET = 'moonriver_mainnet',
	HAQQ_MAINNET = 'haqq_mainnet',
	EVMOS_MAINNET = 'evmos_mainnet',
	EVMOS_TESTNET = 'evmos_testnet',
	BERACHAIN_TESTNET = 'berachain_testnet',
}

// Combining the ws types
export type SocketOptions = {
	socketOptions?: ClientOptions | ClientRequestArgs;
	reconnectOptions?: Partial<ReconnectOptions>;
};
