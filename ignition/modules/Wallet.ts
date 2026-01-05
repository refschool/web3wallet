import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const WalletBalanceModule = buildModule("WalletBalanceModule", (m) => {
  // Déploiement du contrat WalletBalance
  const walletBalance = m.contract("WalletBalance");

  // Retourne l'instance du contrat déployé
  return { walletBalance };
});

export default WalletBalanceModule;