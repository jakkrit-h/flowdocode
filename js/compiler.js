
var nodePointer=undefined;
var connectorPointer=undefined;
var inputSuccess=false;

$(document).on("click","button",function(){

    $("tbody").empty();

    $(this).html("<i class='fas fa-pause'></i>");
    $("#console").empty();
    controller($("#start").attr("data-connector"));
    
    
 
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
function controller(starterConnector){
     connectorPointer=starterConnector;
    let str="";
    var a=1
    while(true){


        if($(connectorPointer).attr("data-to")==undefined||$(connectorPointer).attr("data-to")=="#end" ){
            

            $("#play").html("<i class='fas fa-play'></i>");
            break;
        }else{
            nodePointer=$(connectorPointer).attr("data-to");
            let result=classify(nodePointer);
            if(result)
                break;
            connectorPointer=$(nodePointer).attr("data-connector");
        }
        a++;
    }
    
   
   
}
function compiler(str){
    return eval(str);
}

function classify(node){

    let result
    if(!$(node).hasClass("input")){
        let text =$(node).find(".text").text();
        result=compiler(text);
        Debugger(node,text,result);
    }
    if($(node).hasClass("display")){
         displayConsole(result);
    }
    if($(node).hasClass("decision")){
        if(result){
            $(node).attr("data-connector",$(node).attr("data-yes"));
        }else{
            $(node).attr("data-connector",$(node).attr("data-no"));

        }
    }
    if($(node).hasClass("input")){
        if(!inputSuccess){
            let input=document.createElement("div");
            $(input).attr("contenteditable","true");
            $(input).addClass("consoleInput");
            $("#console").append(input);
            $(input).focus();
            return true;
        }else{

            let source=$(node).find(".text").text()+"="+$(".consoleInput").text();
            result=compiler(source);
            $(".consoleInput").removeClass("consoleInput");
            inputSuccess=false;
        }
       
    }
   
    

}
function compileContinue(){
    controller(connectorPointer);
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
 
    $("#console").append(rsCompile);
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



   
 
   
