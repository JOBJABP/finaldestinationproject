"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './treatment.module.css';
import { Eye, Trash, Plus } from 'lucide-react';

import DeleteTreatmentModal from './DeletetreatmentModal';
import AddTreatmentModal from './AddTreatmentModal';
import ViewTreatmentModal from './ViewTreatmentModal';

export default function TreatmentTable() {
  const [treatments, setTreatments] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTreatments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/treatment');
      setTreatments(response.data);
    } catch (error) {
      console.error('ดึงข้อมูลการรักษาไม่สำเร็จ', error);
    }
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  const handleViewClick = async (treatmentId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/treatment/${treatmentId}`);
      setSelectedTreatment(res.data);
      setShowViewModal(true);
    } catch (error) {
      console.error('ไม่สามารถโหลดข้อมูลการรักษาได้', error);
      alert('โหลดข้อมูลไม่สำเร็จ');
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedTreatment(null);
    fetchTreatments();
  };

  const handleDeleteClick = async (treatmentId) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/treatment/${treatmentId}`);
    setSelectedTreatment(res.data);
    setShowDeleteModal(true);
  } catch (error) {
    console.error('โหลดข้อมูลการรักษาล้มเหลว', error);
    alert('โหลดข้อมูลไม่สำเร็จ');
  }
};

  const confirmDeleteTreatment = async (treatmentId) => {
  setIsDeleting(true);
  try {
    await axios.delete(`http://localhost:5000/api/treatment/${treatmentId}`);
    alert('ลบข้อมูลเรียบร้อยแล้ว');
  } catch (error) {
    alert('ไม่สามารถลบข้อมูลได้');
  } finally {
    setIsDeleting(false);
    setShowDeleteModal(false);
    setSelectedTreatment(null);
    fetchTreatments();
  }
};

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>ข้อมูลการรักษา</h2>
        <button className={styles.addButton} onClick={() => setShowAddModal(true)}>
          <Plus size={16} className={styles.icon} />
          เพิ่มข้อมูลการรักษา
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>รหัสการรักษา</th>
            <th>รหัสผู้ป่วย</th>
            <th>ชื่อ-นามสกุล</th>
            <th>วันที่บันทึก</th>
            <th>รูปแบบการรักษา</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {treatments.map((t, idx) => (
            <tr key={idx}>
              <td>{t.treatment_id || 'N/A'}</td>
              <td>{t.patients_id || 'N/A'}</td>
              <td>{t.first_name} {t.last_name}</td>
              <td>{formatThaiDate(t.treatment_date)}</td>
              <td>{t.treatment_type || '-'}</td>
              <td className={styles.actions}>
                <button className={styles.iconButton} onClick={() => handleViewClick(t.treatment_id)}><Eye size={18} /></button>
                <button className={styles.iconButton} onClick={() => handleDeleteClick(t.treatment_id)}><Trash size={18} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {treatments.length === 0 && (
        <div className={styles.noData}>ไม่มีข้อมูลการรักษา</div>
      )}

      {/* Modal เพิ่ม */}
      {showAddModal && (
        <AddTreatmentModal
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
            fetchTreatments();
          }}
        />
      )}

      {/* Modal ดูข้อมูล */}
      {showViewModal && selectedTreatment && (
        <ViewTreatmentModal
          treatmentData={selectedTreatment}
          onClose={() => {
            setShowViewModal(false);
            setSelectedTreatment(null);
          }}
        />
      )}

      {showDeleteModal && selectedTreatment && (
        <DeleteTreatmentModal
          treatmentData={selectedTreatment}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedTreatment(null);
          }}
          onConfirmDelete={confirmDeleteTreatment}
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
