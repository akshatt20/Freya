import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import baseIcon from '../assets/base.svg';
import optimism from '../assets/optimism.svg';
import freyaIcon from '../assets/freya.png';
import { ArrowLeftRight, Activity, Wallet, ChevronDown, ArrowRight, ChevronRight, Download, Upload } from 'lucide-react';

// Keep existing ABI, CONTRACT_ADDRESS, and SUPPORTED_CHAINS constants
const SUPERETH_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function deposit() payable",
  "function withdraw(uint256 amount)",
  "function crosschainMint(address to, uint256 amount)",
  "function crosschainBurn(address from, uint256 amount)",
  "event Deposited(address indexed user, uint256 amount)",
  "event Withdrawn(address indexed user, uint256 amount)",
  "event CrosschainMinted(address indexed receiver, uint256 amount)",
  "event CrosschainBurned(address indexed from, uint256 amount)"
];

const CONTRACT_ADDRESS = "0xE55A698143bbb447F09b2628aAfE04991B764067";
const ZoraLogo = () => (
  <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#000000"/>
    <path d="M6 8.5L12 5L18 8.5V15.5L12 19L6 15.5V8.5Z" fill="white"/>
  </svg>
);
const BaseLogo = () => (
  <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#0052FF"/>
    <path d="M12 6L16.5 8.75V14.25L12 17L7.5 14.25V8.75L12 6Z" fill="white"/>
  </svg>
);

const SUPPORTED_CHAINS = [
  {
    chainName: "Optimism Sepolia",
    chainId: "0xA8F3C",
    chainIdDecimal: 690556,
    icon: <img src={optimism} alt="Optimism Icon" className="w-10 h-10 bg-transparent" />
  },
  {
    chainName: "Base Sepolia",
    chainId: "0x14913",
    chainIdDecimal: 84531,
    icon: <img src={baseIcon} alt="Base Icon" className="w-10 h-10 bg-transparent" />

  },
  {
    chainName: "Zora",
    chainId: "0x7777777",
    chainIdDecimal: 7777777,
    icon: <ZoraLogo className="w-10 h-10 bg-transparent" />
  },
  {
    chainName: "Unichain",
    chainId: "0x82",
    chainIdDecimal: 130,
    icon: <svg width="40" height="42" viewBox="0 0 116 115" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M115.476 56.406C84.3089 56.406 59.07 31.1416 59.07 0H56.8819V56.406H0.47583V58.594C31.6429 58.594 56.8819 83.8584 56.8819 115H59.07V58.594H115.476V56.406Z" fill="#fc0fa4"/>
  </svg>
  },
];

