const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
  "id": {
    "type": "Number",
    unique: true

  },
  "parent_id": {
    "type": "Number"
  },
  "status": {
    "type": "String"
  },
  "currency": {
    "type": "String"
  },
  "version": {
    "type": "String"
  },
  "prices_include_tax": {
    "type": "Boolean"
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
    "total": {
      "type": "String"
    },
    "total_tax": {
      "type": "String"
    },
    "customer_id": {
      "type": "Number"
    },
    "order_key": {
      "type": "String"
    },
    "billing": {
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
      "email": {
        "type": "String"
      },
      "phone": {
        "type": "String"
      }
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
    "customer_ip_address": {
      "type": "String"
    },
    "customer_user_agent": {
      "type": "String"
    },
    "created_via": {
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
    "number": {
      "type": "Number"
    },
    "meta_data": {
      "type": [
        "Mixed"
      ]
    },
    "line_items": [
      {
        "id": {
          "type": "Number"
        },
        "name": {
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
        "tax_class": {
          "type": "String"
        },
        "subtotal": {
          "type": "String"
        },
        "subtotal_tax": {
          "type": "String"
        },
        "total": {
          "type": "String"
        },
        "total_tax": {
          "type": "String"
        },
        "taxes": {
          "type": "Array"
        },
        "meta_data": [
          {
            "id": {
              "type": "Number"
            },
            "key": {
              "type": "String"
            },
            "value": {
              "type": "String"
            },
            "display_key": {
              "type": "String"
            },
            "display_value": {
              "type": "String"
            }
          }
        ],
        "sku": {
          "type": "String"
        },
        "price": {
          "type": "Number"
        },
        "parent_name": {
          "type": "String"
        }
      }
    ],
    "tax_lines": {
      "type": "Array"
    },
    "shipping_lines": {
      "type": "Array"
    },
    "fee_lines": {
      "type": "Array"
    },
    "coupon_lines": {
      "type": [
        "Mixed"
      ]
    },
    "refunds": {
      "type": "Array"
    },
    "date_created_gmt": {
      "type": "Date"
    },
    "date_modified_gmt": {
      "type": "Date"
    },
    "date_completed_gmt": {
      "type": "Mixed"
    },
    "date_paid_gmt": {
      "type": "Date"
    },
    "currency_symbol": {
      "type": "String"
    },
    "_links": {
      "self": {
        "type": [
          "Mixed"
        ]
      },
      "collection": {
        "type": [
          "Mixed"
        ]
      }
    }

})

const Data = mongoose.model('Data', dataSchema)

module.exports = Data