// app/page.js
'use client';

import React from 'react';
import styles from './home.module.css';
import DigitalClock from './components/Dashboard/DigitalClock';

export default function HomePage() {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.gridContainer}>
        {/* แถวบน: 2 บล็อก */}
        <div className={styles.gridRow}>
          {/* บล็อกที่ 1: นัดหมายประจำวัน */}
          <div className={styles.gridItem}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>นัดหมายประจำวัน</h2>
              </div>
              <div className={styles.cardContent}>
                {/* เนื้อหาของบล็อกจะถูกเพิ่มในภายหลัง */}
              </div>
            </div>
          </div>
          {/* บล็อกที่ 2: จำนวนผู้ป่วยในแต่ละแผนก */}
          <div className={styles.gridItem}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>จำนวนผู้ป่วยในแต่ละแผนก</h2>
              </div>
              <div className={styles.cardContent}>
                {/* เนื้อหาของบล็อกจะถูกเพิ่มในภายหลัง */}
              </div>
            </div>
          </div>
        </div>
        
        {/* แถวล่าง: 1 บล็อกเต็ม */}
        <div className={styles.gridRow}>
          {/* บล็อกที่ 3: เวลาปัจจุบันในขณะนี้ */}
          <div className={`${styles.gridItem} ${styles.fullWidth}`}>
            <div className={styles.card}>
              <DigitalClock />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}