/*
node compress --folder d:/test
*/
"use strict";

var FS =require("fs");
var Process=require("process");
var Colors=require("colors");
var Path=require("path");

function unException(ex){
	//console.info("system error \n");
	console.info(ex);
}
Process.on("uncaughtException",unException);

function log(msg){
	var msg=("-->"+msg).magenta;
	console.info(msg);
}

//cmd 参数是通过空格进行分割
//--folder d:\folder
var folder="D:\\test\\js";

function setFolder(){
	var i=0;
	var len=Process.argv.length;
	for(;i<len;i++){
		if(Process.argv[i].toUpperCase()=="--FOLDER"){
			folder=Process.argv[i+1];
			break;
		}
	}
}
setFolder();
log("folder    "+folder);

var js=[];

function findAllJs(folder){
	var files=FS.readdirSync(folder);
	var _stat;
	var _path;
	files.forEach(function(val){
		_path=Path.join(folder,val);
		_stat=FS.lstatSync(_path);
		if(_stat.isDirectory()){
			findAllJs(_path);
		}
		else{
			log("js file    "+_path);
			js.push(_path);
		}
	});
}
findAllJs(folder);

function readJs(path){
	return FS.readFileSync(path,"utf-8");
}
console.info(readJs(js[0]));

