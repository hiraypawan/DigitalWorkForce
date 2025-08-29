'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
      
      // Mock transaction data
      setTransactions([
        {
          id: '1',
          date: new Date().toISOString().split('T')[0],
          description: 'Task completion payment',
          amount: 500,
          type: 'earning',
          status: 'completed',
        },
        {
          id: '2',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          description: 'SIP Investment',
          amount: 1000,
          type: 'sip',
          status: 'completed',
        },
      ]);
      
    } catch (error) {
      console.error('Failed to fetch earnings data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earning':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'sip':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'insurance':
        return <Shield className="w-4 h-4 text-purple-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Earnings & Investments</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Earnings</h3>
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">₹{earnings.totalEarnings.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-1">From {earnings.completedTasks} completed tasks</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">SIP Investments</h3>
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">₹{earnings.sipInvestments.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-1">Monthly auto-investment</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Insurance</h3>
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            {earnings.insurancePlan ? (
              <>
                <p className="text-lg font-semibold text-purple-600">{earnings.insurancePlan}</p>
                <p className="text-sm text-gray-600 mt-1">Active coverage</p>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-gray-400">No Plan</p>
                <button className="text-sm text-blue-600 hover:underline mt-1">
                  Get Coverage
                </button>
              </>
            )}
          </div>
        </div>

        {/* Financial Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* SIP Investment Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">SIP Investment</h3>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-4">
                Automatically invest a portion of your earnings in mutual funds for long-term wealth building.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-blue-700">Monthly Investment</span>
                  <span className="font-semibold text-blue-900">₹{earnings.sipInvestments.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Expected Annual Return</span>
                  <span className="font-semibold text-blue-900">12-15%</span>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <PieChart className="w-4 h-4" />
              {earnings.sipInvestments > 0 ? 'Manage SIP' : 'Start SIP'}
            </button>
          </div>
          
          {/* Insurance Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-900">Health Insurance</h3>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-4">
                Protect yourself and your family with comprehensive health insurance coverage.
              </p>
              
              {earnings.insurancePlan ? (
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-purple-700">Current Plan</span>
                    <span className="font-semibold text-purple-900">{earnings.insurancePlan}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-700">Coverage</span>
                    <span className="font-semibold text-purple-900">₹5,00,000</span>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 text-center">No insurance plan active</p>
                </div>
              )}
            </div>
            
            <button className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              {earnings.insurancePlan ? 'Manage Insurance' : 'Get Insurance'}
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Recent Transactions</h3>
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h4>
              <p className="text-gray-600">Complete tasks to start earning money!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-600">{transaction.date}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'earning' 
                        ? 'text-green-600' 
                        : transaction.type === 'sip'
                        ? 'text-blue-600'
                        : 'text-purple-600'
                    }`}>
                      {transaction.type === 'earning' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </p>
                    <p className={`text-xs ${
                      transaction.status === 'completed'
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }`}>
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Coming Soon Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <PieChart className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Investment Portfolio</h3>
            </div>
            <p className="text-gray-700 mb-4">Track your SIP investments and portfolio performance in real-time.</p>
            <div className="flex items-center gap-2 text-blue-600">
              <span className="text-sm font-medium">Coming Soon</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Tax Planning</h3>
            </div>
            <p className="text-gray-700 mb-4">Automated tax calculations and optimization strategies for freelancers.</p>
            <div className="flex items-center gap-2 text-green-600">
              <span className="text-sm font-medium">Coming Soon</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
