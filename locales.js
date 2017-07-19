/**
 * Build array of D3 locales to use as data formatting options
 * Requires 'd3-format' and 'country-data' packages
 */

const fs = require('fs');
const path = require('path');
const countryData = require('country-data').countries;
const localesPath = './node_modules/d3-format/locale';
const writeLocation = './app/constants/d3Locales.js';
const defaultCountryCode = 'US';

/**
 * Get country code from filename
 *
 * @param string filename Assumes format like 'en-US.json'
 * @return string Country code or original filename if format not found
 */
function getCountryCode(filename) {
  const matches = /[a-z]+-([A-Z]+)\.json/.exec(filename);
  return matches ? matches[1] : filename;
}

/**
 * Turn filename into JSON object
 *
 * @param string filename
 * @return obj
 */
function handleFilename(filename) {
  // Parse JSON data from locale file
  const locale = JSON.parse(fs.readFileSync(path.join(localesPath, filename), 'utf8'));
  locale.filename = filename;

  // Add country code, name, and flag emoji
  const countryCode = getCountryCode(filename);
  locale.countryCode = countryCode;
  if (undefined !== countryData[countryCode]) {
    locale.name = countryData[countryCode].name;
    locale.emoji = countryData[countryCode].emoji;
  } else {
    locale.name = countryCode;
    locale.emoji = '';
  }
  return locale;
}

/**
 * Compare locales alphabetically. Try name first, then country code
 *
 * @param obj a First locale object
 * @param obj b Second locale object
 * @return int Output of String.prototype.localeCompare()
 */
function compareLocales(a, b) {
  const aName = a.name || a.countryCode;
  const bName = b.name || b.countryCode;
  return aName.localeCompare(bName);
}

/**
 * Write output to module file
 *
 * @param array locales
 */
function writeFile(locales, defaultIdx) {
  const fileContents = "/** File autogenerated by simplechart/locales.js. Do not edit manually. **/\n" +
    `export const locales = ${JSON.stringify(locales)};\n` +
    `export const defaultLocaleIndex = ${defaultIdx};\n`;

  fs.writeFile(writeLocation, fileContents, (err) => {
    if (err) throw err;
    console.log(`Wrote ${locales.length} locales to ${writeLocation}`);
  });
}

/**
 * Handle special cases that we don't want to process
 *
 * @param string filename
 * @param bool
 */
function shouldSkipFile(filename) {
  switch (filename) {
    // Skip duplicates for multi-language countries.
    case 'fr-CA.json':
    case 'ca-ES.json':
      return true;

    default:
      return false;
  }
}

/**
 * Call back after reading the directory containing the locales JSON files
 *
 * @param Error err
 * @param array files Filenames array
 */
function loopLocales(err, files) {
  if (err) {
    throw err;
  }

  // Get array of locale objects ordered by country name
  const locales = files.reduce((acc,filename) => {
    if (!shouldSkipFile(filename)) {
      acc.push(handleFilename(filename));
    }
    return acc;
  }, []);
  locales.sort((a, b) => compareLocales(a, b));

  // Get index of the default country, i.e. 'US'
  const defaultIdx = locales.reduce((prev, locale, currIdx) => {
    return defaultCountryCode === locale.countryCode ? currIdx : prev;
  }, 0);

  // output to module
  writeFile(locales, defaultIdx);
}

/**
 * Here we go!
 */
fs.readdir(localesPath, loopLocales);
