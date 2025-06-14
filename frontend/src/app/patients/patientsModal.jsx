'use client';
import React, { useState, useEffect } from 'react';
import styles from './patients.module.css';

const AddPatientModal = ({ onClose }) => {
  const [form, setForm] = useState({
    first_name: '', 
    last_name: '', 
    card_id: '', 
    birthdate: '',
    age: '', 
    gender: '',
    nationality: '', 
    phone_number: '', 
    weight: '', height: '',
    treatment_id: '', 
    patients_type: '', 
    blood_group: '',
    disease: '',
    address: '', 
    admittion_date: '',
  });

  useEffect(() => {
    const age = calculateAgeFromBirthdate(form.birthdate);
    setForm(prev => ({ ...prev, age }));
  }, [form.birthdate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {

        if (!form.first_name || !form.last_name || !form.card_id) {
            alert('กรุณากรอกชื่อ นามสกุล และเลขบัตรประชาชนให้ครบถ้วน');
            return;
        }

        if (!/^\d{13}$/.test(form.card_id)) {
        alert('เลขบัตรประชาชนไม่ถูกต้อง');
        return;
        }

        const payload = { ...form };
      delete payload.age;

      const res = await fetch('http://localhost:5000/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert('บันทึกข้อมูลสำเร็จ');
        onClose();
      } else {
        alert('เกิดข้อผิดพลาด');
      }
    } catch (err) {
      console.error(err);
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

return (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <h3>เพิ่มข้อมูลผู้ป่วย</h3>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
            <input
            id="first_name"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            placeholder=" "
            required
            />
            <label htmlFor="first_name">ชื่อ</label>
        </div>

        <div className={styles.formGroup}>
            <input
            id="last_name"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder=" "
            required
            />
            <label htmlFor="last_name">นามสกุล</label>
        </div>

        <div className={styles.formGroup}>
            <input
            id="card_id"
            name="card_id"
            value={form.card_id}
            onChange={handleChange}
            placeholder=" "
            required
            />
            <label htmlFor="card_id">เลขบัตรประชาชน</label>
        </div>

        <div className={styles.formGroup}>
            <input
            id="birthdate"
            name="birthdate"
            type="date"
            value={form.birthdate}
            onChange={handleChange}
            placeholder=" "
            required
            />
            <label htmlFor="birthdate">วันเกิด</label>
        </div>

        <div className={styles.formGroup}>
            <input
            id="age"
            name="age"
            value={form.age}
            placeholder=" "
            readOnly
            />
            <label htmlFor="age">อายุ</label>
        </div>

        <div className={styles.formGroup}>
            <select
            id="gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            >
            <option value="">-- เลือกเพศ --</option>
            <option value="ชาย">ชาย</option>
            <option value="หญิง">หญิง</option>
            <option value="อื่น ๆ">อื่น ๆ</option>
            </select>
            <label htmlFor="gender">เพศ</label>
        </div>

        <div className={styles.formGroup}>
            <input
            id="nationality"
            name="nationality"
            value={form.nationality}
            onChange={handleChange}
            placeholder=" "
            required
            />
            <label htmlFor="nationality">สัญชาติ</label>
        </div>

        <div className={styles.formGroup}>
            <input
            id="phone_number"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            placeholder=" "
            required
            />
            <label htmlFor="phone_number">เบอร์โทร</label>
        </div>

        <div className={styles.formGroup}>
            <input
            id="weight"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            placeholder=" "
            required
            />
            <label htmlFor="weight">น้ำหนัก</label>
        </div>

        <div className={styles.formGroup}>
            <input
            id="height"
            name="height"
            value={form.height}
            onChange={handleChange}
            placeholder=" "
            required
            />
            <label htmlFor="height">ส่วนสูง</label>
        </div>

        <div className={styles.formGroup}>
            <select
            id="patients_type"
            name="patients_type"
            value={form.patients_type}
            onChange={handleChange}
            required
            >
            <option value="">-- เลือกประเภทการช่วยเหลือตนเอง --</option>
            <option value="ช่วยเหลือตัวเองได้">ช่วยเหลือตัวเองได้</option>
            <option value="ต้องการช่วยเหลือบางส่วน">ต้องการช่วยเหลือบางส่วน</option>
            <option value="ช่วยเหลือตัวเองไม่ได้เลย">ช่วยเหลือตัวเองไม่ได้เลย</option>
            </select>
            <label htmlFor="patients_type">ประเภทการช่วยเหลือตนเอง</label>
        </div>

        <div className={styles.formGroup}>
            <input
            id="blood_group"
            name="blood_group"
            value={form.blood_group}
            onChange={handleChange}
            placeholder=" "
            required
            />
            <label htmlFor="blood_group">กรุ๊ปเลือด</label>
        </div>

        <div className={styles.formGroup}>
            <input
            id="disease"
            name="disease"
            value={form.disease}
            onChange={handleChange}
            placeholder=" "
            required
            />
            <label htmlFor="disease">โรคประจำตัว</label>
        </div>

        <div className={styles.formGroup}>
            <input
            id="admittion_date"
            name="admittion_date"
            type="date"
            value={form.admittion_date}
            onChange={handleChange}
            placeholder=" "
            required
            />
            <label htmlFor="admittion_date">วันที่เข้ารับการรักษา</label>
        </div>

        </div>

        <div className={styles.formGroup}>
        <textarea
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder=" "
            required
        />
        <label htmlFor="address">ที่อยู่</label>
        </div>

      <div className={styles.modalButtons}>
        <button onClick={onClose}>ยกเลิก</button>
        <button onClick={handleSubmit} className={styles.confirmButton}>บันทึกข้อมูล</button>
      </div>
    </div>
  </div>
);
};

function calculateAgeFromBirthdate(birthdate) {
  if (!birthdate) return '';
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age.toString();
}

export default AddPatientModal;
