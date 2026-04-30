import dotenv from "dotenv";
dotenv.config({ path: '.env.credentials' })

import express from "express"
import cors from "cors"
import bodyParser from "body-parser";
import '@shopify/shopify-api/adapters/node';
import { shopifyApi, ApiVersion, Session } from "@shopify/shopify-api";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// SHOPIFY OAUTH SETUP
const shopify = shopifyApi({
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: process.env.SCOPES.split(","),
    apiVersion: ApiVersion.April26,
    hostName: 'localhost',
    isEmbeddedApp: false
});
app.get('/api/shop/products', async (req, res) => {
    // GETTING PRODUCTS WITH MANUAL SESSION AND ACCESS TOKEN
    // YOU JUST NEET @SHOPIFY/SHOPIFY-API PACKAGE AND SHOPIFYAPI OBJECT
    try {   
        const session = new Session({
            id: 'offline_session_id',
            shop: new URL(process.env.SHOPIFY_STORE_URL).hostname,
            state: 'state',
            isOnline: false,
            accessToken: process.env.SHOPIFY_ACCESS_TOKEN
        });
        const client = new shopify.clients.Rest({ session });
        const response = await client.get({
            path: 'products',
        });
        console.log(response.body.products);
    } catch(error) {
        console.log(error)
    }
});




// THIS METHOD IS FOR BROWSER BASED AUTHENTICATION
// import { shopifyApp } from "@shopify/shopify-app-express";
// import { MemorySessionStorage } from "@shopify/shopify-app-session-storage-memory";
// import { ApiVersion } from "@shopify/shopify-api";

// app.use("/api/auth", shopify.auth.begin());
// app.get(
//     "/api/auth/callback",
//     shopify.auth.callback(),
//     (req, res) => {
//       res.redirect("/");
//     }
// );


// const shopify = shopifyApp({
//     api: {
//         apiKey: process.env.SHOPIFY_API_KEY,
//         apiSecretKey: process.env.SHOPIFY_API_SECRET,
//         scopes: process.env.SCOPES.split(","),
//         apiVersion: ApiVersion.April25,
//         hostName: 'localhost:3000',
//         isEmbeddedApp: false,
//     },
//     auth: {
//         path: '/api/auth',
//         callbackPath: '/api/auth/callback',
//     },
//     sessionStorage: new MemorySessionStorage(),
// });
// app.get("/api/shop/products", shopify.validateAuthenticatedSession(), async(req, res) => {
//     try {
//         const session = res.locals.shopify.session;
//         console.log("session", session)
//         const client = new shopify.api.clients.Rest({ session });
//         const response = await client.get({
//             path: "products"
//         });
//         console.log(response.body.products)
//         res.json(response.body.products)
//     } catch(error) {
//         console.error(error);
//   res.status(500).json({ error: error.message });
//     }
// });


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); 
