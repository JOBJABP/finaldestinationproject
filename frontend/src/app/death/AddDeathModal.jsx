'use client';

import React, { useState } from 'react';
import styles from './death.module.css';

export default function AddDeathModal({ onClose, onSave }) {
  const [patientId, setPatientId] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [form, setForm] = useState({
    death_date: '',
    death_time: '',
    death_cause: '',
    management: '',
  });

  const [error, setError] = useState('');

  const fetchPatient = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/patients/${patientId}`);
      if (!res.ok) throw new Error('ไม่พบผู้ป่วย');
      const data = await res.json();
      setPatientData(data);
      setError('');
    } catch (err) {
      setPatientData(null);
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/deaths', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          patients_id: patientId,
        }),
      });

      if (res.ok) {
        alert('เพิ่มข้อมูลการเสียชีวิตสำเร็จ');
        onSave();
        onClose();
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
        <h2 className={styles.modalTitle}>เพิ่มข้อมูลผู้ป่วยเสียชีวิต</h2>

        <div className={`${styles.formGroup} ${styles.checkRow}`}>
          <input
            type="text"
            placeholder=""
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
          <label htmlFor="patients_id">กรอกรหัสผู้ป่วย</label>
          <button onClick={fetchPatient} className={styles.checkButton}>ตรวจสอบ</button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {patientData && (
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <input type="text" readOnly value={`${patientData.first_name} ${patientData.last_name}`} />
              <label>ชื่อ-นามสกุล</label>
            </div>
            <div className={styles.formGroup}>
              <input type="text" readOnly value={patientData.card_id} />
              <label>เลขบัตรประชาชน</label>
            </div>
            <div className={styles.formGroup}>
              <input type="text" readOnly value={calculateAge(patientData.birthdate)} />
              <label>อายุ</label>
            </div>
            <div className={styles.formGroup}>
              <input type="text" readOnly value={patientData.gender} />
              <label>เพศ</label>
            </div>
            <div className={styles.formGroup}>
              <input type="text" readOnly value={patientData.nationality} />
              <label>สัญชาติ</label>
            </div>
            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
              <input type="text" readOnly value={patientData.address} />
              <label>ที่อยู่</label>
            </div>
            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
              <input type="text" readOnly value={patientData.disease || '-'} />
              <label>โรคประจำตัว</label>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.formGrid}>
            <div className={styles.formGroup}>
              <input 
              type="date" 
              name="death_date" 
              value={form.death_date} 
              onChange={handleChange} 
              required />
              <label htmlFor="death_date">กรอกวันที่เสียชีวิต</label>
            </div>
            <div className={styles.formGroup}>
              <input 
              type="time" 
              name="death_time" 
              value={form.death_time} 
              onChange={handleChange} 
              required />
              <label htmlFor="death_time">กรอกเวลาเสียชีวิต</label>
            </div>
            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
              <input 
              type="text" 
              name="management" 
              value={form.management} 
              onChange={handleChange} 
              placeholder=""
              required />
              <label htmlFor="management">การจัดการศพ</label>
            </div>
            <div className={styles.formGroup} style={{ gridColumn: 'span 3' }}>
              <textarea 
              type="text" 
              name="death_cause" 
              value={form.death_cause} 
              onChange={handleChange}
              placeholder=""
              required />
              <label htmlFor="death_cause">สาเหตุการเสียชีวิต</label>
            </div>
            <div className={styles.modalButtons} style={{ gridColumn: 'span 3' }}>
              <button type="button" onClick={onClose} className={styles.cancelButton}>ยกเลิก</button>
              <button type="submit" onClick={handleSubmit} className={styles.confirmButton}>บันทึก</button>
            </div>
          </form>
        
      </div>
    </div>
  );
}

function calculateAge(birthdateStr) {
  const birthdate = new Date(birthdateStr);
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const m = today.getMonth() - birthdate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  return age;
}
