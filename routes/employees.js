const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

router.post('/', async (req, res) => {
  const { employee_id, full_name, email, hashed_password } = req.body;
  try {
    const newEmployee = new Employee({ employee_id, full_name, email, hashed_password });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
