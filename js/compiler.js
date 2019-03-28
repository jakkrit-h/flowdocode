
var objArr;

$(document).on("click","button",function(){
    console.log($("#canvas").html());
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
    let linePointer=$("#start").attr("data-connector");

    let str="";
    while(true){
        if($(linePointer).attr("data-to")==undefined ){
            break;
        }else{
            let nodePointer=$(linePointer).attr("data-to");
           
            classify(nodePointer);
            linePointer=$(nodePointer).attr("data-connector");
        }
    }
     console.log(str);
    
   
   
}
function compiler(str){
    return eval(str);
}

function classify(node){

 
    var result=compiler($(node).find(".text").text());
    if($(node).hasClass("display")){
         displayConsole(result);
    }else if($(node).hasClass("decision")){
            console.log(result);
        if(result){
            $(node).attr("data-connector",$(node).attr("data-yes"));
        }else{
            $(node).attr("data-connector",$(node).attr("data-no"));

        }
        console.log($(node).attr("data-connector"));
    }
    

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



   
 
   
