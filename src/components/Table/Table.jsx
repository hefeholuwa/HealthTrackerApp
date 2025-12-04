import React, { useState, useEffect } from 'react';
import { fetchCountriesData } from '../../api';
import styles from './Table.module.css';

const Table = () => {
    const [countriesData, setCountriesData] = useState([]);

    useEffect(() => {
        const fetchAPI = async () => {
            const data = await fetchCountriesData();
            // Sort by cases descending by default
            const sortedData = data.sort((a, b) => b.cases - a.cases);
            setCountriesData(sortedData);
        };

        fetchAPI();
    }, []);

    return (
        <div className={styles.tableContainer}>
            <h3 className={styles.heading}>Live Cases by Country</h3>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Country</th>
                            <th>Cases</th>
                            <th>Recovered</th>
                            <th>Deaths</th>
                        </tr>
                    </thead>
                    <tbody>
                        {countriesData.map(({ name, cases, recovered, deaths, flag }) => (
                            <tr key={name}>
                                <td className={styles.countryCell}>
                                    <img src={flag} alt={`Flag of ${name}`} className={styles.flag} />
                                    {name}
                                </td>
                                <td>{cases.toLocaleString()}</td>
                                <td className={styles.recovered}>{recovered.toLocaleString()}</td>
                                <td className={styles.deaths}>{deaths.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
