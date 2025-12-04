import React, { useState, useEffect } from 'react';
import { Cards, Chart, CountryPicker, Vaccinations, Table, Map } from "..";
import styles from './CovidTracker.module.css';
import { fetchData } from '../../api';
import coronaImage from '../../images/coronaImage.png';

const CovidTracker = () => {
    const [data, setData] = useState({});
    const [country, setCountry] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            const fetchedData = await fetchData();
            setData(fetchedData);
        };
        fetchInitialData();
    }, []);

    const handleCountryChange = async (selectedCountry) => {
        const fetchedData = await fetchData(selectedCountry);
        setData(fetchedData);
        setCountry(selectedCountry);
    };

    return (
        <div className={styles.container}>
            <img className={styles.image} src={coronaImage} alt="COVID-19" />
            <Cards data={data} />
            <Map />
            <CountryPicker handleCountryChange={handleCountryChange} />
            <Chart data={data} country={country} />
            <Vaccinations country={country} />
            <Table />
        </div>
    );
};

export default CovidTracker;
