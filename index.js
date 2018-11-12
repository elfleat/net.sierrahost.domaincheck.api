const express = require('express')
const request = require('request')
const whois = require('whois-json')
const app = express()

const port = process.env.PORT || 3001

app.get('/wake-up', (req, res) => {
    res.json({
        success: true
    })
})

// app.get('/checkv2/:domain', async (req, res) => {    
//     const { domain } = req.params
//     const whois = require('whois-json')

//     console.log(`Domain requested: ${domain}`)
//     try {
//         const result = await whois(domain, {follow: 3, verbose: true});
//         const isTaken = result && result.length > 1 ? true : false;
        
//         console.log(`${domain} is ${isTaken ? '' : 'not'} taken`)
    
//         res.json({
//             domain,
//             isTaken,
//             success: true
//         })

//     } catch(error) {
//         console.log(`Request failed for: ${domain}`)

//         res.json({
//             success: false,
//             error
//         })
//     }
// })


app.get('/check/:domain', async (req, res) => {    
    const { domain } = req.params
    let isTaken
    console.log(`Domain requested: ${domain}`)
    try {

        var headers = {
            'accept': 'application/json',
            'Authorization': 'sso-key 9EE5Efgwg99_QdqnHVHsfmzz7bPbDQ2Wkb:QdqpvkDqp813qEhurZrtEf'
        };
        
        var options = {
            url: `https://api.godaddy.com/v1/domains/available?domain=${domain}&checkType=FAST&forTransfer=false`,
            headers: headers
        };
        
        request(options, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body)
                // console.log(body)
                const isTaken = !body.available
                console.log(`${domain} is ${isTaken ? '' : 'not'} taken`)
                res.json({
                    domain,
                    isTaken,
                    success: true
                })
            }
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