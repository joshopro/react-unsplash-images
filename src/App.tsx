import Photos from './components/Photos';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Callback from './components/Callback';
import UserProvider from './contexts/UserContext';
import LikedByMe from './components/LikedByMe';

import './App.less';

function App() {
  return (
    <UserProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Photos />} />
          <Route path="/liked-by-me" element={<LikedByMe />} />
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </Layout>
    </UserProvider>
  );
}

export default App;
