import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowRightLeft, 
  History, 
  CreditCard, 
  User,
  DollarSign,
  Send,
  Search,
  Building2,
  PiggyBank
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Transaction {
  id: number;
  type: 'received' | 'sent';
  amount: number;
  from?: string;
  to?: string;
  date: string;
  description: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [balance, setBalance] = useState(75000);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, type: 'received', amount: 5000, from: 'João Silva', date: '2024-03-15', description: 'Pagamento recebido' },
    { id: 2, type: 'sent', amount: 2500, to: 'Maria Santos', date: '2024-03-14', description: 'Pagamento do carro' },
    { id: 3, type: 'received', amount: 1000, from: 'Pedro Oliveira', date: '2024-03-13', description: 'Serviços' },
  ]);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferTo, setTransferTo] = useState('');

  const handleTransfer = () => {
    const amount = Number(transferAmount);
    if (!amount || amount <= 0) {
      toast.error('Por favor, insira um valor válido', {
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
      return;
    }
    if (!transferTo) {
      toast.error('Por favor, insira o ID do destinatário', {
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
      return;
    }
    if (amount > balance) {
      toast.error('Saldo insuficiente', {
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
      return;
    }

    setBalance(prev => prev - amount);
    const newTransaction: Transaction = {
      id: Date.now(),
      type: 'sent',
      amount,
      to: transferTo,
      date: new Date().toISOString().split('T')[0],
      description: 'Transferência enviada'
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setTransferAmount('');
    setTransferTo('');
    toast.success('Transferência realizada com sucesso!', {
      style: {
        background: '#22c55e',
        color: '#fff',
      },
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'transfer':
        return (
          <div className="bg-gray-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-6">Realizar Transferência</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ID do Destinatário</label>
                <input
                  type="text"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite o ID do destinatário"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Valor</label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite o valor"
                />
              </div>
              <button
                onClick={handleTransfer}
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg px-4 py-2 font-medium"
              >
                Enviar Transferência
              </button>
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="bg-gray-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-6">Histórico de Transações</h3>
            <div className="space-y-4">
              {transactions.map(transaction => (
                <div key={transaction.id} className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${transaction.type === 'received' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {transaction.type === 'received' ? <ArrowRightLeft size={20} /> : <Send size={20} />}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.type === 'received' ? `De ${transaction.from}` : `Para ${transaction.to}`}</p>
                      <p className="text-sm text-gray-400">{transaction.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.type === 'received' ? 'text-green-400' : 'text-red-400'}`}>
                      {transaction.type === 'received' ? '+' : '-'}R$ {transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400">{transaction.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <>
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-300 mb-1">Saldo Total</p>
                  <h2 className="text-4xl font-bold">R$ {balance.toLocaleString()}</h2>
                </div>
                <div className="bg-blue-500/30 p-2 rounded-lg">
                  <DollarSign size={24} />
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setActiveTab('transfer');
                    toast.success('Acessando transferências', {
                      style: {
                        background: '#3b82f6',
                        color: '#fff',
                      },
                    });
                  }}
                  className="flex items-center gap-2 bg-blue-500/30 hover:bg-blue-500/40 transition-colors rounded-lg px-4 py-2"
                >
                  <Send size={18} />
                  Enviar Dinheiro
                </button>
                <button 
                  onClick={() => {
                    toast.success('Transferência rápida iniciada!', {
                      style: {
                        background: '#3b82f6',
                        color: '#fff',
                      },
                    });
                  }}
                  className="flex items-center gap-2 bg-blue-500/30 hover:bg-blue-500/40 transition-colors rounded-lg px-4 py-2"
                >
                  <ArrowRightLeft size={18} />
                  Transferência Rápida
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-700/50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="text-blue-400" size={20} />
                  <h4 className="font-medium">Conta Corrente</h4>
                </div>
                <p className="text-2xl font-semibold">R$ {(balance * 0.8).toLocaleString()}</p>
                <p className="text-sm text-gray-400">Conta Principal</p>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <PiggyBank className="text-green-400" size={20} />
                  <h4 className="font-medium">Poupança</h4>
                </div>
                <p className="text-2xl font-semibold">R$ {(balance * 0.2).toLocaleString()}</p>
                <p className="text-sm text-gray-400">Rendimento: 2,5% ao ano</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Transações Recentes</h3>
              <div className="space-y-4">
                {transactions.slice(0, 3).map(transaction => (
                  <div key={transaction.id} className="bg-gray-700/50 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${transaction.type === 'received' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {transaction.type === 'received' ? <ArrowRightLeft size={20} /> : <Send size={20} />}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.type === 'received' ? `De ${transaction.from}` : `Para ${transaction.to}`}</p>
                        <p className="text-sm text-gray-400">{transaction.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${transaction.type === 'received' ? 'text-green-400' : 'text-red-400'}`}>
                        {transaction.type === 'received' ? '+' : '-'}R$ {transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-400">{transaction.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 text-gray-100 font-['Inter']">
      <div className="bg-gray-800 rounded-2xl w-full max-w-4xl h-[800px] shadow-2xl flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-20 bg-gray-900 p-4 flex flex-col items-center gap-8">
          <div className="p-2 rounded-lg bg-blue-600">
            <Wallet size={24} />
          </div>
          <nav className="flex flex-col gap-6">
            <button 
              onClick={() => {
                setActiveTab('overview');
                toast('Visualizando visão geral', {
                  icon: '👀',
                  style: {
                    background: '#1f2937',
                    color: '#fff',
                  },
                });
              }}
              className={`p-2 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
            >
              <CreditCard size={24} />
            </button>
            <button 
              onClick={() => {
                setActiveTab('transfer');
                toast('Pronto para fazer uma transferência', {
                  icon: '💸',
                  style: {
                    background: '#1f2937',
                    color: '#fff',
                  },
                });
              }}
              className={`p-2 rounded-lg transition-colors ${activeTab === 'transfer' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
            >
              <ArrowRightLeft size={24} />
            </button>
            <button 
              onClick={() => {
                setActiveTab('history');
                toast('Visualizando histórico de transações', {
                  icon: '📜',
                  style: {
                    background: '#1f2937',
                    color: '#fff',
                  },
                });
              }}
              className={`p-2 rounded-lg transition-colors ${activeTab === 'history' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
            >
              <History size={24} />
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold">PladixBank</h1>
              <p className="text-gray-400">Bem-vindo de volta, Michael</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gray-700 p-2 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() => toast('Função de busca em breve!', {
                  icon: '🔍',
                  style: {
                    background: '#1f2937',
                    color: '#fff',
                  },
                })}
              >
                <Search size={20} />
              </div>
              <div className="bg-gray-700 p-2 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() => toast('Configurações do perfil em breve!', {
                  icon: '👤',
                  style: {
                    background: '#1f2937',
                    color: '#fff',
                  },
                })}
              >
                <User size={20} />
              </div>
            </div>
          </div>

          {renderContent()}
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;