'use client';

import React, { useState } from 'react';
import styles from './death.module.css';

export default function EditDeathModal({ deathData, onClose, onSave }) {
  const [form, setForm] = useState({
    death_date: deathData.death_date || '',
    death_time: deathData.death_time || '',
    death_cause: deathData.death_cause || '',
    status: deathData.status || '',
    management: deathData.management || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/deaths/${deathData.death_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert('อัปเดตข้อมูลสำเร็จ');
        onSave();
        onClose();
      } else {
        alert('เกิดข้อผิดพลาดในการอัปเดต');
      }
    } catch (err) {
      console.error(err);
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>แก้ไขข้อมูลการเสียชีวิต</h2>

        {/* แสดงข้อมูลผู้ป่วยแบบอ่านอย่างเดียว */}
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <input type="text" readOnly value={`${deathData.first_name} ${deathData.last_name}`} />
            <label>ชื่อ-นามสกุล</label>
          </div>
          <div className={styles.formGroup}>
            <input type="text" readOnly value={deathData.card_id || '-'} />
            <label>เลขบัตรประชาชน</label>
          </div>
          <div className={styles.formGroup}>
            <input type="text" readOnly value={calculateAge(deathData.birthdate)} />
            <label>อายุ</label>
          </div>
          <div className={styles.formGroup}>
            <input type="text" readOnly value={deathData.gender || '-'} />
            <label>เพศ</label>
          </div>
          <div className={styles.formGroup}>
            <input type="text" readOnly value={deathData.nationality || '-'} />
            <label>สัญชาติ</label>
          </div>
          <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
            <input type="text" readOnly value={deathData.address || '-'} />
            <label>ที่อยู่</label>
          </div>
          <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
            <input type="text" readOnly value={deathData.disease || '-'} />
            <label>โรคประจำตัว</label>
          </div>
        </div>

        {/* ฟอร์มแก้ไข */}
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <div className={styles.formGroup}>
            <input type="date" name="death_date" value={form.death_date} onChange={handleChange} required />
            <label htmlFor="death_date">แก้ไขวันที่เสียชีวิต</label>
          </div>
          <div className={styles.formGroup}>
            <input type="time" name="death_time" value={form.death_time} onChange={handleChange} required />
            <label htmlFor="death_time">แก้ไขเวลาเสียชีวิต</label>
          </div>
          <div className={styles.formGroup}>
            <input type="text" name="status" value={form.status} onChange={handleChange} required />
            <label htmlFor="status">แก้ไขสถานะ</label>
          </div>
          <div className={styles.formGroup}>
            <input type="text" name="management" value={form.management} onChange={handleChange} required />
            <label htmlFor="management">แก้ไขการจัดการศพ</label>
          </div>
          <div className={styles.formGroup} style={{ gridColumn: 'span 3' }}>
            <textarea name="death_cause" value={form.death_cause} onChange={handleChange} required />
            <label htmlFor="death_cause">แก้ไขสาเหตุการเสียชีวิต</label>
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
