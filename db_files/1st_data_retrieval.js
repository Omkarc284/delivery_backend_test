require('../src/db/mongoose')
const dotenv = require('dotenv');
dotenv.config();

const Data = require('../src/models/Data')

const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
// import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; // Supports ESM

const WooCommerce = new WooCommerceRestApi({
  url: process.env.store_url, // Your store URL
  consumerKey: process.env.Ckey, // Your consumer key
  consumerSecret: process.env.Csecret, // Your consumer secret
  version: process.env.Ver // WooCommerce WP REST API version
});
WooCommerce.get("orders?per_page=100").then((response) => {
    const bin = response.data
    
    bin.forEach(batch => {
      const order_data = new Data(batch)
      order_data.save().then(()=>{
        console.log('Order added',batch.id)
      }).catch((e)=>{
        console.log('Error: ',e)
      })
      
    });
    console.log('Total orders added: ',response.data.length);
  })
  .catch((error) => {
    console.log(error.response);
  });
 


