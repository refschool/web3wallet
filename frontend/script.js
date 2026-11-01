// ABI du contrat
const contractABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "wallet",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "BalanceChecked",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_address",
                "type": "address"
            }
        ],
        "name": "checkAndLogBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_address",
                "type": "address"
            }
        ],
        "name": "getBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "_addresses",
                "type": "address[]"
            }
        ],
        "name": "getMultipleBalances",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getMyBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_weiAmount",
                "type": "uint256"
            }
        ],
        "name": "weiToEther",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    }
];

let provider;
let signer;
let contract;
let userAccount;

// Éléments du DOM
const connectBtn = document.getElementById('connectBtn');
const refreshBtn = document.getElementById('refreshBtn');
const statusBar = document.getElementById('statusBar');
const walletInfo = document.getElementById('walletInfo');
const errorDiv = document.getElementById('error');
const instructions = document.getElementById('instructions');
const contractAddressInput = document.getElementById('contractAddress');
const sendForm = document.getElementById('sendForm');
const sendBtn = document.getElementById('sendBtn');
const sendStatus = document.getElementById('sendStatus');

// Vérifier si MetaMask est installé
function isMetaMaskInstalled() {
    return typeof window.ethereum !== 'undefined';
}

// Afficher une erreur
function showError(message) {
    errorDiv.textContent = '❌ ' + message;
    errorDiv.classList.remove('hidden');
    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 5000);
}

// Mettre à jour le statut
function updateStatus(connected) {
    if (connected) {
        statusBar.textContent = '🟢 MetaMask connecté';
        statusBar.className = 'status connected';
        instructions.classList.add('hidden');
    } else {
        statusBar.textContent = '🔴 MetaMask non connecté';
        statusBar.className = 'status disconnected';
    }
}

// Obtenir le nom du réseau
async function getNetworkName(chainId) {
    const networks = {
        1: 'Mainnet',
        5: 'Goerli',
        11155111: 'Sepolia',
        137: 'Polygon',
        80001: 'Mumbai',
        31337: 'Localhost'
    };
    return networks[chainId] || `Chain ID: ${chainId}`;
}

// Formater l'adresse
function formatAddress(address) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Récupérer et afficher le solde
async function updateBalance() {
    try {
        refreshBtn.innerHTML = '<span class="loader"></span>Chargement...';
        refreshBtn.disabled = true;

        // Récupérer le solde via le smart contract
        const balanceWei = await contract.getMyBalance();

        // Convertir en ETH
        const balanceEth = ethers.formatEther(balanceWei);

        // Afficher le solde
        document.getElementById('balance').textContent = `${parseFloat(balanceEth).toFixed(4)} ETH`;

        refreshBtn.innerHTML = '🔄 Rafraîchir le solde';
        refreshBtn.disabled = false;
    } catch (error) {
        console.error('Erreur lors de la récupération du solde:', error);
        showError('Impossible de récupérer le solde: ' + error.message);
        refreshBtn.innerHTML = '🔄 Rafraîchir le solde';
        refreshBtn.disabled = false;
    }
}

// Connecter MetaMask
async function connectWallet() {
    if (!isMetaMaskInstalled()) {
        showError('MetaMask n\'est pas installé. Veuillez l\'installer depuis metamask.io');
        return;
    }

    const contractAddress = contractAddressInput.value.trim();
    if (!contractAddress || !ethers.isAddress(contractAddress)) {
        showError('Veuillez entrer une adresse de contrat valide');
        return;
    }

    try {
        connectBtn.innerHTML = '<span class="loader"></span>Connexion...';
        connectBtn.disabled = true;

        // Initialiser le provider avec Ethers.js v6
        provider = new ethers.BrowserProvider(window.ethereum);

        // Demander la connexion
        await provider.send("eth_requestAccounts", []);

        // Récupérer le signer
        signer = await provider.getSigner();
        userAccount = await signer.getAddress();

        // Récupérer le réseau
        const network = await provider.getNetwork();
        const chainId = Number(network.chainId);
        const networkName = await getNetworkName(chainId);

        // Initialiser le contrat
        contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Mettre à jour l'interface
        updateStatus(true);
        document.getElementById('walletAddress').textContent = formatAddress(userAccount);
        document.getElementById('networkName').textContent = networkName;

        walletInfo.classList.remove('hidden');
        refreshBtn.classList.remove('hidden');
        sendForm.classList.remove('hidden');
        connectBtn.classList.add('hidden');
        contractAddressInput.disabled = true;

        // Récupérer le solde initial
        await updateBalance();

    } catch (error) {
        console.error('Erreur de connexion:', error);
        showError('Erreur de connexion: ' + error.message);
        connectBtn.innerHTML = 'Connecter MetaMask';
        connectBtn.disabled = false;
    }
}

// Convertir le montant saisi en Wei, null si invalide ou nul
function parseAmount(value) {
    try {
        const wei = ethers.parseEther(value.trim().replace(',', '.'));
        return wei > 0n ? wei : null;
    } catch {
        return null;
    }
}

// Envoyer de l'ETH depuis le compte connecté
async function sendEther(event) {
    event.preventDefault();
    sendStatus.classList.add('hidden');

    const to = document.getElementById('recipient').value.trim();
    if (!ethers.isAddress(to)) {
        showError('Adresse du destinataire invalide');
        return;
    }

    const value = parseAmount(document.getElementById('amount').value);
    if (value === null) {
        showError('Montant invalide');
        return;
    }

    try {
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<span class="loader"></span>Envoi...';

        const tx = await signer.sendTransaction({ to, value });
        await tx.wait();

        sendStatus.textContent = `✅ Transaction confirmée : ${tx.hash}`;
        sendStatus.classList.remove('hidden');
        sendForm.reset();
        await updateBalance();
    } catch (error) {
        console.error('Erreur lors de l\'envoi:', error);
        showError(error.code === 'ACTION_REJECTED'
            ? 'Transaction refusée dans MetaMask'
            : 'Échec de l\'envoi: ' + (error.shortMessage || error.message));
    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Envoyer';
    }
}

// Écouteurs d'événements
connectBtn.addEventListener('click', connectWallet);
refreshBtn.addEventListener('click', updateBalance);
sendForm.addEventListener('submit', sendEther);

// Détecter les changements de compte
if (window.ethereum) {
    window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length === 0) {
            location.reload();
        } else {
            signer = await provider.getSigner();
            userAccount = await signer.getAddress();
            document.getElementById('walletAddress').textContent = formatAddress(userAccount);

            // Recréer le contrat avec le nouveau signer
            const contractAddress = contractAddressInput.value.trim();
            contract = new ethers.Contract(contractAddress, contractABI, signer);

            await updateBalance();
        }
    });

    window.ethereum.on('chainChanged', () => {
        location.reload();
    });
}
