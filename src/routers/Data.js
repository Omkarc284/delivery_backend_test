const express = require('express')
const bodyParser = require("body-parser")
const Data = require('../models/data')
const Order = require('../models/order')
const Schedule_del = require('../models/schedule_delivery')
const router = new express.Router()
const date = require('date-and-time');
const functs = require('../playground/functs.js')
// Import "day-of-week" plugin.
const day_of_week = require('date-and-time/plugin/day-of-week');
const { get_start_date, get_weekday, date_increment } = require('../playground/functs')


// Tell express to use body-parser's JSON parsing
router.use(bodyParser.json());
router.post("/hook", (req, res) => {
    const body = Object.create(req.body);
    const header = req.headers;
    const topic = header['x-wc-webhook-topic'];
    const orderid = body.id;
    if(topic === 'order.created'){
        var order_data = new Data(req.body)
        body.meta_data.forEach(element => {
            if (element.key === '_shipping_phone'){
                order_data.shipping.phone = element.value
            }   
        }); 
        order_data.save().then(()=>{
            res.status(200).end()
        }).catch((error)=>{
            console.log('Error: ', error)
        })
    }
    if(topic === 'order.updated'){
        var order_data = new Data(req.body)
        body.meta_data.forEach(element => {
            if (element.key === '_shipping_phone'){
                order_data.shipping.phone = element.value
            }   
        });
        let newbody = order_data.toObject();
        delete newbody._id;
        try{
            Data.findOneAndUpdate({id: req.body.id}, newbody, {new: true, upsert: true, setDefaultsOnInsert: true}, (err, result)=>{
                if(err){
                    console.log("Something wrong when updating data!: ", err);
                } 
                console.log('Data Updated: ', req.body.id)
                res.status(200).end()
            })

            
        }catch(e){
            console.log('Error: ', e)
            res.status(400).end()
        }
    }
    if(topic === 'order.deleted'){
        Data.deleteMany({id : req.body.id}, (err, result)=>{
            if(err){
               return console.log("Something wrong while deleting data!: ", err);
            }
            Order.deleteMany({id: req.body.id},(err, result)=>{
                if(err){
                    console.log('Sub-Orders not deleted due to : ',err)
                }
                console.log('Order deletion complete: ', req.body.id)
                Schedule_del.deleteMany({id: req.body.id},(e, r)=>{
                    if(err){
                        return console.log("Something wrong while deleting data! Update not confirmed: ", err);
                    }
                    console.log(' Schedules for Order: ', req.body.id,' is removed !')

                })
            })
            res.status(200).end()
        })
    }
    if(topic === 'order.restored'){
        var order_data = new Data(req.body)
        body.meta_data.forEach(element => {
            if (element.key === '_shipping_phone'){
                order_data.shipping.phone = element.value
            }   
        }); 
        order_data.save().then(()=>{
            console.log( 'Order restored : ', order_data.id )
            res.status(200).end()
        }).catch((error)=>{
            console.log('Error: ', error)
        })
    }
    
})

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

date.plugin(day_of_week);

const orderstream = Order.watch({ fullDocument: 'updateLookup' });

orderstream.on('change',(chng)=>{
    if ((chng.operationType === 'insert' && chng.fullDocument.status === 'processing')||(chng.operationType === 'update' && (chng.updateDescription.updatedFields.status === 'processing' || chng.updateDescription.updatedFields.status ==='completed'|| chng.fullDocument.status === 'processing'))){

        let body = Object.create(chng);
        delete body.fullDocument._id
        var delvry = new Schedule_del(body.fullDocument)
        delvry.package_quantity = functs.pkg_q(delvry.variation_id,delvry.quantity)
        delvry.start_date = functs.get_start_date(delvry.date_created, delvry.variation_id)
        var q = delvry.package_quantity;
        var dte = delvry.start_date;
        
        if (q === 20||q=== 60){
            var i = 0            
            while (i < q) {
                var dte = new Date(dte)
                var day = dte.getDay()
                var tt = {
                    D_o_d : dte,
                    del_quantity : delvry.quantity,
                    del_status : "Scheduled",
                    del_note : ""
                };
                if(day===1||day===2||day===3||day===4||day===5){
                    
                    delvry.delivery_Time_table.push(tt);
                    i = i+1;
    
                }
                dte = date_increment(dte);
            }
            delvry.end_date = delvry.delivery_Time_table[q-1].D_o_d;
        }
        else if (q === 25||q=== 75){
            var i = 0
            
            while (i < q){
                var dte = new Date(dte)
                var day = dte.getDay()
                var tt = {
                    D_o_d : dte,
                    del_quantity : delvry.quantity,
                    del_status : "Scheduled",
                    del_note : ""
                };
                if(day===1||day===2||day===3||day===4||day===5||day===6){
                
                    delvry.delivery_Time_table.push(tt);
                    i = i+1;
                }
                dte = date_increment(dte);
            }
            delvry.end_date = delvry.delivery_Time_table[q-1].D_o_d;
        }
        else{
            var tt = {
                D_o_d : dte,
                del_quantity : delvry.quantity,
                del_status : "Scheduled",
                del_note: ""
            };
            delvry.delivery_Time_table.push(tt);
        }
        delvry.save().then(()=>{
    
        }).catch((err)=>{
            console.log('Error: ', err)
        })
    }
    if (chng.operationType === 'update' && (chng.updateDescription.updatedFields.status ==='completed'|| chng.fullDocument.status === 'processing')){
        Schedule_del.updateOne({item_id: chng.fullDocument.item_id},chng.updateDescription.updatedFields, {new: true, setDefaultsOnInsert: true},(err, res)=>{
            if(err){
                return console.log("Something wrong when updating order(s)!: ", err);
            }
            console.log('Order - ', chng.fullDocument.id,'-', chng.fullDocument.item_id,'updated')
        })
    }
    if(chng.operationType === 'update' && (chng.updateDescription.updatedFields.status ==='pending'|| chng.updateDescription.updatedFields.status ==='on-hold'|| chng.updateDescription.updatedFields.status ==='failed'||chng.updateDescription.updatedFields.status ==='cancelled')){
        Schedule_del.deleteMany({item_id : chng.fullDocument.item_id},(err, result)=>{
            if(err){
                console.log('Unable to update delivery schedule due to : ',err)
            }
            console.log('Schedule deleted of order: ', chng.fullDocument.id, '-',chng.fullDocument.item_id  )
        })
    }
})

module.exports = router





