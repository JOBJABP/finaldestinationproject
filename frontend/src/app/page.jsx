'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:5000/api/patients')
      .then(res => {
        if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลได้')
        return res.json()
      })
      .then(data => {
        console.log('Fetched:', data)
        setPatients(data) // ✅ ใช้ .patients
      })
      .catch(error => {
        console.error('Fetch error:', error)
        setError(error.message)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">รายชื่อผู้ป่วย</h1>

      {loading && <p>กำลังโหลดข้อมูล...</p>}
      {error && <p className="text-red-500">เกิดข้อผิดพลาด: {error}</p>}

      {!loading && !error && patients.length === 0 && <p>ไม่มีข้อมูล</p>}

      {!loading && !error && patients.length > 0 && (
        <ul className="mt-4 space-y-2">
          {patients.map(patient => (
            <li key={patient.patients_id}>
              {patient.first_name} {patient.last_name} — อายุ: {calculateAge(patient.birthdate)} ปี
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

function calculateAge(birthdate) {
  const birth = new Date(birthdate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}