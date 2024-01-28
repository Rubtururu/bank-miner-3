window.addEventListener('load', async () => {
  // Verifica si MetaMask está instalado y conectado
  if (typeof window.ethereum !== 'undefined') {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
  } else {
    alert('Por favor, instala MetaMask para usar esta aplicación.');
  }

  // Dirección del contrato y ABI
  const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Reemplaza con la dirección de tu contrato
  const contractAbi = [ /* Inserta el ABI de tu contrato aquí */ ];

  // Inicializa el contrato
  const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);

  // Actualiza la interfaz de usuario con la información del usuario
  async function updateUI() {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    document.getElementById('account').textContent = account;

    const bnbBalance = await web3.eth.getBalance(account);
    document.getElementById('bnbBalance').textContent = web3.utils.fromWei(bnbBalance, 'ether');

    const depositedBnb = await contractInstance.methods.depositedBnb(account).call();
    const dividends = await contractInstance.methods.calculateDividends(account).call();
    const lastDepositTime = await contractInstance.methods.lastDepositTime(account).call();

    document.getElementById('depositedBnb').textContent = web3.utils.fromWei(depositedBnb, 'ether');
    document.getElementById('dividends').textContent = web3.utils.fromWei(dividends, 'ether');
    document.getElementById('lastDepositTime').textContent = new Date(lastDepositTime * 1000).toLocaleString();

    const treasuryPoolBalance = await contractInstance.methods.getTreasuryPoolBalance().call();
    const dividendsPoolBalance = await contractInstance.methods.getDividendsPoolBalance().call();
    const dailyDividends = await contractInstance.methods.calculateDailyDividends(account).call();

    document.getElementById('treasuryPoolBalance').textContent = web3.utils.fromWei(treasuryPoolBalance, 'ether');
    document.getElementById('dividendsPoolBalance').textContent = web3.utils.fromWei(dividendsPoolBalance, 'ether');
    document.getElementById('dailyDividends').textContent = web3.utils.fromWei(dailyDividends, 'ether');
  }

  // Depositar BNB
  async function deposit() {
    const depositAmount = document.getElementById('depositAmount').value;
    if (!depositAmount) return;

    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    await contractInstance.methods.deposit().send({
      from: account,
      value: web3.utils.toWei(depositAmount, 'ether')
    });

    updateUI();
  }

  // Retirar BNB
  async function withdraw() {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    await contractInstance.methods.withdraw().send({ from: account });

    updateUI();
  }

  // Reclamar dividendos
  async function claimDividends() {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    await contractInstance.methods.claimDividends().send({ from: account });

    updateUI();
  }

  // Inicializar la interfaz de usuario
  updateUI();
});
