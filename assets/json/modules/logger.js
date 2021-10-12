const fs = require('fs');

module.exports = {
    logChange: async (article_id, title, author) => {
        return new Promise((resolve, reject) => {
            let now = new Date().toLocaleString('en-GB')
            console.log('logger-side', article_id, author, now);
            fs.exists('./assets/logging/articles/' + article_id + '.json', exists => {
                if(exists) {
                    fs.readFile('./assets/logging/articles/' + article_id + '.json', (err, data) => {
                        if (err) { reject(err); }
                        else {
                            let parsedData = JSON.parse(data);
                            let entries = parsedData.entries;
                            entries.push(
                                {
                                    'type': 'UPDATE',
                                    'title': title,
                                    'editor': author,
                                    'created': now
                                }
                            )

                            fs.writeFile('./assets/logging/articles/' + article_id + '.json', JSON.stringify({'entries': entries}), (err, data) => {
                                if(err) reject(err);
                                resolve('file created');
                            })
                        }
                    })
                } else {
                    let firstEntry = { entries: [
                        {
                            'type': 'CREATED',
                            'title': title,
                            'article_id': article_id,
                            'editor': author,
                            'created': now
                        }
                    ]}
                    let data = JSON.stringify(firstEntry)
                    fs.writeFile('./assets/logging/articles/' + article_id + '.json', data, (err, data) => {
                        if(err) reject(err);
                        resolve('file created');
                    })
                }
            })
        })
    },
    deleteLog: id => {
        return new Promise((resolve, reject) => {
            fs.exists('./assets/logging/articles/' + id + '.json', exists => {
                if(exists) {
                    fs.unlink('./assets/logging/articles/' + id + '.json', (err, res) => {
                        if(err) reject(err);
                        resolve(res);
                    })
                }
                else {
                    resolve('no such log file');
                }
            })
        })
    }
}

