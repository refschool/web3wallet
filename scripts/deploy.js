const hre = require("hardhat");

async function main() {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🚀 Déploiement du contrat WalletBalance...");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");

    // Récupérer le compte qui déploie
    const [deployer] = await hre.ethers.getSigners();
    console.log("📍 Déploiement avec le compte:", deployer.address);

    // Récupérer le solde du déployeur
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Solde du compte:", hre.ethers.formatEther(balance), "ETH");
    console.log("");

    // Récupérer le contrat
    console.log("📦 Compilation du contrat...");
    const WalletBalance = await hre.ethers.getContractFactory("WalletBalance");

    // Déployer
    console.log("⏳ Déploiement en cours...");
    const walletBalance = await WalletBalance.deploy();
    await walletBalance.waitForDeployment();

    // Récupérer l'adresse du contrat déployé
    const contractAddress = await walletBalance.getAddress();

    console.log("");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Contrat déployé avec succès!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");
    console.log("📋 Adresse du contrat:", contractAddress);
    console.log("");
    console.log("🔗 Informations réseau:");
    const network = await hre.ethers.provider.getNetwork();
    console.log("   - Nom:", network.name);
    console.log("   - Chain ID:", network.chainId.toString());
    console.log("");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎯 PROCHAINES ÉTAPES:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");
    console.log("1. Copiez l'adresse du contrat ci-dessus");
    console.log("2. Ouvrez frontend/index.html dans votre navigateur");
    console.log("3. Collez l'adresse dans le champ prévu");
    console.log("4. Connectez MetaMask");
    console.log("5. Vérifiez votre solde!");
    console.log("");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Tester que le contrat fonctionne
    console.log("");
    console.log("🧪 Test rapide du contrat...");
    const myBalance = await walletBalance.getMyBalance();
    console.log("✅ getMyBalance() fonctionne! Solde:", hre.ethers.formatEther(myBalance), "ETH");
    console.log("");
}

// Gestion des erreurs
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("");
        console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.error("❌ ERREUR DE DÉPLOIEMENT");
        console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.error("");
        console.error(error);
        console.error("");
        process.exit(1);
    });