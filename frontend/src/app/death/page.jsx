'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './death.module.css';
import { Plus, Eye, Pencil, Trash } from 'lucide-react';
import AddDeathModal from './AddDeathModal';
import EditDeathModal from './EditDeathModal';
import ViewDeathModal from './ViewDeathModal'

export default function DeathInformationTable() {
  const [deaths, setDeaths] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDeath, setSelectedDeath] = useState(null);

  const fetchDeaths = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/deaths`);
      console.log('📦 ข้อมูลจาก backend:', res.data);
      setDeaths(res.data);
      setError('');
    } catch (err) {
      console.error('ดึงข้อมูลการเสียชีวิตล้มเหลว:', err);
    }
  };

  const handleSearch = async () => {
    if (!patientId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/deaths/patient/${patientId}`);
      setDeaths(res.data);
      setError('');
    } catch (err) {
      setError('ไม่พบข้อมูลการเสียชีวิตของผู้ป่วยนี้');
      setDeaths([]);
    }
  };

  const handleDelete = async (deathId) => {
    const confirmDelete = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/deaths/${deathId}`);
      alert('ลบข้อมูลสำเร็จ');
      fetchDeaths();
    } catch (err) {
      console.error('ลบข้อมูลล้มเหลว:', err);
      alert('ลบข้อมูลล้มเหลว');
    }
  };

  const handleEdit = (death) => {
    setSelectedDeath(death);
    setShowEditModal(true);
  };

  const handleView = (death) => {
  setSelectedDeath(death);
  setShowViewModal(true);
  };

  useEffect(() => {
    fetchDeaths();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>ข้อมูลการเสียชีวิตผู้ป่วย</h2>
        <button className={styles.addButton} onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> เพิ่มข้อมูลการเสียชีวิต
        </button>
      </div>

      <div className={styles.searchRow}>
        <input
          type="text"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className={styles.searchInput}
          placeholder="กรอกรหัสผู้ป่วยเพื่อตรวจสอบ"
        />
        <button onClick={handleSearch} className={styles.searchButton}>ค้นหา</button>
        <button onClick={fetchDeaths} className={styles.resetButton}>แสดงทั้งหมด</button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>รหัสการเสียชีวิต</th>
            <th>รหัสผู้ป่วย</th>
            <th>ชื่อ-นามสกุล</th>
            <th>วันที่เสียชีวิต</th>
            <th>สาเหตุ</th>
            <th>สถานะ</th>
            <th>การจัดการศพ</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {deaths.map((d) => (
            <tr key={d.death_id}>
              <td>{d.death_id}</td>
              <td>{d.patients_id}</td>
              <td>{d.first_name} {d.last_name}</td>
              <td>{formatThaiDate(d.death_date)}</td>
              <td>{d.death_cause}</td>
              <td>{d.status}</td>
              <td>{d.management}</td>
              <td className={styles.actions}>
                <button onClick={() => handleView(d)} className={styles.iconButton}>
                  <Eye size={18} />
                </button>
                <button onClick={() => handleEdit(d)} className={styles.iconButton}>
                  <Pencil size={18} />
                </button>
                <button onClick={() => handleDelete(d.death_id)} className={styles.iconButton}>
                  <Trash size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {deaths.length === 0 && <div className={styles.noData}>ไม่มีข้อมูล</div>}

      {showAddModal && (
        <AddDeathModal
          onClose={() => setShowAddModal(false)}
          onSave={fetchDeaths}
        />
      )}

      {showEditModal && selectedDeath && (
        <EditDeathModal
          deathData={selectedDeath}
          onClose={() => setShowEditModal(false)}
          onSave={fetchDeaths}
        />
      )}

      {showViewModal && selectedDeath && (
        <ViewDeathModal
          deathData={selectedDeath}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
}

function formatDateTime(dateStr, timeStr) {
  if (!dateStr) return '-';
  const d = new Date(`${dateStr}T${timeStr || '00:00'}`);
  return d.toLocaleString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
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
