const express = require('express')
const app = express()

const port = process.env.PORT || 3001

app.get('/check/:domain', async (req, res) => {    
    const { domain } = req.params
    const whois = require('whois-json');
    const result = await whois(domain, {follow: 3, verbose: true});
    const isTaken = result && result.length > 1 ? true : false;
    
    console.log(`Domain requested: ${domain} and it's ${isTaken ? '' : 'not'} taken`)

    res.json({
        domain,
        isTaken,
        success: true
    })
})

app.listen(port, () => console.log(`Domain Checker Api Started in Port ${port}`))