const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ajithvictus@rmkec',
  database: 'mydatabase' // Make sure the database 'mydatabase' exists
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// API route to insert data (Add Client)
app.post('/add-client', (req, res) => {
  const { Name, ContactNumber, Email, Address } = req.body;

  // Validate required fields
  if (!Name || !ContactNumber || !Email || !Address) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const insertQuery = `
    INSERT INTO Clients (Name, ContactNumber, Email, Address)
    VALUES (?, ?, ?, ?)
  `;
  db.query(insertQuery, [Name, ContactNumber, Email, Address], (err, result) => {
    if (err) {
      console.error('Failed to insert data:', err);
      return res.status(500).json({ message: 'Error adding client', error: err.message });
    }
    res.status(201).json({ message: 'Client added successfully', clientId: result.insertId });
  });
});

// API route to get all clients
app.get('/clients', (req, res) => {
  const selectQuery = 'SELECT ClientID, Name, ContactNumber, Email, Address FROM Clients';
  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Failed to fetch clients:', err);
      return res.status(500).json({ message: 'Error retrieving clients', error: err.message });
    }
    res.json(results);
  });
});

// API route to update a client
app.put('/clients/:id', (req, res) => {
  const { id } = req.params;
  const { Name, ContactNumber, Email, Address } = req.body;

  // Validate required fields
  if (!Name || !ContactNumber || !Email || !Address) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const query = 'UPDATE Clients SET Name = ?, ContactNumber = ?, Email = ?, Address = ? WHERE ClientID = ?';
  db.query(query, [Name, ContactNumber, Email, Address, id], (err, result) => {
    if (err) {
      console.error('Error updating client:', err);
      return res.status(500).json({ error: 'Error updating client', details: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ message: 'Client updated successfully' });
  });
});

// API route to delete a client
app.delete('/clients/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Clients WHERE ClientID = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting client:', err);
      return res.status(500).json({ error: 'Error deleting client', details: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ message: 'Client deleted successfully' });
  });
});

// API route to add a new material
app.post('/add-material', (req, res) => {
  const { Name, UnitPrice, StockQuantity } = req.body;

  // Validate required fields
  if (!Name || !UnitPrice || !StockQuantity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Query to insert data into the 'materials' table
  const query = `
    INSERT INTO materials (Name, UnitPrice, StockQuantity)
    VALUES (?, ?, ?)
  `;

  db.query(query, [Name, UnitPrice, StockQuantity], (err, result) => {
    if (err) {
      console.error('Error inserting material:', err.message);
      return res.status(500).json({ message: 'Failed to add material', error: err.message });
    }
    res.status(201).json({ message: 'Material added successfully', materialId: result.insertId });
  });
});

// Display all materials
app.get('/materials', (req, res) => {
  const selectQuery = 'SELECT * FROM materials';
  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Failed to fetch materials:', err);
      return res.status(500).json({ message: 'Error retrieving materials', error: err.message });
    }
    res.json(results);
  });
});

