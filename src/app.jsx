import { useCallback, useRef, useState } from "preact/hooks";
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import "./app.css";

export function App() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDAlPGFHzk99vqYNsH-_tQOmHm0v4txxmg",
    libraries: ["places", "drawing"],
  });

  const [map, setMap] = useState(null);
  const autocomplete = useRef();
  const drawingManager = useRef(null);
  const [cords, setCords] = useState();
  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);

    // Initialize DrawingManager for polygon drawing
    const drawingManagerInstance =
      new window.google.maps.drawing.DrawingManager({
        drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
        },
      });

    drawingManagerInstance.setMap(map);

    // Set up event listener for polygon completion
    window.google.maps.event.addListener(
      drawingManagerInstance,
      "overlaycomplete",
      (event) => {
        if (event.type === "polygon") {
          // Do something with the drawn polygon, for example, get its path
          const polygonPath = event.overlay.getPath();
          console.log("Polygon Path:", polygonPath);
          setCords(polygonPath);
        }
      }
    );

    drawingManager.current = drawingManagerInstance;
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const onPlaceChanged = () => {
    if (map && autocomplete?.current.getPlace()) {
      const place = autocomplete?.current.getPlace();
      if (place.geometry && place.geometry.location) {
        map.panTo(place.geometry.location);
        map.setZoom(14);
      }
    }
  };

  return isLoaded ? (
    <div
      style={{
        display: "flex",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Autocomplete
          onLoad={(auto) => {
            autocomplete.current = auto;
          }}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            type="text"
            placeholder="Search for a place"
            style={{
              boxSizing: "border-box",
              border: "1px solid transparent",
              width: "240px",
              height: "32px",
              padding: "0 12px",
              borderRadius: "3px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
              fontSize: "14px",
              outline: "none",
              textOverflow: "ellipses",
            }}
          />
        </Autocomplete>
        <div style={{width: 20}}>
          <p style={{ color: "white" }}> {String(cords?.Hg)}</p>
        </div>
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Child components, such as markers, info windows, etc. */}
        <></>
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
}

const containerStyle = {
  width: "600px",
  height: "600px",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};
