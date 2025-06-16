'use client';

import React, { useState, useEffect } from 'react';
import styles from './appointment.module.css';

export default function EditAppointmentModal({ onClose, onSave, appointmentData }) {
  const [form, setForm] = useState({
    patients_id: '',
    appointment_date: '',
    appointment_time: '',
    hospital_address: '',
    department: '',
    description: '',
  });
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    if (appointmentData && appointmentData.patients_id) {
      const fetchPatient = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/patients/${appointmentData.patients_id}`);
          const data = await res.json();
          setPatientData(data);
        } catch (err) {
          console.error('Error fetching patient data:', err);
        }
      };
      fetchPatient();
    }
  }, [appointmentData]);

  useEffect(() => {
    if (appointmentData) {
      setForm({
        patients_id: appointmentData.patients_id || '',
        appointment_date: formatDateToInput(appointmentData.appointment_date) || '',
        appointment_time: appointmentData.appointment_time || '',
        hospital_address: appointmentData.hospital_address || '',
        department: appointmentData.department || '',
        description: appointmentData.description || '',
      });
    }
  }, [appointmentData]);

  if (!appointmentData) return null; // หรือแสดง loading

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
    ...form,
    patients_id: appointmentData.patients_id,
    };

    console.log('Sending payload:', payload);

    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${appointmentData.appointment_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('อัปเดตการนัดหมายสำเร็จ');
        onClose();
        onSave();
      } else {
        alert('เกิดข้อผิดพลาด');
      }
    } catch (err) {
      console.error(err);
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>แก้ไขการนัดหมาย</h2>

        {patientData && (
          <div className={styles.formGroup}>
            <input
              type="text"
              value={`${patientData.first_name} ${patientData.last_name}`}
              readOnly
              placeholder="ชื่อ-นามสกุล"
            />
            <label>ชื่อ-นามสกุล</label>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <div className={styles.formGroup}>
            <input
              type="date"
              name="appointment_date"
              value={form.appointment_date}
              onChange={handleChange}
              required
            />
            <label htmlFor="appointment_date">วันที่</label>
          </div>

          <div className={styles.formGroup}>
            <input
              type="time"
              name="appointment_time"
              value={form.appointment_time}
              onChange={handleChange}
              required
            />
            <label htmlFor="appointment_time">เวลา</label>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              name="hospital_address"
              value={form.hospital_address}
              onChange={handleChange}
              required
            />
            <label htmlFor="hospital_address">โรงพยาบาล</label>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
              required
            />
            <label htmlFor="department">แผนก</label>
          </div>

          <div className={styles.formGroup} style={{ gridColumn: 'span 3' }}>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
            <label htmlFor="description">รายละเอียดการนัดหมาย</label>
          </div>

          <div className={styles.modalButtons} style={{ gridColumn: 'span 3' }}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>ยกเลิก</button>
            <button type="submit" className={styles.confirmButton}>บันทึก</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatDateToInput(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return '';
  // สร้างรูปแบบ YYYY-MM-DD
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}
