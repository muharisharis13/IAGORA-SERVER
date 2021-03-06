const { Storage } = require("@google-cloud/storage");
const serviceKey = require("./iagora-wingman-test-e124037e7982.json");
require("dotenv").config();


const storage = new Storage({
  keyFilename: serviceKey,
  projectId: process.env.GC_PROJECT_ID,
  credentials: {
    client_email: process.env.GC_CLIENT_EMAIL,
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC2VzeRbak+4hLh\nohYqrpw2SK//dsQgZ43c27nvYxDKIpTvxMEA4fe/eQYeJ/vjKWl3/P/noFsFCRwV\nwihK8FRsCj87Jc5SikqkVAT/1td00yJNpuyfM8pJTv72UmTM8hVaF2cqnl48x+4t\nyDtnGrKdi5n74n3lhA2AVMhhAb2c8rgHu7QVSAc+i15PDGsnEpLFkQZv6fYKiud6\nj0rl354ZNUcp1BJuI0q2oHKg+hAlDaDOpCcB6DEe9h2VUKQvRtEUvS1t35RJlXcK\naCY8W9Yr8M2gpgOzAnqTfBvNSH99KJMavEm5XgjXr81nGFEMU66GSrbdfCQaZEGH\n5ZJCyed/AgMBAAECggEAA3if/lVexvMQ/7eCEO7x+MRYl/gWg8uGwleu9zUwNOaM\nC7VKnU/kpi861QbIAw7bQ3gtM8z0MXRgjyvzfy4wPqeVSMAPhtXZ5OqqjZSiTexd\ngps4wNbEae35Q3fzyKcjQoJcMUZ68clUsXb0sOWVIF8VXBfv+vkgFjPlGqcwRXNg\n2jPrtuBULbuMiXbmjWOTpIWZbdpW5RDseypiJM8kJxlteCnqYCixtEwFl9fwLDVt\nG+IRerAgYtFCjCTrxHhf/lPjTO/8FSYc+Hdwr1u6DQPkxEm6ut9yx06LnLSQih7j\n/9otxLGRVh2JtLMOS20mCGqXjDzM3DYRdPoeANgQQQKBgQDi6GlaKOBrNy4JIlWk\nk98pbb8Xjoqi2cKGlQJwxgzYob1gd794aH/vA3MQu+TLOzg6PYd1oZwEiI3WXplB\ng7FpEIeJL+Un4s172sFDykWAm0m2dMaa1Se9CJRm+5ilXBrhCiUJHu8WqiMXAw24\nelY3ksE6nyTjo3VGzpxIaKp0vwKBgQDNuASw/YFTV6HPq8UtiJhOAJH6Vq/B39Lk\n1yFRFWQACRt8FILlVgQ2WdYoEIwHfSiZzqOapNiLv1Gsrqm9gG8gpZYjucno5Rcl\n+3eZYnmAnhqm278R+8H1rSdhZlRmubY9ze1xrqLXU6NtxVUvJFVJ7DWD5QwpeYyf\nRY4tJr99QQKBgDeHNLDxq+nQ+R0XH+pEnaofx1HWeircK3SP5qb+cIpbGmMPKvYm\nbJhrOa9wq87oURw/jnTE9c9OM5ewUsTrm3DgsKpr5CJcqHiU0hLq3xNX7TQPY8Lk\nQvNJtDd3fqWI4rMLroCK52ueezPYdXUdyxeSfGMCKx7iE4MecLRvmLc1AoGAC9vp\n2VIj3GwW1ePvD/rp3MVHpQjORPzkKXEFaKk1BJOB1BtSmGnnAEMZh2G80Mm0R3mU\nENwj55p12OCQxG3c+iLRjums7BIYzYW7lUoJ+xIiMzBDyYOb4M/Ej2bYwrs9+D4g\nzAbnOEaIC1Hu4TLU/9fwFdRkaReqtZvK4Gt1aoECgYB01C8hfgGGT7uTrGR5O8Ji\nNify5KhHJaq+1xYhTB+gjms8l4VGfIfUOmRyLAD+7m2BG53EPcsXuLwsGpqCl1R8\nKDEaUwpLPn0rxoujLpn68A+Creo68gsnuuxJpr+cc/lh+2+gF+34l1uWyQoSFySg\nAPz/8bqz4nZThko9x40E2g==\n-----END PRIVATE KEY-----\n",
  }
});

exports.bucket = storage.bucket("iagora2");