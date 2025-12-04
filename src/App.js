import React from 'react';
import { Dashboard } from './components';
import styles from './App.module.css';

const App = () => {
    return (
        <div className={styles.container}>
            <Dashboard />
        </div>
    );
};

export default App;
