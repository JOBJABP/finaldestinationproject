import React from 'react';
import styles from './treatment.module.css';

export default function ViewTreatmentModal({ treatmentData, onClose }) {

  if (!treatmentData) return null;

    const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };


  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>รายละเอียดการรักษา</h2>
        <div className={styles.modalContent}>
          <p><strong>ชื่อผู้ป่วย:</strong> {treatmentData.first_name} {treatmentData.last_name}</p>
          <p><strong>อายุ:</strong> {calcAge(treatmentData.birthdate)}</p>
          <p><strong>เพศ:</strong> {treatmentData.gender}</p>
          <p><strong>โรคประจำตัว:</strong> {treatmentData.disease}</p>
          <p><strong>ประเภทผู้ป่วย:</strong> {treatmentData.patients_type}</p>
          <p><strong>กรุ๊ปเลือด:</strong> {treatmentData.blood_group}</p>
          <p><strong>ส่วนสูง:</strong> {treatmentData.height}</p>
          <p><strong>น้ำหนัก:</strong> {treatmentData.weight}</p>
          <p><strong>วันที่บันทึก:</strong> {formatDate(treatmentData.treatment_date)}</p>
          <p><strong>ประเภทการรักษา:</strong> {treatmentData.treatment_type}</p>
          <p><strong>รายละเอียดการรักษา:</strong> {treatmentData.description}</p>
        </div>
        <button onClick={onClose} className={styles.closeButton}>ปิด</button>
      </div>
    </div>
  );
}

function calcAge(birthdate) {
  if (!birthdate) return '-';
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

