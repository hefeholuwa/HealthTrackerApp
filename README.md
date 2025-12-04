# 🌍 Global Health Diseases Tracker

A comprehensive real-time dashboard for monitoring major global health diseases including COVID-19, Influenza, Malaria, Tuberculosis, and HIV/AIDS.

[![GitHub](https://img.shields.io/badge/GitHub-hefeholuwa%2FHealthTrackerApp-blue)](https://github.com/hefeholuwa/HealthTrackerApp)
[![Version](https://img.shields.io/badge/version-2.0.0-green)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

## 📊 Overview

This interactive web application provides a unified platform to track and visualize global health disease statistics. Originally built as a COVID-19 tracker, it has evolved into a multi-disease monitoring system that combines real-time API data with official WHO and UNAIDS statistics.

## ✨ Features

### 🦠 **COVID-19 Dashboard**
- Real-time global statistics (cases, recoveries, deaths)
- Today's updates (new cases, deaths, recoveries)
- Interactive world map with color-coded country hotspots
- Top 5 most affected countries
- Detailed country-specific information with flags

### 🤧 **Influenza Dashboard**
- Latest CDC ILINet surveillance data
- Age distribution breakdown (0-4, 5-24, 25-49, 50-64, 64+ years)
- 30-week trend visualization
- Detailed statistics (average, peak, lowest cases)

### 🦟 **Malaria Dashboard**
- Global statistics from WHO World Malaria Report 2024
- Regional breakdown by WHO regions
- Estimated cases and deaths
- Key educational facts

### 🫁 **Tuberculosis (TB) Dashboard**
- WHO Global Tuberculosis Report 2024 data
- Regional statistics across all continents
- Treatment and prevention information
- Drug-resistant TB insights

### 🎗️ **HIV/AIDS Dashboard**
- UNAIDS Global AIDS Update 2024
- People living with HIV worldwide
- Treatment coverage statistics
- Regional distribution data

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hefeholuwa/HealthTrackerApp.git
   cd HealthTrackerApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 17** | Frontend framework |
| **Material-UI** | UI component library |
| **Leaflet** | Interactive maps |
| **React-Leaflet** | React bindings for Leaflet |
| **Chart.js** | Data visualization |
| **React-ChartJS-2** | React wrapper for Chart.js |
| **Axios** | HTTP client |
| **CSS Modules** | Component-scoped styling |

## 📡 Data Sources

- **COVID-19 & Influenza**: [disease.sh API](https://disease.sh/) - Real-time data
- **Malaria**: WHO World Malaria Report 2024
- **Tuberculosis**: WHO Global Tuberculosis Report 2024
- **HIV/AIDS**: UNAIDS Global AIDS Update 2024

## 🎨 UI/UX Features

- 🌙 **Dark theme** with vibrant color accents
- 📱 **Responsive design** for all screen sizes
- 🗺️ **Interactive maps** with clickable regions
- 📈 **Dynamic charts** and trend visualizations
- ⚡ **Fast loading** with optimized components
- 🎯 **Intuitive navigation** between diseases

## 📂 Project Structure

```
src/
├── components/
│   ├── Dashboard/          # Main dashboard component
│   ├── Cards/             # Statistics cards
│   ├── Chart/             # Chart components
│   ├── Map/               # Map components
│   ├── MapView/           # Map view wrapper
│   ├── Table/             # Data tables
│   ├── Vaccinations/      # Vaccination tracker
│   └── index.js           # Component exports
├── data/
│   └── diseases.js        # Static WHO/UNAIDS data
├── api/
│   └── index.js           # API fetch functions
├── App.js                 # Main app component
└── index.js               # Entry point
```

## 🔮 Roadmap

- [ ] Add more diseases (Dengue, Cholera, Ebola)
- [ ] Historical trend charts for all diseases
- [ ] Advanced country search and filtering
- [ ] Data export (PDF/CSV)
- [ ] PWA support for offline access
- [ ] User preferences and favorites
- [ ] Multi-disease comparison mode
- [ ] Mobile app versions

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**hefeholuwa**
- GitHub: [@hefeholuwa](https://github.com/hefeholuwa)

## 🙏 Acknowledgments

- [disease.sh](https://disease.sh/) for providing free COVID-19 and Influenza APIs
- World Health Organization (WHO) for disease statistics
- UNAIDS for HIV/AIDS data
- CDC for Influenza surveillance data
- OpenStreetMap contributors for map tiles

## 📧 Contact & Support

If you have any questions or suggestions, please open an issue on GitHub.

---

**⭐ Star this repository if you find it useful!**

Made with ❤️ by hefeholuwa
