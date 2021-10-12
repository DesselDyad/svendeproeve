const fs = require('fs');

module.exports = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            fs.readFile('./public/json/crumbs.json', 'utf8', (err, data) => {
                if (err) { reject(err); }
                else {
                    crumbs = JSON.parse(data);
                    resolve(crumbs.crumbs);
                }
            });
        })
    }
}
