// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import MapComponent from './components/MapComponent';


function App() {
  // 既存の useState やロゴの表示などは削除し、MapComponentだけを返します
  return (
    <div className="App">
      <MapComponent />
    </div>
  );
}

export default App
