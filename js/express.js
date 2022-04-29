const express = require('express');
const path = require('path');

module.exports = class expressServer{
   // app;
    constructor(p){
        this.app = express();
        const port = p //Express.js port
        //Home
        this.app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, './../index.html'));
        });
        //css
        this.app.get('/styles.css', function(req, res) {
            res.sendFile(path.join(__dirname, "./../styles.css"));
          });
        //Test
        this.app.get('/datahandler.js', (req, res) => {
            res.sendFile(path.join(__dirname, "./../datahandler.js"));
            });
        this.app.get('/charts.js', async (req, res) => {
            res.sendFile(path.join(__dirname, "./../charts.js"));
            });
        this.app.use(express.static('public'))
        //Start
        this.app.listen(port, () => {
        console.log(`G22 Project listening on port ${port}`)
        });
    }
}
