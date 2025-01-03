import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [conversionRate, setConversionRate] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = 'da9300077c1ce51e84396099';  
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`;

  useEffect(() => {
    // Fetch currency data on component mount
    setLoading(true);
    setError(null); // Reset error before new request
    axios.get(url)
      .then(response => {
        setCurrencies(Object.keys(response.data.conversion_rates));
        setLoading(false);
        setConversionRate(response.data.conversion_rates[toCurrency]);
      })
      .catch(error => {
        setLoading(false);
        setError('Error fetching currency data. Please try again later.');
        console.error('Error fetching data', error);
      });
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    // Update the converted amount whenever the amount or currencies change
    if (conversionRate !== 0) {
      setConvertedAmount(amount * conversionRate);
    }
  }, [amount, conversionRate]);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
  };

  return (
    <div className="App">
      <h1>Currency Converter</h1>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="converter-card">
          <div className="converter">
            <div className="input-group">
              <label htmlFor="fromCurrency">From: </label>
              <select id="fromCurrency" value={fromCurrency} onChange={handleFromCurrencyChange}>
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
              <input type="number" value={amount} onChange={handleAmountChange} />
            </div>

            <div className="input-group">
              <label htmlFor="toCurrency">To: </label>
              <select id="toCurrency" value={toCurrency} onChange={handleToCurrencyChange}>
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
              <input type="number" value={convertedAmount} readOnly />
            </div>

            <div className="rate">
              <p>1 {fromCurrency} = {conversionRate} {toCurrency}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
