import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchVaccineData } from '../../api';
import styles from './Vaccinations.module.css';

const Vaccinations = ({ country }) => {
    const [vaccineData, setVaccineData] = useState([]);

    useEffect(() => {
        const fetchAPI = async () => {
            setVaccineData(await fetchVaccineData(country));
        };

        fetchAPI();
    }, [country]);

    const lineChart = (
        vaccineData.length ? (
            <Line
                data={{
                    labels: vaccineData.map(({ date }) => date),
                    datasets: [{
                        data: vaccineData.map(({ daily }) => daily),
                        label: 'Total Doses Administered',
                        borderColor: '#00ff88',
                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                        fill: true,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    }],
                }}
                options={{
                    title: {
                        display: true,
                        text: `Vaccination Trends (${country ? country : 'Global'}) - Last 30 Days`,
                        fontColor: '#e0e0e0',
                        fontSize: 16
                    },
                    legend: {
                        labels: { fontColor: '#e0e0e0' }
                    },
                    scales: {
                        xAxes: [{
                            ticks: { fontColor: '#e0e0e0' },
                            gridLines: { color: 'rgba(255,255,255,0.1)' }
                        }],
                        yAxes: [{
                            ticks: {
                                fontColor: '#e0e0e0',
                                callback: function (value) {
                                    return value.toLocaleString();
                                }
                            },
                            gridLines: { color: 'rgba(255,255,255,0.1)' }
                        }]
                    },
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem, data) {
                                return tooltipItem.yLabel.toLocaleString() + ' Doses';
                            }
                        }
                    }
                }}
            />
        ) : <div className={styles.loading}>Loading Vaccination Data...</div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.chartContainer}>
                {lineChart}
            </div>
        </div>
    );
};

export default Vaccinations;
