import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

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

function MainPage() {
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

        if (!data.message) {

          setPeople(current => [...current, data]);

          setFormData({ firstname: '', lastname: '' });
        } else {
          alert(data.message)
        }
      } else {
        console.error('Create failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  function handleDelete(pk) {
    setPeople((current) =>
      current.filter((person) => person.id !== pk)
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
        <Person onDelete={handleDelete} key={person.id} pk={person.id} firstname={person.firstname} lastname={person.lastname} />
      ))}
    </div>
  );
}

function AboutPage() {
  return (
    <div>
      <div className="flex justify-center mt-5">
        <p>Django and react are really nice. I'm getting the hang of tailwind too.</p>
      </div>
    </div>
  )
}

function LoggedInPage() {
  return (
    <div>
      <div className="flex justify-center mt-5">
        <p>Logged in.</p>
      </div>
    </div>
  )
}

function LoginPage() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = async event => {
    event.preventDefault();

    const res = await fetch('http://localhost:8000/submitLogin/', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: user,
        password: pass,
      })
    });

    const data = await res.json();

    if(data.message=='authenticated') {
      
      navigate('/loggedIn')
    }

    alert(data.message)


    console.log(`Username: ${user}, Password: ${pass}`);
  };

  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              htmlFor="username"
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            >
              Username
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              type="text"
              id="username"
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              value={user}
              onChange={event => setUser(event.target.value)}
            />
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              htmlFor="password"
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            >
              Password
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              type="password"
              id="password"
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              value={pass}
              onChange={event => setPass(event.target.value)}
            />
          </div>
        </div>
        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>
          <div className="md:w-2/3">
            <button
              type="submit"
              className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
              Sign In
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

function Navbar() {
  return (
    <nav className="bg-black p-3">
      <a href="/" className="text-white font-bold text-lg mr-4">
        FunDjango
      </a>
      <a href="/about" className="text-white hover:text-gray-200 mr-4">
        About
      </a>
      <a href="/login" className="text-white hover:text-gray-200">
        Login
      </a>
    </nav>
  )
}

function App() {
  const [currentPage, setCurrentPage] = useState(<MainPage />)


  return (
    <div>
      <Navbar />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />}>
          </Route>

          <Route path="/about" element={<AboutPage />}>
          </Route>

          <Route path="/login" element={<LoginPage />}>
          </Route>

          <Route path="/loggedIn" element={<LoggedInPage />}>
          </Route>


        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
