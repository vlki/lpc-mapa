import React from "react";
import { icon } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { debounce } from "lodash";

import { publicUrl } from "./shared.js";

const Map = ({
  display,
  offices,
  people,
  peopleByDistricts,
  officesByDistricts,
}) => {
  const peopleMarkers = React.useMemo(() => {
    const markers = [];

    Object.keys(peopleByDistricts).forEach((district) => {
      for (let i = 0; i < peopleByDistricts[district]; i++) {
        markers.push({
          position: districtPositions[district]
            ? districtPositions[district]
            : mapContainerCenter,
          popupLabel: "Dobrovolník v regionu " + district,
        });
      }
    });

    return markers;
  }, [peopleByDistricts]);

  const officesMarkers = React.useMemo(() => {
    const markers = [];

    Object.keys(officesByDistricts).forEach((district) => {
      for (let i = 0; i < officesByDistricts[district]; i++) {
        markers.push({
          position: districtPositions[district]
            ? districtPositions[district]
            : mapContainerCenter,
          popupLabel: "Ordinace v regionu " + district,
        });
      }
    });

    return markers;
  }, [officesByDistricts]);

  const containerRef = React.useRef(null);
  const [width, setWidth] = React.useState(null);

  const onWindowResize = React.useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setWidth(rect.width);
    }
  }, []);
  const onWindowResizeDebounced = React.useCallback(
    debounce(onWindowResize, 100),
    [onWindowResize]
  );

  React.useEffect(() => {
    window.addEventListener("resize", onWindowResizeDebounced);
    onWindowResize();
    return () => {
      window.removeEventListener("resize", onWindowResizeDebounced);
    };
  }, [onWindowResize, onWindowResizeDebounced]);

  let zoom = 7;
  if (width < 600) {
    zoom = 6;
  }

  let height = 500;
  if (width < 600) {
    height = 300;
  }

  return (
    <div ref={containerRef}>
      {width !== null && (
        <MapContainer
          center={mapContainerCenter}
          zoom={zoom}
          scrollWheelZoom={false}
          style={{ width: "100%", height }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup maxClusterRadius={30}>
            {["all", "people"].includes(display) && (
              <>
                {peopleMarkers.map((marker, markerIndex) => (
                  <Marker
                    key={`person-legacy-${markerIndex}`}
                    icon={markerIconPerson}
                    position={marker.position}
                  >
                    <Popup>{marker.popupLabel}</Popup>
                  </Marker>
                ))}
                {people.map((person, personIndex) => (
                  <Marker
                    key={`person-${personIndex}`}
                    icon={markerIconPerson}
                    position={
                      districtPositions[person.district]
                        ? districtPositions[person.district]
                        : mapContainerCenter
                    }
                  >
                    <Popup>
                      {person.type} v regionu {person.district}
                    </Popup>
                  </Marker>
                ))}
              </>
            )}
            {["all", "offices"].includes(display) && (
              <>
                {officesMarkers.map((marker, markerIndex) => (
                  <Marker
                    key={`office-legacy-${markerIndex}`}
                    icon={markerIconOffice}
                    position={marker.position}
                  >
                    <Popup>{marker.popupLabel}</Popup>
                  </Marker>
                ))}
                {offices.map((office, officeIndex) => (
                  <Marker
                    key={`office-${officeIndex}`}
                    icon={markerIconOffice}
                    position={office}
                  >
                    <Popup>
                      <strong>{office.name}</strong>
                      <br />
                      Ordinace na adrese {office.address}
                    </Popup>
                  </Marker>
                ))}
              </>
            )}
          </MarkerClusterGroup>
        </MapContainer>
      )}
    </div>
  );
};

export default Map;

// Center Czechia
const mapContainerCenter = [49.8, 15.6];

const markerIconOffice = icon({
  iconUrl: publicUrl("marker-icon-office.png"),
  iconSize: [23, 29],
});

const markerIconPerson = icon({
  iconUrl: publicUrl("marker-icon-person.png"),
  iconSize: [23, 29],
});

const districtPositions = {
  "Hlavní město Praha": { lat: 50.1348586, lng: 14.4438744 },
  "Středočeský kraj": { lat: 49.9826792, lng: 14.962111 },
  "Karlovarský kraj": { lat: 50.2234664, lng: 12.6228906 },
  "Ústecký kraj": { lat: 50.4758394, lng: 13.6006739 },
  "Liberecký kraj": { lat: 50.8102525, lng: 15.0563622 },
  "Královehradecký kraj": { lat: 50.2831753, lng: 15.8913233 },
  "Pardubický kraj": { lat: 49.990945, lng: 15.8199122 },
  "Olomoucký kraj": { lat: 49.6720497, lng: 17.0778467 },
  "Moravskoslezský kraj": { lat: 49.7998603, lng: 18.0336572 },
  "Zlínský kraj": { lat: 49.2328219, lng: 17.7699853 },
  "Jihomoravský kraj": { lat: 49.1502528, lng: 16.6164208 },
  "Kraj Vysočina": { lat: 49.5153797, lng: 15.4353906 },
  "Jihočeský kraj": { lat: 49.0063261, lng: 14.4905664 },
  "Plzeňský kraj": { lat: 49.6436017, lng: 13.2930567 },
};
