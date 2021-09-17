import Web3 from 'web3'

export class UserData {

    constructor(
        public account?: string,
        public balance?: string,
        public provider?: any,
        public web3?: Web3,
    ) {}

}
