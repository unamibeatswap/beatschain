const http = require('http');

// Test if the app is responding
const testApp = () => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    console.log(`✅ App is responding with status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ Homepage loaded successfully');
        console.log(`Content length: ${data.length} characters`);
      } else {
        console.log(`❌ Error: Status ${res.statusCode}`);
        console.log('Response:', data.substring(0, 500));
      }
      process.exit(0);
    });
  });

  req.on('error', (err) => {
    console.log(`❌ Connection error: ${err.message}`);
    process.exit(1);
  });

  req.on('timeout', () => {
    console.log('❌ Request timeout');
    req.destroy();
    process.exit(1);
  });

  req.end();
};

// Wait a moment for server to be ready
setTimeout(testApp, 2000);