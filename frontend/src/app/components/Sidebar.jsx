import Link from 'next/link';
import styles from './Sidebar.module.css';

export default function Sidebar(){
    return (
        <aside className={styles.sidebar}> {/* ใช้ className จาก styles */}
          <div className={styles.userInfo}> {/* ใช้ className จาก styles */}
            <img src="https://shorturl.asia/HNWZz" alt="User Profile" className={styles.userImg} /> {/* ใช้ className จาก styles */}
            <div className={styles.userDetails}> {/* ใช้ className จาก styles */}
              <p className={styles.userName}> {/*userData.name*/} </p> {/* ใช้ className จาก styles */}
              <p className={styles.userPosition}> {/*userData.role*/} </p> {/* ใช้ className จาก styles */}
            </div>
          </div>
    
          <hr className={styles.divider} /> {/* ใช้ className จาก styles */}
    
          <nav>
            <ul className={styles.navLinks}> {/* ใช้ className จาก styles */}
              <li className={styles.sidebarItem}> {/* ใช้ sidebarItem สำหรับเมนู */}
                <span className={styles.sidebarIcon}>🏠</span> {/* ใช้ sidebarIcon สำหรับไอคอน */}
                <span className={styles.sidebarText}><Link href="/">หน้าแรก</Link></span> {/* ใช้ sidebarText สำหรับข้อความ */}
              </li>
              <li className={styles.sidebarItem}>
                <span className={styles.sidebarIcon}>📝</span>
                <span className={styles.sidebarText}><Link href="/patients">รายชื่อผู้ป่วย</Link></span>
              </li>
              <li className={styles.sidebarItem}>
                <span className={styles.sidebarIcon}>💉</span>
                <span className={styles.sidebarText}><Link href="/treatment">ข้อมูลการรักษา</Link></span>
              </li>
              <li className={styles.sidebarItem}>
                <span className={styles.sidebarIcon}>📅</span>
                <span className={styles.sidebarText}><Link href="/appointment">การนัดหมาย</Link></span>
              </li>
              <li className={styles.sidebarItem}>
                <span className={styles.sidebarIcon}>💀</span>
                <span className={styles.sidebarText}><Link href="/death">ข้อมูลการเสียชีวิต</Link></span>
              </li>
              <li className={styles.sidebarItem}>
                <span className={styles.sidebarIcon}>📊</span>
                <span className={styles.sidebarText}><Link href="/report">ออกรายงาน</Link></span>
              </li>
            </ul>
          </nav>
        </aside>
      );
}