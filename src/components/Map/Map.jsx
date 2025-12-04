import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { fetchCountriesData } from '../../api';
import styles from './Map.module.css';
import 'leaflet/dist/leaflet.css';

const Map = () => {
    const [mapData, setMapData] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
    const [mapZoom, setMapZoom] = useState(3);

    useEffect(() => {
        const fetchAPI = async () => {
            setMapData(await fetchCountriesData());
        };

        fetchAPI();
    }, []);

    // Cases Type Colors
    const casesTypeColors = {
        cases: {
            hex: '#CC1034',
            multiplier: 800,
        },
        recovered: {
            hex: '#7dd71d',
            multiplier: 1200,
        },
        deaths: {
            hex: '#fb4443',
            multiplier: 2000,
        },
    };

    const showDataOnMap = (data, casesType = 'cases') => (
        data.map(country => (
            <Circle
                center={[country.lat, country.long]}
                fillOpacity={0.4}
                color={casesTypeColors[casesType].hex}
                fillColor={casesTypeColors[casesType].hex}
                radius={Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier}
            >
                <Popup>
                    <div className={styles.infoContainer}>
                        <div
                            className={styles.infoFlag}
                            style={{ backgroundImage: `url(${country.flag})` }}
                        />
                        <div className={styles.infoName}>{country.name}</div>
                        <div className={styles.infoConfirmed}>Cases: {country.cases.toLocaleString()}</div>
                        <div className={styles.infoRecovered}>Recovered: {country.recovered.toLocaleString()}</div>
                        <div className={styles.infoDeaths}>Deaths: {country.deaths.toLocaleString()}</div>
                    </div>
                </Popup>
            </Circle>
        ))
    );

    return (
        <div className={styles.mapContainer}>
            <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {showDataOnMap(mapData)}
            </MapContainer>
        </div>
    );
};

export default Map;
