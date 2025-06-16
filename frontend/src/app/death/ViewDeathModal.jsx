import React from 'react';
import styles from './death.module.css'; // หรือใช้ death.module.css ถ้าแยกไฟล์

export default function ViewDeathModal({ deathData, onClose }) {
  if (!deathData) return null;

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
        <h2 className={styles.modalTitle}>รายละเอียดการเสียชีวิต</h2>
        <div className={styles.modalContent}>
          <p><strong>รหัสการเสียชีวิต:</strong> {deathData.death_id}</p>
          <p><strong>รหัสผู้ป่วย:</strong> {deathData.patients_id}</p>
          <p><strong>ชื่อ:</strong> {deathData.first_name} {deathData.last_name}</p>
          <p><strong>รหัสบัตรประชาชน:</strong> {deathData.card_id}</p>
          <p><strong>วันเกิด:</strong> {formatDate(deathData.birthdate)}</p>
          <p><strong>อายุ:</strong> {calcAge(deathData.birthdate)} ปี</p>
          <p><strong>เพศ:</strong> {deathData.gender}</p>
          <p><strong>สัญชาติ:</strong> {deathData.nationality}</p>
          <p><strong>ที่อยู่:</strong> {deathData.address}</p>
          <p><strong>โรคประจำตัว:</strong> {deathData.disease}</p>
          <p><strong>ประเภทผู้ป่วย:</strong> {deathData.patients_type}</p>
          <p><strong>วันที่เข้ารักษา:</strong> {formatDate(deathData.admittion_date)}</p>

          <p><strong>วันที่เสียชีวิต:</strong> {formatDate(deathData.death_date)}</p>
          <p><strong>เวลาเสียชีวิต:</strong> {deathData.death_time}</p>
          <p><strong>สาเหตุการเสียชีวิต:</strong> {deathData.death_cause}</p>
          <p><strong>สถานะ:</strong> {deathData.status}</p>
          <p><strong>การจัดการศพ:</strong> {deathData.management}</p>
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
