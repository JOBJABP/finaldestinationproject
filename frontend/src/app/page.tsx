'use client'

import { useEffect, useState } from 'react'
import Layout from "./layout.js";

export default function Home() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + '/api/message')
      .then(res => res.json())
      .then(data => setMessage(data.message))
  }, [])


  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold">ข้อความ :</h1>
      <p className="text-lg mt-4">{message}</p>
    </main>
  )
}
