import React from 'react';
import { InfoBox } from '@react-google-maps/api';

// --- スタイル定義 (CSS in JS) ---
// (スタイル定義は関数の外でも問題ないため、変更なし)

const infoBoxStyle = {
  position: 'relative',
  background: 'white',
  color: '#000000',
  padding: '10px 15px 10px 15px',
  borderRadius: '8px',
  boxShadow: '0 2px 7px 1px rgba(0,0,0,0.3)',
  width: 'auto',
  minWidth: '150px'
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

// --- InfoBox の設定オプション (ここから削除) ---


/**
 * 選択されたイベントの情報を表示するウィンドウ (InfoBox版)
 */
function EventInfoWindow({ selectedEvent, onCloseClick }) {

  // selectedEvent が null なら何も表示しない
  if (!selectedEvent) {
    return null;
  }

  // place (緯度経度) が不正なら表示しない
  if (!selectedEvent.place || typeof selectedEvent.place.lat !== 'number' || typeof selectedEvent.place.lng !== 'number') {
    return null;
  }

  // ★★★ 修正点 ★★★
  // InfoBox の設定オプションを、コンポーネント関数の「内部」に移動する
  // (これにより、window.google.maps がロードされた後に実行される)
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
      position={selectedEvent.place}
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
        <h3 style={headingStyle}>{selectedEvent.heading}</h3>
        <p style={paragraphStyle}>{selectedEvent.date}</p>
        
        {selectedEvent.explaing && (
          <p style={{...paragraphStyle, fontWeight: 'normal', paddingRight: '20px' }}>
            {selectedEvent.explaing}
          </p>
        )}

        {/* 3. 吹き出しの「しっぽ」 */}
        <div style={triangleStyle} />

      </div>
    </InfoBox>
  );
}

export default React.memo(EventInfoWindow);
