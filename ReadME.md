### The goal is to create the best used framework for operating mongodb
> npm i monto
#### Example：
```javascript
const monto  = require("monto")
var db = monto("mongodb://localhost/database1")
db.connection(function(){
    console.log("connect successful!")
})
db.insertOne("users",{
    name:"zhangsan",
    age:34,
    gender:"man"
}).then(function(){
    console.log("Inserted successfully!")
})
```
- If you want to update the data
```javascript
const monto  = require("monto")
var db = monto("mongodb://localhost/database1")
db.connection(function(){
    console.log("connect successful!")
})
db.updateOne("users",{
    name:"zhangsan"
},{$set:{
    age:50
}}).then(function(){
    console.log("updated successfully!")
})
```
- If you want to find data
```javascript
const monto  = require("monto")
var db = monto("mongodb://localhost/database1")
db.connection(function(){
    console.log("connect successful!")
})
db.findMany("users",{},true).then(function(docs){
    console.log(docs)
})
```
- Or conditional lookup data
```javascript
const monto  = require("monto")
var db = monto("mongodb://localhost/database1")
db.connection(function(){
    console.log("connect successful!")
})
db.findMany("users",{}).skip(2).limit(2,true).then(function(docs){
    console.log(docs)
})
```
#### Method of use
- **All methods return a promise object**

|Method |Description
|------|------
|insert(collection,doc)|Insert a piece of data into the database
|insertOne(collection,doc)|Insert a piece of data into the database
|insertMany(collection,docs)|Insert a lot of data into the database
|update(collection,condition,modify)|Modify a piece of data in the database that meets the criteria
|updateOne(collection,condition,modify)|Modify a piece of data in the database that meets the criteria
|updateMany(collection,condition,modify)|Modify all data in the database that meets the criteria
|remove(collection,condition)|Delete one of the eligible data in the database
|deleteOne(collection,condition)|Delete one of the eligible data in the database
|deleteMany(collection,condition)|Delete all data in the database that meet the criteria
|drop(collection)|Delete the collection
|connection(fn)|Called fn when connecting
|close(fn)|Called fn when manually closed