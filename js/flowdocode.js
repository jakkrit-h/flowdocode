
var objArr;
var pointer;
$(document).on("click","button",function(){
    // var rawCode="";
    // collectPath();
    // console.log(window.objArr);
    $("#console").empty();
    controller();

  
 
});
// function collectPath(){
//     var nodePointer=$("#start").attr("data-next");
//     var continues=true;
//     var obj="";
//     objArr=$("#"+nodePointer).text();
//      while(continues){
         
//         // console.log($("#"+node).text());
//         obj=$("#"+nodePointer);
   
//         node=obj.attr("data-next");      
//         if(node=="end"){
//             break;
//         }else{
//             objArr+=$("#"+nodePointer).text();
//         }
       
       

//     }


// }
function controller(){
    var nodePointer=$("#start").attr("data-next");
    
    while(true){
        var node=$("#"+nodePointer);
      
        nodePointer=classify(node);
        if(nodePointer=="end"){
            break;
        }
    }
  
}
function compiler(str){
    
    return eval(str);
}

function classify(node){

 
    var result=compiler(node.text());
    if(node.hasClass("monitor")){
         displayConsole(result);
    }
    if(node.hasClass("decision")){
       if(result){
           node.attr("data-next",node.attr("data-true"));
       }else{
            node.attr("data-next",node.attr("data-false"));

       }
       
    }
    return node.attr("data-next");
    

}
// function synthetic(obj){
//     var str="if("+obj.text()+")";
//     return str;
// }
// function syntheticAlternative(obj){
//     var pathTrue=obj.attr("data-true");
//     var pathFalse=obj.attr("data-false");

//     var str="if("+obj.text()+"){";
//     str+=$("#"+pathTrue+"").text()+"}";
//     str+="else{"+$("#"+pathFalse+"").text()+"}";
//     console.log(str);
// }

function displayConsole(rsCompile){
 
    $("#console").append(rsCompile+"<br>");
}
// function start(){
//     var text= "";
//     var row=1;
//     $("#content").find(".shape").each(function(){
//         process($(this));
//         // text+= row+". &emsp;&emsp;"+$(this).text()+"<br>";
//         row++;
//     });
//     return text;
// }
// function process(shape){
//     alert(eval(shape.text));
// }