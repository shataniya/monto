const path = require("path")
const MongoClient = require("mongodb").MongoClient
const EventEmitter = require("events").EventEmitter

/**
 * @dsc The goal is to create the best used framework for operating mongodb
 */
function monto(url,options){
    return new monto.fn.init(url,options)
}

monto.prototype = Object.create(EventEmitter.prototype)
monto.prototype.constructor = monto

monto.fn = monto.prototype

/**
 * @function init
 * @dsc Initialize monto
 * @param url @dsc such as "mongodb://localhost:27017/database1"
 */
monto.prototype.init = function(url,options){
    this.url = url
    this.dir = path.parse(url).dir
    this.dbName = path.parse(url).name
    this.options = options || { useUnifiedTopology: true }
    __monto__init.call(this)
    return this
}

function __monto__init(){
    MongoClient.connect(this.url,this.options,(err,client)=>{
        if(err){
            this.emit("error",err)
        }
        var db = client.db(this.dbName)
        this.emit("connect",client)
        this.emit("insertOne",db)
        this.emit("insertMany",db)
        this.emit("findOne",db)
        this.emit("findMany",db)
        this.emit("updateOne",db)
        this.emit("updateMany",db)
        this.emit("deleteOne",db)
        this.emit("deleteMany",db)
        this.emit("drop",db)
        this.emit("close",client)
    })
}

monto.prototype.init.prototype = monto.fn

/**
 * @function connection
 * @dsc The specified function is triggered when the database is successfully connected.
 * @param fn @dsc The function to be called
 */
monto.prototype.connection = function(fn){
    this.once("connect",fn)
    return this
}

/**
 * @function close
 */
monto.prototype.close = function(fn){
    this.once("close",fn)
}

/**
 * @function insertOne
 * @dsc Insert a piece of data into the database
 * @param collection
 * @param data
 */
monto.prototype.insertOne = function(collection,data){
    if(arguments.length === 1){
        if(Object.prototype.toString.call(collection) !== "[object Object]"){
            throw new Error("\033[31minsertOne() requires data to be an object!\033[39m")
        }
        this.data = check(collection,this.opt)
        return this.insertOne(this.collection,this.data)
    }
    if(Object.prototype.toString.call(data) !== "[object Object]"){
        throw new Error("\033[31minsertOne() requires data to be an object!\033[39m")
    }
    return new Promise((resolve,reject)=>{
        __monto__init.call(this)
        this.on("insertOne",db=>{
            db.collection(collection).insertOne(data,(err,result)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        })
    })
}

/**
 * @function insert @dsc is the same as insertOne
 * @dsc Insert a piece of data into the database
 * @param collection
 * @param data @dsc The data to be inserted
 */
monto.prototype.insert = function(collection,data){
    // The function is the same as insertOne
    return this.insertOne(collection,data)
}

/**
 * @function insertMany
 * @dsc Insert a lot of data into the database
 * @param collection
 * @param data @dsc The data to be inserted
 */
monto.prototype.insertMany = function(collection,data){
    if(arguments.length === 1){
        if(Object.prototype.toString.call(collection) !== "[object Array]"){
            throw new Error("\033[31minsertMany() requires data to be an array!\033[39m")
        }
        var odata = []
        for(let i=0,len=collection.length;i<len;i++){
            odata.push(check(collection[i],this.opt))
        }
        this.data = odata
        return this.insertMany(this.collection,this.data)
    }
    if(Object.prototype.toString.call(data) !== "[object Array]"){
        throw new Error("\033[31minsertMany() requires data to be an array!\033[39m")
    }
    return new Promise((resolve,reject)=>{
        __monto__init.call(this)
        this.on("insertMany",db=>{
            db.collection(collection).insertMany(data,(err,result)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        })
    })
}

/**
 * @function findOne
 * @dsc Get a piece of data that meets the criteria
 * @param collection
 * @param condition
 */
monto.prototype.findOne = function(collection,condition){
    return new Promise((resolve,reject)=>{
        __monto__init.call(this)
        this.on("findOne",db=>{
            db.collection(collection).findOne(condition,(err,doc)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(doc)
                }
            })
        })
    })
}

/**
 * @function findMany
 * @dsc Get a lot of data that meets the criteria
 * @param collection
 * @param condition
 * @param flag
 */
monto.prototype.findMany = function(collection,condition,flag){
    this.collection = collection
    this.condition = condition
    if(flag){
        return this.go()
    }
    return this
}

/**
 * @function find @dsc is the same as findMany
 * @dsc Get a lot of data that meets the criteria
 * @param collection
 * @param condition
 * @param flag
 */
monto.prototype.find = function(collection,condition,flag){
    return this.findMany(collection,condition,flag)
}

/**
 * @function updateOne
 * @param collection
 * @param condition
 * @param modify
 */
