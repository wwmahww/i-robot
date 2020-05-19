
module.exports = {
    
timePeriod: (date) => {
    if(date === undefined)
        return Number.POSITIVE_INFINITY
    let currentTime = new Date().getTime();
    let duration = currentTime - date;
    return duration /= (1000*60*60*24)
},

check: (item, list = {}) => {
    let exist

    for(let key in list){
        if(list[key] === item){
            exist = true
            break
        }
    }
    return exist
},

isEmpty: (obj) => {
    for(let key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

};
