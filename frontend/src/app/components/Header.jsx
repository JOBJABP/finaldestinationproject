import Link from 'next/link';
import styles from './Header.module.css';

export default function Header(){
    return(
        <header className={styles.header}> 
            <h1 className={styles.headerTitle}>ชีวาภิบาล</h1> 
            <div className={styles.header_button}>
                <button className={styles.icon} title='การตั้งค่า'><Link href="/setting"></Link>⚙️</button>
                <button className={styles.icon} title='การแจ้งเตือน'><Link href="/notification"></Link>🔔</button>
            </div>   
        </header>
    )
}