const express = require("express");
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Nicky123@#$',
    database: 'newcms'
});

app.get('/',  (req, res)=> {
     const sql = "SELECT * FROM student";
     db.query(sql, (err,result)=> {
        if (err) return res.json({Message:"error"});
        return res.json(result);
     })
})

app.post('/student',  (req, res)=> {
    const sql = "INSERT INTO student(name, email) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email
    ]
    db.query(sql,[values], (err,result)=> {
        if (err) return res.json({Message:"error"});
        return res.json(result);
     })
})
//read
app.get('/read/:id',  (req, res)=> {
    const sql = "SELECT * FROM student WHERE id = ?";
    const id = req.params.id;
    db.query(sql,[id], (err,result)=> {
       if (err) return res.json({Message:"error"});
       return res.json(result);
    })
})

app.put('/update/:id', (req, res) => {
    const sql = 'UPDATE student SET `name`=?, `email`=? WHERE id=?';
    const id = req.params.id;
    db.query(sql, [req.body.name, req.body.email, id], (err, result) => {
      if(err) return res.json({Message: "Error inside server"});
      return res.json(result);
    });
  });

  app.delete('/delete/:id', (req, res) => {
    const sql = 'DELETE FROM student WHERE id=?';
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
      if(err) return res.json({Message: "Error inside server"});
      return res.json(result);
    });
  });
  
  app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    // Insert user into database with actual password
    const sql = "INSERT INTO login (name, email, password) VALUES (?, ?, ?)";
    const values = [name, email, password];
    
    db.query(sql, values, (dbErr, result) => {
        if (dbErr) {
            console.error('Error inserting user into database:', dbErr);
            return res.status(500).json({ error: 'Internal server error' });
        }
        console.log('User inserted successfully');
        return res.status(201).json({ message: 'User signed up successfully' });
    });
});


app.post('/login', (req, res) => {
    // Fetch user from database using email
    const sql = "SELECT * FROM login WHERE email=? AND password=?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if(err) { 
            return res.json("error");
        }
        return res.json(data);
    })
})
app.listen(8081, () => {
    console.log("Listening on port 8081");
});