// Background Animation Component
const BackgroundAnimation = () => {
  const hexPoints = Array.from({ length: 20 }, (_, i) => ({
    id: `hex-${i}`,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  const orbs = Array.from({ length: 15 }, (_, i) => ({
    id: `orb-${i}`,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 15,
  }));

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-gray-900 to-black" />
      
      <div className="absolute inset-0 opacity-20">
        {hexPoints.map((point) => (
          <motion.div
            key={point.id}
            className="absolute w-12 h-12 border border-orange-500/20"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            width: `${orb.size}rem`,
            height: `${orb.size}rem`,
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 165, 0, 0.15), rgba(147, 51, 234, 0.05))',
            boxShadow: '0 0 30px 5px rgba(255, 165, 0, 0.1)',
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

// Custom styled components
const NetworkSelector = ({ value, onChange, options, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(opt => opt.chainId === value);

  return (
    <div className="relative">
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 
                 flex items-center justify-between text-left hover:border-orange-500/50 
                 transition-all duration-200"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{selected?.icon}</span>
          <div>
            <div className="font-medium text-white">{selected?.chainName}</div>
            <div className="text-sm text-gray-400">Network</div>
          </div>
        </div>
        <ChevronDown className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 rounded-xl bg-gray-800/95 backdrop-blur-sm 
                     border border-gray-700/50 shadow-xl overflow-hidden"
          >
            {options.map((option) => (
              <button
                key={option.chainId}
                onClick={() => {
                  onChange(option.chainId);
                  setIsOpen(false);
                }}
                className="w-full p-4 flex items-center space-x-3 hover:bg-gray-700/50 
                         transition-colors duration-200"
              >
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <div className="font-medium text-white">{option.chainName}</div>
                  <div className="text-sm text-gray-400">Network</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AmountInput = ({ value, onChange, label, placeholder = "0.0", tokenSymbol = "ETH" }) => (
  <div className="space-y-2">
    <label className="block text-sm text-gray-400">{label}</label>
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 
                 text-white placeholder-gray-500 text-lg font-medium
                 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 
                 transition-all duration-200"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 
                    px-3 py-1 rounded-lg bg-gray-700/50 text-sm font-medium">
        {tokenSymbol}
      </div>
    </div>
  </div>
);

const AddressInput = ({ value, onChange }) => (
  <div className="space-y-2">
    <label className="block text-sm text-gray-400">Recipient Address</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="0x..."
      className="w-full p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 
               text-white placeholder-gray-500 font-medium
               focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 
               transition-all duration-200"
    />
  </div>
);

const GradientButton = ({ children, onClick, className = "", disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full p-4 rounded-xl font-medium relative
              bg-gradient-to-r from-orange-500 to-purple-600 
              hover:from-orange-600 hover:to-purple-700
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 ${className}`}
  >
    <span className="relative z-10 flex items-center justify-center space-x-2">
      {children}
    </span>
  </button>
);

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="p-4 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-lg font-medium text-white">{value}</p>
      </div>
      {Icon && <Icon className="text-gray-400" size={20} />}
    </div>
  </div>
);

const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200
      ${active ? 'bg-orange-500/20 text-orange-500' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

const ActionButton = ({ onClick, icon: Icon, label, description }) => (
  <button
    onClick={onClick}
    className="w-full p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 
             hover:border-orange-500/50 transition-all duration-200"
  >
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500">
        <Icon size={24} />
      </div>
      <div className="text-left">
        <div className="font-medium">{label}</div>
        <div className="text-sm text-gray-400">{description}</div>
      </div>
    </div>
  </button>
);

function Bridge() {
  // State variables
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [currentChainId, setCurrentChainId] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [superEthBalance, setSuperEthBalance] = useState("0");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bridgeAmount, setBridgeAmount] = useState("");
  const [bridgeSourceChain, setBridgeSourceChain] = useState(SUPPORTED_CHAINS[1]);
  const [bridgeTargetChain, setBridgeTargetChain] = useState(SUPPORTED_CHAINS[0]);
  const [bridgeRecipient, setBridgeRecipient] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [activeTab, setActiveTab] = useState('bridge');
  const [activeAction, setActiveAction] = useState('bridge');
  const [ethBalance, setEthBalance] = useState("0");


  // Effect for wallet connection and chain changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainId) => {
        setCurrentChainId(chainId);
        resetContractData();
      });

      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
        } else {
          setUserAddress("");
        }
        resetContractData();
      });
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('chainChanged');
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  // Effect for loading balance
  useEffect(() => {
    if (userAddress && currentChainId && signer) {
      loadSuperETHBalance();
    }
  }, [userAddress, currentChainId, signer]);

  useEffect(() => {
    if (provider && userAddress) {
      loadEthBalance();
    }
  }, [provider, userAddress]);
  

  // Wallet connection
  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install Metamask or a compatible wallet.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      const account = accounts[0];
      setUserAddress(account);

      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setCurrentChainId(chainId);

      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);

      const newSigner = await newProvider.getSigner();
      setSigner(newSigner);

    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  }

  function resetContractData() {
    setSuperEthBalance("0");
    setStatusMessage("");
  }

  function getSuperETHContract() {
    if (!signer) return null;
    return new ethers.Contract(CONTRACT_ADDRESS, SUPERETH_ABI, signer);
  }

  async function loadSuperETHBalance() {
    try {
      setStatusMessage("Loading SuperETH balance...");
      const contract = getSuperETHContract();
      if (!contract) {
        setStatusMessage("No contract instance (signer not ready).");
        return;
      }
      const balance = await contract.balanceOf(userAddress);
      const decimals = await contract.decimals();
      const formatted = ethers.formatUnits(balance, decimals);
      setSuperEthBalance(formatted);
      setStatusMessage("SuperETH balance updated.");
    } catch (err) {
      console.error("Error loading balance:", err);
      setStatusMessage("Failed to load SuperETH balance.");
    }
  }

  async function loadEthBalance() {
    if (!provider || !userAddress) return;
    try {
      const balance = await provider.getBalance(userAddress);
      const formatted = ethers.formatEther(balance);
      setEthBalance(formatted);
    } catch (err) {
      console.error("Error loading ETH balance:", err);
    }
  }
  

  async function handleDeposit() {
    if (!depositAmount || Number(depositAmount) <= 0) {
      alert("Please enter a valid deposit amount.");
      return;
    }
    setStatusMessage("Depositing...");
    try {
      const contract = getSuperETHContract();
      if (!contract) {
        setStatusMessage("Signer or contract not available.");
        return;
      }
      const tx = await contract.deposit({
        value: ethers.parseEther(depositAmount)
      });
      await tx.wait();
      setStatusMessage("Deposit successful!");
      setDepositAmount("");
      loadSuperETHBalance();
    } catch (err) {
      console.error("Deposit error:", err);
      setStatusMessage("Deposit failed. See console for details.");
    }
  }

  async function handleWithdraw() {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      alert("Please enter a valid withdraw amount.");
      return;
    }
    setStatusMessage("Withdrawing...");
    try {
      const contract = getSuperETHContract();
      if (!contract) {
        setStatusMessage("Signer or contract not available.");
        return;
      }
      const decimals = await contract.decimals();
      const amountBig = ethers.parseUnits(withdrawAmount, decimals);

      const tx = await contract.withdraw(amountBig);
      await tx.wait();

      setStatusMessage("Withdraw successful!");
      setWithdrawAmount("");
      loadSuperETHBalance();
    } catch (err) {
      console.error("Withdraw error:", err);
      setStatusMessage("Withdraw failed. See console for details.");
    }
  }

  async function handleBridge() {
    if (!bridgeAmount || Number(bridgeAmount) <= 0) {
      alert("Please enter a valid bridging amount.");
      return;
    }
    if (!bridgeRecipient) {
      alert("Please enter a valid recipient address.");
      return;
    }

    setStatusMessage("Starting bridging operation...");

    await switchNetwork(bridgeSourceChain.chainId);
    const contractSource = getSuperETHContract();
    const decimals = await contractSource.decimals();
    const burnAmount = ethers.parseUnits(bridgeAmount, decimals);

    setStatusMessage(`Burning on source chain ${bridgeSourceChain.chainName}...`);
    try {
      const txBurn = await contractSource.crosschainBurn(userAddress, burnAmount);
      await txBurn.wait();
      setStatusMessage("Burn on source chain successful!");
    } catch (err) {
      console.error("crosschainBurn error:", err);
      setStatusMessage("Burn failed (likely not authorized).");
      return;
    }

    await switchNetwork(bridgeTargetChain.chainId);
    const contractTarget = getSuperETHContract();
    setStatusMessage(`Minting on target chain ${bridgeTargetChain.chainName}...`);
    try {
      const txMint = await contractTarget.crosschainMint(bridgeRecipient, burnAmount);
      await txMint.wait();
      setStatusMessage("Mint on target chain successful!");
    } catch (err) {
      console.error("crosschainMint error:", err);
      setStatusMessage("Mint failed (likely not authorized).");
      return;
    }

    await loadSuperETHBalance();
  }

  async function switchNetwork(chainIdHex) {
    if (!window.ethereum) {
      alert("No wallet found to switch network");
      return;
    }
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }]
      });
    } catch (switchError) {
      console.error(switchError);
    }
  }

  return (
    <div className="min-h-screen text-white">
      <BackgroundAnimation />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gray-800/50">
        <div className="container mx-auto px-6 h-20">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-8">
              <nav >
              <div className="flex items-center space-x-3">
                <span className="text-xl font-bold">
                  <NavLink to="/">
                    <img src={freyaIcon} alt="Freya" className="w-14 h-14" />
                  </NavLink> 
                  </span>
              </div>
              </nav>
              <nav className="hidden md:flex space-x-1">
                <TabButton
                  active={activeTab === 'bridge'}
                  onClick={() => setActiveTab('bridge')}
                  icon={ArrowLeftRight}
                  label="Bridge"
                />
                <TabButton
                  active={activeTab === 'activity'}
                  onClick={() => setActiveTab('activity')}
                  icon={Activity}
                  label="Activity"
                />
              </nav>
            </div>

            {!userAddress ? (
              <GradientButton 
                onClick={connectWallet} 
                className="!w-auto px-6"
              >
                <Wallet size={20} />
                <span>Connect Wallet</span>
              </GradientButton>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50">
                  <div className="text-sm font-medium">
                    {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Action Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ActionButton
                onClick={() => setActiveAction('bridge')}
                icon={ArrowLeftRight}
                label="Bridge"
                description="Transfer across chains"
              />
              <ActionButton
                onClick={() => setActiveAction('deposit')}
                icon={Download}
                label="Deposit"
                description="ETH to SuperETH"
              />
              <ActionButton
                onClick={() => setActiveAction('withdraw')}
                icon={Upload}
                label="Withdraw"
                description="SuperETH to ETH"
              />
            </div>

            {/* Form Content */}
            <div className="p-6 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50">
              {activeAction === 'bridge' && (
                <>
                  <h2 className="text-2xl font-bold mb-8">Bridge ETH</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <NetworkSelector
                        label="From Network"
                        value={bridgeSourceChain.chainId}
                        options={SUPPORTED_CHAINS}
                        onChange={(chainId) => {
                          const chainData = SUPPORTED_CHAINS.find(c => c.chainId === chainId);
                          if (chainData) setBridgeSourceChain(chainData);
                        }}
                      />
                      <NetworkSelector
                        label="To Network"
                        value={bridgeTargetChain.chainId}
                        options={SUPPORTED_CHAINS}
                        onChange={(chainId) => {
                          const chainData = SUPPORTED_CHAINS.find(c => c.chainId === chainId);
                          if (chainData) setBridgeTargetChain(chainData);
                        }}
                      />
                    </div>

                    <AmountInput
                      label="Amount"
                      value={bridgeAmount}
                      onChange={(e) => setBridgeAmount(e.target.value)}
                      tokenSymbol="ETH"
                    />

                    <AddressInput
                      value={bridgeRecipient}
                      onChange={(e) => setBridgeRecipient(e.target.value)}
                    />

                    <GradientButton 
                      onClick={handleBridge}
                      disabled={!userAddress}
                    >
                      <span>Bridge ETH</span>
                      <ChevronRight size={20} />
                    </GradientButton>
                  </div>
                </>
              )}

              {activeAction === 'deposit' && (
                <>
                  <h2 className="text-2xl font-bold mb-8">Deposit ETH</h2>
                  <div className="space-y-6">
                    <AmountInput
                      label="Amount to Deposit"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      tokenSymbol="ETH"
                    />
                    <GradientButton 
                      onClick={handleDeposit}
                      disabled={!userAddress}
                    >
                      <span>Deposit ETH</span>
                      <Download size={20} />
                    </GradientButton>
                  </div>
                </>
              )}

              {activeAction === 'withdraw' && (
                <>
                  <h2 className="text-2xl font-bold mb-8">Withdraw ETH</h2>
                  <div className="space-y-6">
                    <AmountInput
                      label="Amount to Withdraw"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      tokenSymbol="sETH"
                    />
                    <GradientButton 
                      onClick={handleWithdraw}
                      disabled={!userAddress}
                    >
                      <span>Withdraw ETH</span>
                      <Upload size={20} />
                    </GradientButton>
                  </div>
                </>
              )}
            </div>

            {/* Status Messages */}
            {statusMessage && (
              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-center space-x-2 text-orange-500">
                  <Activity size={20} />
                  <span>{statusMessage}</span>
                </div>
              </div>
            )}
          </div>

          {/* Balances & Stats */}
          <div className="space-y-8">
            {/* Balances Card */}
            <div className="p-6 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50">
              <h3 className="text-lg font-bold mb-6">Your Balances</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gray-800/50 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500">
                      ETH
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">ETH Balance</div>
                      <div className="font-medium">{ethBalance} ETH</div>

                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-800/50 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500">
                      sE
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">SuperETH Balance</div>
                      <div className="font-medium">{superEthBalance} sETH</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Network Stats */}
            <div className="p-6 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50">
              <h3 className="text-lg font-bold mb-6">Network Stats</h3>
              <div className="grid gap-4">
                <StatCard
                  label="Total Transfers"
                  value="10,234 txs"
                  icon={ArrowLeftRight}
                />
                <StatCard
                  label="24h Volume"
                  value="1,234 ETH"
                  icon={Activity}
                />
                <div className="p-4 rounded-xl bg-gray-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Active Users</span>
                    <span className="font-medium">567</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-700">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-purple-600"
                      style={{ width: '60%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Bridge;