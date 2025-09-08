const cron = require('cron');
const https = require('https');

const job = new cron.CronJob("*/14 * * * *", function () {
  https
    .get(process.env.API_URL, (res) => {
      if (res.statusCode === 200) {
        console.log(`[CRON] Pinged API successfully at ${new Date().toISOString()}`);
      } else {
        console.log(`[CRON] Failed to ping API: ${res.statusCode}`);
      }
    })
    .on("error", (e) => console.error("[CRON] Error:", e.message));
});

module.exports = job;
