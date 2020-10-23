const {
  readFile,
  writeFile,
} = require('fs');
const {
  promisify,
} = require('util');
const {
  request,
} = require('http');
const got = require('got');
const juice = require('juice');
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const cwd = process.cwd();
const generateBody = async logArr => {
  const body = juice((await readFileAsync(`${cwd}/assets/mail.html`, () => {}))
    .toString()
    .replace('***content***', logArr
      .map(entry => `
        <tr>
          <td>
            <b>
              ${entry.date}
            </b>
          </td>
          <td>
            <img src=${entry.icon} alt=""/>
          </td>
          <td>
            ${entry.site}
          </td>
        </tr>
      `)
      .join('')
    ));
  writeFileAsync(`${cwd}/assets/report.html`, body, () => {});
};

(async () => {
  const log = (await readFileAsync(`${cwd}/~log.csv`, () => {})).toString();
  let logArr = (await Promise.all([ ...new Set(log
    .split('\n')) ]
    .filter(entry => entry.length > 0)
    .map(entry => entry.split(','))
    .filter(entry => entry.length < 3)
    .map(entry => {return({
      date: new Date(parseInt(entry[0], 10))
        .toLocaleString('en-CA', { timeZone: 'America/New_York' }),
      site: entry[1],
      icon: `http://${entry[1]}/favicon.ico`
    })})
    .map(async entry => {return({
      ...entry,
      keep: await (async () => {
        try {
          await got(entry.icon, { method: 'HEAD', timeout: 1000 });
          return(true);
        } catch (error) {
          return(false);
        }
      })()
    })})
  )).filter(entry => entry.keep);
  generateBody(logArr);
  console.log('Report generated.');
})();
