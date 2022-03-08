let AWS = require('aws-sdk');


let keyPairId = YOUR_KEY_PAIR_ID;

// It is not clear in which format YOUR_PRIVATE_KEY suppose to be inserted, maybe just path or so what...
// When storing key as environment variable string, all new line suppose to be changed to \n:
// let privateKey = ""-----BEGIN RSA PRIVATE KEY-----\nMIIE ...... Kg==\n-----END RSA PRIVATE KEY-----"
let privateKey = YOUR_PRIVATE_KEY;


let cfUrl = "xyz.cloudfront.net";
let expiry = 1543607263;

let policy = {
  'Statement': [{
    'Resource': 'http*://' + cfUrl + '/*',
    'Condition': {
      'DateLessThan': {'AWS:EpochTime': expiry}
    }
  }]
};

let policyString = JSON.stringify(policy);

let signer = new AWS.CloudFront.Signer(keyPairId, privateKey);

exports.getSignedCookie = function(req, res) {
    var options = {url: "http://"+cfUrl, policy: policyString};

    signer.getSignedCookie(options, function(err, cookie) {
        if (err) {
            res.send(err);
        } else {

            console.log("cookies: ");
            console.log(cookie);
            res.send(cookie);
            
        }
    });
};
