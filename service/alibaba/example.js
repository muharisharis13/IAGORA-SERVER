const OssClient = require("./helper/alibaba-osss")


const ossClient = new OssClient({ bucket: "iagora", region: "Indonesia (Jakarta)" })


ossClient.uploadObject('object-name.png', '/path/to/local/file/example.png');

// /**
//  * List all buckets in your account.
//  * @param {Object} [query]
//  * @param {String} [query.prefix] - Search objects that match prefix
//  * @param {String} [query.marker] - Search start from marker, including marker
//  * @param {String|Number} [query['max-keys'], Maximum objects in result
//  * @param {Object} [options] - Optional params
//  * @param {Number} [options.timeout] - Request timeout
//  * @return {Promise}
//  */
// AliOssClient.prototype.listBuckets = async function (query, options) {
//   const result = await this.client.listBuckets(query, options);
//   console.log('Bucket names: ' + _.map(result.buckets, 'name'));

//   return result;
// };

// ossClient.listBuckets();