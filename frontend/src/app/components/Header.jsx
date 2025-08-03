
'use client';

import React from 'react';
import { FiMenu } from 'react-icons/fi';
import styles from './Header.module.css';
import logo from '../../../../../LOGO.jpg';

export default function Header({ toggleSidebar }) {
  return (
    <header className={styles.header}>
      <button
        className={styles.burgerButton}
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <FiMenu size={24} />
      </button>
      <div className={styles.headerBrand}>
        <img 
          src={logo.src} 
          alt="โรงพยาบาลวัดห้วยปลากั้งเพื่อสังคม" 
          className={styles.brandLogo} 
        />
        <span className={styles.brandText}>ระบบบริหารจัดการแผนกชีวาภิบาล</span>
      </div>
      <div className={styles.headerRight}>

      </div>
    </header>
  );
}