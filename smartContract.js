const Web3 = require("web3");

const Abi = require("./abi.json");

const Abi2 = require("./abi2.json");
const rewardAbi = require("./rewardabi.json");

const erc20 = require("./erc20.json");

let web3;

const provider = new Web3.providers.HttpProvider(
  "https://mainnet.infura.io/v3/287af69fca9142f3b1681a93ce4c3afa"
);
web3 = new Web3(provider);

async function getBalance(address, contract) {
  const Instance = new web3.eth.Contract(Abi, contract);

  const decimals = await Instance.methods.decimals().call();
  const symbol = await Instance.methods.symbol().call();
  const stake = await Instance.methods.balanceOf(address).call();

  const balance = (stake / 10 ** decimals).toFixed(2);

  if(contract==="0xbA4cFE5741b357FA371b506e5db0774aBFeCf8Fc")console.log("balance:", (balance*1.6).toFixed(2), symbol.slice(1));
  else if (balance != 0) console.log("balance:", balance, symbol.slice(1));
}
async function getBalance2(address, contract) {
  const Instance = new web3.eth.Contract(Abi2, contract);

  const decimals = await Instance.methods.decimals().call();
  const symbol = await Instance.methods.symbol().call();
  const stake = await Instance.methods.balanceOf(address).call();

  const poolRewards = await Instance.methods.poolRewards().call();

  const rewardInstance = new web3.eth.Contract(rewardAbi, poolRewards);
  let rewardsInfo = await rewardInstance.methods.claimable(address).call();
  let rewards = rewardsInfo._claimableAmounts;
  let rewardtoken = rewardsInfo._rewardTokens[0];

  const tokeninstance = new web3.eth.Contract(erc20, rewardtoken);
  const rewardSymbol = await tokeninstance.methods.symbol().call();

  const balance = (stake / 10 ** decimals).toFixed(2);

  if (balance != 0) {
    console.log("balance:", balance, symbol.slice(2));
    console.log("rewards:", (rewards / 10 ** 18).toFixed(2), rewardSymbol);
  }
}

let address = "0xdbc13e67f678cc00591920cece4dca6322a79ac7";
let VesperContracts = [
  "0x103cc17C2B1586e5Cd9BaD308690bCd0BBe54D5e",
  "0x4B2e76EbBc9f2923d83F5FBDe695D8733db1a17B",
  "0x0C49066C0808Ee8c673553B7cbd99BCC9ABf113d",
  "0x0a27E910Aee974D05000e05eab8a4b8Ebd93D40C",
  "0xbA4cFE5741b357FA371b506e5db0774aBFeCf8Fc",
  "0xcA0c34A3F35520B9490C1d58b35A19AB64014D80",
  "0xBA680a906d8f624a5F11fba54D3C672f09F26e47",
  "0xfF43C327410F960261057ba1DA787eD78B42c257",
  "0x9b91ab47cefC35dbe4DDCC7983fFA1fB40795663",
];

let orbitContracts = [
  "0xc14900dFB1Aa54e7674e1eCf9ce02b3b35157ba5",
  "0x2B6c40Ef15Db0D78D08A7D1b4E12d57E88a3e324",
  "0x83c608b3997db00B5C6D93746785857Cd22d4495",
  "0xA5Bc6eB0A7E6738e2F2Ac6c92280b32771aC52Ad",
  "0x8BCdd6a8168d658dFA19721eaB7470e43398Db25",
];

for (let i = 0; i < VesperContracts.length; i++)
  getBalance(address, VesperContracts[i]);

for (let i = 0; i < orbitContracts.length; i++)
  getBalance2(address, orbitContracts[i]);
