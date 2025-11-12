import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { db } from '../firebase'; 
import { collection, getDocs } from "firebase/firestore";

// --- 子コンポーネントのインポート ---
import PlaceSearchBox from './PlaceSearchBox';
import LifeEventMarkers from './LifeEventMarkers';

// --- マップの基本設定 ---
const containerStyle = {
  width: '100vw',
  height: '100vh'
};
const center = {
  lat: 35.6812,
  lng: 139.7671
};
const libraries = ["places"]; 

// --- コンポーネント本体  ---

function MapComponent() {
  // --- 1. Google Map の読み込み処理 (変更なし) ---
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

  // --- 2. 状態 (State) の管理 ---
  // Firestore から取得したイベントリストのみ管理する
  const [lifeEvents, setLifeEvents] = useState([]);

  // --- 3. 参照 (Ref) の管理 (変更なし) ---
  const mapRef = useRef(null);

  // --- 4. 副作用 (Effect) の管理 (変更なし) ---
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "lifeEvents"));
        const eventsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLifeEvents(eventsData);
        console.log("Firestoreからデータを取得しました:", eventsData);
      } catch (error) {
        console.error("Firestoreのデータ取得エラー:", error);
      }
    };
    fetchEvents();
  }, []); 

  // --- 5. コールバック関数 (子コンポーネントに渡す処理) の定義 ---
  // マップのロード
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // 地名検索
  const handlePlaceSelected = useCallback((location) => {
    if (mapRef.current && location) {
      mapRef.current.panTo(location);
      mapRef.current.setZoom(15);
    }
  }, []);

  // --- 6. レンダリング (画面表示) ---
  if (loadError) {
    return <div>マップの読み込みでエラーが発生しました。</div>;
  }
  if (!isLoaded) {
    return <div>マップを読み込んでいます...</div>;
  }

  return (
    // 検索ボックス (絶対配置) の基準 (変更なし)
    <div style={{ position: 'relative', width: containerStyle.width, height: containerStyle.height }}>
      {/* 1. 地名検索ボックス (変更なし) */}
      <PlaceSearchBox 
        onPlaceSelected={handlePlaceSelected} 
      />
      {/* 2. GoogleMap 本体 (変更なし) */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onMapLoad}
      >
        {/* 3. マーカーの一覧 */}
        {/*
          LifeEventMarkers がマーカーと情報ウィンドウの両方を管理する
          親は lifeEvents (データ) を渡すだけ
        */}
        <LifeEventMarkers 
          events={lifeEvents} 
        />
      </GoogleMap>
    </div>
  );
}

export default React.memo(MapComponent);
