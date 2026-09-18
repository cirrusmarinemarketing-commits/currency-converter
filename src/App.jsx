import { useEffect, useState } from "react";
import { getExchangeRates } from "./services/exchangeRateApi";

const quickCurrencies = [
  "USD",
  "THB",
  "EUR",
  "GBP",
  "JPY",
  "SGD",
  "CNY",
  "AUD",
];

function App() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("THB");
  const [to, setTo] = useState("USD");

  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRates() {
      try {
        setLoading(true);
        setError(null);

        const data = await getExchangeRates(from);

        setRates(data.conversion_rates);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadRates();
  }, [from]);

  const currencies = Object.keys(rates);
  const convertedAmount = Number(amount || 0) * (rates[to] || 0);

  function swapCurrency() {
    setFrom(to);
    setTo(from);
  }

  function selectQuickCurrency(currency) {
    setTo(currency);
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Currency Converter
        </h1>

        <p className="text-gray-500 text-center mt-2">
          Convert currencies quickly and easily
        </p>

        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          {/* Converter */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* From */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                From
              </label>

              <div className="flex gap-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  placeholder="Amount"
                  className="w-full min-w-0 border border-gray-300 rounded-lg px-4 py-3 text-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-24 border border-gray-300 rounded-lg px-3 py-3 bg-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap */}
            <button
              onClick={swapCurrency}
              className="shrink-0 sm:mt-7 w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-600 text-lg font-semibold flex items-center justify-center hover:bg-gray-100 hover:text-gray-900 transition"
              title="Swap currencies"
            >
              ⇄
            </button>

            {/* To */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                To
              </label>

              <div className="flex gap-2">
                <div className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg bg-gray-50 overflow-hidden">
                  {loading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    convertedAmount.toFixed(2)
                  )}
                </div>

                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-24 border border-gray-300 rounded-lg px-3 py-3 bg-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Currency */}
          <div className="mt-8">
            <p className="text-sm font-medium text-gray-600 mb-3">
              Quick Currency
            </p>

            <div className="flex flex-wrap gap-2">
              {quickCurrencies.map((currency) => (
                <button
                  key={currency}
                  onClick={() => selectQuickCurrency(currency)}
                  className={`
                    px-4 py-2 rounded-lg border text-sm font-medium transition
                    ${to === currency
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }
                  `}
                >
                  {currency}
                </button>
              ))}
            </div>
          </div>

          {/* Rate */}
          {!loading && rates[to] && (
            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                1 {from} = {rates[to]} {to}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="mt-4 text-sm text-red-500 text-center">
              {error}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;