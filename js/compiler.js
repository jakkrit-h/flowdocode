
var nodePointer=undefined;
var connectorPointer=undefined;
var inputSuccess=false;
var onDebug=false;
$(document).on("click","#play",function(){
    clearOnDebug();

    onButtonClick();
    $(this).html("<i class='fas fa-stop'></i>");
    $("#debug").html("<i class='fas fa-bug'></i>");
    controller($("#start").attr("data-connector"));
    
});
$(document).on("click","#debug",function(){
  
    onButtonClick();
        $("#play").html("<i class='fas fa-play'></i>");

        $("#debug").html("<i class='fas fa-stop'></i>");
        nodePointer=$("#start");
        connectorPointer=$("#start").attr("data-connector");
        onDebug=true;
        // controllerOnDebug();
        $(".ondebug").show();
        hightLight($("#start"),"#27ae60");
        $("tr").last().addClass("font-weight-bold");


    
});
$(document).on("click","#next",function () { 

    unHightLight(nodePointer);
    $("tr").last().removeClass("font-weight-bold");
    controllerOnDebug();

    let obj    = $('#con-debugger');
    let height = obj[0].scrollHeight;
    obj.scrollTop(height);
});
function clearOnDebug(){
    $("#debug").html("<i class='fas fa-bug'></i>");
    $(".ondebug").hide();
    onDebug=false;
}
function onButtonClick(){
    $("tbody").empty();
    $("#console").empty(); 
    unHightLight($(".shape"));



}
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

        
    }
    
   
   
}
function controllerOnDebug(){

    if($(connectorPointer).attr("data-to")==undefined||connectorPointer==undefined){
        clearOnDebug();
        
        onDebug=false;
    }else{
        nodePointer=$(connectorPointer).attr("data-to");
        if(nodePointer!="#end"){
            let result=classify(nodePointer);
        }
        connectorPointer=$(nodePointer).attr("data-connector");
        hightLight(nodePointer,"#27ae60");
        $("tr").last().addClass("font-weight-bold");
    }
}
function compiler(str){
    if(str.trim().match(/^[A-Za-z$_]+[\+\-\*\/]{2}$/)){
        let temp =str.split("++");
        str="++"+temp[0];
    }
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
            let container=document.createElement("div");
            $(container).addClass("col-12 row p-0 m-0");
            $(container).html("<div class='mr-1 font-weight-bold'>Input "+$(node).find(".text").text()+" : </div>");
            let input=document.createElement("div");

            $(input).attr("contenteditable","true");
            $(input).addClass("consoleInput col");
            $(container).append(input);
            $("#console").append(container);
            $(input).focus();
            $(input).empty();
            return true;
        }else{

            let source=$(node).find(".text").text()+"="+$(".consoleInput").text()+"";
            result=compiler(source);
            $(".consoleInput").find("br").remove();

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


   
 
   
