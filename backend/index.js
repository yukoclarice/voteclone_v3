import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Express + MySQL Boilerplate Running!' });
});

// Test MySQL connection route
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({ dbTest: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all candidates with positions and provinces
app.get('/api/candidates', async (req, res) => {
  try {
    // First check if the database tables exist
    const [tables] = await pool.query('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    
    console.log('Available tables:', tableNames);
    
    // Check if candidates table exists
    if (!tableNames.includes('tbl_candidates')) {
      return res.status(404).json({ 
        success: false,
        message: 'Candidates table not found',
        availableTables: tableNames
      });
    }
    
    // First, let's check the structure of the tables to understand the column names
    const [candidateColumns] = await pool.query('DESCRIBE tbl_candidates');
    console.log('Candidate columns:', candidateColumns.map(col => col.Field));
    
    if (tableNames.includes('tbl_positions')) {
      const [positionColumns] = await pool.query('DESCRIBE tbl_positions');
      console.log('Position columns:', positionColumns.map(col => col.Field));
    }
    
    if (tableNames.includes('tbl_provinces')) {
      const [provinceColumns] = await pool.query('DESCRIBE tbl_provinces');
      console.log('Province columns:', provinceColumns.map(col => col.Field));
    }
    
    // Start with a basic query
    let query = 'SELECT c.* FROM tbl_candidates c';
    
    // Conditionally add joins
    if (tableNames.includes('tbl_positions')) {
      query += ' LEFT JOIN tbl_positions p ON c.position_id = p.id';
    }
    
    if (tableNames.includes('tbl_provinces')) {
      query += ' LEFT JOIN tbl_provinces pr ON c.province_code = pr.code';
    }
    
    // Add the SELECT columns for joins
    if (tableNames.includes('tbl_positions') || tableNames.includes('tbl_provinces')) {
      query = query.replace('SELECT c.*', 'SELECT c.*');
      
      if (tableNames.includes('tbl_positions')) {
        query = query.replace('SELECT c.*', 'SELECT c.*, p.name AS position_name');
      }
      
      if (tableNames.includes('tbl_provinces')) {
        if (query.includes('position_name')) {
          query = query.replace('position_name', 'position_name, pr.name AS province_name, pr.region_code');
        } else {
          query = query.replace('SELECT c.*', 'SELECT c.*, pr.name AS province_name, pr.region_code');
        }
      }
    }
    
    console.log('Executing query:', query);
    const [candidates] = await pool.query(query);
    
    // Format response to match the expected format in the frontend
    const formattedCandidates = candidates.map(candidate => {
      const formattedCandidate = {
        id: candidate.id,
        name: candidate.name,
        party: candidate.party || null,
        ballotNo: candidate.ballot_no,
        picture: candidate.picture || null,
      };
      
      // Add position data if available
      if (tableNames.includes('tbl_positions') && candidate.position_name) {
        formattedCandidate.positionId = candidate.position_id;
        formattedCandidate.position = { 
          id: candidate.position_id,
          name: candidate.position_name 
        };
      }
      
      // Add province data if available
      if (tableNames.includes('tbl_provinces') && candidate.province_name) {
        formattedCandidate.provinceCode = candidate.province_code;
        formattedCandidate.province = {
          code: candidate.province_code,
          name: candidate.province_name,
          region_code: candidate.region_code
        };
      }
      
      return formattedCandidate;
    });
    
    res.json({
      success: true,
      count: candidates.length,
      data: formattedCandidates
    });
  } catch (err) {
    console.error('Error fetching candidates:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching candidates',
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
