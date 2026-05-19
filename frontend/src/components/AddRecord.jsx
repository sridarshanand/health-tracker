import React, { useState } from 'react'
import axios from 'axios'
import { Plus, Check } from 'lucide-react'

const AddRecord = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    systolic: '',
    diastolic: '',
    heartRate: '',
    bloodSugar: '',
    steps: '',
    waterIntake: '',
    sleepHours: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:5000/api/health', {
        weight: Number(formData.weight),
        height: Number(formData.height),
        bloodPressure: {
          systolic: Number(formData.systolic) || undefined,
          diastolic: Number(formData.diastolic) || undefined
        },
        heartRate: Number(formData.heartRate) || undefined,
        bloodSugar: Number(formData.bloodSugar) || undefined,
        steps: Number(formData.steps) || undefined,
        waterIntake: Number(formData.waterIntake) || undefined,
        sleepHours: Number(formData.sleepHours) || undefined,
        notes: formData.notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setSuccess(true)
      setFormData({
        weight: '',
        height: '',
        systolic: '',
        diastolic: '',
        heartRate: '',
        bloodSugar: '',
        steps: '',
        waterIntake: '',
        sleepHours: '',
        notes: ''
      })

      setTimeout(() => {
        onSuccess()
      }, 1500)
    } catch (err) {
      alert('Failed to add record')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "input-field"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1"

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Health Record</h2>

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
          <Check className="w-5 h-5" />
          Record added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Weight (kg) *</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className={inputClass}
              required
              step="0.1"
            />
          </div>

          <div>
            <label className={labelClass}>Height (cm) *</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className={inputClass}
              required
              step="0.1"
            />
          </div>

          <div>
            <label className={labelClass}>Systolic BP</label>
            <input
              type="number"
              name="systolic"
              value={formData.systolic}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Diastolic BP</label>
            <input
              type="number"
              name="diastolic"
              value={formData.diastolic}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Heart Rate (bpm)</label>
            <input
              type="number"
              name="heartRate"
              value={formData.heartRate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Blood Sugar (mg/dL)</label>
            <input
              type="number"
              name="bloodSugar"
              value={formData.bloodSugar}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Steps</label>
            <input
              type="number"
              name="steps"
              value={formData.steps}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Water Intake (L)</label>
            <input
              type="number"
              name="waterIntake"
              value={formData.waterIntake}
              onChange={handleChange}
              className={inputClass}
              step="0.1"
            />
          </div>

          <div>
            <label className={labelClass}>Sleep Hours</label>
            <input
              type="number"
              name="sleepHours"
              value={formData.sleepHours}
              onChange={handleChange}
              className={inputClass}
              step="0.5"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className={inputClass}
            rows="3"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          {loading ? 'Saving...' : (
            <>
              <Plus className="w-5 h-5" />
              Add Record
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default AddRecord
