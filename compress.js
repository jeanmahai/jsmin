/*
node compress --folder d:/test

closure-compiler:需要代理才能访问
http://closure-compiler.appspot.com/compile
js_code:
compilation_level:WHITESPACE_ONLY|SIMPLE_OPTIMIZATIONS|ADVANCED_OPTIMIZATIONS
output_format:text
output_info:compiled_code

*/
"use strict";

var FS =require("fs");
var Process=require("process");
var Colors=require("colors");
var Path=require("path");
var Request=require("request");

var COMPRESS_URL="http://closure-compiler.appspot.com/compile";
var PROXY='http://127.0.0.1:8087';
var CPMPRESS_LEVEL='SIMPLE_OPTIMIZATIONS';
var COMPRESS_CURATION=10*1000;

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
			if(new RegExp(".*\.min\.js$",'i').test(_path)) {
				return;
			}
			log("js file    "+_path);
			js.push(_path);
		}
	});
}
findAllJs(folder);

function readJs(path){
	return FS.readFileSync(path,"utf-8");
}

function compress(){
	var jsPath=js.shift();
	if(!jsPath) return;
	if(new RegExp(".*\.min\.js$",'i').test(jsPath)) {
		compress();
	}
	var jsCode=readJs(jsPath);
	log("begin compressing :    "+jsPath);
	Request({
		method:"POST",
		uri:COMPRESS_URL,
		form:{
			js_code:jsCode,
			compilation_level:CPMPRESS_LEVEL,
			output_format:'text',
			output_info:'compiled_code'
		},
		proxy:PROXY
	},function(error,response,body){
		if(!error && response.statusCode==200){
			if(new RegExp("^Error.*","i").test(body)){
				log(body);
			}
			else{
				var dir=Path.dirname(jsPath);
				var base=Path.basename(jsPath,'.js');
				var min=Path.join(dir,base+".min.js");
				log("save"+min);
				FS.writeFileSync(min,body);
				log("done compressed :    "+jsPath);
			}
			setTimeout(compress,COMPRESS_CURATION);
		}
		else{
			log(error);
		}
	});
}
compress();


