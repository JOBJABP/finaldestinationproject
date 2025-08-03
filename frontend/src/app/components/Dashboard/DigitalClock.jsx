'use client';

import React, { useEffect, useState } from 'react';
import styles from './DigitalClock.module.css';

const DAILY_SCHEDULE = [
  { start: '07:30', end: '08:00', activity: 'ตื่นนอน (เปลี่ยนผ้าปูที่นอน, เปลี่ยนเสื้อผ้า, เปลี่ยนแพมเพิส)' },
  { start: '08:00', end: '08:30', activity: 'รับประทานข้าวเช้า' },
  { start: '08:30', end: '09:30', activity: 'จันทร์-พฤหัส: แปรงฟัน, ศุกร์: อาบน้ำ, เสาร์-อาทิตย์: แปรงฟัน' },
  { start: '09:30', end: '10:00', activity: 'ทำแผล' },
  { start: '10:00', end: '11:00', activity: 'ปล่อยคนไข้นอนตามอัธยาศัย' },
  { start: '11:00', end: '11:30', activity: 'เตรียมผู้ป่วยกินข้าว' },
  { start: '11:30', end: '12:00', activity: 'รับประทานข้าวเที่ยง' },
  { start: '12:00', end: '13:00', activity: 'ทำกิจกรรม (วาดภาพระบายสี, เย็บปักทักร้อย, และอื่นๆ)' },
  { start: '13:00', end: '14:00', activity: 'ทำกิจกรรมร้องรำฮัมเพลง' },
  { start: '14:00', end: '15:00', activity: 'ทำกายภาพ' },
  { start: '15:00', end: '16:00', activity: 'เตรียมผู้ป่วยรับประทานข้าวเย็น' },
  { start: '16:00', end: '23:59', activity: 'ตามอัธยาศัย' },
];

const getCurrentActivity = (currentTime) => {
  const [currentHour, currentMinute] = currentTime.split(':').map(Number);
  const nowInMinutes = currentHour * 60 + currentMinute;

  for (const schedule of DAILY_SCHEDULE) {
    const [startHour, startMinute] = schedule.start.split(':').map(Number);
    const [endHour, endMinute] = schedule.end.split(':').map(Number);

    const startInMinutes = startHour * 60 + startMinute;
    const endInMinutes = endHour * 60 + endMinute;

    if (nowInMinutes >= startInMinutes && nowInMinutes < endInMinutes) {
      return schedule.activity;
    }
  }


  return 'ไม่มีกิจกรรมที่กำหนด';
};

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('th-TH', { hour12: false, hour: '2-digit', minute: '2-digit' });
  const timeParts = formattedTime.split(':');
  const formattedDate = time.toLocaleDateString('th-TH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const currentActivity = getCurrentActivity(formattedTime);

  return (
    <div className={styles.clockCard}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>เวลาปัจจุบันในขณะนี้</h2>
      </div>
      <div className={styles.cardContent}>
        <p className={styles.clockDate}>วันที่ {formattedDate}</p>
        
        <div className={styles.clockDisplay}>
          <p className={styles.currentActivity}>{currentActivity}</p>
          
          <div className={styles.digitalClock}>
            <div className={styles.clockDigit}>{timeParts[0][0]}</div>
            <div className={styles.clockDigit}>{timeParts[0][1]}</div>
            <div className={styles.clockSeparator}>:</div>
            <div className={styles.clockDigit}>{timeParts[1][0]}</div>
            <div className={styles.clockDigit}>{timeParts[1][1]}</div>
            <span className={styles.clockUnit}>น.</span>
          </div>
        </div>
      </div>
    </div>
  );
}