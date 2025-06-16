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

/*=================PATIENTS=====================================*/
/*=================PATIENTS=====================================*/
/*=================PATIENTS=====================================*/

/*--------------GET------------------------------------------------------------------------------------*/

app.get('/api/patients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients');
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
      disease,
      age,
    } = req.body;

    const status = 'มีชีวิต';

    const result = await pool.query(
      `INSERT INTO patients (
        first_name, last_name, card_id, gender, address, birthdate, nationality,
        patients_type, blood_group, phone_number, height, weight, status,
        admittion_date, disease, age
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13,
        $14, $15, $16
      )
      RETURNING *`,
      [
        first_name, last_name, card_id, gender, address, birthdate, nationality,
        patients_type, blood_group, phone_number, height, weight, status,
        admittion_date, disease, age
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

/*=================TREATMENT=====================================*/
/*=================TREATMENT=====================================*/
/*=================TREATMENT=====================================*/

/*--------------GET---------------------------------------------------*/

app.get('/api/treatment', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM treatment t
      JOIN patients p ON t.patients_id = p.patients_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ดึงข้อมูลไม่สำเร็จ' });
  }
});

app.get('/api/treatment/:id', async (req, res) => {
  const treatmentId = parseInt(req.params.id, 10);
  if (isNaN(treatmentId)) {
    return res.status(400).json({ message: 'รหัสการรักษาไม่ถูกต้อง' });
  }

  try {
    const result = await pool.query(
      `SELECT t.*, 
              p.first_name, p.last_name, p.gender, p.birthdate, 
              p.patients_type, p.blood_group,
              p.height, p.weight, p.status,
              p.disease
       FROM treatment t
       JOIN patients p ON t.patients_id = p.patients_id
       WHERE t.treatment_id = $1`,
      [treatmentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลการรักษา' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์' });
  }
});

/*--------------POST---------------------------------------------------*/

