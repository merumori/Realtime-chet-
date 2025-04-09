import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';

function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);

  return (
    <div className="">
      {page === 'register' && <Register setPage={setPage} />}
      {page === 'login' && <Login setUser={setUser} setPage={setPage} />}
      {page === 'chat' && user && <Chat user={user} />}
    </div>
  );
}

export default App;
