import "./contentScript.css";

interface ExchangeRate {
  [key: string]: string | number;
}

const symbols: string[] = [
  "AED",
  "AFN",
  "ALL",
  "AMD",
  "ANG",
  "AOA",
  "ARS",
  "AUD",
  "AWG",
  "AZN",
  "BAM",
  "BBD",
  "BDT",
  "BGN",
  "BHD",
  "BIF",
  "BMD",
  "BND",
  "BOB",
  "BOV",
  "BRL",
  "BSD",
  "BTN",
  "BWP",
  "BYN",
  "BZD",
  "CAD",
  "CDF",
  "CHE",
  "CHF",
  "CHW",
  "CLF",
  "CLP",
  "CNY",
  "COP",
  "COU",
  "CRC",
  "CUC",
  "CUP",
  "CVE",
  "CZK",
  "DJF",
  "DKK",
  "DOP",
  "DZD",
  "EGP",
  "ERN",
  "ETB",
  "EUR",
  "FJD",
  "FKP",
  "GBP",
  "GEL",
  "GHS",
  "GIP",
  "GMD",
  "GNF",
  "GTQ",
  "GYD",
  "HKD",
  "HNL",
  "HRK",
  "HTG",
  "HUF",
  "IDR",
  "ILS",
  "NIS",
  "INR",
  "IQD",
  "IRR",
  "ISK",
  "JMD",
  "JOD",
  "JPY",
  "KES",
  "KGS",
  "KHR",
  "KMF",
  "KPW",
  "KRW",
  "KWD",
  "KYD",
  "KZT",
  "LAK",
  "LBP",
  "LKR",
  "LRD",
  "LSL",
  "LYD",
  "MAD",
  "MDL",
  "MGA",
  "MKD",
  "MMK",
  "MNT",
  "MOP",
  "MRU",
  "MUR",
  "MVR",
  "MWK",
  "MXN",
  "MXV",
  "MYR",
  "MZN",
  "NAD",
  "NGN",
  "NIO",
  "NOK",
  "NPR",
  "NZD",
  "OMR",
  "PAB",
  "PEN",
  "PGK",
  "PHP",
  "PKR",
  "PLN",
  "PYG",
  "QAR",
  "RON",
  "RSD",
  "RUB",
  "RWF",
  "SAR",
  "SBD",
  "SCR",
  "SDG",
  "SEK",
  "SGD",
  "SHP",
  "SLL",
  "SOS",
  "SRD",
  "SSP",
  "STN",
  "SYP",
  "SZL",
  "THB",
  "TJS",
  "TMT",
  "TND",
  "TOP",
  "TRY",
  "TL",
  "TTD",
  "TWD",
  "TZS",
  "UAH",
  "UGX",
  "USD",
  "USN",
  "UYI",
  "UYU",
  "UZS",
  "VEF",
  "VND",
  "VUV",
  "WST",
  "XAF",
  "XCD",
  "XOF",
  "XPF",
  "YER",
  "ZAR",
  "ZMW",
  "ZWL",
];

const bubbleDOM = document.createElement("div");
bubbleDOM.setAttribute("class", "selection_bubble");
document.body.appendChild(bubbleDOM);

const renderBubble = (selection: string): void => {
  const range = window.getSelection().getRangeAt(0);
  const rect = range.getBoundingClientRect();
  bubbleDOM.innerHTML = selection;

  bubbleDOM.style.top = rect.top - bubbleDOM.offsetHeight - 10 + "px";
  bubbleDOM.style.left =
    (rect.left + rect.right) / 2 - bubbleDOM.offsetWidth / 2 + "px";

  bubbleDOM.style.visibility = "visible";
};

