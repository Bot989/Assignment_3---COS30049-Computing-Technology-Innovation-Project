import React from "react";
import ReactCSV from './components/ReactCSV';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/header-footer.css';

const App = () => {
    return (
        <div className="App">
            <Header />
            <main className="main-content">
                <ReactCSV />
            </main>
            <Footer />
        </div>
    );
};

export default App;  // Export App, not ReactCSV