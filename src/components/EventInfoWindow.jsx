import React from 'react';
import { InfoBox } from '@react-google-maps/api';

// --- スタイル定義 (CSS in JS) ---
const infoBoxStyle = {
  position: 'relative',
  background: 'white',
  color: '#000000',
  padding: '10px 15px 10px 15px',
  borderRadius: '8px',
  boxShadow: '0 2px 7px 1px rgba(0,0,0,0.3)',
  minWidth: '150px',
  width: '80vw', // 画面幅の80%を基準にする
  maxWidth: '320px' // 横幅が320px以上には広がらないようにする
};

const closeButtonStyle = {
  position: 'absolute',
  top: '5px',
  right: '5px',
  padding: '2px 5px',
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#000000',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  zIndex: 10
};

const triangleStyle = {
  position: 'absolute',
  left: '50%',
  bottom: '-10px',
  marginLeft: '-10px',
  width: '0',
  height: '0',
  borderTop: '10px solid white',
  borderLeft: '10px solid transparent',
  borderRight: '10px solid transparent'
};

const headingStyle = {
  margin: '0 0 5px 0',
  paddingRight: '20px'
};

const paragraphStyle = {
  margin: '0 0 5px 0'
};

/**
 * 選択されたイベントの情報を表示するウィンドウ (InfoBox版)
 */
function EventInfoWindow({ selectedEvent, onCloseClick }) {

  // selectedEvent が null または空の配列なら何も表示しない
  if (!selectedEvent || selectedEvent.length === 0) {
    return null;
  }

  // selectedEventが配列でない場合は配列に変換する（後方互換性のため）
  const eventsToShow = Array.isArray(selectedEvent) ? selectedEvent : [selectedEvent];
  const firstEvent = eventsToShow[0];

  // place (緯度経度) が不正なら表示しない
  // GeoPointオブジェクト (latitude, longitude) をチェックするように修正
  if (!firstEvent.place || typeof firstEvent.place.latitude !== 'number' || typeof firstEvent.place.longitude !== 'number') {
    return null;
  }

  // InfoBoxに渡すための position オブジェクトを作成
  const position = {
    lat: firstEvent.place.latitude,
    lng: firstEvent.place.longitude,
  };

  // InfoBox の設定オプションを、コンポーネント関数の「内部」に移動する
  const infoBoxOptions = {
    // マーカー位置からのオフセット (ピクセル)
    pixelOffset: new window.google.maps.Size(0, -45),
    
    // InfoBox の背景を透明にし、影も消す (自前のスタイルを適用するため)
    boxStyle: {
      background: "transparent",
      opacity: 1,
      border: "none",
      boxShadow: "none"
    },
    
    // 標準の「×」ボタンは使わない
    closeBoxURL: "", 
    
    // マップクリックで閉じないようにする (自前のボタンで制御)
    disableAutoPan: true,
    enableEventPropagation: true
  };


  return (
    <InfoBox
      // 表示する緯度・経度
      position={position}
      // 上で定義した設定オプション
      options={infoBoxOptions}
    >
      {/* ここから下が、私たちが自由にデザインできるウィンドウ本体 */}
      <div style={infoBoxStyle}>
        
        {/* 1. ご要望の「黒い閉じるボタン」 */}
        <button 
          style={closeButtonStyle} 
          onClick={onCloseClick} // 親(LifeEventMarkers)に「閉じる」を通知
          aria-label="閉じる"
        >
          ×
        </button>
        
        {/* 2. コンテンツ */}
        {/* イベントの配列をループして表示 */}
        {eventsToShow.map((event, index) => (
          <div key={event.id} style={{ marginBottom: index === eventsToShow.length - 1 ? 0 : '10px' }}>
            <h2 style={headingStyle}>{event.heading}</h2>
            <h3 style={paragraphStyle}>{event.date}</h3>
            {event.explaing && (
              <p style={{...paragraphStyle, fontWeight: 'normal', paddingRight: '20px', whiteSpace: 'pre-line' }}>
                {event.explaing}
              </p>
            )}
          </div>
        ))}
        {/* 3. 吹き出しの「しっぽ」 */}
        <div style={triangleStyle} />

      </div>
    </InfoBox>
  );
}

export default React.memo(EventInfoWindow);
