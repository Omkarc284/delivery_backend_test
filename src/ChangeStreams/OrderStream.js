require('../db/mongoose')
const Order = require('../models/order')
const Schedule_del = require('../models/schedule_delivery')
const date = require('date-and-time');
const functs = require('../playground/functs.js')
// Import "day-of-week" plugin.
const day_of_week = require('date-and-time/plugin/day-of-week');
const { get_start_date, get_weekday, date_increment } = require('../playground/functs')
// Apply "day-of-week" plugin to `date-and-time`.
date.plugin(day_of_week);

const orderstream = Order.watch({ fullDocument: 'updateLookup' });

orderstream.on('change',(chng)=>{
    if ((chng.operationType === 'insert' && chng.fullDocument.status === 'processing')||(chng.operationType === 'update' && (chng.updateDescription.updatedFields.status === 'processing' || chng.updateDescription.updatedFields.status ==='completed'|| chng.fullDocument.status === 'processing'))){

        let body = Object.create(chng);
        delete body.fullDocument._id
        var delvry = new Schedule_del(body.fullDocument)
        delvry.package_quantity = functs.pkg_q(delvry.variation_id,delvry.quantity)
        delvry.start_date = functs.get_start_date(delvry.date_created)
        var q = delvry.package_quantity;
        var dte = delvry.start_date;
        
        if (q === 20||q=== 60){
            var i = 0            
            while (i < q) {
                var dte = new Date(dte)
                var day = dte.getDay()
                var tt = {
                    D_o_d : date.format(dte, 'ddd, DD MMM YYYY'),
                    del_quantity : delvry.quantity,
                    del_status : "Delivery Scheduled"
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
                    D_o_d : date.format(dte, 'ddd, DD MMM YYYY'),
                    del_quantity : delvry.quantity,
                    del_status : "Delivery Scheduled"
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
                D_o_d : date.format(dte, 'ddd, DD MMM YYYY'),
                del_quantity : delvry.quantity,
                del_status : "Delivery Scheduled"
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

module.exports = orderstream