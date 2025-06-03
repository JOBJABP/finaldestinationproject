import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <nav className="p-4 bg-gray-100 flex gap-4">
          <Link href="/">หน้าแรก</Link>
          <Link href="/about">เกี่ยวกับ</Link>
          <Link href="/contact">ติดต่อ</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
