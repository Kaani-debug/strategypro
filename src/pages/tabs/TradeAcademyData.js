const CHAPTERS = [
  {
    id: 1, category: "Getting Started",
    title: "What is Deriv?",
    sections: [
      {
        heading: "What is Deriv?",
        blocks: [
          { type: "text", content: "Deriv is an online trading platform that allows users to trade a variety of financial instruments, including forex, commodities, stocks, and indices. Founded in 1999, Deriv has grown to serve millions of traders worldwide, offering a user-friendly interface and a range of innovative trading tools." },
          { type: "text", content: "What sets Deriv apart from traditional trading platforms is its focus on accessibility. Deriv offers both a web-based platform and a mobile app, allowing users to trade from anywhere in the world. Additionally, Deriv provides a demo account feature, enabling users to practice trading with virtual funds before committing real money." },
          { type: "callout", variant: "info", title: "Did You Know?", content: "Deriv was originally known as Binary.com before rebranding to Deriv in 2021. The rebranding reflected the company's expanded product offerings beyond binary options." },
        ]
      },
      {
        heading: "Origin Story",
        blocks: [
          { type: "text", content: "Deriv was founded in 1999 by Jean-Yves Sireau, a French-born entrepreneur with a vision to make trading accessible to everyone. The company started as Binary.com and was one of the first platforms to offer binary options trading online." },
          { type: "text", content: "Over the years, Deriv has evolved significantly. From a simple binary options platform, it has grown into a comprehensive trading hub offering CFDs, multipliers, options, and digital options. The platform now serves over 2.5 million traders across more than 200 countries and territories." },
          { type: "definition", term: "Binary Options", definition: "A financial instrument where the payoff is either a fixed amount or nothing at all. Traders predict whether an asset's price will be above or below a certain level at a specified time." },
        ]
      },
      {
        heading: "Mission & Vision",
        blocks: [
          { type: "text", content: "Deriv's mission is to make trading accessible, transparent, and fair for everyone. The company aims to break down barriers to entry in the financial markets by providing low minimum deposits, a wide range of educational resources, and intuitive trading tools." },
          { type: "bulletList", items: ["Break down barriers to entry in financial trading", "Provide transparent and fair trading conditions", "Offer comprehensive educational resources for all skill levels", "Continuously innovate trading technology and tools", "Maintain the highest standards of security and regulation"] },
        ]
      },
      {
        heading: "Regulation at Deriv",
        blocks: [
          { type: "text", content: "Deriv is regulated by multiple financial authorities, ensuring that it operates in compliance with industry standards. This regulatory oversight provides traders with a level of security and trust." },
          { type: "bulletList", items: ["Malta Financial Services Authority (MFSA)", "Vanuatu Financial Services Commission (VFSC)", "British Virgin Islands Financial Services Commission (BVIFSC)", "Labuan Financial Services Authority (LFSA), Malaysia"] },
          { type: "callout", variant: "warning", title: "Important", content: "Regulation varies by region. Some features and products may not be available in certain jurisdictions due to local regulatory requirements. Always check the terms for your region." },
        ]
      },
      {
        heading: "Deriv vs Traditional Forex Brokers",
        blocks: [
          { type: "comparison", leftTitle: "Deriv", leftItems: ["Low minimum deposits ($5)", "User-friendly interface", "Demo account with virtual funds", "Innovative contract types (options, multipliers)", "Built-in educational resources", "24/7 customer support"], rightTitle: "Traditional Brokers", rightItems: ["Higher minimum deposits ($100+)", "Complex platforms (MT4/MT5)", "Limited or no demo accounts", "Standard forex/CFD products only", "Separate educational platforms", "Limited support hours"] },
        ]
      },
      {
        heading: "Key Advantages of Trading with Deriv",
        blocks: [
          { type: "bulletList", items: ["Low minimum deposit of just $5", "Intuitive and easy-to-use platform", "Wide range of tradable assets", "Innovative contract types including multipliers and options", "Demo account for risk-free practice", "Comprehensive educational resources", "Regulated by multiple financial authorities", "Available in over 200 countries"] },
        ]
      },
      {
        heading: "Risks Involved",
        blocks: [
          { type: "text", content: "While Deriv offers many advantages, it's important to understand the risks involved in trading. All financial trading carries inherent risk, and traders should never invest more than they can afford to lose." },
          { type: "bulletList", items: ["Market volatility can lead to rapid losses", "Leverage amplifies both gains and losses", "Past performance does not guarantee future results", "Trading requires knowledge, skill, and discipline", "Emotional decision-making can lead to poor outcomes"] },
          { type: "keyTakeaway", items: ["Deriv is a regulated, accessible trading platform founded in 1999", "It offers low minimum deposits, a demo account, and innovative products", "Understanding both the advantages and risks is essential before trading"] },
        ]
      },
    ]
  },
  {
    id: 2, category: "Getting Started",
    title: "Basic Financial Market Concepts",
    sections: [
      {
        heading: "What Is a Financial Market?",
        blocks: [
          { type: "text", content: "A financial market is a marketplace where buyers and sellers trade assets such as stocks, bonds, currencies, commodities, and derivatives. These markets are essential for the functioning of capitalist economies, as they allocate resources and create liquidity for businesses and investors." },
          { type: "text", content: "Financial markets can be physical locations like the New York Stock Exchange or electronic networks like the forex market. They operate on the principles of supply and demand, with prices determined by the collective actions of all participants." },
        ]
      },
      {
        heading: "Buyers vs Sellers",
        blocks: [
          { type: "text", content: "In financial markets, every transaction requires both a buyer and a seller. When you open a trade, you are either buying (going long) because you expect the price to rise, or selling (going short) because you expect the price to fall." },
          { type: "callout", variant: "info", title: "Key Insight", content: "For every buyer, there must be a seller. This is why markets are described as 'zero-sum' in the short term — one trader's gain is another's loss." },
        ]
      },
      {
        heading: "Supply and Demand",
        blocks: [
          { type: "text", content: "Supply and demand are the fundamental forces that drive price movements in financial markets. When demand exceeds supply, prices rise. When supply exceeds demand, prices fall." },
          { type: "definition", term: "Supply", definition: "The total amount of a particular asset available for sale at a given price level." },
          { type: "definition", term: "Demand", definition: "The desire and ability of buyers to purchase a particular asset at a given price level." },
        ]
      },
      {
        heading: "Price Movement",
        blocks: [
          { type: "text", content: "Price movement in financial markets is driven by a variety of factors, including economic data releases, geopolitical events, market sentiment, and technical analysis. Understanding why prices move is crucial for developing effective trading strategies." },
          { type: "bulletList", items: ["Economic indicators (GDP, employment, inflation)", "Central bank policies and interest rates", "Geopolitical events and news", "Market sentiment and trader psychology", "Technical analysis patterns and indicators"] },
        ]
      },
      {
        heading: "What Are Ticks?",
        blocks: [
          { type: "text", content: "A tick is the smallest incremental movement in the price of an asset. In trading, ticks represent the minimum change in price that an asset can experience. Understanding ticks is essential for calculating risk, setting stop-losses, and analyzing price movements." },
          { type: "definition", term: "Tick Size", definition: "The minimum price increment for a particular asset. For example, if an asset's tick size is 0.001, the price can only move in increments of 0.001." },
        ]
      },
      {
        heading: "Time vs Tick Analysis",
        blocks: [
          { type: "text", content: "Time-based analysis looks at price movements over fixed time intervals (e.g., 1-minute, 1-hour, daily charts), while tick-based analysis examines every individual price change regardless of time." },
          { type: "comparison", leftTitle: "Time Analysis", leftItems: ["Standard chart intervals (1m, 5m, 1h, 1d)", "Easy to use with most platforms", "Missing activity between candles", "Good for longer-term trends"], rightTitle: "Tick Analysis", rightItems: ["Every price change recorded", "Captures all market activity", "More detailed view of volatility", "Better for short-term scalping"] },
        ]
      },
      {
        heading: "Understanding Volatility",
        blocks: [
          { type: "text", content: "Volatility refers to the degree of price variation in an asset over time. High volatility means prices are moving rapidly and unpredictably, while low volatility indicates more stable, gradual price movements." },
          { type: "keyTakeaway", items: ["Financial markets connect buyers and sellers to determine asset prices", "Supply and demand are the fundamental drivers of all price movements", "Understanding ticks, time frames, and volatility is essential for trading"] },
        ]
      },
    ]
  },
  {
    id: 3, category: "Getting Started",
    title: "What is Trading?",
    sections: [
      {
        heading: "What Is Trading?",
        blocks: [
          { type: "text", content: "Trading is the act of buying and selling financial assets with the goal of generating profit. Unlike investing, which typically involves holding assets for long periods, trading focuses on shorter-term price movements." },
          { type: "text", content: "Traders analyze markets using various methods — technical analysis (studying charts and patterns), fundamental analysis (evaluating economic and financial factors), and sentiment analysis (gauging market mood) — to make informed decisions about when to enter and exit trades." },
        ]
      },
      {
        heading: "Types of Traders",
        blocks: [
          { type: "definition", term: "Scalper", definition: "A trader who makes dozens or hundreds of trades per day, holding positions for seconds to minutes to capture small price movements." },
          { type: "definition", term: "Day Trader", definition: "A trader who opens and closes positions within the same trading day, avoiding overnight risk." },
          { type: "definition", term: "Swing Trader", definition: "A trader who holds positions for several days to weeks, aiming to capture medium-term price swings." },
          { type: "definition", term: "Position Trader", definition: "A trader who holds positions for weeks to months or longer, based on long-term market trends." },
        ]
      },
      {
        heading: "Speculation vs Hedging",
        blocks: [
          { type: "text", content: "Most retail traders engage in speculation — taking on risk in the hope of profit. Hedging, by contrast, involves taking positions to reduce or offset existing risk." },
          { type: "comparison", leftTitle: "Speculation", leftItems: ["Goal is profit from price movements", "Higher risk tolerance", "Short to medium time frames", "Common for retail traders"], rightTitle: "Hedging", rightItems: ["Goal is risk reduction", "Lower risk tolerance", "Varies by exposure", "Common for institutions"] },
        ]
      },
      {
        heading: "Assets You Can Trade",
        blocks: [
          { type: "text", content: "Modern trading platforms offer a wide variety of assets across different markets. On Deriv, traders can access:" },
          { type: "table", headers: ["Asset Class", "Examples", "Market Hours"], rows: [["Forex", "EUR/USD, GBP/JPY", "24/5"], ["Commodities", "Gold, Oil, Silver", "24/5"], ["Stock Indices", "S&P 500, FTSE 100", "Varies"], ["Cryptocurrencies", "BTC, ETH, LTC", "24/7"], ["Volatility Indices", "Vol 10, Vol 100", "24/7"]] },
        ]
      },
      {
        heading: "The Importance of Education",
        blocks: [
          { type: "text", content: "Education is the foundation of successful trading. Without a solid understanding of market principles, risk management, and trading psychology, even the most promising strategies will fail." },
          { type: "bulletList", items: ["Learn market fundamentals before trading with real money", "Practice with a demo account to develop your skills", "Study both technical and fundamental analysis", "Understand risk management principles thoroughly", "Keep a trading journal to track your progress"] },
          { type: "keyTakeaway", items: ["Trading involves buying and selling assets to profit from price movements", "Different trading styles suit different personalities and schedules", "Education and practice are essential before trading with real capital"] },
        ]
      },
    ]
  },
  {
    id: 4, category: "Platforms",
    title: "Deriv Trading Platforms",
    sections: [
      {
        heading: "Overview of Deriv Platforms",
        blocks: [
          { type: "text", content: "Deriv offers several trading platforms designed to cater to different types of traders. From the web-based Deriv Trader to the automated Deriv Bot, each platform has unique features and benefits." },
          { type: "table", headers: ["Platform", "Best For", "Key Feature"], rows: [["Deriv Trader", "Manual trading", "User-friendly interface"], ["Deriv Bot", "Automated trading", "Drag-and-drop strategy builder"], ["Deriv GO", "Mobile trading", "Trade on the go"], ["SmartTrader", "Options trading", "Advanced charting"], ["Deriv MT5", "Professional trading", "Advanced indicators and EAs"]] },
        ]
      },
      {
        heading: "Deriv Trader",
        blocks: [
          { type: "text", content: "Deriv Trader is Deriv's flagship web-based platform. It offers an intuitive interface with real-time charts, technical indicators, and a wide range of contract types. It's ideal for both beginners and experienced traders." },
          { type: "bulletList", items: ["Real-time price charts with multiple time frames", "Built-in technical indicators (RSI, MACD, Bollinger Bands, etc.)", "One-click trading for fast execution", "Multiple contract types available", "Demo account integration"] },
        ]
      },
      {
        heading: "Deriv Bot",
        blocks: [
          { type: "text", content: "Deriv Bot is a drag-and-drop trading bot builder that allows you to create automated trading strategies without any programming knowledge. You can build, test, and deploy trading bots directly in your browser." },
          { type: "callout", variant: "info", title: "Automation Advantage", content: "Automated trading removes emotion from your trading decisions and allows you to execute strategies 24/7 without manual intervention." },
        ]
      },
      {
        heading: "Deriv GO",
        blocks: [
          { type: "text", content: "Deriv GO is Deriv's mobile trading app, available for both iOS and Android. It provides a streamlined trading experience optimized for mobile devices, allowing you to trade anytime, anywhere." },
        ]
      },
      {
        heading: "Deriv MT5",
        blocks: [
          { type: "text", content: "Deriv MT5 is the popular MetaTrader 5 platform offered by Deriv. It provides advanced charting tools, technical indicators, and support for Expert Advisors (EAs) for automated trading." },
          { type: "keyTakeaway", items: ["Deriv offers multiple platforms for different trading styles", "Deriv Trader is best for manual trading, Deriv Bot for automation", "Choose the platform that matches your experience level and needs"] },
        ]
      },
    ]
  },
  {
    id: 5, category: "Contract Types",
    title: "Options Trading",
    sections: [
      {
        heading: "What Are Options?",
        blocks: [
          { type: "text", content: "Options are financial derivatives that give the buyer the right, but not the obligation, to buy or sell an underlying asset at a specified price within a specified time period. On Deriv, options trading is one of the most popular contract types." },
          { type: "definition", term: "Call Option", definition: "An option contract that gives the holder the right to buy an asset at a specified price within a specific time period." },
          { type: "definition", term: "Put Option", definition: "An option contract that gives the holder the right to sell an asset at a specified price within a specific time period." },
        ]
      },
      {
        heading: "How Options Work on Deriv",
        blocks: [
          { type: "text", content: "On Deriv, options contracts are based on predicting the price movement of an underlying asset. You choose an asset, a duration, and a strike price, then predict whether the price will be higher or lower than the strike at expiration." },
          { type: "callout", variant: "info", title: "Fixed Odds", content: "Unlike traditional options, many of Deriv's options offer fixed odds, meaning you know the potential payout before you enter the trade." },
        ]
      },
      {
        heading: "Benefits of Options Trading",
        blocks: [
          { type: "bulletList", items: ["Defined risk — you can only lose your initial investment", "Fixed payout structure — know your potential profit before trading", "Short-term trading opportunities", "Can be used for hedging existing positions", "No margin calls or stop-outs"] },
        ]
      },
      {
        heading: "Options vs CFDs",
        blocks: [
          { type: "comparison", leftTitle: "Options", leftItems: ["Fixed risk and reward", "Known payout upfront", "Expiration time required", "No leverage involved", "Simpler to understand"], rightTitle: "CFDs", rightItems: ["Variable risk and reward", "Payout depends on exit price", "No expiration (can hold indefinitely)", "Leverage available", "More complex risk management"] },
        ]
      },
      {
        heading: "Risks of Options Trading",
        blocks: [
          { type: "bulletList", items: ["Time decay — options lose value as expiration approaches", "Market volatility can work against your prediction", "Fixed payout means limited profit potential", "Not suitable for all market conditions"] },
          { type: "keyTakeaway", items: ["Options give you the right to buy or sell an asset at a specified price", "Deriv offers fixed-odds options with known risk and reward", "Options are simpler than CFDs but still require careful risk management"] },
        ]
      },
    ]
  },
  {
    id: 6, category: "Contract Types",
    title: "Rise/Fall",
    sections: [
      {
        heading: "What Are Rise/Fall Contracts?",
        blocks: [
          { type: "text", content: "Rise/Fall is one of the simplest and most popular contract types on Deriv. You predict whether the price of an asset will rise or fall from its current level by the time the contract expires." },
          { type: "callout", variant: "info", title: "Simple Prediction", content: "With Rise/Fall, you only need to answer one question: will the price be higher or lower at expiration? No complex analysis required." },
        ]
      },
      {
        heading: "How Rise/Fall Works",
        blocks: [
          { type: "text", content: "To trade a Rise/Fall contract, you select an asset, choose a duration, and predict whether the price will be higher (Rise) or lower (Fall) at the end of the contract period. If your prediction is correct, you receive a fixed payout." },
          { type: "table", headers: ["Prediction", "Price at Expiration", "Outcome"], rows: [["Rise", "Higher than entry", "Win — receive payout"], ["Rise", "Lower than entry", "Loss — stake lost"], ["Fall", "Lower than entry", "Win — receive payout"], ["Fall", "Higher than entry", "Loss — stake lost"]] },
        ]
      },
      {
        heading: "Strategies for Rise/Fall",
        blocks: [
          { type: "bulletList", items: ["Follow clear trends — trade in the direction of the trend", "Use technical indicators like RSI to identify overbought/oversold conditions", "Consider market news and economic events", "Start with longer durations for more predictable movements", "Use demo account to practice before trading real money"] },
        ]
      },
      {
        heading: "When to Trade Rise/Fall",
        blocks: [
          { type: "text", content: "Rise/Fall contracts are most effective when there is clear directional movement in the market. During periods of high volatility or strong trends, Rise/Fall can be particularly profitable. During sideways or choppy markets, accuracy may decrease." },
          { type: "keyTakeaway", items: ["Rise/Fall is the simplest contract — predict up or down", "Fixed payout if prediction is correct, stake lost if wrong", "Works best in trending markets with clear direction"] },
        ]
      },
    ]
  },
  {
    id: 7, category: "Contract Types",
    title: "Higher/Lower",
    sections: [
      {
        heading: "What Are Higher/Lower Contracts?",
        blocks: [
          { type: "text", content: "Higher/Lower is similar to Rise/Fall but with a key difference: you predict whether the price will be higher or lower than a specific barrier level (not just higher or lower than the entry price)." },
          { type: "definition", term: "Barrier Level", definition: "A specific price level set by the trader or platform that serves as the target for a Higher/Lower contract." },
        ]
      },
      {
        heading: "How Higher/Lower Differs from Rise/Fall",
        blocks: [
          { type: "text", content: "In Rise/Fall, the comparison is always against the entry price. In Higher/Lower, you set a specific price target. If you predict the price will be higher than 1.2000, the price must be above 1.2000 at expiration, regardless of where it started." },
          { type: "comparison", leftTitle: "Rise/Fall", leftItems: ["Compares to entry price", "Simpler, fewer variables", "Lower potential payouts", "Good for beginners"], rightTitle: "Higher/Lower", rightItems: ["Compares to barrier level", "More flexibility in prediction", "Higher potential payouts", "More strategic control"] },
        ]
      },
      {
        heading: "Setting Barriers",
        blocks: [
          { type: "text", content: "When trading Higher/Lower, you can often choose where to set the barrier level. A barrier closer to the current price is easier to reach but offers a lower payout. A barrier further away is harder to reach but offers a higher payout." },
          { type: "keyTakeaway", items: ["Higher/Lower predicts price against a specific barrier, not entry price", "Barrier distance affects both difficulty and potential payout", "Offers more strategic flexibility than Rise/Fall"] },
        ]
      },
    ]
  },
  {
    id: 8, category: "Contract Types",
    title: "Touch/No Touch",
    sections: [
      {
        heading: "What Are Touch/No Touch Contracts?",
        blocks: [
          { type: "text", content: "Touch/No Touch contracts require the price to reach (Touch) or avoid (No Touch) a specified barrier level at any point during the contract duration — not just at expiration." },
          { type: "callout", variant: "info", title: "Key Difference", content: "Unlike Rise/Fall or Higher/Lower, Touch/No Touch is determined by whether the barrier is hit at ANY point during the contract, not just at the end." },
        ]
      },
      {
        heading: "How Touch/No Touch Works",
        blocks: [
          { type: "text", content: "With a Touch contract, if the price touches the barrier level at any time during the contract period, you win — even if it quickly moves back. With a No Touch contract, the price must stay on your side of the barrier for the entire duration." },
          { type: "table", headers: ["Contract Type", "Condition to Win", "Risk Level"], rows: [["Touch", "Price hits barrier at any point", "Medium — only needs one touch"], ["No Touch", "Price never hits barrier", "High — requires sustained movement away"]] },
        ]
      },
      {
        heading: "Strategies for Touch/No Touch",
        blocks: [
          { type: "bulletList", items: ["Identify key support and resistance levels for barrier placement", "Touch contracts work well during high volatility", "No Touch contracts are better in ranging markets", "Consider using technical analysis to identify likely touch points", "Monitor news events that could cause price spikes"] },
          { type: "keyTakeaway", items: ["Touch wins if the price hits the barrier at ANY point during the contract", "No Touch requires the price to avoid the barrier entirely", "Touch/No Touch offers more flexibility than expiration-based contracts"] },
        ]
      },
    ]
  },
  {
    id: 9, category: "Contract Types",
    title: "Stay/Exit",
    sections: [
      {
        heading: "What Are Stay/Exit Contracts?",
        blocks: [
          { type: "text", content: "Stay/Exit contracts are a unique type where you predict whether the price will stay within (Stay) or exit from (Exit) a specified price range during the contract duration." },
          { type: "definition", term: "Price Range", definition: "A range defined by an upper and lower barrier. For Stay contracts, the price must remain within this range. For Exit contracts, the price must break out of this range." },
        ]
      },
      {
        heading: "How Stay/Exit Works",
        blocks: [
          { type: "text", content: "You set two barriers — an upper and lower boundary. For a Stay contract, you win if the price remains between these two barriers for the entire contract period. For an Exit contract, you win if the price breaks outside the range at any point." },
          { type: "comparison", leftTitle: "Stay", leftItems: ["Price stays within range", "Benefits from low volatility", "Range must be wide enough to hold", "Good for sideways markets"], rightTitle: "Exit", rightItems: ["Price breaks out of range", "Benefits from high volatility", "Range must be narrow enough to break", "Good for breakout strategies"] },
        ]
      },
      {
        heading: "Choosing Range Width",
        blocks: [
          { type: "text", content: "The width of your price range significantly affects the probability of winning. A wider range makes Stay contracts easier to win but Exit contracts harder. A narrower range makes Exit easier but Stay harder." },
          { type: "keyTakeaway", items: ["Stay wins if price remains within a range, Exit wins if price breaks out", "Range width determines the difficulty and potential payout", "Stay suits low-volatility markets, Exit suits high-volatility markets"] },
        ]
      },
    ]
  },
  {
    id: 10, category: "Contract Types",
    title: "Multipliers",
    sections: [
      {
        heading: "What Are Multipliers?",
        blocks: [
          { type: "text", content: "Multipliers are a unique Deriv product that allows you to amplify your exposure to an asset's price movement without risking more than your stake. Unlike traditional leverage, multipliers have built-in risk management features." },
          { type: "callout", variant: "warning", title: "Amplified Risk", content: "While multipliers amplify your potential profit, they also amplify your potential loss. However, you can never lose more than your initial stake, unlike traditional leveraged trading." },
        ]
      },
      {
        heading: "How Multipliers Work",
        blocks: [
          { type: "text", content: "When you trade with a multiplier, your profit or loss is multiplied by the chosen factor. For example, with a 10x multiplier, a 1% price movement in your favor results in a 10% profit on your stake. However, a 1% movement against you results in a 10% loss." },
          { type: "table", headers: ["Multiplier", "Price Movement", "Profit/Loss on Stake"], rows: [["2x", "+2%", "+4%"], ["5x", "+2%", "+10%"], ["10x", "+2%", "+20%"], ["2x", "-2%", "-4%"], ["5x", "-2%", "-10%"], ["10x", "-2%", "-20%"]] },
        ]
      },
      {
        heading: "Multipliers vs Traditional Leverage",
        blocks: [
          { type: "comparison", leftTitle: "Multipliers (Deriv)", leftItems: ["Loss limited to initial stake", "No margin calls", "Automatic stop-out at stake loss", "No funding costs or swaps", "Simple and transparent"], rightTitle: "Traditional Leverage", rightItems: ["Loss can exceed initial deposit", "Margin calls possible", "Can lose more than account balance", "Overnight funding costs apply", "Complex margin calculations"] },
        ]
      },
      {
        heading: "Strategies for Trading Multipliers",
        blocks: [
          { type: "bulletList", items: ["Start with lower multipliers (2x-5x) as a beginner", "Use stop-loss orders to protect your capital", "Take partial profits when in a winning position", "Avoid high multipliers during news events", "Practice with small stakes before scaling up"] },
          { type: "keyTakeaway", items: ["Multipliers amplify both profits and losses but limit loss to initial stake", "Unlike leverage, no margin calls or risk of losing more than deposited", "Start with low multipliers and practice risk management"] },
        ]
      },
    ]
  },
  {
    id: 11, category: "Analysis",
    title: "Introduction to Technical Analysis",
    sections: [
      {
        heading: "What Is Technical Analysis?",
        blocks: [
          { type: "text", content: "Technical analysis is the study of historical price data and trading volume to forecast future price movements. It is based on the idea that all market information is already reflected in the price, and that price movements follow identifiable patterns." },
          { type: "callout", variant: "info", title: "Core Principle", content: "Technical analysis operates on three assumptions: (1) price discounts everything, (2) price moves in trends, and (3) history tends to repeat itself." },
        ]
      },
      {
        heading: "Types of Charts",
        blocks: [
          { type: "definition", term: "Candlestick Chart", definition: "The most popular chart type, showing the open, high, low, and close price for each time period. The body is green/white if price rose, red/black if price fell." },
          { type: "definition", term: "Bar Chart", definition: "A chart type showing the high and low as a vertical line, with a left dash for the open and a right dash for the close." },
          { type: "definition", term: "Line Chart", definition: "The simplest chart type, connecting closing prices with a continuous line. Useful for identifying overall trends." },
        ]
      },
      {
        heading: "Key Technical Indicators",
        blocks: [
          { type: "table", headers: ["Indicator", "Type", "What It Measures"], rows: [["RSI", "Momentum Oscillator", "Overbought/oversold conditions"], ["MACD", "Trend-Following", "Trend direction and momentum"], ["Bollinger Bands", "Volatility", "Price volatility and potential reversals"], ["Moving Averages", "Trend", "Average price over a specific period"], ["Stochastic", "Momentum", "Price position relative to recent range"]] },
        ]
      },
      {
        heading: "Support and Resistance",
        blocks: [
          { type: "text", content: "Support is a price level where buying pressure is strong enough to prevent further price declines. Resistance is a price level where selling pressure prevents further price increases. Identifying these levels is a fundamental skill in technical analysis." },
          { type: "keyTakeaway", items: ["Technical analysis uses past price data to forecast future movements", "Candlestick charts are the most widely used chart type", "Key indicators include RSI, MACD, Bollinger Bands, and Moving Averages"] },
        ]
      },
    ]
  },
  {
    id: 12, category: "Analysis",
    title: "Introduction to Fundamental Analysis",
    sections: [
      {
        heading: "What Is Fundamental Analysis?",
        blocks: [
          { type: "text", content: "Fundamental analysis involves evaluating the intrinsic value of an asset by examining related economic, financial, and other qualitative and quantitative factors. Unlike technical analysis, which focuses on price data, fundamental analysis looks at the broader factors that affect an asset's value." },
        ]
      },
      {
        heading: "Key Economic Indicators",
        blocks: [
          { type: "table", headers: ["Indicator", "What It Measures", "Market Impact"], rows: [["GDP", "Economic growth rate", "High — affects overall market sentiment"], ["CPI", "Inflation rate", "High — influences interest rate decisions"], ["Employment Data", "Labor market health", "High — impacts consumer spending"], ["Interest Rates", "Cost of borrowing", "Very High — directly affects currency values"], ["Retail Sales", "Consumer spending", "Medium — indicates economic health"]] },
        ]
      },
      {
        heading: "Fundamental vs Technical Analysis",
        blocks: [
          { type: "comparison", leftTitle: "Fundamental Analysis", leftItems: ["Evaluates intrinsic value", "Long-term perspective", "Uses economic data and news", "Answers 'what' to trade", "Requires broad economic knowledge"], rightTitle: "Technical Analysis", rightItems: ["Studies price patterns", "Short to medium-term", "Uses charts and indicators", "Answers 'when' to trade", "Requires chart reading skills"] },
        ]
      },
      {
        heading: "Trading Around News Events",
        blocks: [
          { type: "text", content: "News events can cause significant market volatility. Economic data releases, central bank announcements, and geopolitical events can trigger rapid price movements. Understanding how to trade around these events is essential for fundamental analysis." },
          { type: "bulletList", items: ["Use an economic calendar to track upcoming events", "Be aware of expected vs actual figures", "Avoid trading just before major announcements as a beginner", "Consider volatility expansion after news releases", "Use wider stop-losses during news events"] },
          { type: "keyTakeaway", items: ["Fundamental analysis evaluates the intrinsic value of assets using economic data", "Key indicators include GDP, CPI, employment, interest rates, and retail sales", "Combine fundamental and technical analysis for a complete trading approach"] },
        ]
      },
    ]
  },
  {
    id: 13, category: "Analysis",
    title: "Volatility",
    sections: [
      {
        heading: "What Is Volatility?",
        blocks: [
          { type: "text", content: "Volatility measures the rate and magnitude of price changes in a financial instrument. High volatility means prices are moving rapidly and unpredictably, while low volatility indicates more stable, gradual price movements." },
          { type: "definition", term: "Historical Volatility", definition: "A measure of past price fluctuations over a specific period, calculated using standard deviation of price changes." },
          { type: "definition", term: "Implied Volatility", definition: "A forward-looking measure of expected future volatility, derived from options prices." },
        ]
      },
      {
        heading: "Why Volatility Matters",
        blocks: [
          { type: "text", content: "Volatility is crucial for traders because it determines the potential for both profit and loss. High volatility creates more trading opportunities but also increases risk. Low volatility may be safer but offers fewer profit opportunities." },
          { type: "callout", variant: "warning", title: "Volatility Risk", content: "While high volatility can lead to larger profits, it can also lead to rapid losses. Always adjust your position size and risk management strategies based on current market volatility." },
        ]
      },
      {
        heading: "Measuring Volatility",
        blocks: [
          { type: "bulletList", items: ["Standard Deviation — measures price dispersion from the average", "Average True Range (ATR) — measures average price range over a period", "Bollinger Bands — visually show volatility through band width", "VIX Index — measures implied volatility for the S&P 500", "Historical price range — high-low price difference per period"] },
        ]
      },
      {
        heading: "Volatility and Contract Selection",
        blocks: [
          { type: "text", content: "Different contract types perform better under different volatility conditions. Rise/Fall contracts work well in trending markets with moderate volatility. Touch contracts benefit from high volatility. Stay contracts suit low-volatility environments." },
          { type: "keyTakeaway", items: ["Volatility measures the rate and magnitude of price movements", "High volatility = more opportunities but more risk", "Choose contract types based on current volatility conditions"] },
        ]
      },
    ]
  },
  {
    id: 14, category: "Analysis",
    title: "Volatility 100 Index",
    sections: [
      {
        heading: "What Is the Volatility 100 Index?",
        blocks: [
          { type: "text", content: "The Volatility 100 Index is a synthetic index offered by Deriv that simulates a market with 100% annual volatility. Unlike traditional assets, its price movements are generated by an algorithm and are not affected by real-world market events." },
          { type: "callout", variant: "info", title: "24/7 Trading", content: "Since Volatility Indices are synthetic, they are available for trading 24/7, including weekends and holidays, unlike traditional markets." },
        ]
      },
      {
        heading: "Advantages of Volatility Indices",
        blocks: [
          { type: "bulletList", items: ["Available for trading 24 hours a day, 7 days a week", "No influence from real-world news or economic events", "Consistent volatility levels for predictable trading conditions", "No gaps in price — continuous market operation", "Perfect for testing strategies in controlled conditions"] },
        ]
      },
      {
        heading: "Different Volatility Index Levels",
        blocks: [
          { type: "table", headers: ["Index", "Volatility Level", "Best For"], rows: [["Volatility 10", "10% (Low)", "Beginners, stable conditions"], ["Volatility 25", "25% (Moderate)", "Intermediate traders"], ["Volatility 50", "50% (High)", "Experienced traders"], ["Volatility 100", "100% (Very High)", "Advanced traders, scalping"], ["Volatility 200", "200% (Extreme)", "Very experienced traders"]] },
        ]
      },
      {
        heading: "Trading Strategies for Volatility 100",
        blocks: [
          { type: "text", content: "Due to its high volatility, the Volatility 100 Index is best suited for short-term trading strategies. Scalping and day trading work well, while longer-term positions face higher uncertainty." },
          { type: "keyTakeaway", items: ["Volatility 100 is a synthetic index with constant 100% annual volatility", "Tradable 24/7 with no influence from real-world events", "Best for short-term strategies and experienced traders"] },
        ]
      },
    ]
  },
  {
    id: 15, category: "Risk Management",
    title: "Introduction to Risk Management",
    sections: [
      {
        heading: "Why Risk Management Matters",
        blocks: [
          { type: "text", content: "Risk management is the most important skill for any trader. Without proper risk management, even the most profitable strategy can lead to account ruin. The goal of risk management is not to avoid losses altogether, but to ensure that losses are controlled and do not prevent you from continuing to trade." },
          { type: "callout", variant: "info", title: "The Golden Rule", content: "Never risk more than 1-2% of your trading capital on any single trade. This ensures that a string of losses won't deplete your account." },
        ]
      },
      {
        heading: "Key Risk Management Principles",
        blocks: [
          { type: "bulletList", items: ["Position sizing — determine the right stake for each trade based on account size", "Stop-loss orders — set a predetermined exit point for losing trades", "Risk-reward ratio — ensure potential profit outweighs potential loss", "Portfolio diversification — don't put all your capital into one asset", "Maximum daily loss limit — stop trading after a certain loss amount"] },
        ]
      },
      {
        heading: "Calculating Position Size",
        blocks: [
          { type: "text", content: "Position size should be calculated based on your account balance, the percentage you are willing to risk, and the distance to your stop-loss level. As a general rule, risk 1% of your account per trade, and adjust your position size accordingly." },
          { type: "definition", term: "Risk-Reward Ratio", definition: "The ratio of potential profit to potential loss on a trade. A ratio of 1:2 means you risk $1 to make $2. A minimum of 1:2 is recommended for most strategies." },
        ]
      },
      {
        heading: "Common Risk Management Mistakes",
        blocks: [
          { type: "bulletList", items: ["Risking too much on a single trade", "Moving stop-losses further away when the trade goes against you", "Averaging down — adding to losing positions", "Not using stop-losses at all", "Revenge trading after a loss", "Overtrading — taking too many trades simultaneously"] },
          { type: "keyTakeaway", items: ["Risk management is more important than any trading strategy", "Never risk more than 1-2% of your account per trade", "Always use stop-losses and maintain proper position sizing"] },
        ]
      },
    ]
  },
  {
    id: 16, category: "Risk Management",
    title: "Managing Drawdowns",
    sections: [
      {
        heading: "What Is a Drawdown?",
        blocks: [
          { type: "text", content: "A drawdown is the decline in your trading account from its peak to its lowest point. Drawdowns are a normal part of trading — even the most successful traders experience them. The key is to manage drawdowns so they don't become catastrophic." },
          { type: "definition", term: "Maximum Drawdown", definition: "The largest peak-to-trough decline in your account over a specific period. A 30% maximum drawdown means your account fell 30% from its highest point." },
        ]
      },
      {
        heading: "Types of Drawdowns",
        blocks: [
          { type: "table", headers: ["Type", "Cause", "Duration"], rows: [["Normal Drawdown", "Standard market fluctuations", "Days to weeks"], ["Strategy Drawdown", "Strategy not working in current conditions", "Weeks to months"], ["Psychological Drawdown", "Emotional trading after losses", "Varies"], ["Market Event Drawdown", "Unexpected market events or black swans", "Days to weeks"]] },
        ]
      },
      {
        heading: "Managing Drawdowns Effectively",
        blocks: [
          { type: "bulletList", items: ["Reduce position size during drawdowns — don't try to recover losses quickly", "Take a break from trading if drawdown exceeds your comfort zone", "Review your strategy to ensure it's still valid", "Keep a trading journal to identify patterns in losing periods", "Maintain a positive mindset — drawdowns are temporary", "Never increase risk to 'make back' losses"] },
          { type: "callout", variant: "warning", title: "The Recovery Trap", content: "After a 50% drawdown, you need a 100% gain just to break even. This is why limiting drawdowns is critical. A 20% drawdown requires only a 25% gain to recover, which is far more achievable." },
        ]
      },
      {
        heading: "Setting Drawdown Limits",
        blocks: [
          { type: "text", content: "Professional traders set maximum drawdown limits. Common limits include a daily loss limit (stop trading after losing 3-5% in one day), a weekly loss limit, and a monthly drawdown limit. Once these limits are hit, trading stops for the period." },
          { type: "keyTakeaway", items: ["Drawdowns are normal and unavoidable in trading", "Limit drawdowns to prevent catastrophic account losses", "Reduce risk, review strategy, and maintain discipline during drawdowns"] },
        ]
      },
    ]
  },
  {
    id: 17, category: "Automation",
    title: "Intro to Deriv Bot",
    sections: [
      {
        heading: "What Is Deriv Bot?",
        blocks: [
          { type: "text", content: "Deriv Bot is a web-based automated trading platform that allows you to create trading bots using a drag-and-drop interface. You don't need any programming experience — simply connect blocks to build your trading strategy, then let the bot execute it automatically." },
          { type: "callout", variant: "info", title: "No Coding Required", content: "Deriv Bot uses a visual block-building interface similar to Scratch or Blockly. Just drag, drop, and connect blocks to create sophisticated trading strategies." },
        ]
      },
      {
        heading: "Benefits of Automated Trading",
        blocks: [
          { type: "bulletList", items: ["Remove emotion from trading decisions", "Execute strategies 24/7 without manual intervention", "Backtest strategies on historical data", "Trade multiple strategies simultaneously", "Consistent execution without human error", "Can react to market conditions faster than a human"] },
        ]
      },
      {
        heading: "Getting Started with Deriv Bot",
        blocks: [
          { type: "text", content: "To start using Deriv Bot, navigate to the Bot section on the Deriv platform. You'll find pre-built strategies you can use immediately, as well as the tools to build your own. Start with the demo account to test your strategies risk-free." },
          { type: "keyTakeaway", items: ["Deriv Bot is a no-code drag-and-drop trading bot builder", "Automated trading removes emotion and enables 24/7 execution", "Always test your bots on a demo account before using real money"] },
        ]
      },
    ]
  },
  {
    id: 18, category: "Automation",
    title: "Building Blocks of Deriv Bot",
    sections: [
      {
        heading: "Block Categories",
        blocks: [
          { type: "text", content: "Deriv Bot organizes blocks into categories based on their function. Understanding each category is essential for building effective trading strategies." },
          { type: "table", headers: ["Block Category", "Purpose", "Examples"], rows: [["Trading", "Execute trades and manage positions", "Purchase contract, Sell contract"], ["Indicators", "Add technical analysis", "RSI, MACD, Moving Average"], ["Variables", "Store and manage data", "Set variable, Get variable"], ["Logic", "Decision making", "If/Else, And/Or/Not"], ["Loops", "Repeat actions", "Repeat, While, For each"], ["Math", "Mathematical operations", "Add, Subtract, Compare"], ["Utility", "Miscellaneous functions", "Notify, Random number"]] },
        ]
      },
      {
        heading: "Building Your First Bot",
        blocks: [
          { type: "text", content: "A basic bot typically follows this structure: market analysis block → trading logic → contract purchase → monitoring → contract sold. Here is a simple example using RSI to trigger trades." },
          { type: "bulletList", items: ["Step 1: Add a Trading block to purchase a Rise/Fall contract", "Step 2: Connect an RSI indicator block to analyze the market", "Step 3: Add Logic to check if RSI is above 70 (overbought) or below 30 (oversold)", "Step 4: Set the bot to trade when conditions are met", "Step 5: Add a Loop to continue running"] },
        ]
      },
      {
        heading: "Testing and Optimization",
        blocks: [
          { type: "text", content: "Before deploying any bot, thoroughly test it on a demo account. Deriv Bot allows you to run simulations and analyze performance metrics like win rate, profit factor, and maximum drawdown." },
          { type: "keyTakeaway", items: ["Deriv Bot blocks are organized into categories by function", "Basic bots follow: analysis → logic → trade → monitor", "Always test and optimize your bot on a demo account first"] },
        ]
      },
    ]
  },
  {
    id: 19, category: "Automation",
    title: "Practical Examples Using Deriv Bot",
    sections: [
      {
        heading: "Example 1: RSI Reversal Bot",
        blocks: [
          { type: "text", content: "This bot uses the RSI indicator to identify overbought and oversold conditions. When RSI drops below 30 (oversold), the bot purchases a Rise contract. When RSI rises above 70 (overbought), it purchases a Fall contract." },
          { type: "text", content: "Key settings: RSI period 14, contract duration 5 minutes, stake $1. This simple strategy can be effective in ranging markets with clear support and resistance levels." },
        ]
      },
      {
        heading: "Example 2: Moving Average Crossover Bot",
        blocks: [
          { type: "text", content: "This bot trades when a fast moving average crosses above or below a slow moving average. A bullish crossover (fast MA crosses above slow MA) triggers a Rise contract. A bearish crossover triggers a Fall contract." },
          { type: "table", headers: ["Parameter", "Setting", "Rationale"], rows: [["Fast MA", "10 periods", "Responsive to recent price"], ["Slow MA", "50 periods", "Shows overall trend"], ["Contract", "Rise/Fall", "Directional prediction"], ["Duration", "15 minutes", "Matches trend duration"], ["Stake", "$1", "Conservative risk"]] },
        ]
      },
      {
        heading: "Example 3: Martingale Strategy Bot",
        blocks: [
          { type: "callout", variant: "warning", title: "High Risk", content: "The Martingale strategy involves doubling your stake after each loss to recover losses with a single win. This can lead to very large stakes and rapid account depletion if not managed carefully." },
          { type: "text", content: "This bot doubles the stake after each loss and resets to the base stake after a win. Due to its high-risk nature, this strategy should only be used with a substantial account and strict loss limits." },
          { type: "keyTakeaway", items: ["Deriv Bot can implement strategies from simple to complex", "Always start with a simple strategy and gradually add complexity", "Test thoroughly on demo before using real money"] },
        ]
      },
    ]
  },
  {
    id: 20, category: "Psychology",
    title: "Trading Psychology",
    sections: [
      {
        heading: "Why Psychology Matters",
        blocks: [
          { type: "text", content: "Trading psychology is the study of how emotions and mental states affect trading decisions. It is often said that trading is 80% psychology and 20% strategy. Even the best strategy will fail if you cannot control your emotions." },
          { type: "callout", variant: "info", title: "The Psychology Edge", content: "Mastering your emotions is what separates profitable traders from unprofitable ones. Technical skills can be learned by anyone, but emotional discipline is much harder to develop." },
        ]
      },
      {
        heading: "Common Emotional Challenges",
        blocks: [
          { type: "table", headers: ["Emotion", "Effect on Trading", "How to Overcome"], rows: [["Fear", "Missing good opportunities, closing winners early", "Use predefined entry and exit rules"], ["Greed", "Overtrading, holding too long, taking excessive risk", "Set profit targets and stick to them"], ["Hope", "Holding losing positions too long", "Use stop-losses and accept losses quickly"], ["Revenge", "Trading impulsively after a loss to recover", "Take a break after a losing trade"], ["FOMO", "Chasing trades based on fear of missing out", "Stick to your trading plan, ignore noise"]] },
        ]
      },
      {
        heading: "Developing Discipline",
        blocks: [
          { type: "bulletList", items: ["Create a detailed trading plan and follow it strictly", "Keep a trading journal to track emotions alongside trades", "Set daily loss limits and stop trading when hit", "Practice mindfulness and meditation to stay calm", "Review your performance regularly and learn from mistakes"] },
        ]
      },
      {
        heading: "The Importance of Patience",
        blocks: [
          { type: "text", content: "Patience is one of the most underrated trading skills. Waiting for the right setup, not forcing trades, and staying within your strategy requires immense patience. Remember: there will always be another trading opportunity." },
          { type: "keyTakeaway", items: ["Trading psychology is 80% of successful trading", "Mastering fear, greed, hope, and revenge is essential", "Develop discipline through a trading plan and journal"] },
        ]
      },
    ]
  },
  {
    id: 21, category: "Psychology",
    title: "Trading Challenges and How to Overcome Them",
    sections: [
      {
        heading: "Common Challenges Faced by Traders",
        blocks: [
          { type: "text", content: "Every trader faces challenges on their journey to profitability. Recognizing these challenges and developing strategies to overcome them is essential for long-term success." },
          { type: "bulletList", items: ["Consistency — maintaining steady performance over time", "Emotional control — managing fear, greed, and frustration", "Drawdowns — coping with losing periods", "Information overload — too many indicators and strategies", "Loneliness — trading can be an isolating activity"] },
        ]
      },
      {
        heading: "Challenge 1: Inconsistency",
        blocks: [
          { type: "text", content: "Many traders have profitable weeks followed by losing weeks. This inconsistency often stems from not following a fixed strategy. The solution is to develop a detailed trading plan and stick to it through both good and bad periods." },
        ]
      },
      {
        heading: "Challenge 2: Overtrading",
        blocks: [
          { type: "text", content: "Overtrading occurs when you take too many trades, often in response to boredom or the desire to recover losses. Overtrading leads to higher transaction costs, lower quality trades, and increased emotional fatigue." },
          { type: "definition", term: "Overtrading", definition: "Taking more trades than your strategy calls for, often driven by emotion rather than analysis. It is one of the most common causes of trading losses." },
        ]
      },
      {
        heading: "Challenge 3: Analysis Paralysis",
        blocks: [
          { type: "text", content: "Analysis paralysis occurs when you have so many indicators and tools that you cannot make a decision. The solution is to simplify — choose 2-3 indicators you understand well and focus on them instead of trying to use everything available." },
          { type: "keyTakeaway", items: ["Every trader faces challenges — recognizing them is the first step", "Inconsistency, overtrading, and analysis paralysis are common issues", "Develop systems and routines to overcome each challenge"] },
        ]
      },
    ]
  },
  {
    id: 22, category: "Practice",
    title: "Trading as a Business",
    sections: [
      {
        heading: "Trading Is a Business",
        blocks: [
          { type: "text", content: "Successful traders treat trading as a business, not a hobby or a get-rich-quick scheme. This mindset shift is essential for long-term profitability. Like any business, trading requires planning, capital management, record keeping, and continuous improvement." },
          { type: "callout", variant: "info", title: "Business Mindset", content: "Would you open a restaurant without a business plan? Treat trading the same way. Define your goals, strategies, risk tolerance, and metrics for success before you start." },
        ]
      },
      {
        heading: "Elements of a Trading Business",
        blocks: [
          { type: "bulletList", items: ["Business Plan — detailed trading plan with goals and strategies", "Capital Management — proper allocation and risk management", "Record Keeping — detailed trading journal for analysis", "Performance Review — regular evaluation of results", "Education Budget — allocate resources for continuous learning", "Tax Planning — understanding tax obligations from trading"] },
        ]
      },
      {
        heading: "Setting Up Your Trading Business",
        blocks: [
          { type: "text", content: "Start by defining your trading goals (e.g., 5% monthly return), your risk tolerance (e.g., 1% per trade, 10% monthly max drawdown), and your strategies. Then set up systems for tracking, reviewing, and improving your performance." },
          { type: "keyTakeaway", items: ["Treat trading as a business, not a gamble", "Create a business plan with clear goals and strategies", "Maintain proper records and review performance regularly"] },
        ]
      },
    ]
  },
  {
    id: 23, category: "Practice",
    title: "Creating a Trading Plan",
    sections: [
      {
        heading: "What Is a Trading Plan?",
        blocks: [
          { type: "text", content: "A trading plan is a comprehensive document that outlines your trading approach, including what you trade, when you trade, how much you risk, and how you manage your positions. It serves as your roadmap for every trading decision you make." },
          { type: "callout", variant: "warning", title: "Rule #1", content: "A trading plan is not optional. It is the single most important tool for consistent profitability. Without a plan, you are gambling, not trading." },
        ]
      },
      {
        heading: "Components of a Trading Plan",
        blocks: [
          { type: "bulletList", items: ["Markets and assets you will trade", "Trading strategy with clear entry and exit rules", "Risk management rules (position sizing, stop-losses)", "Daily/weekly routine for market analysis", "Performance metrics and review schedule", "Psychological rules for handling emotions"] },
        ]
      },
      {
        heading: "Sample Trading Plan Template",
        blocks: [
          { type: "table", headers: ["Component", "Your Rule"], rows: [["Assets to Trade", "EUR/USD, Volatility 100"], ["Strategy", "RSI reversal on 5-min chart"], ["Entry Rule", "RSI below 30 → Rise; RSI above 70 → Fall"], ["Position Size", "1% of account per trade"], ["Stop Loss", "Loss of 2% of account per day"], ["Max Trades/Day", "5"], ["Review Schedule", "Weekly performance review"]] },
        ]
      },
      {
        heading: "Sticking to Your Plan",
        blocks: [
          { type: "text", content: "Creating a trading plan is only half the battle — the real challenge is following it. Successful traders have the discipline to stick to their plan even when emotions are running high. If your plan consistently loses money, adjust it, but never abandon it mid-trade." },
          { type: "keyTakeaway", items: ["A trading plan is essential for consistent profitability", "Include entry/exit rules, risk management, and review procedures", "Discipline in following your plan is more important than the plan itself"] },
        ]
      },
    ]
  },
  {
    id: 24, category: "Practice",
    title: "Common Scams to Avoid",
    sections: [
      {
        heading: "Trading Scams Overview",
        blocks: [
          { type: "text", content: "The trading world is unfortunately full of scams designed to separate you from your money. As a trader, it is essential to recognize common scams and avoid them. If something sounds too good to be true, it almost certainly is." },
          { type: "callout", variant: "warning", title: "Red Flag", content: "Be extremely skeptical of anyone guaranteeing profits, promising 'secret strategies,' or pressuring you to deposit money quickly. Legitimate trading involves risk, and no one can guarantee results." },
        ]
      },
      {
        heading: "Common Scams",
        blocks: [
          { type: "definition", term: "Signal Seller Scams", definition: "Scammers who sell trading signals or 'insider tips.' Most signal sellers are not profitable traders themselves and make money from selling signals, not from trading." },
          { type: "definition", term: "Ponzi Schemes", definition: "Investment programs that pay returns to earlier investors using money from new investors. They always collapse when new investments stop." },
          { type: "definition", term: "Fake Brokers", definition: "Unregulated brokers who manipulate prices, reject withdrawals, or disappear with your funds. Always check regulatory status before depositing." },
          { type: "definition", term: "Robot Scams", definition: "Automated trading systems that claim to generate huge profits with no effort. Most are either worthless or designed to lose your money." },
        ]
      },
      {
        heading: "How to Protect Yourself",
        blocks: [
          { type: "bulletList", items: ["Only use regulated brokers like Deriv", "Be skeptical of guaranteed returns or risk-free profits", "Research any signal seller or course provider thoroughly", "Never share your account credentials or passwords", "Ignore unsolicited trading advice on social media", "Withdraw profits regularly to test broker reliability"] },
          { type: "keyTakeaway", items: ["Trading scams are common and target both beginners and experienced traders", "If it sounds too good to be true, it is", "Use regulated brokers, research thoroughly, and stay skeptical"] },
        ]
      },
    ]
  },
  {
    id: 25, category: "Practice",
    title: "Record Keeping and Review",
    sections: [
      {
        heading: "Why Keep Records?",
        blocks: [
          { type: "text", content: "Keeping detailed records of your trades is essential for improving your performance. Without records, you cannot objectively analyze what works and what doesn't. A trading journal is the single most valuable tool for self-improvement as a trader." },
          { type: "callout", variant: "info", title: "The Journal Advantage", content: "Traders who keep detailed journals improve 2-3 times faster than those who don't. Your journal helps you identify patterns, eliminate bad habits, and reinforce successful behaviors." },
        ]
      },
      {
        heading: "What to Record",
        blocks: [
          { type: "table", headers: ["Field", "Purpose"], rows: [["Date and Time", "Track when you trade and identify productive times"], ["Asset and Contract", "Know which instruments you trade most"], ["Entry and Exit Prices", "Calculate exact profit/loss"], ["Stake and Risk %", "Track risk management compliance"], ["Strategy Used", "Evaluate which strategies perform best"], ["Emotional State", "Identify emotional patterns affecting decisions"], ["Setup Screenshot", "Visual reference for later review"], ["Lesson Learned", "Capture insights immediately"]] },
        ]
      },
      {
        heading: "Reviewing Your Performance",
        blocks: [
          { type: "text", content: "Schedule regular reviews of your trading journal. Daily reviews help you spot immediate issues, while weekly and monthly reviews reveal longer-term patterns. Look for your strengths, weaknesses, and areas for improvement." },
          { type: "bulletList", items: ["Daily: Review each trade and identify immediate lessons", "Weekly: Calculate win rate, profit factor, and drawdown", "Monthly: Analyze performance by strategy, asset, and time of day", "Quarterly: Assess overall progress toward your trading goals"] },
          { type: "keyTakeaway", items: ["Record keeping is essential for trading improvement", "Track entry/exit, strategy, emotions, and lessons for every trade", "Review your journal daily, weekly, monthly, and quarterly"] },
        ]
      },
    ]
  },
  {
    id: 26, category: "Practice",
    title: "Trading Strategies",
    sections: [
      {
        heading: "What Is a Trading Strategy?",
        blocks: [
          { type: "text", content: "A trading strategy is a systematic approach to entering and exiting trades based on predefined rules. A good strategy removes emotion from decision-making and provides a consistent framework for evaluating opportunities." },
        ]
      },
      {
        heading: "Types of Trading Strategies",
        blocks: [
          { type: "table", headers: ["Strategy", "Time Frame", "Key Principle"], rows: [["Trend Following", "Any", "Trade in the direction of the trend"], ["Mean Reversion", "Short-term", "Prices tend to revert to their average"], ["Breakout", "Short to medium", "Trade when price breaks key levels"], ["Scalping", "Very short (seconds-minutes)", "Capture small price movements frequently"], ["Swing Trading", "Days to weeks", "Capture medium-term price swings"]] },
        ]
      },
      {
        heading: "Developing Your Own Strategy",
        blocks: [
          { type: "text", content: "While you can use existing strategies, developing your own gives you a deeper understanding. Start with a simple hypothesis, test it on historical data, refine it, and then test it on a demo account before using real money." },
          { type: "bulletList", items: ["Define the market conditions your strategy requires", "Set clear entry and exit rules", "Define risk management parameters", "Test on historical data (backtesting)", "Test on demo account (forward testing)", "Track performance metrics and refine"] },
          { type: "keyTakeaway", items: ["A trading strategy provides a systematic framework for decisions", "Common strategies include trend following, mean reversion, and breakout", "Develop and test your own strategy before using real money"] },
        ]
      },
    ]
  },
  {
    id: 27, category: "Practice",
    title: "Probability in Trading",
    sections: [
      {
        heading: "Understanding Probability",
        blocks: [
          { type: "text", content: "Probability is the branch of mathematics that deals with the likelihood of events occurring. In trading, understanding probability is essential because every trade has an uncertain outcome. Successful traders think in terms of probabilities, not certainties." },
          { type: "callout", variant: "info", title: "Probabilistic Thinking", content: "A single trade can win or lose due to random chance. What matters is whether your strategy has a positive edge over many trades. Focus on the long-term results, not individual outcomes." },
        ]
      },
      {
        heading: "Expected Value",
        blocks: [
          { type: "definition", term: "Expected Value (EV)", definition: "The average outcome you can expect per trade when a strategy is repeated many times. EV = (Win Probability × Average Win) - (Loss Probability × Average Loss)." },
          { type: "text", content: "A positive expected value means your strategy should be profitable over many trades. A negative expected value means you will lose money over time. This is why tracking your win rate and average win/loss sizes is crucial." },
        ]
      },
      {
        heading: "Probability and Risk Management",
        blocks: [
          { type: "text", content: "Understanding probability helps with risk management. Even with a 70% win rate, you could experience 5 or more consecutive losses due to normal statistical variance. Position sizing ensures you survive these losing streaks." },
          { type: "table", headers: ["Win Rate", "Consecutive Losses Possible", "Recommended Risk per Trade"], rows: [["60%", "10+", "0.5%-1%"], ["70%", "7+", "1%-2%"], ["80%", "4+", "1%-2%"], ["90%", "2+", "2%-3%"]] },
        ]
      },
      {
        heading: "The Law of Large Numbers",
        blocks: [
          { type: "text", content: "The Law of Large Numbers states that as the number of trials increases, the actual outcome approaches the expected outcome. This means your win rate and average returns become more predictable with more trades. Patience and consistency are key." },
          { type: "keyTakeaway", items: ["Trading is a game of probabilities, not certainties", "Calculate expected value to know if your strategy is profitable long-term", "Use probability to size positions appropriately for variance"] },
        ]
      },
    ]
  },
  {
    id: 28, category: "Practice",
    title: "Demo Accounts and Their Importance",
    sections: [
      {
        heading: "What Is a Demo Account?",
        blocks: [
          { type: "text", content: "A demo account is a practice trading account that uses virtual funds instead of real money. Deriv offers demo accounts with $10,000 in virtual currency, allowing you to trade in real market conditions without any financial risk." },
          { type: "callout", variant: "info", title: "Risk-Free Practice", content: "A demo account allows you to make mistakes and learn without financial consequences. This is the safest way to develop and test your trading skills." },
        ]
      },
      {
        heading: "Benefits of Demo Trading",
        blocks: [
          { type: "bulletList", items: ["Learn the platform without financial risk", "Test trading strategies in real market conditions", "Practice risk management without real losses", "Build confidence before trading with real money", "Test new strategies or indicators safely", "Understand how different contract types work"] },
        ]
      },
      {
        heading: "When to Switch to Real Money",
        blocks: [
          { type: "text", content: "You should switch to a real account only when you have consistently achieved positive results on demo for at least 1-3 months. Start with a small amount of money that you can afford to lose, and continue to practice risk management." },
          { type: "callout", variant: "warning", title: "Important", content: "Demo trading does not perfectly replicate real trading. The psychology of trading with real money is different. Be prepared for the emotional shift when you start trading with your own capital." },
          { type: "keyTakeaway", items: ["Demo accounts allow risk-free practice with virtual funds", "Test strategies and learn the platform before trading real money", "Switch to real money only after consistent demo profitability"] },
        ]
      },
    ]
  },
  {
    id: 29, category: "Practice",
    title: "Final Exam Prep",
    sections: [
      {
        heading: "Course Review",
        blocks: [
          { type: "text", content: "This section summarizes the key concepts covered throughout the course to help you prepare for the final assessment. Review each topic and ensure you understand the core principles before proceeding." },
        ]
      },
      {
        heading: "Key Concepts by Chapter",
        blocks: [
          { type: "bulletList", items: ["Chapters 1-3: Deriv platform, financial markets, and what trading is", "Chapters 4-7: Trading platforms and basic contract types (Options, Rise/Fall, Higher/Lower)", "Chapters 8-10: Advanced contracts (Touch/No Touch, Stay/Exit, Multipliers)", "Chapters 11-14: Technical and fundamental analysis, volatility concepts", "Chapters 15-16: Risk management and managing drawdowns", "Chapters 17-19: Deriv Bot, automation, and practical bot examples", "Chapters 20-21: Trading psychology and overcoming challenges", "Chapters 22-27: Business approach, trading plans, scams, record keeping, strategies, probability", "Chapter 28: Demo accounts and when to go live"] },
        ]
      },
      {
        heading: "Exam Topics",
        blocks: [
          { type: "table", headers: ["Topic", "Key Areas to Study"], rows: [["Platform Basics", "Account setup, deposits, withdrawals, demo vs real"], ["Contract Types", "Rise/Fall, Higher/Lower, Touch/No Touch, Stay/Exit, Multipliers"], ["Analysis", "Technical indicators, support/resistance, economic indicators"], ["Risk Management", "Position sizing, stop-losses, drawdown management"], ["Automation", "Deriv Bot blocks, building strategies, testing"], ["Psychology", "Emotional control, discipline, common challenges"], ["Best Practices", "Trading plan, journal keeping, scams to avoid"]] },
        ]
      },
      {
        heading: "Final Tips",
        blocks: [
          { type: "callout", variant: "info", title: "Success Tips", content: "Take your time with each question. Read carefully. Focus on understanding concepts rather than memorizing facts. Remember that this course is designed to prepare you for real-world trading." },
          { type: "keyTakeaway", items: ["Review all 28 chapters of course material", "Focus on understanding core concepts, not memorization", "Take your time and read each question carefully"] },
        ]
      },
    ]
  },
  {
    id: 30, category: "Practice",
    title: "Sample Trading Plans",
    sections: [
      {
        heading: "Sample Plan 1: Conservative Growth",
        blocks: [
          { type: "text", content: "This plan is designed for beginners who want steady, conservative growth. Focus is on capital preservation with moderate profit targets." },
          { type: "table", headers: ["Component", "Setting"], rows: [["Account Size", "$500"], ["Risk per Trade", "1% ($5)"], ["Max Daily Loss", "3% ($15)"], ["Monthly Goal", "5% ($25)"], ["Assets", "Volatility 25, EUR/USD"], ["Strategy", "RSI reversal on 15-min chart"], ["Max Trades/Day", "3"], ["Review", "Weekly"]] },
        ]
      },
      {
        heading: "Sample Plan 2: Moderate Growth",
        blocks: [
          { type: "text", content: "This plan is for intermediate traders comfortable with moderate risk. Combines technical analysis with trend following for consistent returns." },
          { type: "table", headers: ["Component", "Setting"], rows: [["Account Size", "$2,000"], ["Risk per Trade", "1.5% ($30)"], ["Max Daily Loss", "5% ($100)"], ["Monthly Goal", "8% ($160)"], ["Assets", "Volatility 50, Gold, S&P 500"], ["Strategy", "Moving Average crossover + MACD confirmation"], ["Max Trades/Day", "5"], ["Review", "Weekly"]] },
        ]
      },
      {
        heading: "Sample Plan 3: Aggressive Growth",
        blocks: [
          { type: "callout", variant: "warning", title: "High Risk Warning", content: "This plan is for experienced traders only. The higher risk parameters increase both potential returns and potential losses significantly." },
          { type: "table", headers: ["Component", "Setting"], rows: [["Account Size", "$5,000"], ["Risk per Trade", "2% ($100)"], ["Max Daily Loss", "8% ($400)"], ["Monthly Goal", "15% ($750)"], ["Assets", "Volatility 100, Crypto"], ["Strategy", "Breakout trading with multiple confirmations"], ["Max Trades/Day", "8"], ["Review", "Daily"]] },
        ]
      },
      {
        heading: "Choosing the Right Plan",
        blocks: [
          { type: "text", content: "The right plan for you depends on your account size, experience level, risk tolerance, and time commitment. Start with the conservative plan and only move to higher risk levels after achieving consistent results." },
          { type: "keyTakeaway", items: ["Choose a trading plan that matches your experience and risk tolerance", "Start conservative and gradually increase risk as you gain experience", "The best plan is one you can stick to consistently"] },
        ]
      },
    ]
  },
]

const CHAPTER_CATEGORY_MAP = {
  "Getting Started": [1, 2, 3],
  "Platforms": [4],
  "Contract Types": [5, 6, 7, 8, 9, 10],
  "Analysis": [11, 12, 13, 14],
  "Risk Management": [15, 16],
  "Automation": [17, 18, 19],
  "Psychology": [20, 21],
  "Practice": [22, 23, 24, 25, 26, 27, 28, 29, 30],
}

export { CHAPTERS, CHAPTER_CATEGORY_MAP }
