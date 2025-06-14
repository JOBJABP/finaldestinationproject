require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

/*--------------GET------------------------------------------------------------------------------------*/

app.get('/api/treatment', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM treatment');
    res.json(result.rows);
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'ดึงข้อมูลไม่สำเร็จ' })
  }
})

app.get('/api/patients/:id', async (req, res) => {
  const patientId = parseInt(req.params.id, 10);
  if (isNaN(patientId)) {
    return res.status(400).json({ message: 'รหัสผู้ป่วยไม่ถูกต้อง' });
  }

  try {
    const patient = await pool.query(
      'SELECT * FROM patients WHERE patients_id = $1',
      [patientId]
    );
    if (patient.rows.length === 0) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ป่วย' });
    }
    res.json(patient.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์' });
  }
});



/*--------------POST------------------------------------------------------------------------------------*/

app.post('/api/patients', async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      card_id,
      gender,
      address,
      birthdate,
      nationality,
      patients_type,
      blood_group,
      phone_number,
      height,
      weight,
      admittion_date,
    } = req.body;

    const status = 'มีชีวิต';

    const result = await pool.query(
      `INSERT INTO patients (
        first_name, last_name, card_id, gender, address, birthdate, nationality,
        patients_type, blood_group, phone_number, height, weight, status,
        admittion_date, disease
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13,
        $14, $15
      )
      RETURNING *`,
      [
        first_name, last_name, card_id, gender, address, birthdate, nationality,
        patients_type, blood_group, phone_number, height, weight, status,
        admittion_date, disease
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'บันทึกข้อมูลไม่สำเร็จ' });
  }
});

/*--------------PUT---------------------------------------------------*/

app.put('/api/patients/:id', async (req, res) => {
  const id = req.params.id;
  const {
    first_name, last_name, card_id, birthdate,
    gender, nationality, phone_number,
    weight, height,
    patients_type, blood_group, disease,
    address, admittion_date
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE patients
       SET first_name = $1,
           last_name = $2,
           card_id = $3,
           birthdate = $4,
           gender = $5,
           nationality = $6,
           phone_number = $7,
           weight = $8,
           height = $9,
           patients_type = $10,
           blood_group = $11,
           disease = $12,
           address = $13,
           admittion_date = $14
       WHERE patients_id = $15  -- ✅ แก้ตรงนี้
       RETURNING *`,
      [
        first_name, last_name, card_id, birthdate,
        gender, nationality, phone_number,
        weight, height,
        patients_type, blood_group, disease,
        address, admittion_date,
        id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'ไม่พบผู้ป่วย' });
    }

    res.status(200).json({ message: 'อัปเดตข้อมูลสำเร็จ', patient: result.rows[0] });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
  }
});



const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`)
})