// Edit a material by MaterialID
app.put('/materials/:id', (req, res) => {
  const { id } = req.params;
  const { Name, UnitPrice, StockQuantity } = req.body;

  // Validation: Check if required fields are provided
  if (!Name || !UnitPrice || StockQuantity === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const updateQuery = `
    UPDATE materials
    SET Name = ?, UnitPrice = ?, StockQuantity = ?
    WHERE MaterialID = ?
  `;

  db.query(updateQuery, [Name, UnitPrice, StockQuantity, id], (err, result) => {
    if (err) {
      console.error('Error updating material:', err);
      return res.status(500).json({ error: 'Error updating material' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.json({ message: 'Material updated successfully' });
  });
});

// Delete a material by MaterialID
app.delete('/materials/:id', (req, res) => {
  const { id } = req.params;

  const deleteQuery = 'DELETE FROM materials WHERE MaterialID = ?';

  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('Error deleting material:', err);
      return res.status(500).json({ error: 'Error deleting material' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.json({ message: 'Material deleted successfully' });
  });
});

app.post('/projects', (req, res) => {
  const { Name, StartDate, EndDate, ClientID, Budget, Status, Address, AmountPaid } = req.body;

  // Validation: Check if all required fields are provided
  if (!Name || !StartDate || !EndDate || !ClientID || !Budget || !Status || !Address || !AmountPaid) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const insertQuery = `
    INSERT INTO projects (Name, StartDate, EndDate, ClientID, Budget, Status, Address, AmountPaid)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(insertQuery, [Name, StartDate, EndDate, ClientID, Budget, Status, Address, AmountPaid], (err, result) => {
    if (err) {
      console.error('Error inserting project:', err);
      return res.status(500).json({ error: 'Error inserting project' });
    }
    res.status(201).json({ message: 'Project added successfully', projectID: result.insertId });
  });
});

// Get all projects
app.get('/projects', (req, res) => {
  const query = 'SELECT * FROM projects';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching projects:', err);
      return res.status(500).json({ error: 'Error fetching projects' });
    }
    res.status(200).json(result); // Sends all project details including Address and AmountPaid
  });
});

// Update a project
app.put('/projects/:id', (req, res) => {
  const projectId = req.params.id;
  const { Name, StartDate, EndDate, ClientID, Budget, Status, Address, AmountPaid } = req.body;

  // Update the project, including the new fields Address and AmountPaid
  const query = 'UPDATE projects SET Name = ?, StartDate = ?, EndDate = ?, ClientID = ?, Budget = ?, Status = ?, Address = ?, AmountPaid = ? WHERE ProjectID = ?';
  db.query(query, [Name, StartDate, EndDate, ClientID, Budget, Status, Address, AmountPaid, projectId], (err, result) => {
    if (err) {
      console.error('Error updating project:', err);
      return res.status(500).json({ error: 'Error updating project' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ message: 'Project updated successfully' });
  });
});



// Delete a project
app.delete('/projects/:id', (req, res) => {
  const projectId = req.params.id;

  const query = 'DELETE FROM projects WHERE ProjectID = ?';
  db.query(query, [projectId], (err, result) => {
    if (err) {
      console.error('Error deleting project:', err);
      return res.status(500).json({ error: 'Error deleting project' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  });
});

//add-contractor 
app.post("/add-contractor", (req, res) => {
  const { Name, ContactNumber, Email, Specialization } = req.body;

  // Validate required fields
  if (!Name || !ContactNumber || !Email || !Specialization) {
    return res.status(400).send({ message: "All fields are required." });
  }

  // SQL query to insert contractor details into the database
  const sql = "INSERT INTO contractors (Name, ContactNumber, Email, Specialization) VALUES (?, ?, ?, ?)";
  db.query(sql, [Name, ContactNumber, Email, Specialization], (err, result) => {
    if (err) {
      console.error("Error adding contractor:", err.message);
      return res.status(500).send({ message: "Failed to add contractor." });
    }
    res.status(201).send({ message: "Contractor added successfully", id: result.insertId });
  });
});

// Display all contractors
app.get('/contractors', (req, res) => {
  const query = 'SELECT * FROM contractors';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving contractors');
      return;
    }
    res.json(results);
  });
});

// Display a single contractor by ID
app.get('/contractor/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM contractors WHERE ContractorID = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving contractor');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Contractor not found');
      return;
    }
    res.json(results[0]);
  });
});

// Edit contractor details
app.put('/contractor/:id', (req, res) => {
  const { id } = req.params;
  const { Name, ContactNumber, Email, Specialization } = req.body;

  const query = 'UPDATE contractors SET Name = ?, ContactNumber = ?, Email = ?, Specialization = ? WHERE ContractorID = ?';
  db.query(query, [Name, ContactNumber, Email, Specialization, id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating contractor');
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send('Contractor not found');
      return;
    }
    res.send('Contractor updated successfully');
  });
});

// Delete contractor
app.delete('/contractor/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM contractors WHERE ContractorID = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting contractor');
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send('Contractor not found');
      return;
    }
    res.send('Contractor deleted successfully');
  });
});

// Endpoint to Add Payment
app.post("/add-payment", (req, res) => {
  const { contractorId, amount, paymentDate, projectId } = req.body;

  // Validate required fields
  if (!contractorId || !paymentDate) {
    return res.status(400).send({ message: "ContractorID and PaymentDate are required." });
  }

  // SQL query to insert payment with ProjectID as foreign key (can be null)
  const sql = "INSERT INTO contractor_payments (ContractorID, Amount, PaymentDate, ProjectID) VALUES (?, ?, ?, ?)";

  db.query(sql, [contractorId, amount, paymentDate, projectId || null], (err, result) => {
    if (err) {
      console.error("Error adding payment:", err.message);
      return res.status(500).send({ message: "Failed to add payment." });
    }
    res.status(201).send({ message: "Payment added successfully", paymentId: result.insertId });
  });
});


// Get all payments
app.get('/payments', (req, res) => {
  db.query('SELECT * FROM contractor_payments', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Edit payment
app.put('/payments/:id', (req, res) => {
  const { id } = req.params;
  const { ContractorID, Amount, PaymentDate, ProjectID } = req.body;
  db.query(
    'UPDATE contractor_payments SET ContractorID = ?, Amount = ?, PaymentDate = ?, ProjectID = ? WHERE PaymentID = ?',
    [ContractorID, Amount, PaymentDate, ProjectID, id],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json({ message: 'Payment updated successfully' });
    }
  );
});

// Delete payment
app.delete('/payments/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM contractor_payments WHERE PaymentID = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: 'Payment deleted successfully' });
  });
});




//contractor payment detail
// API endpoint to get contractor payment details
app.get('/payments-contractor', (req, res) => {
  const query = `
    SELECT 
      cp.PaymentID,
      cp.ContractorID,
      c.Name AS ContractorName,
      cp.Amount,
      cp.PaymentDate,
      cp.ProjectID
    FROM 
      contractor_payments cp
    JOIN 
      contractors c ON cp.ContractorID = c.ContractorID;
  `;

  // Execute the query
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Send the results as JSON response
    res.json(results);
  });
});


// API endpoint to fetch client and project details
app.get('/client-projects', (req, res) => {
  const query = `
    SELECT 
      c.ClientID, 
      c.Name AS ClientName, 
      c.ContactNumber, 
      c.Email, 
      c.Address AS ClientAddress,
      p.ProjectID, 
      p.Name AS ProjectName, 
      p.StartDate, 
      p.EndDate, 
      p.Budget, 
      p.Status, 
      p.Address AS ProjectAddress, 
      p.AmountPaid
    FROM clients c
    LEFT JOIN projects p ON c.ClientID = p.ClientID;
  `;

  // Execute the query
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Send the results as JSON response
    res.json(results);
  });
});




// API route to fetch dashboard statistics
app.get('/dashboard', (req, res) => {
  const queries = {
    totalClients: 'SELECT COUNT(*) AS count FROM clients',
    ongoingProjects: 'SELECT COUNT(*) AS count FROM projects WHERE Status = "In Progress"',
    materialsInStock: 'SELECT SUM(StockQuantity) AS totalStock FROM materials',
    totalProjectValue: 'SELECT SUM(Budget) AS totalBudget FROM projects',
    totalPaymentsReceived: 'SELECT SUM(AmountPaid) AS totalPayments FROM projects',
  };

  const results = {};

  let completedQueries = 0;

  // Query all statistics
  Object.keys(queries).forEach((key) => {
    db.query(queries[key], (err, resultsData) => {
      if (err) {
        console.error(`Error fetching ${key}: `, err);
        return;
      }
      results[key] = resultsData[0].count || resultsData[0].totalStock || resultsData[0].totalBudget || resultsData[0].totalPayments;

      completedQueries++;

      // Once all queries have been completed, send the response
      if (completedQueries === Object.keys(queries).length) {
        res.json(results);
      }
    });
  });
});


//pie chart
// Total Clients, Contractors, Projects, and Materials
app.get('/api/summary', (req, res) => {
  const query = `
    SELECT 
      (SELECT COUNT(*) FROM clients) AS totalClients,
      (SELECT COUNT(*) FROM contractors) AS totalContractors,
      (SELECT COUNT(*) FROM projects) AS totalProjects,
      (SELECT COUNT(*) FROM materials) AS totalMaterials
  `;
  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result[0]);
  });
});

// Projects by Status
app.get('/api/projects/status', (req, res) => {
  const query = `
    SELECT Status, COUNT(*) AS count
    FROM projects
    GROUP BY Status
  `;
  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// Payments Overview
app.get('/api/payments/overview', (req, res) => {
  const query = `
    SELECT 
      MONTH(PaymentDate) AS month, 
      SUM(Amount) AS total
    FROM contractor_payments
    GROUP BY MONTH(PaymentDate)
    ORDER BY MONTH(PaymentDate)
  `;
  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// Budget vs Amount Paid
app.get('/api/projects/budget', (req, res) => {
  const query = `
    SELECT Name, Budget, AmountPaid 
    FROM projects
  `;
  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});




// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