app.post('/api/treatment', async (req, res) => {
  const { patients_id, description, treatment_date, treatment_type } = req.body;

  if (!patients_id || !description || !treatment_date || !treatment_type) {
    return res.status(400).json({ error: 'ข้อมูลไม่ครบถ้วน' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // เริ่ม transaction

    // 1. insert ข้อมูล treatment
    const insertTreatmentQuery = `
      INSERT INTO treatment (patients_id, description, treatment_date, treatment_type)
      VALUES ($1, $2, $3, $4)
      RETURNING treatment_id;
    `;

    const insertResult = await client.query(insertTreatmentQuery, [patients_id, description, treatment_date, treatment_type]);
    const newTreatmentId = insertResult.rows[0].treatment_id;

    // 2. update treatment_id ใน patients
    const updatePatientQuery = `
      UPDATE patients
      SET treatment_id = $1
      WHERE patients_id = $2;
    `;

    await client.query(updatePatientQuery, [newTreatmentId, patients_id]);

    await client.query('COMMIT'); // commit transaction

    res.status(201).json({ message: 'บันทึกการรักษาและอัพเดตผู้ป่วยสำเร็จ', treatment_id: newTreatmentId });
  } catch (error) {
    await client.query('ROLLBACK'); // rollback กรณี error
    console.error('Error processing treatment:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
  } finally {
    client.release();
  }
});

/*--------------DELETE---------------------------------------------------*/

app.delete('/api/treatment/:id', async (req, res) => {
  const treatmentId = req.params.id;
  try {
    const result = await pool.query(
      'DELETE FROM treatment WHERE treatment_id = $1',
      [treatmentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลการรักษานี้' });
    }

    res.json({ message: 'ลบข้อมูลการรักษาเรียบร้อยแล้ว' });
  } catch (error) {
    console.error('Error deleting treatment:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
  }
});

/*=================APPOINTMENT=====================================*/
/*=================APPOINTMENT=====================================*/
/*=================APPOINTMENT=====================================*/

/*--------------GET---------------------------------------------------*/

app.get('/api/appointments', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.*, 
        p.first_name, 
        p.last_name 
      FROM appointment a
      JOIN patients p ON a.patients_id = p.patients_id
      ORDER BY a.appointment_date, a.appointment_time
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/appointments/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(`
      SELECT a.*, p.first_name, p.last_name
      FROM appointment a
      JOIN patients p ON a.patients_id = p.patients_id
      WHERE a.patients_id = $1
      ORDER BY a.appointment_date, a.appointment_time
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'ไม่พบนัดหมายของผู้ป่วยนี้' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching appointments by patient id:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



/*--------------POST---------------------------------------------------*/

app.post('/api/appointments', async (req, res) => {
  const {
    appointment_date,
    appointment_time,
    hospital_address,
    department,
    description,
    patients_id,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO appointment (
        appointment_date,
        appointment_time,
        hospital_address,
        department,
        description,
        patients_id
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        appointment_date,
        appointment_time,
        hospital_address,
        department,
        description,
        patients_id
      ]
    );

    res.status(201).json({ message: 'Appointment created successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*--------------PUT---------------------------------------------------*/

app.put('/api/appointments/:id', async (req, res) => {
  const { id } = req.params;
  const { patients_id, appointment_date, appointment_time, hospital_address, department, description } = req.body;

  try {
    const result = await pool.query(
      `UPDATE appointment
       SET patients_id = $1,
           appointment_date = $2,
           appointment_time = $3,
           hospital_address = $4,
           department = $5,
           description = $6
       WHERE appointment_id = $7`,
      [patients_id, appointment_date, appointment_time, hospital_address, department, description, id]
    );

    res.status(200).json({ message: 'Appointment updated successfully' });
  } catch (err) {
    console.error('Error updating appointment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/*--------------DELETE---------------------------------------------------*/

app.delete('/api/appointments/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM appointment WHERE appointment_id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'ไม่พบการนัดหมายที่ต้องการลบ' });
    }

    res.status(200).json({ message: 'ลบการนัดหมายเรียบร้อยแล้ว' });
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการลบการนัดหมาย:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
  }
});

/*=================DEATH_INFORMATION=====================================*/
/*=================DEATH_INFORMATION=====================================*/
/*=================DEATH_INFORMATION=====================================*/

/*--------------GET---------------------------------------------------*/

// GET /api/deaths
app.get('/api/deaths', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM death_information
      ORDER BY death_id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching death list:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' });
  }
});

app.get('/api/deaths/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        d.death_id,
        d.death_date,
        d.death_time,
        d.death_cause,
        d.status,
        d.management,
        p.patients_id,
        p.first_name,
        p.last_name,
        p.card_id,
        p.gender,
        p.birthdate,
        p.nationality,
        p.address,
        p.disease
      FROM death_information d
      JOIN patients p ON d.patients_id = p.patients_id
      WHERE d.death_id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลการเสียชีวิตนี้' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching death detail:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' });
  }
});

/*--------------POST---------------------------------------------------*/

app.post('/api/deaths', async (req, res) => {
  const {
    death_date,
    death_time,
    death_cause,
    management,
    patients_id
  } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. ดึงข้อมูลผู้ป่วยทั้งหมดจาก patients
    const patientRes = await client.query(
      `SELECT
         patients_id,
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
         user_id,
         disease,
         age
       FROM patients
       WHERE patients_id = $1`,
      [patients_id]
    );
    if (patientRes.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'ไม่พบผู้ป่วยในระบบ' });
    }
    const p = patientRes.rows[0];
    console.log('patient data:', p);  // <-- ตรงนี้แสดงข้อมูลผู้ป่วย

    // 2. แทรกลง death_information (snapshot ข้อมูลผู้ป่วย + ข้อมูลการเสียชีวิต)
    const insertResult = await client.query(
      `INSERT INTO death_information (
         death_date,
         death_time,
         death_cause,
         status,
         management,
         patients_id,
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
         user_id,
         disease,
         age
       ) VALUES (
         $1, $2, $3, $4, $5, $6,
         $7, $8, $9, $10, $11, $12,
         $13, $14, $15, $16, $17, $18,
         $19, $20, $21, $22
       )
        RETURNING *`,
      [
        death_date,
        death_time,
        death_cause,
        'เสียชีวิต',      // บังคับสถานะ
        management,
        patients_id,

        // ข้อมูลผู้ป่วย
        p.first_name,
        p.last_name,
        p.card_id,
        p.gender,
        p.address,
        p.birthdate,
        p.nationality,
        p.patients_type,
        p.blood_group,
        p.phone_number,
        p.height,
        p.weight,
        p.admittion_date,
        p.user_id,
        p.disease,
        p.age
      ]
    );

    console.log('insertResult:', insertResult);

    // 3. ลบข้อมูลผู้ป่วยออกจาก patients
    const deleteResult = await client.query(
      'DELETE FROM patients WHERE patients_id = $1',
      [patients_id]
    );

    await client.query('COMMIT');
    res.status(201).json({ message: 'บันทึกข้อมูลการเสียชีวิตสำเร็จ' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in POST /death_information:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดขณะบันทึกข้อมูล' });
  } finally {
    client.release();
  }
  
});

/*--------------PUT---------------------------------------------------*/

app.put('/api/deaths/:id', async (req, res) => {
  const { id } = req.params;
  const {
    death_date,
    death_time,
    death_cause,
    status,
    management,
    patients_id
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE death_information
       SET death_date = $1,
           death_time = $2,
           death_cause = $3,
           status = $4,
           management = $5,
           patients_id = $6
       WHERE death_id = $7`,
      [death_date, death_time, death_cause, status, management, patients_id, id]
    );

    res.json({ message: 'อัปเดตข้อมูลการเสียชีวิตสำเร็จ' });
  } catch (err) {
    console.error('Error updating death info:', err);
    res.status(500).json({ error: 'ไม่สามารถอัปเดตข้อมูลได้' });
  }
});


/*--------------DELETE---------------------------------------------------*/

app.delete('/api/deaths/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM death_information WHERE death_id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลการเสียชีวิตนี้' });
    }

    res.json({ message: 'ลบข้อมูลการเสียชีวิตสำเร็จ' });
  } catch (err) {
    console.error('Error deleting death record:', err);
    res.status(500).json({ error: 'ไม่สามารถลบข้อมูลได้' });
  }
});

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`)
})