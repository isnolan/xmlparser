/*
*  XML2JSON package for Node.js
*  Author    : Thomas Frank(2005-2007)
*  Update    : yhostc@gmail.com
*  version   : 1.0
*  Date      : 2012-09-01
*  Project   : https://github.com/yhostc/XML2JSON
* 
* 使用：
* var xml2json = require("XML2JSON");
* var xml = "<poi><pguid>B000A2E9FB</pguid><name><![CDATA[中关村广场]]></name><code>110108</code>"
* var json     = xml2json.parser( xml );
* myJsonObject=xml2json.parser(str);
* console.log( json );
*/

module.exports = {
	parser : function(/*带解析的XML字符串*/xml){
		// 转换不做解析的节点名称数组 
		var tags = tags || '';
		tags = tags instanceof Array ? tags : tags.split(',');
		// 替换掉右边界符前N个空格
		xml = xml.replace(/\s*\/>/g,'/>');
		// 替换掉左节点有边界钱N个空格
		xml = xml.replace(/\s*>/g,'>');
		// CDATA片区替换
		xml = xml.replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1");
		// 去除所有问号包含部分
		xml = xml.replace(/<\?[^>]*>/g,"").replace(/<\![^>]*>/g, "");
		// 将快速结束符解析为普通节点
		var x = this.fastending2normal(xml);
		// 转换子属性为子节点
		x = this.attris2tags(x);
		return this.xml_to_object(x);
	},
	// 将XML解析为JSON
	xml_to_object : function(xml){
		// 将右节点右边界符替换掉
		var x = xml.replace(/<\//g,"�");
		// 以左节点左边界符分割为数组,即：节点组数组
		x = x.split("<");
		var json = {};
		var tags = ['json'];
		/**/
		// 循环每个节点组
		for (var i=1; i < x.length; i++){
			// 节点行
			var row = x[i].split("�");
			// 分析节点名称及值
			var key_value = row[0].split('>'), tagname = key_value[0], val = key_value[1];
			// 检测右节点是否在此行出现，如存在右节点，则为数据行，否则为下级做好存储对象
			if(!row[1]){//节点行 "searchresult>"
				tags.push(tagname);
				var origin = eval(tags.join('.'));
				if(!origin){//节点不存在，则创建对象
					eval(tags.join('.')+'={}');
				}else if(!(origin instanceof Array)){// 节点存在，调整为数组
					var topNode = tags.join('.');
					eval(topNode+'=[]');
					eval(topNode+'.push(origin,{})');
				}else{
					eval(tags.join('.')+'.push({})');
				}
			}else{//数据行 "time>23"
				val = !val ? "" : val ;
				val = val && !isNaN(val) ? Number(val) : val;
				var obj = eval(tags.join('.'));
				if(obj instanceof Array){
					obj[obj.length-1][tagname] = val;
				}else{
					eval(tags.join('.')+'.'+tagname+'=val');
				}
			}
			if(row.length>2){//如果检测到额外的结束节点，则退上一级
				for(var j=2; j<row.length; j++){
					tags.pop();
				}
			}
		};
		return json;
	},
	// 解析快速结束符号为普通节点    <pinyin/> -> <pinyin></pinyin>
	fastending2normal:function(x){
		x = x.split("/>");
		for (var i=1; i < x.length; i++){
			var t = x[i-1].substring(x[i-1].lastIndexOf("<")+1).split(" ")[0];
			x[i] = "></"+t+">" + x[i];
		}	
		x = x.join("");
		return x;
	},
	// 属性变子节点 <a type="list"><a> -> <a><type>list</type></a>
	attris2tags: function(x){
		//进行内容预处理，做字符的保护处理
		var d = ' ="\''.split('');
		x = x.split(">");//对节点进行分析
		for (var i=0; i<x.length; i++){
			var temp = x[i].split("<");
			for (var r=0; r<4; r++){//节点左侧部分
				temp[0] = temp[0].replace(new RegExp(d[r],"g"),"_jsonconvtemp"+r+"_");//将所有符号进行转义
			}
			if(temp[1]){//节点右侧部分
				temp[1] = temp[1].replace(/'/g,'"');//单引号转为双引号
				temp[1] = temp[1].split('"');
				for (var j=1; j<temp[1].length; j+=2){
					for (var r=0; r<4; r++){
						temp[1][j] = temp[1][j].replace(new RegExp(d[r],"g"), "_jsonconvtemp"+r+"_")
					}
				};
				temp[1] = temp[1].join('"')
			};
			x[i] = temp.join("<")
		};
		x = x.join(">");
		// 将所有属性等号前后空格替换掉 
		x = x.replace(/(\s*)=(\s*)/g, "=");
		// 将属性变为子节点
		x = x.replace(/ ([^=]*)=([^ |>]*)/g, "><$1>$2</$1");
		// 替换掉值中的引号
		x = x.replace(/>"/g,">").replace(/"</g,"<");
		// 清楚右边界前空格
		x = x.replace(/\w\s+>/g,'>');
		// 还原被保护字符
		for (var r=0; r<4; r++){
			x = x.replace(new RegExp("_jsonconvtemp"+r+"_","g"), d[r]);
		}
		
		return x;
	}
};
