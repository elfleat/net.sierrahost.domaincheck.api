const express = require('express')
const app = express()

const port = process.env.PORT || 3001

app.get('/wake-up', (req, res) => {
    res.json({
        success: true
    })
})

app.get('/check/:domain', async (req, res) => {    
    const { domain } = req.params
    const whois = require('whois-json')

    console.log(`Domain requested: ${domain}`)
    try {
        const result = await whois(domain, {follow: 3, verbose: true});
        const isTaken = result && result.length > 1 ? true : false;
        
        console.log(`${domain} is ${isTaken ? '' : 'not'} taken`)
    
        res.json({
            domain,
            isTaken,
            success: true
        })

    } catch(error) {
        console.log(`Request failed for: ${domain}`)

        res.json({
            success: false,
            error
        })
    }
})

app.listen(port, () => console.log(`Domain Checker Api Started in Port ${port}`))