import React, { useState, useEffect } from 'react';
import './ProjectAssignmentsTable.css';

const ProjectAssignmentsTable = () => {
  const [assignments, setAssignments] = useState([]);
  const [employees, setEmployees] = useState({});
  const [projects, setProjects] = useState({});
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const assignmentsResponse = await fetch('/api/assignments');
        if (!assignmentsResponse.ok) {
          throw new Error('Failed to fetch assignments');
        }
        const assignmentsData = await assignmentsResponse.json();
        setAssignments(assignmentsData);

        const uniqueEmployeeIds = Array.from(new Set(assignmentsData.map(assignment => assignment.employee_id)));
        const uniqueProjectIds = Array.from(new Set(assignmentsData.map(assignment => assignment.project_code)));

        const employeesResponse = await fetch(`/api/employees?ids=${uniqueEmployeeIds.join(',')}`);
        if (!employeesResponse.ok) {
          throw new Error('Failed to fetch employees');
        }
        const employeesData = await employeesResponse.json();

        const employeesMap = {};
        employeesData.forEach(employee => {
          employeesMap[employee.employee_id] = employee.full_name;
        });
        setEmployees(employeesMap);

        const projectsResponse = await fetch(`/api/projects?codes=${uniqueProjectIds.join(',')}`);
        if (!projectsResponse.ok) {
          throw new Error('Failed to fetch projects');
        }
        const projectsData = await projectsResponse.json();

        const projectsMap = {};
        projectsData.forEach(project => {
          projectsMap[project.project_code] = project.project_name;
        });
        setProjects(projectsMap);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAssignments();

    const intervalId = setInterval(fetchAssignments, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedAssignments = [...assignments].sort((a, b) => {
    const valueA = sortKey === 'start_date' ? new Date(a[sortKey]) : a[sortKey];
    const valueB = sortKey === 'start_date' ? new Date(b[sortKey]) : b[sortKey];

    if (sortOrder === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });


  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => handleSort('employee_id')}>Employee ID</th>
          <th onClick={() => handleSort('employee_name')}>Employee Name</th>
          <th onClick={() => handleSort('project_name')}>Project Name</th>
          <th onClick={() => handleSort('start_date')}>Start Date</th>
        </tr>
      </thead>
      <tbody>
        {sortedAssignments.slice(0, 5).map((assignment) => (
          <tr key={assignment._id}>
            <td>{assignment.employee_id}</td>
            <td>{employees[assignment.employee_id]}</td>
            <td>{projects[assignment.project_code]}</td>
            <td>{formatDate(assignment.start_date)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProjectAssignmentsTable;
