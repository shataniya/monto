/**
 * @class Schema
 * @description Create a data template
 * @param options
 */
function Schema(options){
    if(Object.prototype.toString.call(options) !== "[object Object]"){
        throw new Error("\033[31mSchema's argument must be an object!\033[39m")
    }
    this.options = options
}

module.exports = Schema
