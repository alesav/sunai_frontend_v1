import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import { useEffect, useState} from 'react';
import { useCookies } from 'react-cookie';
import {jwtDecode} from 'jwt-decode';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import BotDetails from './components/BotDetails';
import Embeddings from './components/Embeddings'; 
import AddEmbedding from './components/AddEmbedding'; 
import { UserContext } from './UserContext';
import './App.css';

function App() {
  const [cookies, setCookie] = useCookies(['token']);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (cookies.token) {
      const decoded = jwtDecode(cookies.token);
      console.log("Decoded: " + JSON.stringify(decoded));
      setUser(decoded);
      setUserData(decoded);
      setLoading(false)

    } else(
      setLoading(false)
    )
  }, [cookies.token]);

  if(loading) return <p>Loading...</p>

  return (
    <UserContext.Provider value={userData}>
      <Router>
        <Routes>
          {cookies.token ? <Route path="/dashboard" element={<Dashboard />} /> : <Route path="/" element={<Login />} />}
          <Route path="/register" element={<Register />} />
          {userData && userData.tenant && <Route path="/someURL" element={<Dashboard/>} />}
          {userData && userData.company && <Route path="/someOtherURL" element={<Dashboard />} />}
          <Route path="/" element={userData ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/dashboard" element={userData ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/bot/:id" element={userData ? <BotDetails /> : <Navigate to="/" />} />
          <Route path="/embeddings" element={<Embeddings />} />
          <Route path="/addembedding" element={<AddEmbedding />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
