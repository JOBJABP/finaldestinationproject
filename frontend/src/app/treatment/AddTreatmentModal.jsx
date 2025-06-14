'use client';
import React, { useState } from 'react';
import styles from './treatment.module.css';


const AddTreatmentModal = ({ onClose }) => {
  const [patientsId, setPatientsId] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [treatmentForm, setTreatmentForm] = useState({
    description: '',
    treatment_date: '',
    treatment_type: ''
  });

  const [errorMsg, setErrorMsg] = useState('');

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


  const handleSubmit = async () => {
  if (!patientData) {
    alert('กรุณาตรวจสอบข้อมูลผู้ป่วยก่อน');
    return;
  }

  try {
    const payload = {
      ...treatmentForm,
      patients_id: patientData.patients_id
    };
    const res = await fetch('http://localhost:5000/api/treatment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      alert('บันทึกการรักษาสำเร็จ');
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
        <h3>เพิ่มข้อมูลการรักษา</h3>

        <div className={`${styles.formGroup} ${styles.checkRow}`}>
          <input
            id="patients_id"
            name="patients_id"
            value={patientsId}
            onChange={(e) => setPatientsId(e.target.value)}
            placeholder=" "
            required
          />
          <label htmlFor="patients_id">กรอกรหัสผู้ป่วย</label>
          <button onClick={handleCheckPatient} className={styles.checkButton}>ตรวจสอบ</button>
          {errorMsg && <p className={styles.error}>{errorMsg}</p>}        
        </div>

        {patientData && (
          <div className={styles.patientInfo}>
            <div className={styles.formGroup}>
              <input
                type="text"
                name="first_name"
                value={`${patientData.first_name} ${patientData.last_name}`}
                readOnly
                placeholder="ชื่อ-นามสกุล"
              />
              <label htmlFor="first_name">ชื่อ-นามสกุล</label>
            </div>

            <div className={styles.formGroup}>
              <input
                type="text"
                name="age"
                value={patientData.age}
                readOnly
                placeholder="อายุ"
              />
              <label htmlFor="age">อายุ</label>
            </div>

            <div className={styles.formGroup}>
              <input
                type="text"
                name="disease"
                value={patientData.disease}
                readOnly
                placeholder="โรคประจำตัว"
              />
              <label htmlFor="disease">โรคประจำตัว</label>
            </div>

            <div className={styles.formGroup}>
              <input
                type="text"
                name="blood_group"
                value={patientData.blood_group}
                readOnly
                placeholder="กรุ๊ปเลือด"
              />
              <label htmlFor="blood_group">กรุ๊ปเลือด</label>
            </div>
          </div>
        )}


        <div className={styles.formGroup}>
          <input
            type="date"
            name="treatment_date"
            value={treatmentForm.treatment_date}
            onChange={(e) => setTreatmentForm({ ...treatmentForm, treatment_date: e.target.value })}
          />
          <label htmlFor="treatment_date">วันที่บันทึก</label>
        </div>

        <div className={styles.formGroup}>
          <select
            name="treatment_type"
            value={treatmentForm.treatment_type}
            onChange={(e) => setTreatmentForm({ ...treatmentForm, treatment_type: e.target.value })}
          >
            <option value="">-- เลือกประเภท --</option>
            <option value="ฉุกเฉิน">ฉุกเฉิน</option>
            <option value="ประจำ">ประจำ</option>
          </select>
          <label htmlFor="treatment_type">ประเภทการรักษา</label>
        </div>

        <div className={styles.formGroup} style={{ gridColumn: 'span 3' }}>
          <textarea
            type="text"
            name="description"
            value={treatmentForm.description}
            onChange={(e) => setTreatmentForm({ ...treatmentForm, description: e.target.value })}
            placeholder=" "
          />
          <label htmlFor="description">รายละเอียดการรักษา</label>
        </div>

        <div className={styles.modalButtons}>
          <button onClick={onClose} className={styles.dismissButton}>ยกเลิก</button>
          <button onClick={handleSubmit} className={styles.confirmButton}>บันทึก</button>
        </div>
      </div>
    </div>
  );
};


export default AddTreatmentModal;
