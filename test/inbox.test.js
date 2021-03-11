const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const provider = ganache.provider()
const web3 = new Web3(provider)
const { interface, bytecode } = require('../compile')
let accounts
let inbox

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts()
  //   .then((fetchedAccounts) => {
  //   console.log(fetchedAccounts)
  // })

  // Deploy contract with an account
  //interface -> ABI (solidity -> js)
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,

      arguments: ['Hi there!'],
    })
    //10 accounts from ganache above
    .send({ from: accounts[0], gas: '1000000' })
})
// inbox.setProvider(provider)
describe('Inbox', () => {
  it('deploys a contract', () => {
    //if truthy pass
    assert.ok(inbox.options.address)
    console.log(inbox.options)
  })

  it('has a default message', async () => {
    //methods -> object that contains all public functions in contract
    //message -> method
    const message = await inbox.methods.message().call()
    assert.strictEqual(message, 'Hi there!')
  })

  it('can change the message', async () => {
    await inbox.methods
      .setMessage('Bye')
      .send({ from: accounts[0], gas: '1000000' })
    const message = await inbox.methods.message().call()
    assert.strictEqual(message, 'Bye')
  })
})