"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './patients.module.css';
import { Eye, Pencil, Plus } from 'lucide-react';
import AddPatientModal from './patientsModal';
import EditPatientModal from './EditpatientsModal';
import ViewPatientModal from './ViewpatientsModal';


export default function PatientsTable() {
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState('');

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('ดึงข้อมูลไม่สำเร็จ', error);
    }
  };

  const handleSearch = async () => {
    if (!patientId.trim()) return;

    try {
      const response = await axios.get(`http://localhost:5000/api/patients/${patientId}`);
      setPatients([response.data]);  // ใส่เป็น array เดียว
      setError('');
    } catch (err) {
      setPatients([]);
      setError('ไม่พบข้อมูลผู้ป่วย');
    }
  };


  useEffect(() => {
    fetchPatients();
  }, []);

  const handleEditClick = async (patientId) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/patients/${patientId}`);
    setSelectedPatient(res.data);
    setShowEditModal(true);
  } catch (error) {
    console.error('โหลดข้อมูลผู้ป่วยล้มเหลว', error);
  }
};

  const handleViewClick = async (patientId) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/patients/${patientId}`);
    setSelectedPatient(res.data);
    setShowViewModal(true);
  } catch (error) {
    console.error('ไม่สามารถโหลดข้อมูลผู้ป่วยได้', error);
    alert('โหลดข้อมูลผู้ป่วยไม่สำเร็จ');
  }
};

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedPatient(null);
    fetchPatients();
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>ข้อมูลผู้ป่วยในแผนก</h2>
        <button className={styles.addButton} onClick={() => setShowAddModal(true)}>
          <Plus size={16} className={styles.icon} />
          เพิ่มผู้ป่วย
        </button>
      </div>

      <div className={styles.searchRow}>
        <input
          type="text"
          placeholder="กรอกรหัสผู้ป่วยเพื่อค้นหา"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>ค้นหา</button>
        <button onClick={fetchPatients} className={styles.resetButton}>แสดงทั้งหมด</button>
      </div>

      {error && <div className={styles.error}>{error}</div>}


      <table className={styles.table}>
        <thead>
          <tr>
            <th>รหัสประจำตัว</th>
            <th>ชื่อจริง-นามสกุล</th>
            <th>อายุ</th>
            <th>วันที่เข้ารับการรักษา</th>
            <th>สถานะ</th>
            <th>การช่วยเหลือตนเอง</th>
            <th>โรคประจำตัว</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p, idx) => (
            <tr key={idx}>
              <td>{p.patients_id || 'N/A'}</td>
              <td>{p.first_name} {p.last_name}</td>
              <td>{calcAge(p.birthdate)} ปี</td>
              <td>{formatThaiDate(p.admittion_date)}</td>
              <td>{p.status || '-'}</td>
              <td>{p.patients_type}</td>
              <td>{p.disease}</td>
              <td className={styles.actions}>
                <button className={styles.iconButton} onClick={() => handleViewClick(p.patients_id)}><Eye size={18} /></button>
                <button className={styles.iconButton} onClick={() => handleEditClick(p.patients_id)}><Pencil size={18} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {patients.length === 0 && (
        <div className={styles.noData}>ไม่มีข้อมูลผู้ป่วย</div>
      )}


      {/* Modal เพิ่มข้อมูล */}
      {showAddModal && (
        <AddPatientModal
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
            fetchPatients();  // รีเฟรชข้อมูลหลังเพิ่มสำเร็จ
          }}
        />
      )}

      {/* Modal ตรวจสอบข้อมูล */}
      {showViewModal && selectedPatient && (
        <ViewPatientModal
          patientData={selectedPatient}
          onClose={() => {
            setShowViewModal(false);
            setSelectedPatient(null);
          }}
        />
      )}


      {/* Modal แก้ไขข้อมูล */}
      {showEditModal && selectedPatient && (
        <EditPatientModal
          patientData={selectedPatient}
          onClose={handleCloseModal}
          onSaveSuccess={handleCloseModal}
        />
      )}

    </div>
  );
}



// ฟังก์ชันคำนวณอายุ
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


// แปลงวันที่เป็นภาษาไทย
function formatThaiDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
