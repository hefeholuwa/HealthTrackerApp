import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { Line } from 'react-chartjs-2';
import { fetchCountriesData, fetchData } from '../../api';
import { diseaseData } from '../../data/diseases';
import styles from './Dashboard.module.css';
import 'leaflet/dist/leaflet.css';

const Dashboard = () => {
    const [mapData, setMapData] = useState([]);
    const [globalData, setGlobalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedDisease, setSelectedDisease] = useState('covid');
    const [influenzaData, setInfluenzaData] = useState([]);
    const [mapCenter] = useState({ lat: 20, lng: 0 });
    const [mapZoom] = useState(2);

    useEffect(() => {
        const fetchAPI = async () => {
            setLoading(true);
            const [countries, globalResponse] = await Promise.all([
                fetchCountriesData(),
                fetchData()
            ]);

            const todayData = await fetch('https://disease.sh/v3/covid-19/all').then(r => r.json());

            const global = {
                ...globalResponse,
                todayCases: todayData.todayCases,
                todayDeaths: todayData.todayDeaths,
                todayRecovered: todayData.todayRecovered,
            };

            const fluResponse = await fetch('https://disease.sh/v3/influenza/cdc/ILINet').then(r => r.json());
            const fluData = fluResponse.data ? fluResponse.data.slice(-30) : [];

            setMapData(countries);
            setGlobalData(global);
            setInfluenzaData(fluData);
            setLoading(false);
        };

        fetchAPI();
    }, []);

    const topCountries = useMemo(() => {
        return mapData.sort((a, b) => b.cases - a.cases).slice(0, 5);
    }, [mapData]);

    const getSeverityColor = useCallback((cases) => {
        if (cases > 50000000) return '#8B0000';
        if (cases > 20000000) return '#CC1034';
        if (cases > 5000000) return '#FF4444';
        if (cases > 1000000) return '#FF6B6B';
        if (cases > 100000) return '#FF9999';
        return '#FFB3B3';
    }, []);

    const circles = useMemo(() => {
        return mapData.map(country => {
            const color = getSeverityColor(country.cases);
            const radius = Math.sqrt(country.cases) * 150;

            return (
                <Circle
                    key={country.name}
                    center={[country.lat, country.long]}
                    fillOpacity={0.4}
                    color={color}
                    fillColor={color}
                    radius={radius}
                    weight={2}
                    onClick={() => setSelectedCountry(country)}
                >
                    <Popup>
                        <div className={styles.popupContainer}>
                            <div className={styles.popupFlag} style={{ backgroundImage: `url(${country.flag})` }} />
                            <div className={styles.popupName}>{country.name}</div>
                            <div className={styles.popupStat}>Cases: {country.cases.toLocaleString()}</div>
                            <div className={styles.popupStat}>Recovered: {country.recovered.toLocaleString()}</div>
                            <div className={styles.popupStat}>Deaths: {country.deaths.toLocaleString()}</div>
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
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className={styles.dashboard}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h1 className={styles.logo}>Health Tracker</h1>
                    <p className={styles.tagline}>Global Disease Monitor</p>
                </div>

                {/* Disease Selector */}
                <div className={styles.diseaseSelector}>
                    <button
                        className={`${styles.diseaseTab} ${selectedDisease === 'covid' ? styles.active : ''}`}
                        onClick={() => setSelectedDisease('covid')}
                    >
                        🦠 COVID-19
                    </button>
                    <button
                        className={`${styles.diseaseTab} ${selectedDisease === 'influenza' ? styles.active : ''}`}
                        onClick={() => setSelectedDisease('influenza')}
                    >
                        🤧 Influenza
                    </button>
                </div>
                <div className={styles.diseaseSelector}>
                    <button
                        className={`${styles.diseaseTab} ${selectedDisease === 'malaria' ? styles.active : ''}`}
                        onClick={() => setSelectedDisease('malaria')}
                    >
                        🦟 Malaria
                    </button>
                    <button
                        className={`${styles.diseaseTab} ${selectedDisease === 'tuberculosis' ? styles.active : ''}`}
                        onClick={() => setSelectedDisease('tuberculosis')}
                    >
                        🫁 TB
                    </button>
                    <button
                        className={`${styles.diseaseTab} ${selectedDisease === 'hiv' ? styles.active : ''}`}
                        onClick={() => setSelectedDisease('hiv')}
                    >
                        🎗️ HIV/AIDS
                    </button>
                </div>

                {/* COVID-19 Stats */}
                {selectedDisease === 'covid' && (
                    <>
                        <div className={styles.statsSection}>
                            <h3 className={styles.sectionTitle}>Worldwide</h3>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>🦠</div>
                                <div className={styles.statContent}>
                                    <div className={styles.statValue}>{globalData?.confirmed?.value.toLocaleString()}</div>
                                    <div className={styles.statLabel}>Total Cases</div>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>💚</div>
                                <div className={styles.statContent}>
                                    <div className={`${styles.statValue} ${styles.green}`}>{globalData?.recovered?.value.toLocaleString()}</div>
                                    <div className={styles.statLabel}>Recovered</div>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>💔</div>
                                <div className={styles.statContent}>
                                    <div className={`${styles.statValue} ${styles.red}`}>{globalData?.deaths?.value.toLocaleString()}</div>
                                    <div className={styles.statLabel}>Deaths</div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.dailyChangesSection}>
                            <h3 className={styles.sectionTitle}>Today's Update</h3>
                            <div className={styles.changeCard}>
                                <div className={styles.changeHeader}>
                                    <span className={styles.changeIcon}>📈</span>
                                    <span className={styles.changeLabel}>New Cases</span>
                                </div>
                                <div className={styles.changeValue}>
                                    {globalData?.todayCases ? `+${globalData.todayCases.toLocaleString()}` : 'N/A'}
                                </div>
                            </div>
                            <div className={styles.changeCard}>
                                <div className={styles.changeHeader}>
                                    <span className={styles.changeIcon}>💔</span>
                                    <span className={styles.changeLabel}>New Deaths</span>
                                </div>
                                <div className={`${styles.changeValue} ${styles.red}`}>
                                    {globalData?.todayDeaths ? `+${globalData.todayDeaths.toLocaleString()}` : 'N/A'}
                                </div>
                            </div>
                            <div className={styles.changeCard}>
                                <div className={styles.changeHeader}>
                                    <span className={styles.changeIcon}>💚</span>
                                    <span className={styles.changeLabel}>New Recoveries</span>
                                </div>
                                <div className={`${styles.changeValue} ${styles.green}`}>
                                    {globalData?.todayRecovered ? `+${globalData.todayRecovered.toLocaleString()}` : 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div className={styles.topCountriesSection}>
                            <h3 className={styles.sectionTitle}>Top 5 Affected</h3>
                            <div className={styles.countryList}>
                                {topCountries.map((country, index) => (
                                    <div
                                        key={country.name}
                                        className={styles.countryItem}
                                        onClick={() => setSelectedCountry(country)}
                                    >
                                        <div className={styles.countryRank}>{index + 1}</div>
                                        <img src={country.flag} alt={country.name} className={styles.countryFlag} />
                                        <div className={styles.countryInfo}>
                                            <div className={styles.countryName}>{country.name}</div>
                                            <div className={styles.countryCases}>{country.cases.toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Influenza Stats */}
                {selectedDisease === 'influenza' && influenzaData.length > 0 && (
                    <>
                        <div className={styles.statsSection}>
                            <h3 className={styles.sectionTitle}>Latest Week Data</h3>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>🤧</div>
                                <div className={styles.statContent}>
                                    <div className={styles.statValue}>
                                        {influenzaData[influenzaData.length - 1].totalILI.toLocaleString()}
                                    </div>
                                    <div className={styles.statLabel}>ILI Cases</div>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>👥</div>
                                <div className={styles.statContent}>
                                    <div className={styles.statValue}>
                                        {influenzaData[influenzaData.length - 1].totalPatients.toLocaleString()}
                                    </div>
                                    <div className={styles.statLabel}>Total Patients</div>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>📊</div>
                                <div className={styles.statContent}>
                                    <div className={styles.statValue}>
                                        {influenzaData[influenzaData.length - 1].percentWeightedILI}%
                                    </div>
                                    <div className={styles.statLabel}>ILI Percentage</div>
                                </div>
                            </div>
                        </div>

                        {/* Age Breakdown */}
                        <div className={styles.ageBreakdownSection}>
                            <h3 className={styles.sectionTitle}>Age Distribution</h3>
                            <div className={styles.ageBreakdownList}>
                                <div className={styles.ageBreakdownItem}>
                                    <span className={styles.ageLabel}>👶 0-4 years</span>
                                    <span className={styles.ageValue}>{influenzaData[influenzaData.length - 1]['age 0-4'].toLocaleString()}</span>
                                </div>
                                <div className={styles.ageBreakdownItem}>
                                    <span className={styles.ageLabel}>🧒 5-24 years</span>
                                    <span className={styles.ageValue}>{influenzaData[influenzaData.length - 1]['age 5-24'].toLocaleString()}</span>
                                </div>
                                <div className={styles.ageBreakdownItem}>
                                    <span className={styles.ageLabel}>👨 25-49 years</span>
                                    <span className={styles.ageValue}>{influenzaData[influenzaData.length - 1]['age 25-49'].toLocaleString()}</span>
                                </div>
                                <div className={styles.ageBreakdownItem}>
                                    <span className={styles.ageLabel}>🧑 50-64 years</span>
                                    <span className={styles.ageValue}>{influenzaData[influenzaData.length - 1]['age 50-64'].toLocaleString()}</span>
                                </div>
                                <div className={styles.ageBreakdownItem}>
                                    <span className={styles.ageLabel}>👴 64+ years</span>
                                    <span className={styles.ageValue}>{influenzaData[influenzaData.length - 1]['age 64+'].toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.infoBox}>
                            <p><strong>Week:</strong> {influenzaData[influenzaData.length - 1].week}</p>
                            <p><strong>About ILI:</strong> Influenza-Like Illness includes fever with cough or sore throat.</p>
                            <p><strong>Source:</strong> CDC ILINet surveillance (US only)</p>
                        </div>
                    </>
                )}

                {/* Malaria Stats */}
                {selectedDisease === 'malaria' && (
                    <div className={styles.statsSection}>
                        <h3 className={styles.sectionTitle}>Global Data ({diseaseData.malaria.lastUpdated})</h3>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>{diseaseData.malaria.icon}</div>
                            <div className={styles.statContent}>
                                <div className={styles.statValue}>
                                    {diseaseData.malaria.global.estimatedCases.toLocaleString()}
                                </div>
                                <div className={styles.statLabel}>Estimated Cases</div>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>💔</div>
                            <div className={styles.statContent}>
                                <div className={`${styles.statValue} ${styles.red}`}>
                                    {diseaseData.malaria.global.deaths.toLocaleString()}
                                </div>
                                <div className={styles.statLabel}>Deaths</div>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>🌍</div>
                            <div className={styles.statContent}>
                                <div className={styles.statValue}>
                                    {diseaseData.malaria.global.countriesAffected}
                                </div>
                                <div className={styles.statLabel}>Countries Affected</div>
                            </div>
                        </div>
                        <div className={styles.infoBox}>
                            {diseaseData.malaria.keyFacts.map((fact, idx) => (
                                <p key={idx}>• {fact}</p>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tuberculosis Stats */}
                {selectedDisease === 'tuberculosis' && (
                    <div className={styles.statsSection}>
                        <h3 className={styles.sectionTitle}>Global Data ({diseaseData.tuberculosis.lastUpdated})</h3>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>{diseaseData.tuberculosis.icon}</div>
                            <div className={styles.statContent}>
                                <div className={styles.statValue}>
                                    {diseaseData.tuberculosis.global.estimatedCases.toLocaleString()}
                                </div>
                                <div className={styles.statLabel}>Estimated Cases</div>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>💔</div>
                            <div className={styles.statContent}>
                                <div className={`${styles.statValue} ${styles.red}`}>
                                    {diseaseData.tuberculosis.global.deaths.toLocaleString()}
                                </div>
                                <div className={styles.statLabel}>Deaths</div>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>🌍</div>
                            <div className={styles.statContent}>
                                <div className={styles.statValue}>
                                    {diseaseData.tuberculosis.global.countriesAffected}
                                </div>
                                <div className={styles.statLabel}>Countries Affected</div>
                            </div>
                        </div>
                        <div className={styles.infoBox}>
                            {diseaseData.tuberculosis.keyFacts.map((fact, idx) => (
                                <p key={idx}>• {fact}</p>
                            ))}
                        </div>
                    </div>
                )}

                {/* HIV/AIDS Stats */}
                {selectedDisease === 'hiv' && (
                    <div className={styles.statsSection}>
                        <h3 className={styles.sectionTitle}>Global Data ({diseaseData.hiv.lastUpdated})</h3>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>{diseaseData.hiv.icon}</div>
                            <div className={styles.statContent}>
                                <div className={styles.statValue}>
                                    {diseaseData.hiv.global.estimatedCases.toLocaleString()}
                                </div>
                                <div className={styles.statLabel}>People Living with HIV</div>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>💊</div>
                            <div className={styles.statContent}>
                                <div className={`${styles.statValue} ${styles.green}`}>
                                    {diseaseData.hiv.global.peopleOnTreatment.toLocaleString()}
                                </div>
                                <div className={styles.statLabel}>On Treatment</div>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>💔</div>
                            <div className={styles.statContent}>
                                <div className={`${styles.statValue} ${styles.red}`}>
                                    {diseaseData.hiv.global.deaths.toLocaleString()}
                                </div>
                                <div className={styles.statLabel}>Annual Deaths</div>
                            </div>
                        </div>
                        <div className={styles.infoBox}>
                            {diseaseData.hiv.keyFacts.map((fact, idx) => (
                                <p key={idx}>• {fact}</p>
                            ))}
                        </div>
                    </div>
                )}
            </aside>

            <main className={styles.mainContent}>
                {selectedDisease === 'covid' && (
                    <>
                        <div className={styles.mapSection}>
                            <div className={styles.mapHeader}>
                                <h2>Global Hotspots</h2>
                                <div className={styles.mapLegend}>
                                    <span className={styles.legendItem}>
                                        <span className={styles.legendDot} style={{ backgroundColor: '#8B0000' }}></span>
                                        &gt;10M
                                    </span>
                                    <span className={styles.legendItem}>
                                        <span className={styles.legendDot} style={{ backgroundColor: '#CC1034' }}></span>
                                        5M-10M
                                    </span>
                                    <span className={styles.legendItem}>
                                        <span className={styles.legendDot} style={{ backgroundColor: '#FF4444' }}></span>
                                        1M-5M
                                    </span>
                                    <span className={styles.legendItem}>
                                        <span className={styles.legendDot} style={{ backgroundColor: '#FF9999' }}></span>
                                        &lt;1M
                                    </span>
                                </div>
                            </div>
                            <div className={styles.mapContainer}>
                                <MapContainer
                                    center={mapCenter}
                                    zoom={mapZoom}
                                    style={{ height: '100%', width: '100%' }}
                                    zoomControl={true}
                                >
                                    <TileLayer
                                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                        attribution='&copy; OpenStreetMap contributors'
                                    />
                                    {circles}
                                </MapContainer>
                            </div>
                        </div>

                        {selectedCountry && (
                            <div className={styles.detailsPanel}>
                                <div className={styles.detailsHeader}>
                                    <img src={selectedCountry.flag} alt={selectedCountry.name} />
                                    <h3>{selectedCountry.name}</h3>
                                    <button onClick={() => setSelectedCountry(null)} className={styles.closeBtn}>×</button>
                                </div>
                                <div className={styles.detailsGrid}>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Total Cases</span>
                                        <span className={styles.detailValue}>{selectedCountry.cases.toLocaleString()}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Active</span>
                                        <span className={styles.detailValue}>{selectedCountry.active.toLocaleString()}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Recovered</span>
                                        <span className={`${styles.detailValue} ${styles.green}`}>{selectedCountry.recovered.toLocaleString()}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Deaths</span>
                                        <span className={`${styles.detailValue} ${styles.red}`}>{selectedCountry.deaths.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {selectedDisease === 'influenza' && influenzaData.length > 0 && (
                    <div className={styles.influenzaContent}>
                        <div className={styles.trendSection}>
                            <h2>📈 ILI Trend (Last 30 Weeks)</h2>
                            <div className={styles.chartContainer}>
                                <Line
                                    data={{
                                        labels: influenzaData.map(w => w.week),
                                        datasets: [{
                                            label: 'ILI Cases',
                                            data: influenzaData.map(w => w.totalILI),
                                            borderColor: '#00d4ff',
                                            backgroundColor: 'rgba(0, 212, 255, 0.1)',
                                            fill: true,
                                            tension: 0.4,
                                            pointRadius: 3,
                                            pointHoverRadius: 6,
                                            pointBackgroundColor: '#00d4ff',
                                            pointBorderColor: '#fff',
                                            pointBorderWidth: 2,
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: false
                                            },
                                            tooltip: {
                                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                titleColor: '#00d4ff',
                                                bodyColor: '#fff',
                                                borderColor: '#00d4ff',
                                                borderWidth: 1,
                                                padding: 12,
                                                displayColors: false,
                                                callbacks: {
                                                    label: (context) => {
                                                        return `Cases: ${context.parsed.y.toLocaleString()}`;
                                                    }
                                                }
                                            }
                                        },
                                        scales: {
                                            x: {
                                                ticks: {
                                                    color: '#888',
                                                    maxRotation: 45,
                                                    minRotation: 45,
                                                    font: { size: 10 }
                                                },
                                                grid: {
                                                    color: 'rgba(255, 255, 255, 0.05)'
                                                }
                                            },
                                            y: {
                                                ticks: {
                                                    color: '#888',
                                                    callback: (value) => value.toLocaleString()
                                                },
                                                grid: {
                                                    color: 'rgba(255, 255, 255, 0.05)'
                                                }
                                            }
                                        }
                                    }}
                                    height={250}
                                />
                            </div>
                        </div>

                        <div className={styles.detailsPanel}>
                            <h3>📊 Detailed Statistics</h3>
                            <div className={styles.detailsGrid}>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Avg Weekly Cases</span>
                                    <span className={styles.detailValue}>
                                        {Math.round(influenzaData.reduce((sum, w) => sum + w.totalILI, 0) / influenzaData.length).toLocaleString()}
                                    </span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Peak Cases</span>
                                    <span className={styles.detailValue}>
                                        {Math.max(...influenzaData.map(w => w.totalILI)).toLocaleString()}
                                    </span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Lowest Cases</span>
                                    <span className={styles.detailValue}>
                                        {Math.min(...influenzaData.map(w => w.totalILI)).toLocaleString()}
                                    </span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Current % ILI</span>
                                    <span className={styles.detailValue}>
                                        {influenzaData[influenzaData.length - 1].percentWeightedILI}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Malaria Main Content */}
                {selectedDisease === 'malaria' && (
                    <div className={styles.diseaseRegionalView}>
                        <h2>🦟 Malaria by WHO Region</h2>
                        <div className={styles.regionGrid}>
                            {diseaseData.malaria.byRegion.map((region, idx) => (
                                <div key={idx} className={styles.regionCard}>
                                    <h3>{region.region}</h3>
                                    <div className={styles.regionStats}>
                                        <div className={styles.regionStat}>
                                            <span className={styles.regionLabel}>Cases</span>
                                            <span className={styles.regionValue}>{region.cases.toLocaleString()}</span>
                                        </div>
                                        <div className={styles.regionStat}>
                                            <span className={styles.regionLabel}>Deaths</span>
                                            <span className={`${styles.regionValue} ${styles.red}`}>{region.deaths.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tuberculosis Main Content */}
                {selectedDisease === 'tuberculosis' && (
                    <div className={styles.diseaseRegionalView}>
                        <h2>🫁 Tuberculosis by WHO Region</h2>
                        <div className={styles.regionGrid}>
                            {diseaseData.tuberculosis.byRegion.map((region, idx) => (
                                <div key={idx} className={styles.regionCard}>
                                    <h3>{region.region}</h3>
                                    <div className={styles.regionStats}>
                                        <div className={styles.regionStat}>
                                            <span className={styles.regionLabel}>Cases</span>
                                            <span className={styles.regionValue}>{region.cases.toLocaleString()}</span>
                                        </div>
                                        <div className={styles.regionStat}>
                                            <span className={styles.regionLabel}>Deaths</span>
                                            <span className={`${styles.regionValue} ${styles.red}`}>{region.deaths.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* HIV/AIDS Main Content */}
                {selectedDisease === 'hiv' && (
                    <div className={styles.diseaseRegionalView}>
                        <h2>🎗️ HIV/AIDS by WHO Region</h2>
                        <div className={styles.regionGrid}>
                            {diseaseData.hiv.byRegion.map((region, idx) => (
                                <div key={idx} className={styles.regionCard}>
                                    <h3>{region.region}</h3>
                                    <div className={styles.regionStats}>
                                        <div className={styles.regionStat}>
                                            <span className={styles.regionLabel}>Living with HIV</span>
                                            <span className={styles.regionValue}>{region.cases.toLocaleString()}</span>
                                        </div>
                                        <div className={styles.regionStat}>
                                            <span className={styles.regionLabel}>Deaths</span>
                                            <span className={`${styles.regionValue} ${styles.red}`}>{region.deaths.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
