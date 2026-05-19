import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Trash2, Calendar, Scale, Heart, Activity } from 'lucide-react'
import { format } from 'date-fns'

const RecordList = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:5000/api/health', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRecords(response.data)
    } catch (err) {
      console.error('Failed to fetch records')
    } finally {
      setLoading(false)
    }
  }

  const deleteRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return
    
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:5000/api/health/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRecords(records.filter(r => r._id !== id))
    } catch (err) {
      alert('Failed to delete record')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No records found. Add your first health record!</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Health History</h2>
      
      <div className="space-y-4">
        {records.map(record => (
          <div key={record._id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(record.date), 'PPP')}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Weight</p>
                      <p className="font-semibold">{record.weight} kg</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">BMI</p>
                      <p className="font-semibold">{record.bmi}</p>
                    </div>
                  </div>

                  {record.heartRate && (
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-600" />
                      <div>
                        <p className="text-xs text-gray-500">Heart Rate</p>
                        <p className="font-semibold">{record.heartRate} bpm</p>
                      </div>
                    </div>
                  )}

                  {record.steps && (
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-orange-600" />
                      <div>
                        <p className="text-xs text-gray-500">Steps</p>
                        <p className="font-semibold">{record.steps}</p>
                      </div>
                    </div>
                  )}
                </div>

                {record.bloodPressure?.systolic && (
                  <div className="mt-3 text-sm">
                    <span className="text-gray-500">Blood Pressure: </span>
                    <span className="font-medium">
                      {record.bloodPressure.systolic}/{record.bloodPressure.diastolic} mmHg
                    </span>
                  </div>
                )}

                {record.notes && (
                  <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {record.notes}
                  </p>
                )}
              </div>

              <button
                onClick={() => deleteRecord(record._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecordList
