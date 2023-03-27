import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

function Person({ onDelete, pk, firstname, lastname }) {

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:8000/person/?pk=${pk}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        onDelete(pk)
      } else {
        console.error('Delete failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="bg-gray-200 p-4 rounded-lg shadow-lg">
        <h2 onClick={handleDelete} className="text-2xl font-bold"> {firstname} {lastname}</h2>
      </div>
    </div>
  );
}

function App() {
  const [people, setPeople] = useState([]);
  const [formData, setFormData] = useState({ firstname: '', lastname: '' });


  useEffect(() => {
    fetch('http://localhost:8000/person/')
      .then(response => response.json())
      .then(data => setPeople(data));
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/person/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();

        setPeople(current => [...current, data[0]]);

        setFormData({ firstname: '', lastname: '' });
      } else {
        console.error('Create failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  function handleDelete(pk) {
    setPeople((current) =>
      current.filter((person) => person.pk !== pk)
    );
  }

  return (
    <div>
      <form className="flex justify-center mt-5 mb-4" onSubmit={handleSubmit}>
        <div className="mr-2">
          <input
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="firstname"
            placeholder="First name"
            value={formData.firstname}
            onChange={handleInputChange}
          />
        </div>
        <div className="mr-2">
          <input
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="lastname"
            placeholder="Last name"
            value={formData.lastname}
            onChange={handleInputChange}
          />
        </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          Create
        </button>
      </form>

      {people.map(person => (
        <Person onDelete={handleDelete} pk={person.pk} firstname={person.fields.firstname} lastname={person.fields.lastname} />
      ))}
    </div>
  );
}

export default App;
