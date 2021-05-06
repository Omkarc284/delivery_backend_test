require('../db/mongoose')
const Data = require('../models/data')
const Order = require('../models/order')
const Schedule_del = require('../models/schedule_delivery')
const changeStream = Data.watch({ fullDocument: 'updateLookup' });
changeStream.on('change',(change)=>{

    if (change.operationType === 'insert'){
        let body = Object.create(change);
        delete body.fullDocument._id
        body.fullDocument.line_items.forEach(element => {
            var order = new Order(body.fullDocument)
            order.item_id = element.id
            order.item_name = element.name
            order.product_id = element.product_id
            order.variation_id = element.variation_id
            order.quantity = element.quantity
            order.subtotal = element.subtotal
            order.item_total = element.total
            order.price = element.price
            order.parent_name = element.parent_name
            order.sku = element.sku
            Order.find({item_id : element.id}, (err, doc)=>{
                if (!doc[0]){
                    order.save().then(()=>{
        
                    }).catch((err)=>{
                        console.log('Error: ', err)
                    })
                }
            })  
        });   
    }
    if (change.operationType === 'update'){
        const updates = Object.keys(change.updateDescription.updatedFields)
        Order.updateMany({id: change.fullDocument.id},change.updateDescription.updatedFields, {new: true, setDefaultsOnInsert: true},(err, res)=>{
            if(err){
                return console.log("Something wrong when updating order(s)!: ", err);
            }
            const isValidOps = updates.every((update)=> updates.includes('line_items'))
            if(isValidOps){
                change.updateDescription.updatedFields.line_items.forEach(element => {
                    Order.findOneAndUpdate({item_id : element.id},
                    {
                    item_id : element.id,
                    item_name : element.name,
                    product_id : element.product_id,
                    variation_id : element.variation_id,
                    quantity : element.quantity,
                    subtotal : element.subtotal,
                    item_total : element.total,
                    price : element.price,
                    parent_name : element.parent_name,
                    sku : element.sku
                    },
                    {new: true, setDefaultsOnInsert: true},
                    (err, doc)=>{
                        if(err){
                            return console.log("Something wrong when updating data!: ", err);
                        } 
                        console.log('suborder updated: ',doc.item_id)
                    })
                });   
            }
        })
        //deleting the data from order collection if a line item is deleted: 
        Order.find({id : change.fullDocument.id},(err, docs)=>{
            if(err){
               return console.log('Something is wrong: ',err)
            }
            docs.forEach(element => {
                Data.find({id : element.id, "line_items.id": element.item_id},(err, doc)=>{
                    if (err){
                        return console.log('Validation failed: ',err)
                    }
                    if(!doc[0]){
                        Order.deleteMany({item_id : element.item_id}, (err, result)=>{
                            if(err){
                               return console.log("Something wrong while deleting data! Update not confirmed: ", err);
                            }
                            Schedule_del.deleteMany({item_id: element.item_id},(e, r)=>{
                                if(err){
                                    return console.log("Something wrong while deleting data! Update not confirmed: ", err);
                                }
                                console.log('Update confirmed and Sub-Order: ', element.item_id,' is removed !')

                            })
                        })
                    }
                })                  
            });
        });
        
    }    
})
module.exports = changeStream