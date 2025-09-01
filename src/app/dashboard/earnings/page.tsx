'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  ArrowLeft, 
  DollarSign, 
  TrendingUp, 
  PieChart,
  Shield,
  Calendar,
  Download,
  ExternalLink
} from 'lucide-react';

interface EarningsData {
  totalEarnings: number;
  thisMonth: number;
  lastMonth: number;
  sipInvestments: number;
  insurancePlan: string | null;
  completedTasks: number;
  pendingPayments: number;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'earning' | 'sip' | 'insurance';
  status: 'completed' | 'pending';
}

export default function Earnings() {
  const { currentTheme, formatCurrency } = useTheme();
  const [earnings, setEarnings] = useState<EarningsData>({
    totalEarnings: 0,
    thisMonth: 0,
    lastMonth: 0,
    sipInvestments: 0,
    insurancePlan: null,
    completedTasks: 0,
    pendingPayments: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user profile for earnings data
      const profileResponse = await fetch('/api/users/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setEarnings({
          totalEarnings: profileData.user.totalEarnings || 0,
          thisMonth: 0, // Mock data for now
          lastMonth: 0, // Mock data for now
          sipInvestments: profileData.user.sipInvestments || 0,
          insurancePlan: profileData.user.insurancePlan,
          completedTasks: profileData.user.completedTasks || 0,
          pendingPayments: 0, // Mock data for now
        });
      }
      
      // Set empty transactions array - no demo data
      setTransactions([]);
      
    } catch (error) {
      console.error('Failed to fetch earnings data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earning':
        return <DollarSign className="w-4 h-4 text-green-400" />;
      case 'sip':
        return <TrendingUp className="w-4 h-4 text-blue-400" />;
      case 'insurance':
        return <Shield className="w-4 h-4 text-purple-400" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center transition-colors duration-300"
        style={{ background: currentTheme.gradients.background }}
      >
        <div className="text-center">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: currentTheme.gradients.card }}
          >
            <div 
              className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: currentTheme.colors.primary }}
            ></div>
          </div>
          <p style={{ color: currentTheme.colors.textMuted }}>Loading earnings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ background: currentTheme.gradients.background, minHeight: '100vh' }}>
      {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Total Earnings</h3>
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-green-400">₹{earnings.totalEarnings.toLocaleString()}</p>
              <p className="text-sm text-gray-400 mt-1">From {earnings.completedTasks} completed tasks</p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">SIP Investments</h3>
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-blue-400">₹{earnings.sipInvestments.toLocaleString()}</p>
              <p className="text-sm text-gray-400 mt-1">Monthly auto-investment</p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Insurance</h3>
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              {earnings.insurancePlan ? (
                <>
                  <p className="text-lg font-semibold text-purple-400">{earnings.insurancePlan}</p>
                  <p className="text-sm text-gray-400 mt-1">Active coverage</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold text-gray-400">No Plan</p>
                  <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors mt-1">
                    Get Coverage
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Financial Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* SIP Investment Card */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">SIP Investment</h3>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-300 mb-4">
                  Automatically invest a portion of your earnings in mutual funds for long-term wealth building.
                </p>
                
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-blue-300">Monthly Investment</span>
                    <span className="font-semibold text-blue-400">₹{earnings.sipInvestments.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-300">Expected Annual Return</span>
                    <span className="font-semibold text-blue-400">12-15%</span>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 font-medium glow-button">
                <PieChart className="w-4 h-4" />
                {earnings.sipInvestments > 0 ? 'Manage SIP' : 'Start SIP'}
              </button>
            </div>
          </div>
          
          {/* Insurance Card */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">Health Insurance</h3>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-300 mb-4">
                  Protect yourself and your family with comprehensive health insurance coverage.
                </p>
                
                {earnings.insurancePlan ? (
                  <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-purple-300">Current Plan</span>
                      <span className="font-semibold text-purple-400">{earnings.insurancePlan}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-300">Coverage</span>
                      <span className="font-semibold text-purple-400">₹5,00,000</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-400 text-center">No insurance plan active</p>
                  </div>
                )}
              </div>
              
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 font-medium glow-button">
                <Shield className="w-4 h-4" />
                {earnings.insurancePlan ? 'Manage Insurance' : 'Get Insurance'}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="group relative mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
          <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Transactions</h3>
              <button className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">No transactions yet</h4>
                <p className="text-gray-400">Complete tasks to start earning money!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-900/30 border border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium text-white">{transaction.description}</p>
                        <p className="text-sm text-gray-400">{transaction.date}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'earning' 
                          ? 'text-green-400' 
                          : transaction.type === 'sip'
                          ? 'text-blue-400'
                          : 'text-purple-400'
                      }`}>
                        {transaction.type === 'earning' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </p>
                      <p className={`text-xs ${
                        transaction.status === 'completed'
                          ? 'text-green-400'
                          : 'text-yellow-400'
                      }`}>
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Coming Soon Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <PieChart className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Investment Portfolio</h3>
              </div>
              <p className="text-gray-300 mb-4">Track your SIP investments and portfolio performance in real-time.</p>
              <div className="flex items-center gap-2 text-blue-400">
                <span className="text-sm font-medium">Coming Soon</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-black/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Tax Planning</h3>
              </div>
              <p className="text-gray-300 mb-4">Automated tax calculations and optimization strategies for freelancers.</p>
              <div className="flex items-center gap-2 text-green-400">
                <span className="text-sm font-medium">Coming Soon</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
