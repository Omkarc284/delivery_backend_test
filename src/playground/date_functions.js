const date = require('date-and-time');
// Import "day-of-week" plugin.
const day_of_week = require('date-and-time/plugin/day-of-week');

// Apply "day-of-week" plugin to `date-and-time`.
date.plugin(day_of_week);


var get_weekday = (new_date)=>{
    var d_c = new Date(new_date);
    return d_c.getDay()
}
const get_start_date = (new_date)=>{
    var d = new Date(new_date);
    const f = get_weekday(new_date)
    if(f === 6){
        const c = new Date(d.setDate(d.getDate() + 2));
        return c
    }
    const c = new Date(d.setDate(d.getDate() + 1));
    //const f = date.format(c, 'ddd, MMM DD YYYY');
    return c
    //return f
}
var date_increment = (new_date)=>{
    var d = new Date(new_date);
    const c = new Date(d.setDate(d.getDate() + 1));

    const f = date.format(c, 'ddd, DD MMM YYYY')
    return f
}
var d = new Date("Tue, 16 Mar 2021");
//var d_c = new Date(new_date);
f = d.getDay()
console.log(f)

// const c = new Date(d.setDate(d.getDate() + 1));
// console.log(c)
// const f = date.format(c, 'ddd, DD MMM YYYY')
// console.log(f)