monto.prototype.updateOne = function(collection,condition,modify){
    return new Promise((resolve,reject)=>{
        __monto__init.call(this)
        this.on("updateOne",db=>{
            db.collection(collection).updateOne(condition,modify,(err,result)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        })
    })
}

/**
 * @function update
 * @param collection
 * @param condition
 * @param modify
 */
monto.prototype.update = function(collection,condition,modify){
    return this.updateOne(collection,condition,modify)
}

/**
 * @function updateMany
 * @param collection
 * @param condition
 * @param modify
 */
monto.prototype.updateMany = function(collection,condition,modify){
    return new Promise((resolve,reject)=>{
        __monto__init.call(this)
        this.on("updateMany",db=>{
            db.collection(collection).updateMany(condition,modify,(err,result)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        })
    })
}

/**
 * @function deleteOne
 * @param collection
 * @param condition
 */
monto.prototype.deleteOne = function(collection,condition){
    return new Promise((resolve,reject)=>{
        __monto__init.call(this)
        this.on("deleteOne",db=>{
            db.collection(collection).deleteOne(condition,(err,result)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        })
    })
}

/**
 * @function remove
 * @param collection
 * @param condition
 */
monto.prototype.remove = function(collection,condition){
    return this.deleteOne(collection,condition)
}

/**
 * @function deleteMany
 * @param collection
 * @param condition
 */
monto.prototype.deleteMany = function(collection,condition){
    return new Promise((resolve,reject)=>{
        __monto__init.call(this)
        this.on("deleteMany",db=>{
            db.collection(collection).deleteMany(condition,(err,result)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        })
    })
}

/**
 * @function drop
 * @description Remove a collection from the database
 * @param collection
 */
monto.prototype.drop = function(collection){
    this.on("drop",db=>{
        db.collection(collection).drop()
    })
    return this
}


/**
 * @function skip
 * @param skipNum
 * @param flag
 */
monto.prototype.skip = function(skipNum,flag){
    this.skipNum = skipNum
    if(flag){
        return this.go()
    }
    return this
}

/**
 * @function limit
 * @param limitNum
 * @param flag
 */
monto.prototype.limit = function(limitNum,flag){
    this.limitNum = limitNum
    if(flag){
        return this.go()
    }
    return this
}

/**
 * @function sort
 * @param sortObject
 */
monto.prototype.sort = function(sortObject,flag){
    this.sortObject = sortObject
    if(flag){
        return this.go()
    }
    return this
}

/**
 * @function go
 * @param collection
 */
monto.prototype.go = function(){
    if(!this.collection){
        throw new Error("\033[31mMissing collection!\033[39m")
    }
    if(this.limitNum == null){
        this.limitNum = 0
    }
    if(this.skipNum == null){
        this.skipNum = 0
    }
    if(this.sortObject == null){
        this.sortObject = {}
    }
    return new Promise((resolve,reject)=>{
        __monto__init.call(this)
        this.on("findMany",db=>{
            db.collection(this.collection)
            .find(this.condition)
            .limit(this.limitNum)
            .skip(this.skipNum)
            .sort(this.sortObject)
            .toArray((err,docs)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(docs)
                }
            })
        })
    })
}


/**
 * @description Introducing the Schema module
 */
const Schema = require("./Schema")
monto.Schema = Schema


/**
 * @description Introducing the mdoel module
 */
function isObject(o){
    return Object.prototype.toString.call(o) === "[object Object]"
}

function objectLength(o){
    return Object.keys(o).length
}

function dataType(o){
    return Object.prototype.toString.call(o)
}

function equal(target,source){
    return dataType(target) === "[object "+ source.name +"]"
}

function check(data,options){
    if(objectLength(data) > objectLength(options)){
        throw new Error("\033[31mData does not match the data model!\033[39m")
    }
    for(let o in options){
        if(!data[o]){
            if(!isObject(options[o])){
                throw new Error("\033[31mData does not match the data model!\033[39m")
            }
            data[o] = options[o].default // Set to default if it does not exist
        }else{
            if(!isObject(options[o])){
                if(!equal(data[o],options[o])){
                    throw new Error("\033[31mData does not match the data model!\033[39m")
                }
            }else{
                if(!equal(data[o],options[o].type)){
                    throw new Error("\033[31mData does not match the data model!\033[39m")
                }
            }
        }
    }
    return data
}

/**
 * @function model
 * @description Use Schema to constrain collection
 * @param collection
 * @param SchemaModel
 */
monto.prototype.model = function(collection,SchemaModel){
    if(!collection){
        throw new Error("\033[31mMissing collection!\033[39m")
    }
    if(!(SchemaModel instanceof Schema)){
        throw new Error("\033[31mThe second argument to model must be an instance of Schema!\033[39m")
    }
    this.collection = collection
    this.SchemaModel = SchemaModel
    this.opt = SchemaModel.options
    return this
}

module.exports = monto
