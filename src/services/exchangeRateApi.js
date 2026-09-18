const API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;

export async function getExchangeRates(baseCurrency) {
    const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch exchange rates");
    }

    const data = await response.json();

    if (data.result !== "success") {
        throw new Error("Exchange rate API error");
    }

    return data;
}