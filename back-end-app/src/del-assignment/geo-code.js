const https = require("https");
exports.fetchLatLng = function (address) {
  return new Promise((resolve, reject) => {
    const query = encodeURIComponent(address);
    console.log(query);
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

    const options = {
      headers: {
        "User-Agent": "Logistics-EMS-App/1.0",
      },
    };

    https
      .get(url, options, (res) => {
        let data = "";

        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            if (json.length > 0) {
              resolve({
                lat: parseFloat(json[0].lat),
                lng: parseFloat(json[0].lon),
                name: json[0].display_name,
              });
            } else {
              resolve(null);
            }
          } catch (err) {
            reject(err);
          }
        });
      })
      .on("error", reject);
  });
};
