const HttpError = require('../HttpError');
const secp256k1 = require('secp256k1');

module.exports = {
	params: {
		required: [],
	},
	validate: function(params) {
	},
	info: function() {
		throw new HttpError('Invalid request. Expected querystring as follows: k1=SECRET&sig=SIGNATURE&key=LINKING_PUBKEY', 400)
	},
	action: function(secret, params) {
		if (!params.sig) {
			throw new HttpError('Missing required parameter: "sig"', 400);
		}
		if (!params.key) {
			throw new HttpError('Missing required parameter: "key"', 400);
		}
		return new Promise((resolve, reject) => {
			const k1 = Buffer.from(secret, 'hex');
			const signature = Buffer.from(params.sig, 'hex');
			const key = Buffer.from(params.key, 'hex')
			const signatureOk = secp256k1.verify(k1, signature, key);
			if (!signatureOk) {
				throw new HttpError('Invalid signature', 400);
			}
			resolve();
		});
	},
};
