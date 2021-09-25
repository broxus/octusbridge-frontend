import Web3 from 'web3'

export class UserData {

    constructor(
        public address?: string,
        public balance?: string,
        public provider?: any,
        public web3?: Web3,
    ) {}

}
