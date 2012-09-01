XML2JSON
========

XML2JSON 是一个基于NodeJs的封装组件，主要是用来解决XML转JSON格式的问题.


### 使用方法：  
安装：  
<pre>
$ npm install XML2JSON
</pre>

使用：  
<pre>
var xml2json = require("XML2JSON");
var xml      = "<xml><category><id>1</id><name>Programmer</name><url>http://www.k-zone.cn/zblog/catalog.asp?cate=1</url><intro></intro><order>1</order><count>3</count></category></xml>";
var json     = xml2json.parser( xml );
console.log( json );
</pre>

### 优化:
在原著基础上进行了优化，解决了以下问题：   
1、节点中存在CDATA被过滤的问题；  
2、空值被处理为对象、其余数据均为字符串的问题；    
3、增加代码注释，增加代码注释，方便日后各位优化；  
4、节点的多属性支持。   
5、去掉了内置的DEBUG和不做节点解析的部分（对我用处不大，所以被优化掉了）。  

###版权
原作者： [ Thomas Frank ](http://www.thomasfrank.se/xml_to_json.html)    
优  &nbsp;化： [ yhostc ]( http://yhostc.com )

