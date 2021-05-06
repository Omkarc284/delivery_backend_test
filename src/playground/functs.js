const date = require('date-and-time');
// Import "day-of-week" plugin.
const day_of_week = require('date-and-time/plugin/day-of-week');

// Apply "day-of-week" plugin to `date-and-time`.
date.plugin(day_of_week);
const pkg_q = (v_id,quantity) =>{
    if(v_id === 9396){
        return 20
    }
    else if(v_id === 9401){
        return 25
    }
    else if(v_id === 9395){
        return 60
    }
    else if(v_id === 9402){
        return 75
    }
    else{
        return quantity
    }
}
const get_weekday = (new_date)=>{
    var d_c = new Date(new_date);
    return d_c.getDay()
}
const get_start_date = (new_date)=>{
    var d = new Date(new_date);
    var f = get_weekday(new_date)
    if(f === 6){
        var c = new Date(d.setDate(d.getDate() + 2));
        var e = date.format(c, 'ddd, DD MMM YYYY');
        return e
    }
    var c = new Date(d.setDate(d.getDate() + 1));
    var e = date.format(c, 'ddd, DD MMM YYYY');
    return e
}
const date_increment = (new_date)=>{
    var d = new Date(new_date);
    var c = new Date(d.setDate(d.getDate() + 1));

    var f = date.format(c, 'ddd, DD MMM YYYY')
    return f
}


module.exports = {
    pkg_q : pkg_q,
    get_start_date: get_start_date,
    get_weekday: get_weekday,
    date_increment: date_increment
}