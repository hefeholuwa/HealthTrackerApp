// Hybrid disease data fetcher
// Uses APIs when available, falls back to WHO statistical data

// Fallback data from WHO (2023-2024 reports)
const fallbackData = {
    malaria: {
        name: 'Malaria',
        icon: '🦟',
        lastUpdated: '2024 WHO Report',
        source: 'WHO World Malaria Report 2024',
        global: {
            estimatedCases: 249000000,
            deaths: 608000,
            countriesAffected: 85,
            peopleAtRisk: 2400000000
        },
        byRegion: [
            { region: 'African Region', cases: 233700000, deaths: 580000 },
            { region: 'South-East Asia', cases: 5800000, deaths: 12000 },
            { region: 'Eastern Mediterranean', cases: 4700000, deaths: 9800 },
            { region: 'Western Pacific', cases: 2200000, deaths: 3500 },
            { region: 'Americas', cases: 650000, deaths: 600 },
            { region: 'European Region', cases: 0, deaths: 0 }
        ],
        keyFacts: [
            'Nearly half of the world\'s population is at risk',
            'Children under 5 account for 76% of malaria deaths',
            '95% of cases occur in Africa',
            'Preventable and curable disease',
            'Data Source: WHO World Malaria Report 2024'
        ]
    },
    tuberculosis: {
        name: 'Tuberculosis (TB)',
        icon: '🫁',
        lastUpdated: '2024 WHO Report',
        source: 'WHO Global Tuberculosis Report 2024',
        global: {
            estimatedCases: 10600000,
            deaths: 1300000,
            countriesAffected: 194,
            peopleAtRisk: 2000000000
        },
        byRegion: [
            { region: 'South-East Asia', cases: 4590000, deaths: 733000 },
            { region: 'African Region', cases: 2500000, deaths: 536000 },
            { region: 'Western Pacific', cases: 2000000, deaths: 182000 },
            { region: 'Eastern Mediterranean', cases: 842000, deaths: 73000 },
            { region: 'Americas', cases: 322000, deaths: 32000 },
            { region: 'European Region', cases: 230000, deaths: 24000 }
        ],
        keyFacts: [
            'Leading cause of death from infectious disease',
            'One of top 10 causes of death worldwide',
            'Curable and preventable',
            'Drug-resistant TB is a major concern',
            'Data Source: WHO Global TB Report 2024'
        ]
    },
    hiv: {
        name: 'HIV/AIDS',
        icon: '🎗️',
        lastUpdated: '2024 UNAIDS Report',
        source: 'UNAIDS Global AIDS Update 2024',
        global: {
            estimatedCases: 39000000,
            deaths: 630000,
            countriesAffected: 195,
            peopleOnTreatment: 29800000
        },
        byRegion: [
            { region: 'African Region', cases: 25600000, deaths: 480000 },
            { region: 'Americas', cases: 5600000, deaths: 48000 },
            { region: 'South-East Asia', cases: 4200000, deaths: 62000 },
            { region: 'European Region', cases: 2200000, deaths: 29000 },
            { region: 'Western Pacific', cases: 2100000, deaths: 11000 },
            { region: 'Eastern Mediterranean', cases: 300000, deaths: 8000 }
        ],
        keyFacts: [
            '39 million people living with HIV globally',
            '29.8 million people on antiretroviral therapy',
            'No cure, but can be controlled with treatment',
            'New infections declined by 52% since peak in 1997',
            'Data Source: UNAIDS Global AIDS Update 2024'
        ]
    }
};

// Export both the fallback data and the fetcher function
export const diseaseData = fallbackData;

// Future API integration function (can be enhanced later)
export const fetchDiseaseData = async (disease) => {
    // For now, return fallback data
    // In future, we can add API calls here with fallback
    return fallbackData[disease];
};
