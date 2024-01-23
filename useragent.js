const fs = require('fs').promises;
const cliProgress = require('cli-progress');

// Function to delete the old file asynchronously
async function deleteOldFile(filePath) {
  try {
    if (await fs.access(filePath)) {
      await fs.unlink(filePath);
      console.log('Old useragent.txt file deleted.');
    }
  } catch (error) {
    console.error('Error deleting old file:', error.message);
  }
}

// Function to initialize the progress bar as a promise
function initializeProgressBar(total) {
  return new Promise((resolve) => {
    const progressBar = new cliProgress.SingleBar({
      format: 'Progress [{bar}] {percentage}% | ETA: {eta}s | {value,} / {total,} | {duration_formatted}',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
      stopOnComplete: true,
      clearOnComplete: true,
      fps: 5
    }, cliProgress.Presets.shades_classic);

    progressBar.start(total, 0);

    // Resolve the promise with the progress bar instance
    resolve(progressBar);
  });
}

// Function to generate user agents using a for...of loop
function generateUserAgents(count, progressBar) {
  const userAgents = new Set();

  for (let _ of Array(count)) {
    const newUserAgent = generateUserAgent();
    userAgents.add(newUserAgent);

    // Update the progress bar for each iteration
    progressBar.increment();
  }

  return Array.from(userAgents);
}

// Function to save user agents to a file asynchronously
async function saveUserAgentsToFile(filePath, userAgents) {
  try {
    await fs.writeFile(filePath, userAgents.join('\n'), 'utf-8');
    console.log('User agents saved to', filePath);
  } catch (error) {
    console.error('Error saving user agents to file:', error.message);
  }
}

// Utility function to get a random element from an array concisely
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Function to generate a random user agent string
function generateUserAgent() {
  const platforms = ['Windows NT 10.0', 'Macintosh; Intel Mac OS X 10_15_7', 'Linux; Android 11', 'iPad; CPU OS 15_0 like Mac OS X'];
  const browsers = [
    'Chrome/98.0.4758.102',
    'Firefox/95.0',
    'Safari/15.2',
    'Edge/98.0.1108.43',
    'Opera/82.0.4227.30'
  ];

  const platform = getRandomElement(platforms);
  const browser = getRandomElement(browsers);

  const userAgent = `"Mozilla/5.0 (${platform}) AppleWebKit/537.36 (KHTML, like Gecko) ${browser} Mobile Safari/537.36",`;

  return userAgent;
}

// Constants for configuration
const FILE_PATH = 'useragent.txt';
const TOTAL_USER_AGENTS = 10000;

// Main asynchronous function
async function main() {
  // Delete old useragent.txt file if it exists
  await deleteOldFile(FILE_PATH);

  // Initialize a colored progress bar with commas as thousand separators
  const progressBar = await initializeProgressBar(TOTAL_USER_AGENTS);

  // Generate 10,000 unique realistic user agent strings
  const userAgents = generateUserAgents(TOTAL_USER_AGENTS, progressBar);

  // Save user agents to a new file named useragent.txt
  await saveUserAgentsToFile(FILE_PATH, userAgents);

  // Stop the progress bar
  progressBar.stop();
  console.log('Unique realistic user agents saved to useragent.txt');
}

// Call the main asynchronous function
main();
