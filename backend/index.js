require('dotenv').config(); // โหลดค่าจาก .env

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// เช็กว่า backend ทำงานอยู่
app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.get('/api/message', (req, res) => {
  res.json({ message: 'สวัสดีครับสุดสวยยยย' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
