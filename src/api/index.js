import axios from 'axios';

const url = 'https://disease.sh/v3/covid-19';

export const fetchData = async (country) => {
  let changeableUrl = `${url}/all`;

  if (country) {
    changeableUrl = `${url}/countries/${country}`;
  }

  try {
    const { data } = await axios.get(changeableUrl);

    return {
      confirmed: { value: data.cases },
      recovered: { value: data.recovered },
      deaths: { value: data.deaths },
      lastUpdate: data.updated,
    };
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const fetchDailyData = async () => {
  try {
    const { data } = await axios.get(`${url}/historical/all?lastdays=all`);

    const modifiedData = Object.keys(data.cases).map((date) => ({
      confirmed: data.cases[date],
      deaths: data.deaths[date],
      date: date,
    }));

    return modifiedData;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const fetchCountries = async () => {
  try {
    const { data } = await axios.get(`${url}/countries`);

    return data.map((country) => country.country);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const fetchCountriesData = async () => {
  try {
    const { data } = await axios.get(`${url}/countries`);
    return data.map((country) => ({
      name: country.country,
      cases: country.cases,
      recovered: country.recovered,
      deaths: country.deaths,
      active: country.active,
      flag: country.countryInfo.flag,
      lat: country.countryInfo.lat,
      long: country.countryInfo.long,
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const fetchVaccineData = async (country) => {
  try {
    let changeableUrl = 'https://disease.sh/v3/covid-19/vaccine/coverage/countries?lastdays=30';

    if (country && country !== 'Global') {
      changeableUrl = `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${country}?lastdays=30`;
    }

    const { data } = await axios.get(changeableUrl);

    // If specific country, data is the object directly. If all countries, it's an array.
    // However, the endpoint structure varies slightly. 
    // For specific country: { timeline: { date: count, ... } }
    // For all countries (we might not need this for the chart unless we aggregate):
    // Let's stick to specific country or global aggregation if possible.

    // Actually, for global vaccine coverage, there is a specific endpoint:
    if (!country || country === 'Global') {
      const { data: globalData } = await axios.get('https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=30');
      return Object.keys(globalData).map((date) => ({ date, daily: globalData[date] }));
    }

    // For a specific country
    if (data.timeline) {
      return Object.keys(data.timeline).map((date) => ({ date, daily: data.timeline[date] }));
    }

    return [];

  } catch (error) {
    console.log(error);
    return [];
  }
};