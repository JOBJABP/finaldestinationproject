
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiUsers, // สำหรับ รายชื่อผู้ป่วย
  FiActivity, // สำหรับ ข้อมูลการรักษา
  FiCalendar, // สำหรับ การนัดหมาย
  FiXOctagon, // สำหรับ ข้อมูลการเสียชีวิต
  FiFileText, // สำหรับ ออกรายงาน
  FiChevronDown,
  FiChevronUp,
  FiUser
} from 'react-icons/fi';
import styles from './Sidebar.module.css';


const MENU_ITEMS = [
  { label: 'หน้าแรก', icon: <FiHome />, path: '/', id: 'home' },
  { label: 'รายชื่อผู้ป่วย', icon: <FiUsers />, path: '/patients', id: 'patients' },
  { label: 'ข้อมูลการรักษา', icon: <FiActivity />, path: '/treatment', id: 'treatment' },
  { label: 'การนัดหมาย', icon: <FiCalendar />, path: '/appointment', id: 'appointment' },
  { label: 'ข้อมูลการเสียชีวิต', icon: <FiXOctagon />, path: '/death', id: 'death' }, 
  { label: 'ออกรายงาน', icon: <FiFileText />, path: '/reports', id: 'reports' }
];

const DEFAULT_USER_DATA = {
  name: 'ชื่อผู้ใช้',
  role: 'ตำแหน่ง',
  avatar: '/images/default-avatar.png',
};

export default function Sidebar({ userData, isExpanded, currentSidebarWidth }) {
  const pathname = usePathname();
  const user = userData || DEFAULT_USER_DATA;
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const handleSubmenuToggle = (id) => {
    setOpenSubmenu(openSubmenu === id ? null : id);
  };

  return (
    <aside
      className={`${styles.sidebar} ${isExpanded ? styles.expanded : styles.collapsed}`}
      style={{ width: currentSidebarWidth }}
    >
      <div className={styles.userProfile}>
        <div className={styles.avatar}>
          <Image 
            src={user.avatar} 
            alt={user.name}
            width={isExpanded ? 50 : 36}
            height={isExpanded ? 50 : 36}
            className={styles.userAvatar}
          />
        </div>
        {isExpanded && (
          <div className={styles.userInfo}>
            <h3 className={styles.userName}>{user.name}</h3>
            <p className={styles.userRole}>{user.role}</p>
          </div>
        )}
      </div>

      <nav className={styles.navigation}>
        <ul className={styles.menuList}>
          {MENU_ITEMS.map((item) => (
            <React.Fragment key={item.id}>

              {item.submenu ? (

                <li className={`${styles.menuItem}`}>
                  <button 
                    className={`${styles.menuLink} ${pathname.startsWith(item.path) ? styles.active : ''}`}
                    onClick={() => handleSubmenuToggle(item.id)}
                    title={!isExpanded ? item.label : ''}
                  >
                    <span className={styles.menuIcon}>{item.icon}</span>
                    {isExpanded && <span className={styles.menuLabel}>{item.label}</span>}
                    {isExpanded && (
                      <span className={styles.submenuToggleIcon}>
                        {openSubmenu === item.id ? <FiChevronUp /> : <FiChevronDown />}
                      </span>
                    )}
                  </button>
                </li>
              ) : (

                <li key={item.id} className={styles.menuItem}>
                  <Link 
                    href={item.path} 
                    className={`${styles.menuLink} ${pathname === item.path ? styles.active : ''}`}
                    title={!isExpanded ? item.label : ''}
                  >
                    <span className={styles.menuIcon}>{item.icon}</span>
                    {isExpanded && <span className={styles.menuLabel}>{item.label}</span>}
                  </Link>
                </li>
              )}

              {item.submenu && openSubmenu === item.id && (
                <ul className={styles.submenuList}>
                  {item.submenu.map(subItem => (
                    <li key={subItem.path} className={styles.submenuItem}>
                      <Link 
                        href={subItem.path}
                        className={`${styles.submenuLink} ${pathname === subItem.path ? styles.active : ''}`}
                      >
                        <span className={styles.submenuLabel}>{subItem.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </React.Fragment>
          ))}
        </ul>
      </nav>
    </aside>
  );
}