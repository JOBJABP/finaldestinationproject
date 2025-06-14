'use client';

import React, { useState } from 'react';
import styles from './appointment.module.css';

export default function AddAppointmentModal({ onClose, onSave }) {
  const [patientsId, setPatientsId] = useState('');
  const [form, setForm] = useState({
    patients_id: '',
    appointment_date: '',
    appointment_time: '',
    hospital_address: '',
    department: '',
    description: '',
  });
  const [patientData, setPatientData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckPatient = async () => {
  if (!patientsId.trim()) {
    alert('กรุณากรอกรหัสผู้ป่วย');
    return;
  }

  try {
      const res = await fetch(`http://localhost:5000/api/patients/${patientsId}`);
      if (!res.ok) {
        setErrorMsg('ไม่พบผู้ป่วย');
        throw new Error('ไม่พบผู้ป่วย');
      }
      const data = await res.json();
      setPatientData(data);
      setErrorMsg('');
    } catch (err) {
      alert(err.message || 'เกิดข้อผิดพลาดในการตรวจสอบผู้ป่วย');
      setPatientData(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientsId || isNaN(patientsId)) {
      alert('กรุณาตรวจสอบรหัสผู้ป่วยอีกครั้ง');
      return;
    }

    const payload = {
      ...form,
      patients_id: parseInt(patientsId),
    };

    try {
      const res = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('บันทึกการรักษาสำเร็จ');
        onClose();
      } else {
        alert('เกิดข้อผิดพลาด');
      }
      onSave();
    } catch (err) {
    console.error(err);
    alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์');
  }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>เพิ่มการนัดหมาย</h2>

        <div className={`${styles.formGroup} ${styles.checkRow}`}>
          <input
            type="patients_id"
            name="patients_id"
            value={patientsId}
            onChange={(e) => setPatientsId(e.target.value)}
            placeholder=" "
            required
          />
          <label htmlFor="patients_id">รหัสผู้ป่วย</label>
          <button onClick={handleCheckPatient} className={styles.checkButton}>ตรวจสอบ</button>
          {errorMsg && <p className={styles.error}>{errorMsg}</p>} 
        </div>

        {patientData && (
          <div className={styles.patientInfo}>
            <div className={styles.formGroup}>
              <input
                type="name"
                name="patient_name"
                value={`${patientData.first_name} ${patientData.last_name}`}
                onChange={handleChange}
                placeholder="ชื่อ-นามสกุล"
                readOnly
              />
              <label htmlFor="first_name">ชื่อ-นามสกุล</label>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <div className={styles.formGroup}>
            <input
              type="date"
              name="appointment_date"
              value={form.appointment_date}
              onChange={handleChange}
              placeholder=""
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
              placeholder=""
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
              placeholder=""
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
              placeholder=""
              required
            />
            <label htmlFor="department">แผนก</label>
          </div>

          <div className={styles.formGroup} style={{ gridColumn: 'span 3' }}>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder=""
            />
            <label htmlFor="description">รายละเอียดการนัดหมาย</label>
          </div>

          {errorMsg && <p className={styles.error}>{errorMsg}</p>}  

        </form>
            <div className={styles.modalButtons}>
                <button onClick={onClose} type="button" className={styles.cancelButton} >
                ยกเลิก
                </button>
                <button onClick={handleSubmit} type="submit" className={styles.confirmButton}>
                บันทึก
                </button>
            </div>
      </div>
    </div>
  );
}
