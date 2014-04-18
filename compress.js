/*
node compress path=sdf
*/
"use strict";

var fs =require("fs");
var process=require("process");

var path="";

process.argv.forEach(function(val,index,array){
	console.info(index+":"+val);
});

console.info("hello world");