document.addEventListener(
  "mouseup",
  (): void => {
    const selection: string = window.getSelection()?.toString() || "";
    const ounceRegex: RegExp = new RegExp(
      /^(\d+([.,]\d+)?)\s*(?:fl\s+)?(?:fluid\s+)?(?:oun?ces?|oz)$/i
    );

    const ounceMatch: RegExpMatchArray | null = selection.match(ounceRegex);
    if (ounceMatch) {
      const ounceValue: number = parseFloat(ounceMatch[1]);
      const mlValue: number = Math.ceil(ounceValue * 29.574);

      let volumeString: string;
      if (mlValue >= 1000) {
        const literValue: number = mlValue / 1000;
        if (mlValue >= 2000) {
          const numLiters: number = Math.floor(literValue);
          volumeString = `${numLiters} L`;
          const remainingMl: number = mlValue - numLiters * 1000;
          if (remainingMl > 0) {
            volumeString += ` ${remainingMl} ml`;
          }
        } else {
          volumeString = `${Math.round(literValue * 10) / 10} L`;
        }
      } else {
        volumeString = `${mlValue} ml`;
      }

      renderBubble(volumeString);
    }

    const millilitresRegex: RegExp = new RegExp(/^(\d+([.,]\d+)?)\s*ml$/i);
    const millilitresMatch: RegExpMatchArray | null =
      selection.match(millilitresRegex);
    if (millilitresMatch) {
      const millilitresValue: number = parseFloat(millilitresMatch[1]);
      const ounceValue: number = millilitresValue / 29.574;

      renderBubble(`${Math.round(ounceValue * 10) / 10} fl oz`);
    }

    const fahrenheitRegex: RegExp = new RegExp(
      /^(\d+(?:[.,]\d+)?)\s*(?:°|\s)*[fF]$/
    );
    const fahrenheitMatch: RegExpMatchArray | null =
      selection.match(fahrenheitRegex);
    if (fahrenheitMatch) {
      const fahrenheitValue: number = parseFloat(fahrenheitMatch[1]);

      renderBubble(`${Math.round(((fahrenheitValue - 32) * 5) / 9)}°C`);
    }

    const celsiusRegex: RegExp = new RegExp(
      /^(\d+(?:[.,]\d+)?)\s*(?:°|\s)*[cC]$/
    );
    const celsiusMatch: RegExpMatchArray | null = selection.match(celsiusRegex);
    if (celsiusMatch) {
      const celsiusValue: number = parseFloat(celsiusMatch[1]);

      renderBubble(`${Math.round((celsiusValue * 9) / 5 + 32)}°F`);
    }

    const mphRegex = /^(\d+(?:\.\d+)?)\s*(?:mph|m\.p\.h)$/i;
    const mphMatch = selection.match(mphRegex);
    if (mphMatch) {
      const MilesPerHourValue = parseFloat(mphMatch[1]);

      renderBubble(`${Math.round(MilesPerHourValue * 1.609 * 10) / 10} km/h`);
    }

    const kmhRegex = /^(\d+(?:\.\d+)?)\s*(?:km\/h)$/i;
    const kmhMatch = selection.match(kmhRegex);
    if (kmhMatch) {
      const KilometersPerHourValue = parseFloat(kmhMatch[1]);

      renderBubble(
        `${Math.round((KilometersPerHourValue / 1.609) * 10) / 10} mph`
      );
    }

    const feetRegex = /^(\d+(?:\.\d+)?)\s*(?:ft|feet)$/i;
    const feetMatch = selection.match(feetRegex);
    if (feetMatch) {
      const meterValue = parseFloat(feetMatch[1]);
      const feetValue = meterValue / 3.281;
      const roundedFeetValue = feetValue.toFixed(2).replace(/\.?0+$/, "");

      renderBubble(`${roundedFeetValue} m`);
    }

    const metersRegex = /^(\d+(?:\.\d+)?)\s*(?:meter|meters|m)$/i;
    const metersMatch = selection.match(metersRegex);
    if (metersMatch) {
      const feetValue = parseFloat(metersMatch[1]);
      const meterValue = feetValue * 3.281;
      const roundedMeterValue = meterValue.toFixed(2).replace(/\.?0+$/, "");

      renderBubble(`${roundedMeterValue} ft`);
    }

    const inchesRegex = /^(\d+(?:\.\d+)?)\s*(?:in|inch|inches)$/i;
    const inchesMatch = selection.match(inchesRegex);
    if (inchesMatch) {
      const inchesValue = parseFloat(inchesMatch[1]);
      const centimeterValue = inchesValue * 2.54;
      const roundedFeetValue = centimeterValue.toFixed(2).replace(/\.?0+$/, "");

      renderBubble(`${roundedFeetValue} cm`);
    }

    const centimetersRegex =
      /^(\d+(?:\.\d+)?)\s*(?:cm|centimeter|centimeters)$/i;
    const centimetersMatch = selection.match(centimetersRegex);
    if (centimetersMatch) {
      const centimetersValue = parseFloat(centimetersMatch[1]);
      const inchesValue = centimetersValue / 2.54;
      const roundedFeetValue = inchesValue.toFixed(2).replace(/\.?0+$/, "");

      renderBubble(`${roundedFeetValue} in`);
    }

    chrome.storage.local.get((result: { [key: string]: any }): void => {
      if (result && result.key && result.key.rates) {
        const exchangeRate: ExchangeRate = result.key.rates;

        const currencyCodes: string = symbols.join("|");
        const currencyRegex: RegExp = new RegExp(
          `([0-9]+([,.][0-9]+)?)\\s*(${currencyCodes})`,
          "i"
        );
        const currencyMatch: RegExpMatchArray | null =
          selection.match(currencyRegex);

        const currencyRegex0: RegExp = new RegExp(
          `([0-9,.]*\\d[.]\\d{2})\\s+(${currencyCodes})`
        );
        const currencyMatch0: RegExpMatchArray | null =
          selection.match(currencyRegex0);

        const currencyRegex1: RegExp = new RegExp(
          `(${currencyCodes})\\s*([0-9]+([,.][0-9]+)?)`,
          "i"
        );
        const currencyMatch1: RegExpMatchArray | null =
          selection.match(currencyRegex1);

        const currencyRegex2: RegExp = new RegExp(
          /\d+(?:[,\s]\d{3})*(?:\.\d{2})?\s*(?:[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6])/
        );
        const currencyMatch2 = selection.match(currencyRegex2);

        const currencyRegex3: RegExp = new RegExp(
          /(?:[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6])\s?\d+(?:[,\s]\d{3})*(?:\.\d{2})?/
        );
        const currencyMatch3 = selection.match(currencyRegex3);

        if (currencyMatch) {
          const amount = parseInt(currencyMatch[1].replace(/[^\d.]/g, ""));
          let isoCode: string = currencyMatch[3].toUpperCase();

          if (isoCode === "NIS") {
            isoCode = "ILS";
          }
          if (isoCode === "TL") {
            isoCode = "TRY"
          }

          if (isoCode !== result.key.base) {
            const rate: number = parseFloat(exchangeRate[isoCode] as string);

            renderBubble(
              `${(Math.ceil((amount / rate) * 100) / 100).toLocaleString()} ${
                result.key.base
              }`
            );
          }
        }

        if (currencyMatch0) {
          const amount: number = parseInt(currencyMatch0[1].replace(",", ""));
          let isoCode: string = currencyMatch0[2].toUpperCase();
          if (isoCode === "NIS") {
            isoCode = "ILS";
          }
          if (isoCode === "TL") {
            isoCode = "TRY"
          }

          if (isoCode !== result.key.base) {
            const rate: number = parseFloat(exchangeRate[isoCode] as string);

            renderBubble(
              `${(Math.ceil((amount / rate) * 100) / 100).toLocaleString()} ${
                result.key.base
              }`
            );
          }
        }

        if (currencyMatch1) {
          const amount = parseInt(currencyMatch1[0].replace(/[^\d.]/g, ""));
          let isoCode: string = currencyMatch1[1].toUpperCase();

          if (isoCode === "NIS") {
            isoCode = "ILS";
          }

          if (isoCode === "TL") {
            isoCode = "TRY"
          }

          if (isoCode !== result.key.base) {
            const rate: number = parseFloat(exchangeRate[isoCode] as string);

            renderBubble(
              `${(Math.ceil((amount / rate) * 100) / 100).toLocaleString()} ${
                result.key.base
              }`
            );
          }
        }

        if (currencyMatch2) {
          let isoCode: string;
          const string = currencyMatch2[0];
          const symbolRegex =
            /[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/;
          const symbol = string.match(symbolRegex)?.[0];

          const amount = parseInt(currencyMatch2[0].replace(/[^\d.]/g, ""));
          switch (symbol) {
            case "$":
              isoCode = "USD";
              break;
            case "€":
              isoCode = "EUR";
              break;
            case "£":
              isoCode = "GBP";
              break;
            case "¥":
              isoCode = "JPY";
              break;
            case "₩":
              isoCode = "KRW";
              break;
            case "₽":
              isoCode = "RUB";
              break;
            case "₺":
              isoCode = "TRY";
              break;
            case "₪":
              isoCode = "ILS";
              break;
            case "₼":
              isoCode = "AZN";
              break;
            case "฿":
              isoCode = "THB";
              break;

            case "₴":
              isoCode = "UAH";
              break;

            default:
              isoCode = "";
              break;
          }

          if (isoCode !== result.key.base) {
          const rate: number = parseFloat(exchangeRate[isoCode] as string);
          renderBubble(
            `${(Math.ceil((amount / rate) * 100) / 100).toLocaleString()} ${
              result.key.base
            }`
          );
          }
        }

        if (currencyMatch3) {
          let isoCode: string;
          const string = currencyMatch3[0];
          const symbolRegex =
            /[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/;
          const symbol = string.match(symbolRegex)?.[0];
          const amount = parseFloat(string.replace(/[^\d.]+/g, ""));

          switch (symbol) {
            case "$":
              isoCode = "USD";
              break;
            case "€":
              isoCode = "EUR";
              break;
            case "£":
              isoCode = "GBP";
              break;
            case "¥":
              isoCode = "JPY";
              break;
            case "₩":
              isoCode = "KRW";
              break;
            case "₽":
              isoCode = "RUB";
              break;
            case "₺":
              isoCode = "TRY";
              break;
            case "₪":
              isoCode = "ILS";
              break;
            case "₼":
              isoCode = "AZN";
              break;
            case "฿":
              isoCode = "THB";
              break;

            case "₴":
              isoCode = "UAH";
              break;

            default:
              isoCode = "";
              break;
          }

          if (isoCode !== result.key.base) {
          const rate: number = parseFloat(exchangeRate[isoCode] as string);
          renderBubble(
            `${(Math.ceil((amount / rate) * 100) / 100).toLocaleString()} ${
              result.key.base
            }`
          );
          }
        }
      }
    });
  },
  false
);

document.addEventListener(
  "mousedown",
  (event: MouseEvent): void => {
    bubbleDOM.style.visibility = "hidden";
  },
  false
);
