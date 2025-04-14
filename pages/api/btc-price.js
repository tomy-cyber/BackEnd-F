const { runMiddleware, cors } = require("../../middlewares/cors")

// Cache settings
let cachedRate = null
let lastFetched = 0
const CACHE_DURATION = 10 * 1000 // 10 seconds

// Price validation constants
const MIN_REALISTIC_BTC_PRICE = 10000 // $10,000 minimum realistic price
const MAX_REALISTIC_BTC_PRICE = 150000 // $150,000 maximum realistic price

export default async function handler(req, res) {
  // Run the CORS middleware to allow cross-origin requests
  await runMiddleware(req, res, cors)

  const now = Date.now()
  const source = req.query.source || "auto"

  // Return cached value if still valid and no specific source requested
  if (source === "auto" && cachedRate && now - lastFetched < CACHE_DURATION) {
    return res.status(200).json({
      rate: cachedRate,
      cached: true,
      timestamp: lastFetched,
      age: now - lastFetched,
    })
  }

  try {
    let btcPrice = null
    let priceSource = "unknown"

    // Try Binance first (usually most accurate for current market price)
    if (source === "binance" || source === "auto") {
      try {
        const binanceResponse = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT")

        if (binanceResponse.ok) {
          const binanceData = await binanceResponse.json()
          const price = Number.parseFloat(binanceData.price)

          if (!isNaN(price) && price > MIN_REALISTIC_BTC_PRICE && price < MAX_REALISTIC_BTC_PRICE) {
            btcPrice = price
            priceSource = "binance"
          }
        }
      } catch (error) {
        console.error("Binance API error:", error)
        // Continue to next source if this one fails
      }
    }

    // Try CoinGecko if Binance failed or wasn't requested
    if (btcPrice === null && (source === "coingecko" || source === "auto")) {
      try {
        const coinGeckoResponse = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
        )

        if (coinGeckoResponse.ok) {
          const coinGeckoData = await coinGeckoResponse.json()
          const price = coinGeckoData.bitcoin?.usd

          if (!isNaN(price) && price > MIN_REALISTIC_BTC_PRICE && price < MAX_REALISTIC_BTC_PRICE) {
            btcPrice = price
            priceSource = "coingecko"
          }
        }
      } catch (error) {
        console.error("CoinGecko API error:", error)
      }
    }

    // Try Coinbase as a third option
    if (btcPrice === null && (source === "coinbase" || source === "auto")) {
      try {
        const coinbaseResponse = await fetch("https://api.coinbase.com/v2/prices/BTC-USD/spot")

        if (coinbaseResponse.ok) {
          const coinbaseData = await coinbaseResponse.json()
          const price = Number.parseFloat(coinbaseData.data?.amount)

          if (!isNaN(price) && price > MIN_REALISTIC_BTC_PRICE && price < MAX_REALISTIC_BTC_PRICE) {
            btcPrice = price
            priceSource = "coinbase"
          }
        }
      } catch (error) {
        console.error("Coinbase API error:", error)
      }
    }

    // If all APIs failed or returned unrealistic values, throw an error
    if (btcPrice === null) {
      throw new Error("Could not retrieve a valid Bitcoin price from any source")
    }

    // Update cache if not using a specific source
    if (source === "auto") {
      cachedRate = btcPrice
      lastFetched = now
    }

    // Return the price data
    return res.status(200).json({
      rate: btcPrice,
      source: priceSource,
      timestamp: now,
      formatted: `$${btcPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    })
  } catch (error) {
    console.error("Error fetching BTC price:", error)
    return res.status(500).json({
      error: "Failed to fetch BTC price",
      details: error.message,
      timestamp: Date.now(),
    })
  }
}
