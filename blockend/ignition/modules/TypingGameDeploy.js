// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TypingGameWithTokenModule", (m) => {
  // First deploy a test token
  const testToken = m.contract("TestToken");

  // Then deploy the typing game with the test token address
  const typingGame = m.contract("TypingGame", [testToken]);

  return { testToken, typingGame };
});