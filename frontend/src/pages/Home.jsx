import React, { useState } from 'react'
import Dashboard from '../components/Dashboard'
import AddRecord from '../components/AddRecord'
import RecordList from '../components/RecordList'

const Home = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'add', label: 'Add Record' },
    { id: 'history', label: 'History' }
  ]

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'add' && <AddRecord onSuccess={() => setActiveTab('dashboard')} />}
      {activeTab === 'history' && <RecordList />}
    </div>
  )
}

export default Home
