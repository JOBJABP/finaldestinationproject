import React from "react";
import LayoutWrapper from "./components/LayoutWrapper";
import "./globals.css";

export const metadata = {
  title: 'ระบบจัดการข้อมูลผู้ป่วย',
  description: 'ระบบจัดการข้อมูลผู้ป่วยสำหรับแพทย์และพยาบาล',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" 
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5KwQ/AqjM/QERbwP6KkSxf/tf5JNEkXjQd4xM8z/w1W+FVYJ2pDw==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
      </head>
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}