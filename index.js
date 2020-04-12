var aws = require('aws-sdk');
var ses = new aws.SES({ region: 'us-west-2' });
var request = require('request');
var cheerio = require('cheerio');

const checkInventory = () => {
    const url = "https://www.bestbuy.com/site/nintendo-switch-32gb-console-gray-joy-con/6364253.p?skuId=6364253"
    const cookie = "";
    const sourceEmailAddr = "haozhouzhu@gmail.com";
    const destinationEmailAddrs = ["814678064@qq.com"];
    
    const req = {
        url: url,
        headers: {
            "Accept": "application/json, text/plain, */*",
            "User-Agent": "axios/0.18.0",
            "Cookie": cookie
        }
    }
    request(req, (error, response, body) => {
        if (error) {
            console.log(error);
        }
        console.log("Status code: " + response.statusCode);
        const $ = cheerio.load(body);
        const status = $('.fulfillment-add-to-cart-button div button').text().trim();
        console.log("Inventory status: " + status);
        console.log("time: " + (new Date).toUTCString() + "\n");
        if (status !== "Sold Out") {
            var params = {
                Destination: {
                    ToAddresses: destinationEmailAddrs
                },
                Message: {
                    Body: {
                        Text: { Data: "" }
                    },
                    Subject: { Data: "Nintendo Switch is available!" }
                },
                Source: sourceEmailAddr
            };
            ses.sendEmail(params, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("email sent")
                    console.log(data);
                }
            });
        }
    });
}
console.log("Script starting...")
setInterval(checkInventory, 30000);
