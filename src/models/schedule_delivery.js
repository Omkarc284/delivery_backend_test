const mongoose = require('mongoose')

const schedule_deliverySchema = new mongoose.Schema({
  "id": {
    "type": "Number"
  },
  "item_id": {
    "type": "Number"
  },
  "item_name": {
    "type": "String"
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
  "item_total": {
    "type": "String"
  },
  "total": {
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
  "customer_note": {
    "type": "String"
  },
  "date_completed": {
    "type": "Date"
  },
  "start_date": {
    "type": "Date"
  },
  "end_date": {
    "type": "Date"
  },
  "package_quantity": {
    "type": "Number"
  },
  "delivery_Time_table": [
    {
      "D_o_d":{
        "type": "Date"
      },
      "del_quantity": {
        "type": "Number"
      },
      "del_status": {
        "type": "String"
      },
      "del_note": {
        "type": "String"
      }
    }
  ]
})

const Schedule_delivery = mongoose.model('Schedule_delivery', schedule_deliverySchema)

module.exports = Schedule_delivery