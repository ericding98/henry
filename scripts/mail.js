if (process.argv.length <= 3) throw new Error('Need emails.');

const {
  readFile,
} = require('fs');
const {
  promisify,
} = require('util');
const {
  createTransport,
} = require('nodemailer');
const cwd = process.cwd();
const readFileAsync = promisify(readFile);
const args = process.argv;
const mailOptions = {
  from: 'eric.ding.98@gmail.com',
  to: args.slice(3).join(','),
  subject: `Henry\'s daily browsing report - ${args[2]}`
};
const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: 'eric.ding.98@gmail.com',
    pass: 'QApl9173RUmii'
  }
});

(async () => {
  await transporter.sendMail({
    ...mailOptions,
    html: await readFileAsync(`${cwd}/assets/report.html`)
  }, res => {
    console.log(`Email sent: ${res}`);
  });
})();
