const express = require('express');
const router = express.Router();
const ProjectAssignment = require('../models/ProjectAssignment');


router.post('/', async (req, res) => {
  const { employee_id, project_code, start_date } = req.body;
  try {
    const newAssignment = new ProjectAssignment({ employee_id, project_code, start_date });
    await newAssignment.save();
    res.status(201).json(newAssignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const assignments = await ProjectAssignment.find();
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
