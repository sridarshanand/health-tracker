import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { TrendingUp, Activity, Scale, Moon, Footprints } from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:5000/api/health/stats/summary', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStats(response.data)
    } catch (err) {
      setError('Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Activity className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        {error}
      </div>
    )
  }

  if (!stats || stats.message) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No health records found. Start by adding your first record!</p>
      </div>
    )
  }

  const weightData = stats.weightTrend?.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    weight: item.weight
  })) || []

  const bmiData = stats.bmiTrend?.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    bmi: item.bmi
  })) || []

  const StatCard = ({ icon: Icon, title, value, unit, color }) => (
    <div className="card">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      </div>
      <p className="text-2xl font-bold text-gray-900">
        {value} <span className="text-sm font-normal text-gray-500">{unit}</span>
      </p>
    </div>
  )

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Health Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Scale}
          title="Latest BMI"
          value={stats.latestBMI}
          unit="kg/m²"
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          icon={TrendingUp}
          title="Avg Weight"
          value={stats.averageWeight}
          unit="kg"
          color="bg-green-100 text-green-600"
        />
        <StatCard
          icon={Footprints}
          title="Avg Steps"
          value={stats.averageSteps}
          unit="steps"
          color="bg-orange-100 text-orange-600"
        />
        <StatCard
          icon={Moon}
          title="Avg Sleep"
          value={stats.averageSleep}
          unit="hrs"
          color="bg-purple-100 text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Weight Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="weight" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">BMI Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bmiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bmi" fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
