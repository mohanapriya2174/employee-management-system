const https = require('https');

exports.getDrivingRoute = function (stops) {
  if (!stops || stops.length < 2) {
    throw new Error("At least two coordinates are required.");
  }

  const coordinates = stops.map(p => `${p.lng},${p.lat}`).join(';');

  const options = {
    method: 'GET',
    hostname: 'fast-routing.p.rapidapi.com',
    path: `/route/v1/driving/${coordinates}?steps=true&overview=false`,
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY_r,
      'x-rapidapi-host': 'fast-routing.p.rapidapi.com',
      'Accept': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let chunks = [];

      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString();

        try {
          const data = JSON.parse(raw);

          if (!data?.routes || !data.routes[0]?.legs || !data.routes[0].legs[0]) {
            console.warn('⚠️ No usable route in response:', raw);
            return resolve({
              durationMinutes: 2,
              distanceKm: "0.5",
              summary: "Fallback route"
            });
          }

          const leg = data.routes[0].legs[0];

          resolve({
            durationMinutes: Math.ceil(leg.duration / 60),
            distanceKm: (leg.distance / 1000).toFixed(2),
            summary: leg.summary || 'Route found',
            raw: data.routes[0]
          });
        } catch (err) {
          console.error('❌ Error parsing route response:', raw);
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
};
