import React, { useRef, useCallback } from 'react';
import { StandaloneSearchBox } from '@react-google-maps/api';

// 検索ボックスの見た目 (CSS) を定義する
const searchBoxStyle = {
  boxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `240px`,
  height: `32px`,
  padding: `0 12px`,
  borderRadius: `3px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  textOverflow: `ellipses`,
  position: "absolute",
  left: "50%",
  marginLeft: "-120px",
  top: "10px"
};

/**
 * 地名検索ボックスコンポーネント
 * @param {object} props
 * @param {(location: google.maps.LatLngLiteral) => void} props.onPlaceSelected - 場所が選択されたときに呼び出される関数
 */

function PlaceSearchBox({ onPlaceSelected }) {
  // 検索ボックスのDOM要素を参照 (操作) するために useRef を準備する
  const searchBoxRef = useRef(null);

  // --- コールバック関数 (Google Map ライブラリから呼び出される) ---

  // 1. 検索ボックスが読み込まれた (ロードされた) 時に実行する関数を定義する
  const onSearchLoad = useCallback((searchBox) => {
    // searchBoxRef に、読み込まれた検索ボックスの情報を保存する
    // (これ以降、searchBoxRef.current で検索ボックスを操作できる)
    searchBoxRef.current = searchBox;
  }, []); // [] (空の配列) を指定し、この関数が再作成されないようにする

  // 2. 検索ボックスで場所が選択 (変更) された時に実行する関数を定義する
  const onPlacesChanged = useCallback(() => {
    // 検索ボックスから、選択された場所のリストを取得する
    const places = searchBoxRef.current.getPlaces();
    
    // 場所が選択されていない、または場所の地理情報 (geometry) がない場合は処理を中断する
    if (!places || places.length === 0 || !places[0].geometry) {
      console.log("有効な場所が選択されませんでした。");
      return;
    }

    // 選択された場所（通常は1つ目）の情報を取得する
    const place = places[0];
    // 場所情報から緯度・経度 (location) を取り出す
    const location = place.geometry.location;

    // 緯度・経度が存在する場合
    if (location) {
      // 親コンポーネント (MapComponent) に、選択された位置情報 (緯度・経度) を渡す
      // (location.toJSON() は {lat: ..., lng: ...} というシンプルな形式に変換する)
      onPlaceSelected(location.toJSON());
    }
  }, [onPlaceSelected]); // onPlaceSelected (親から渡された関数) が変更された時だけ、この関数を再作成する

  // --- 表示 ---
  return (
    // Google Map の検索ボックスコンポーネントを配置する
    <StandaloneSearchBox
      // 読み込み時に onSearchLoad 関数を実行するよう設定する
      onLoad={onSearchLoad}
      // 場所選択時に onPlacesChanged 関数を実行するよう設定する
      onPlacesChanged={onPlacesChanged}
    >
      {/* 検索ボックスの本体 (HTML の input タグ) */}
      <input
        type="text"
        placeholder="地名を検索..."
        // 上で定義した searchBoxStyle を適用する
        style={searchBoxStyle}
      />
    </StandaloneSearchBox>
  );
}

// 親コンポーネントからの props が変更されない限り、再レンダリングしないようにする
export default React.memo(PlaceSearchBox);
