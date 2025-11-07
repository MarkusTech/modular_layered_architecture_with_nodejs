import * as xrpl from "xrpl";

async function main() {
  // Generate a random wallet
  const wallet = xrpl.Wallet.generate();

  console.log("Wallet address:", wallet.address);
  console.log("Wallet seed:", wallet.seed);
}

main();
