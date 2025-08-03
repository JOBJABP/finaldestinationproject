
'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './LayoutWrapper.module.css';


const SIDEBAR_WIDTHS = {
  collapsed: '78px',
  expanded: '250px',
};


const DEFAULT_USER_DATA = {
  name: 'ชื่อผู้ใช้',
  role: 'ตำแหน่ง',
  avatar: '/images/default-avatar.png',
};

export default function LayoutWrapper({ children }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(prev => !prev);
  };

  const currentSidebarWidth = isSidebarExpanded
    ? SIDEBAR_WIDTHS.expanded
    : SIDEBAR_WIDTHS.collapsed;

  return (
    <div className={styles.layoutContainer}>
      <Sidebar 
        userData={DEFAULT_USER_DATA}
        isExpanded={isSidebarExpanded}
        currentSidebarWidth={currentSidebarWidth}
        toggleSidebar={toggleSidebar}
      />
      <div
        className={styles.mainContentArea}
        style={{
          '--sidebar-width': currentSidebarWidth,
        }}
      >
        <Header toggleSidebar={toggleSidebar} />
        <main className={styles.mainSection}>
          {children}
        </main>
      </div>
    </div>
  );
}