import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Circle, Popup, Tooltip } from 'react-leaflet';
import { fetchCountriesData } from '../../api';
import styles from './MapView.module.css';
import 'leaflet/dist/leaflet.css';

const MapView = () => {
    const [mapData, setMapData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const [mapCenter] = useState({ lat: 20, lng: 0 });
    const [mapZoom] = useState(2);

    useEffect(() => {
        const fetchAPI = async () => {
            setLoading(true);
            const data = await fetchCountriesData();
            setMapData(data);
            setLoading(false);
        };

        fetchAPI();
    }, []);

    // Memoize global stats calculation
    const globalStats = useMemo(() => {
        if (mapData.length === 0) return null;

        return {
            totalCases: mapData.reduce((acc, country) => acc + country.cases, 0),
            totalRecovered: mapData.reduce((acc, country) => acc + country.recovered, 0),
            totalDeaths: mapData.reduce((acc, country) => acc + country.deaths, 0),
            totalActive: mapData.reduce((acc, country) => acc + country.active, 0),
        };
    }, [mapData]);

    // Get color based on severity
    const getSeverityColor = useCallback((cases) => {
        if (cases > 10000000) return '#8B0000'; // Dark red
        if (cases > 5000000) return '#CC1034';
        if (cases > 1000000) return '#FF4444';
        if (cases > 500000) return '#FF6B6B';
        return '#FF9999';
    }, []);

    // Memoize circles rendering
    const circles = useMemo(() => {
        return mapData.map(country => {
            const color = getSeverityColor(country.cases);
            const radius = Math.sqrt(country.cases) * 400;

            return (
                <Circle
                    key={country.name}
                    center={[country.lat, country.long]}
                    fillOpacity={0.6}
                    color={color}
                    fillColor={color}
                    radius={radius}
                    weight={1}
                    onMouseOver={() => setHoveredCountry(country)}
                    onMouseOut={() => setHoveredCountry(null)}
                    onClick={() => setHoveredCountry(country)}
                >
                    <Popup>
                        <div className={styles.popupContainer}>
                            <div
                                className={styles.popupFlag}
                                style={{ backgroundImage: `url(${country.flag})` }}
                            />
                            <div className={styles.popupName}>{country.name}</div>
                            <div className={styles.popupCases}>Cases: {country.cases.toLocaleString()}</div>
                            <div className={styles.popupRecovered}>Recovered: {country.recovered.toLocaleString()}</div>
                            <div className={styles.popupDeaths}>Deaths: {country.deaths.toLocaleString()}</div>
                            <div className={styles.popupActive}>Active: {country.active.toLocaleString()}</div>
                        </div>
                    </Popup>
                </Circle>
            );
        });
    }, [mapData, getSeverityColor]);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
                <p>Loading global data...</p>
            </div>
        );
    }

    return (
        <div className={styles.mapViewContainer}>
            {/* Header with title */}
            <div className={styles.mapHeader}>
                <h1 className={styles.title}>COVID-19 Global Tracker</h1>
                <p className={styles.subtitle}>Hover over hotspots • Click for details</p>
            </div>

            {/* Global Stats Panel */}
            {globalStats && (
                <div className={styles.statsPanel}>
                    <div className={styles.statItem}>
                        <div className={styles.statValue}>{globalStats.totalCases.toLocaleString()}</div>
                        <div className={styles.statLabel}>Total Cases</div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={`${styles.statValue} ${styles.green}`}>{globalStats.totalRecovered.toLocaleString()}</div>
                        <div className={styles.statLabel}>Recovered</div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={`${styles.statValue} ${styles.red}`}>{globalStats.totalDeaths.toLocaleString()}</div>
                        <div className={styles.statLabel}>Deaths</div>
                    </div>
                </div>
            )}

            {/* Hovered Country Info Panel */}
            {hoveredCountry && (
                <div className={styles.infoPanel}>
                    <img src={hoveredCountry.flag} alt={hoveredCountry.name} className={styles.infoPanelFlag} />
                    <h2>{hoveredCountry.name}</h2>
                    <div className={styles.statRow}>
                        <span className={styles.statRowLabel}>Total Cases</span>
                        <span className={styles.statRowValue}>{hoveredCountry.cases.toLocaleString()}</span>
                    </div>
                    <div className={styles.statRow}>
                        <span className={styles.statRowLabel}>Recovered</span>
                        <span className={styles.statRowValueGreen}>{hoveredCountry.recovered.toLocaleString()}</span>
                    </div>
                    <div className={styles.statRow}>
                        <span className={styles.statRowLabel}>Deaths</span>
                        <span className={styles.statRowValueRed}>{hoveredCountry.deaths.toLocaleString()}</span>
                    </div>
                    <div className={styles.statRow}>
                        <span className={styles.statRowLabel}>Active</span>
                        <span className={styles.statRowValue}>{hoveredCountry.active.toLocaleString()}</span>
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className={styles.legend}>
                <div className={styles.legendTitle}>Severity</div>
                <div className={styles.legendItem}>
                    <div className={styles.legendCircle} style={{ backgroundColor: '#8B0000' }}></div>
                    <span>&gt;10M</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={styles.legendCircle} style={{ backgroundColor: '#CC1034' }}></div>
                    <span>5M-10M</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={styles.legendCircle} style={{ backgroundColor: '#FF4444' }}></div>
                    <span>1M-5M</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={styles.legendCircle} style={{ backgroundColor: '#FF9999' }}></div>
                    <span>&lt;1M</span>
                </div>
            </div>

            {/* Full Screen Map */}
            <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                className={styles.fullScreenMap}
                style={{ height: '100vh', width: '100%' }}
                zoomControl={true}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                {circles}
            </MapContainer>
        </div>
    );
};

export default MapView;
