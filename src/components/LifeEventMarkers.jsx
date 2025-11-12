// ★ useState と useCallback を React からインポート
import React, { useState, useCallback } from 'react';
import { Marker } from '@react-google-maps/api';
// ★ EventInfoWindow をインポート
import EventInfoWindow from './EventInfoWindow';

/**
 * ライフイベントのマーカー一覧と、
 * それに対応する情報ウィンドウを表示・管理するコンポーネント
 * @param {object} props
 * @param {Array<object>} props.events - Firestoreから取得したイベントの配列
 */

function LifeEventMarkers({ events }) {
  // --- 状態管理 ---
  // ★ このコンポーネント内部で、選択されたイベントを管理する
  const [selectedEvent, setSelectedEvent] = useState(null);

  // --- コールバック関数 ---
  // マーカーがクリックされた時の処理
  const handleMarkerClick = useCallback((event) => {
    console.log("LifeEventMarkers: マーカーがクリックされました", event);
    setSelectedEvent(event);
  }, []); // [] (空) を指定し、関数を再作成しない

  // 情報ウィンドウが閉じられた時の処理
  const handleInfoWindowClose = useCallback(() => {
    setSelectedEvent(null);
  }, []); // [] (空) を指定し、関数を再作成しない

  // --- 表示 ---
  return (
    // React.Fragment (<>) を使い、マーカーとウィンドウをグループ化する
    <>
      {/* --- 1.マーカーの一覧 (既存のロジック) --- */}
      {events.map((event) => (
        <Marker
          key={event.id}
          position={event.place} 
          // ★ クリック時に、このコンポーネント内部の handleMarkerClick を呼ぶ
          onClick={() => {
            handleMarkerClick(event); 
          }}
          animation={window.google.maps.Animation.DROP}
        />
      ))}

      {/* --- 2.情報ウィンドウ --- */}
      {/*
        selectedEvent が null でない場合に、
        EventInfoWindow を呼び出す
      */}
      <EventInfoWindow 
        selectedEvent={selectedEvent} 
        onCloseClick={handleInfoWindowClose}
      />
    </>
  );
}

export default React.memo(LifeEventMarkers);
