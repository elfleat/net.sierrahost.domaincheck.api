const express = require('express')
const request = require('request')
const app = express()

const port = process.env.PORT || 3001

const apiKey = process.env.RAPIDKEY || require('./config').apiKey;

app.get('/wake-up', (req, res) => {
    res.json({
        success: true
    })
})

app.get('/check/:domain', async (req, res) => {    
    const { domain } = req.params
    let isTaken
    console.log(`Domain requested: ${domain}`)
    try {

        var headers = {
            'X-RapidAPI-Key': apiKey,
            'Authorization': apiKey
        };
        
        var options = {
            url: `https://domainr.p.rapidapi.com/v2/status?domain=${domain}&checkType=FAST&forTransfer=false`,
            headers: headers
        };
        
        request(options, (error, response, body) => {
            body = JSON.parse(body)

            if (!error && response.statusCode == 200 && !body.errors) {
                // "inactive" means: Available for new registration
                // https://domainr.com/docs/api/v2/status
                const isTaken = body.status[0].status.indexOf('inactive') === -1
                return res.json({
                    domain,
                    isTaken,
                    success: true
                })
            }
            console.error(body.errors)
            return res.json({
                domain,
                errors: body.errors,
                success: false
            })
        });

    } catch(error) {
        console.log(`Request failed for: ${domain}`)

        res.json({
            success: false,
            error
        })
    }
})

app.listen(port, () => console.log(`Domain Checker Api Started in Port ${port}`))