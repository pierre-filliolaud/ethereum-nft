// Based on https://github.com/OpenZeppelin/openzeppelin-solidity/blob/v2.5.1/test/examples/SimpleToken.test.js

// const { expect } = require('chai');
require('chai')
  .use(require('chai-as-promised'))
  .should()

// Import utilities from Test Helpers
const { BN, expectEvent, expectRevert, constants } = require('@openzeppelin/test-helpers');

const Bird = artifacts.require('./Bird.sol')

contract('Bird', (accounts) => {

  before(async () => {
    this.contract = await Bird.deployed()
  });

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await this.contract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await this.contract.name()
      assert.equal(name, 'Bird')
    })

    it('has a symbol', async () => {
      const symbol = await this.contract.symbol()
      assert.equal(symbol, 'BIRD')
    })
  })

  describe('minting', async () => {
    it('creates a new token', async () => {
      const result = await this.contract.mint("#EC058E")
      const totalSupply = await this.contract.totalSupply()
      // console.log(totalSupply)
      // // SUCCESS
      assert.equal(totalSupply, 1)
      // expect(totalSupply).to.be.bignumber.equal(new BN(1));
      const event = result.logs[0].args
      // assert.equal(event.tokenId.toNumber(), 0, 'id is correct')
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
      assert.equal(event.to, accounts[0], 'to is correct')

      // FAILURE: cannot mint same bird twice
      await expectRevert.unspecified(this.contract.mint('#EC058E'));
    })
  })

  describe('indexing', async () => {
    it('lists birds', async () => {
      // Mint 3 more tokens
      await this.contract.mint('#5386E4')
      await this.contract.mint('#FFFFFF')
      await this.contract.mint('#000000')
      const totalSupply = await this.contract.totalSupply()

      let bird
      let result = []

      for (var i = 1; i <= totalSupply; i++) {
        bird = await this.contract.birds(i - 1)
        result.push(bird)
      }

      let expected = ['#EC058E', '#5386E4', '#FFFFFF', '#000000']
      assert.equal(result.join(','), expected.join(','))
    })
  })
})