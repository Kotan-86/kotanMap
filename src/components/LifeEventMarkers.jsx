// ★ useState と useCallback を React からインポート
import React, { useState, useCallback, useMemo } from 'react';
import { Marker, MarkerClustererF } from '@react-google-maps/api';
// ★ EventInfoWindow をインポート
import EventInfoWindow from './EventInfoWindow';

/**
 * ライフイベントのマーカー一覧と、
 * それに対応する情報ウィンドウを表示・管理するコンポーネント
 * @param {object} props
 * @param {Array<object>} props.events - Firestoreから取得したイベントの配列
 */

function LifeEventMarkers({ events }) {
  // ★★★ デバッグ用ログを追加 ★★★
  console.log("LifeEventMarkers: 受け取った events", events);

  // --- データ加工 ---
  // useMemoを使って、eventsが変更された時だけ再計算する
  const groupedEvents = useMemo(() => {
    const groups = {};
    events.forEach(event => {
      // event.place やそのプロパティが存在しない場合は処理をスキップ
      if (!event.place || typeof event.place.latitude === 'undefined' || typeof event.place.longitude === 'undefined') {
        console.warn("Skipping event with invalid place data:", event);
        return;
      }

      // 緯度経度を文字列にしてキーとして使う
      const key = `${event.place.latitude},${event.place.longitude}`;
      if (!groups[key]) {
        groups[key] = {
          // latとlngを parseFloat で数値に変換する
          place: {
            lat: parseFloat(event.place.latitude),
            lng: parseFloat(event.place.longitude)
          },
          events: []
        };
      }
      groups[key].events.push(event);
    });
    const result = Object.values(groups);

    // ★★★ デバッグ用ログを追加 ★★★
    console.log("LifeEventMarkers: グループ化後のデータ (groupedEvents)", result);
    return result;
  }, [events]);

  // --- 状態管理 ---
  // ★ このコンポーネント内部で、選択されたイベントを管理する
  const [selectedEvents, setSelectedEvents] = useState(null);

  // --- コールバック関数 ---
  // マーカーがクリックされた時の処理
  const handleMarkerClick = useCallback((eventGroup) => {
    console.log("LifeEventMarkers: マーカーがクリックされました", eventGroup);
    setSelectedEvents(eventGroup.events); // イベントの配列をセット
  }, []); // [] (空) を指定し、関数を再作成しない

  // 情報ウィンドウが閉じられた時の処理
  const handleInfoWindowClose = useCallback(() => {
    setSelectedEvents(null);
  }, []); // [] (空) を指定し、関数を再作成しない

  // --- 表示 ---
  return (
    // React.Fragment (<>) を使い、マーカーとウィンドウをグループ化する
    <>
      {/* --- 1.マーカーの一覧 --- */}
      {/* MarkerClustererFでマーカーをラップしてクラスタリングを有効にする */}
      <MarkerClustererF>
        {(clusterer) =>
          groupedEvents.map((group, index) => (
            <Marker
              key={index}
              position={group.place}
              onClick={() => handleMarkerClick(group)}
              animation={window.google.maps.Animation.DROP}
              clusterer={clusterer}
            />
          ))
        }
      </MarkerClustererF>

      {/* --- 2.情報ウィンドウ --- */}
      {/*
        selectedEvents が null でない場合に、
        EventInfoWindow を呼び出す
      */}
      <EventInfoWindow 
        selectedEvent={selectedEvents} 
        onCloseClick={handleInfoWindowClose}
      />
    </>
  );
}

export default React.memo(LifeEventMarkers);
