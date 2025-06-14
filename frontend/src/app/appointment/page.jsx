'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './appointment.module.css';
import { Plus, Eye, Trash, Pencil, } from 'lucide-react';
import AddAppointmentModal from './AddAppointmentModal';

export default function AppointmentsTable() {
    const [patientId, setPatientId] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/appointments');
      setAppointments(res.data);
    } catch (error) {
      console.error('ดึงข้อมูลการนัดหมายล้มเหลว:', error);
    }
  };

  const handleSearch = async () => {
    if (!patientId) return;
    try {
        const res = await fetch(`http://localhost:5000/api/appointments/${patientId}`);
        if (!res.ok) throw new Error('ไม่พบนัดหมายของผู้ป่วยคนนี้');

        const data = await res.json();
        setAppointments(data);
        setError('');
    } catch (err) {
        setAppointments([]);
        setError(err.message);
    }
    };


  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>การนัดหมายของผู้ป่วย</h2>
        <button className={styles.addButton} onClick={() => setShowAddModal(true)}>
          <Plus size={16} className={styles.icon} />
          เพิ่มการนัดหมาย
        </button>
      </div>

      <div className={styles.searchRow}>
        <input
            type="text"
            placeholder="กรอกรหัสผู้ป่วยเพื่อตรวจสอบ"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>ค้นหา</button>
        <button onClick={fetchAppointments} className={styles.resetButton}>แสดงทั้งหมด</button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>รหัสนัดหมาย</th>
            <th>รหัสผู้ป่วย</th>
            <th>ชื่อผู้ป่วย</th>
            <th>วันที่</th>
            <th>เวลา</th>
            <th>สถานที่</th>
            <th>แผนก</th>
            <th>รายละเอียด</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a, idx) => (
            <tr key={idx}>
              <td>{a.appointment_id}</td>
              <td>{a.patients_id}</td>
              <td>{a.first_name} {a.last_name}</td>
              <td>{formatThaiDate(a.appointment_date)}</td>
              <td>{a.appointment_time}</td>
              <td>{a.hospital_address}</td>
              <td>{a.department}</td>
              <td>{a.description}</td>
              <td className={styles.actions}>
                <button className={styles.iconButton} onClick={() => handleViewClick(a.appointment_id)}>
                    <Pencil size={18} />
                </button>
                <button className={styles.iconButton} onClick={() => handleDeleteClick(a.appointment_id)}>
                    <Trash size={18} />
                </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>

      {appointments.length === 0 && (
        <div className={styles.noData}>ไม่มีข้อมูลการนัดหมาย</div>
      )}

      {showAddModal && (
        <AddAppointmentModal
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
            fetchAppointments(); // รีเฟรชหลังเพิ่มข้อมูล
          }}
        />
      )}
    </div>
  );
}

function formatThaiDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
