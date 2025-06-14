import React from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import styles from "./globals.module.css"

export default function Rootlayout({ children }) {
    return (
      <html lang="en" className={styles.page}>
        <body>
          <div className={styles.layout}>
            <div style={{ display: 'flex', height: '100vh' }}> 
              <Sidebar />{/* Sidebar ชิดซ้าย */}
            {/* เนื้อหาฝั่งขวา */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              
                <Header />{/* Header อยู่ตรงกลาง */}
                
                <main className={styles.main} style={{ flex: 1 }}>{children}</main>
                
              </div>
            </div>
          </div>
        </body>
      </html>
    );
  }
  
