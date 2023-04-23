import './App.css';
import { useState } from 'react';
import io from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Chat from './pages/chat';
import Login from './pages/login';
import Register from './pages/register';

const sock = io.connect('http://localhost:4000');

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [room, setRoom] = useState('');

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route 
              path='/' 
              element={
                <Login
                  username={username}
                  setUsername={setUsername}
                  password={password}
                  setPassword={setPassword}
                  socket={sock}
                
                />
                      } 
              />
            <Route 
              path='/home' 
              element={
                <Home
                  username={username}
                  setUsername={setUsername}
                  room={room}
                  setRoom={setRoom}
                  socket={sock}
                
                />
                      } 
              />
              <Route 
              path='/register' 
              element={
                <Register
                  username={username}
                  setUsername={setUsername}
                  password={password}
                  setPassword={setPassword}
                  //setRoom={setRoom}
                  socket={sock}
                
                />
                      } 
              />
            <Route
              path='/chat'
              element={<Chat 
                          username={username} 
                          room={room} 
                          socket={sock} 
                        />
                      }
            />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
