// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title WalletBalance
 * @dev Un contrat simple pour récupérer le solde d'un wallet
 */
contract WalletBalance {
    // Événement émis quand un solde est consulté
    event BalanceChecked(
        address indexed wallet,
        uint256 balance,
        uint256 timestamp
    );

    function deposit() public payable {}

    function showContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Récupère le solde d'une adresse spécifique
     * @param _address L'adresse dont on veut connaître le solde
     * @return Le solde en Wei
     */
    function getBalance(address _address) public view returns (uint256) {
        return _address.balance;
    }

    /**
     * @dev Récupère le solde de l'appelant (msg.sender)
     * @return Le solde en Wei
     */
    function getMyBalance() public view returns (uint256) {
        return msg.sender.balance;
    }

    /**
     * @dev Récupère les soldes de plusieurs adresses
     * @param _addresses Tableau d'adresses
     * @return Tableau des soldes en Wei
     */
    function getMultipleBalances(
        address[] memory _addresses
    ) public view returns (uint256[] memory) {
        uint256[] memory balances = new uint256[](_addresses.length);

        for (uint i = 0; i < _addresses.length; i++) {
            balances[i] = _addresses[i].balance;
        }

        return balances;
    }

    /**
     * @dev Enregistre une consultation de solde (version non-view pour émettre un événement)
     * @param _address L'adresse à vérifier
     * @return Le solde en Wei
     */
    function checkAndLogBalance(address _address) public returns (uint256) {
        uint256 balance = _address.balance;
        emit BalanceChecked(_address, balance, block.timestamp);
        return balance;
    }

    /**
     * @dev Convertit Wei en Ether (pour faciliter l'affichage)
     * @param _weiAmount Montant en Wei
     * @return Montant en Ether (avec 18 décimales)
     */
    function weiToEther(uint256 _weiAmount) public pure returns (uint256) {
        return _weiAmount / 1 ether;
    }
}
