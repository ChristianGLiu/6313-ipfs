/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'ipfs-http-client';
// connect to the default API address http://localhost:5001
const client = create();

import { AbortController } from "node-abort-controller";

global.AbortController = AbortController;

// async function main() {

// connect to a different API
// const client = create('http://127.0.0.1:5002')

// connect using a URL
// const client = create(new URL('http://127.0.0.1:5002'))

// call Core API methods
client.add('This is a purchase document!').then(async cid => {
    console.log("created message on IPFS:", cid);
    const resp = await client.cat(cid.path);
    let content = [];
    for await (const chunk of resp) {
        content = [...content, ...chunk];
        const raw = Buffer.from(content).toString('utf8')
        // console.log(JSON.parse(raw))
        console.log(raw)
    }

    // console.log(content.toString());
}).catch(e => {
    console.log(e);
});

// }

// main();