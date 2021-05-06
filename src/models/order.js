const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    "id": {
      "type": "Number"
    },
    "parent_id": {
      "type": "Number"
    },
    "item_id": {
      "type": "Number",
      unique: true
    },
    "item_name": {
      "type": "String"
    },
    "product_id": {
      "type": "Number"
    },
    "variation_id": {
      "type": "Number"
    },
    "quantity": {
      "type": "Number"
    },
    "status": {
      "type": "String"
    },
    "date_created": {
      "type": "Date"
    },
    "date_modified": {
      "type": "Date"
    },
    "discount_total": {
      "type": "String"
    },
    "discount_tax": {
      "type": "String"
    },
    "shipping_total": {
      "type": "String"
    },
    "shipping_tax": {
      "type": "String"
    },
    "cart_tax": {
      "type": "String"
    },
    "subtotal": {
      "type": "String"
    },
    "item_total": {
      "type": "String"
    },
    "total": {
      "type": "String"
    },
    "customer_id": {
      "type": "Number"
    },
    "order_key": {
      "type": "String"
    },
    "shipping": {
        "first_name": {
            "type": "String"
        },
        "last_name": {
            "type": "String"
        },
        "company": {
            "type": "String"
        },
        "address_1": {
            "type": "String"
        },
        "address_2": {
            "type": "String"
        },
        "city": {
            "type": "String"
        },
        "state": {
            "type": "String"
        },
        "postcode": {
            "type": "String"
        },
        "country": {
            "type": "String"
        },
        "phone": {
          "type": "String"
        }
    },
    "payment_method": {
      "type": "String"
    },
    "payment_method_title": {
      "type": "String"
    },
    "transaction_id": {
      "type": "String"
    },
    "customer_note": {
      "type": "String"
    },
    "date_completed": {
      "type": "Date"
    },
    "date_paid": {
      "type": "Date"
    },
    "cart_hash": {
      "type": "String"
    },
    "tax_class": {
      "type": "String"
    },
    "sku": {
      "type": "String"
    },
    "price": {
      "type": "Number"
    },
    "parent_name": {
      "type": "String"
    } 
  })

const Order = mongoose.model('Order', orderSchema)

module.exports = Order