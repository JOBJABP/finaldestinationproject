import React from "react";
import styles from './treatment.module.css';

export default function DeleteTreatmentModal({ treatmentData, onClose, onConfirmDelete }) {
  if (!treatmentData) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calcAge = (birthdate) => {
    if (!birthdate) return "-";
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleDeleteClick = () => {
    const confirm = window.confirm(
      `คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลการรักษาของ ${treatmentData.first_name} ${treatmentData.last_name} ?`
    );
    if (confirm) {
      onConfirmDelete(treatmentData.treatment_id);
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2 style={{ color: "#00796b", marginBottom: "1rem" }}>
          ยืนยันการลบข้อมูลการรักษา
        </h2>

        <div className={styles.modalContent} style={{ gridTemplateColumns: "1fr" }}>
          <p><strong>ชื่อผู้ป่วย:</strong> {treatmentData.first_name} {treatmentData.last_name}</p>
          <p><strong>อายุ:</strong> {calcAge(treatmentData.birthdate)}</p>
          <p><strong>เพศ:</strong> {treatmentData.gender}</p>
          <p><strong>โรคประจำตัว:</strong> {treatmentData.disease}</p>
          <p><strong>วันที่บันทึก:</strong> {formatDate(treatmentData.treatment_date)}</p>
          <p><strong>ประเภทการรักษา:</strong> {treatmentData.treatment_type}</p>
          <p><strong>รายละเอียดการรักษา:</strong> {treatmentData.description}</p>
        </div>

        <div className={styles.modalButtons} style={{ marginTop: 20 }}>
          <button
            className={styles.addButton}
            style={{ backgroundColor: "#d32f2f" }}
            onClick={handleDeleteClick}
          >
            ลบข้อมูลการรักษา
          </button>
          <button
            className={styles.addButton}
            style={{ backgroundColor: "#ccc", color: "#333", marginLeft: "12px" }}
            onClick={onClose}
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}
