import React from 'react';
import styles from './patients.module.css';

export default function ViewPatientModal({ patientData, onClose }) {
  if (!patientData) return null;

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
        <h2 className={styles.modalTitle}>รายละเอียดผู้ป่วย</h2>
        <div className={styles.modalContent}>
          <p><strong>ชื่อ:</strong> {patientData.first_name} {patientData.last_name}</p>
          <p><strong>รหัสบัตรประชาชน:</strong> {patientData.card_id}</p>
          <p><strong>วันเกิด:</strong> {formatDate(patientData.birthdate)}</p>
          <p><strong>อายุ:</strong> {calcAge(patientData.birthdate)}</p>
          <p><strong>เพศ:</strong> {patientData.gender}</p>
          <p><strong>ส่วนสูง:</strong> {patientData.height}</p>
          <p><strong>น้ำหนัก:</strong> {patientData.weight}</p>
          <p><strong>สัญชาติ:</strong> {patientData.nationality}</p>
          <p><strong>ที่อยู่:</strong> {patientData.address}</p>
          <p><strong>เบอร์โทร:</strong> {patientData.phone_number}</p>
          <p><strong>ประเภทผู้ป่วย:</strong> {patientData.patients_type}</p>
          <p><strong>กรุ๊ปเลือด:</strong> {patientData.blood_group}</p>
          <p><strong>โรคประจำตัว:</strong> {patientData.disease}</p>
         <p><strong>วันที่เข้ารักษา:</strong> {formatDate(patientData.admittion_date)}</p>
          
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

