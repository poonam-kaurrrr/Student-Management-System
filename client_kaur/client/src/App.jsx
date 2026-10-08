import { useEffect, useState } from 'react';
import './App.css'
import axios from "axios";
 
 
function App() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");
  const [edit, setEdit] = useState(null);
  const [students, setStudents] = useState([]);
 
  let title = "Add Student";
  let buttonText = "Add Student";
 
  if (edit != null) {
    title = "Edit Student";
    buttonText = "Update Student";
  }
 
  function getStudents() {
    axios.get("/api/students")
    .then((response) => {
      setStudents(response.data);
    });
  }
 
  useEffect(() => {
    getStudents();
  },
  []);

  
 
  function clearTxt() {
    setName("");
    setCourse("");
    setEdit(null);
    setAge("");
    setError("");
  }
 
    function saveStud() {
    if (!name || !course || !age) {
      setError("Please fill in all fields.");
      return;
    }
 
    if (edit != null) {
      const current = students.find((student) => student._id == edit);
      if (current.name == name && current.course == course && current.age == age) {
        setError("Nothing was changed.");
        return;
      }
    }
 
    const checkStud = students.find((student) =>
      student._id != edit &&
      student.name.toLowerCase() == name.toLowerCase() &&
      student.course.toLowerCase() == course.toLowerCase()
    );
    if (checkStud) {
      setError("Student already exists.");
      return;
    }
    setError("");
    if (edit == null) {
      axios.post("/api/students", { name, course, age })
        .then(() => {
          clearTxt();
          getStudents();
        });
    } else {
      axios.put("/api/students/" + edit, { name, course, age })
        .then(() => {
          clearTxt();
          getStudents();
        });
    }
  }
 
  function editStudent(student) {
    setEdit(student._id);
    setName(student.name);
    setCourse(student.course);
    setAge(student.age);
  }
 
  function deleteStudent(id) {
    axios.delete("/api/students/" + id)
      .then(() => {
        getStudents();
      });
  }
 
  return (
    <div>
      <h1>Student Management System</h1>
 
      <h2>{title}</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br/>
 
      <input
        placeholder="Course"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
      />
      <br/>
 
      <input
        placeholder="Age"
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      
      <br/>
      <p style={{ color: "red" }}>{error}</p> 
      <br/>
 
      <button type="button" onClick={saveStud}>
      {buttonText}
      </button>
      
      {edit != null && (<button type="button" onClick={clearTxt}>Back</button>)}
      
      <br/>
      <br/>
      <h2>Students</h2>
 
      {students.length == 0 && <p>No students yet.</p>}
 
      {students.map((student) => (
        <div key={student._id}>
          <p>Name: {student.name}</p>
          <p>Course: {student.course}</p>
          <p>Age: {student.age}</p>
          <br/>
          <button type="button" onClick={() => editStudent(student)}>Edit</button>
          <button type="button" onClick={() => deleteStudent(student._id)}>Delete</button>
          <br/><br/>
        </div>
      ))}
 
    </div>
  );
}
 
export default App