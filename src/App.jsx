import React, { useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import MapComponent from './components/MapComponent';
import { auth } from './firebase';



function App() {
  useEffect(() => {
    // ログイン状態の変化を監視
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // 未ログインの場合のみ、匿名ログインを実行
        signInAnonymously(auth)
          .then(() => {
            console.log("匿名ログイン成功");
          })
          .catch((error) => {
            console.error("匿名ログイン失敗:", error);
          });
      } else {
        console.log("ログイン済みユーザーID:", user.uid);
      }
    });
    return () => unsubscribe();
  }, []);
  
  return (
    <div className="App">
      <MapComponent />
    </div>
  );
}

export default App
