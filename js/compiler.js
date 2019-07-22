
var nodePointer=undefined;
var connectorPointer=undefined;
var inputSuccess=false;
var onDebug=false;
var onAction=undefined;
$(document).on("click","#play",function(){
    clearOnDebug();
    if(!checkSyntax()){

        return false;
    }
    onButtonClick();
    onAction="compile";
    $(this).html("<i class='fas fa-stop'></i>");
    $("#debug").html("<i class='fas fa-bug'></i>");
    controller($("#start").attr("data-connector"));
});
$(document).on("click","#debug",function(){
    if(!checkSyntax()){
        return false;
    }
    onButtonClick();
    onAction="debug";

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
    inputSuccess=false;
    onAction=undefined;


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
    if(str.trim().match(/^[A-Za-z$_][A-Za-z$_0-9]*(\+\+|\-\-)$/)){
        let temp =str.split("++");
        str="++"+temp[0];
    }else if(str.trim().match(/^[A-Za-z$_][A-Za-z$_0-9]*(\+\+|\-\-)$/)){
        let temp =str.split("--");
        str="--"+temp[0];
    }
    return eval(str);
}

function classify(node){
    let result;
    let text;
    
    if(!$(node).hasClass("input")){
         text=$(node).find(".text").text();
        if($(node).hasClass("process")){
            text = text.split(",");
            text.forEach(element => {
                result=compiler(element);
                Debugger(node,element,result);
            });
            return null;
        }else{
            
            result=compiler(text);
        }

       
    
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

            $("#InputDialog").modal("show");
            $("#inputtitle").html("Assign Value Variable <strong>"+$(node).find(".text").text()+"</strong>");
            $("#inputBox").focus();
            $("#inputBox").val("");
            return true;
        }else{

             text=$(node).find(".text").text()+"="+$("#inputBox").val()+"";
       
            result=compiler(text);
            inputSuccess=false;

        }
       
    }
    Debugger(node,text,result);


    

}
function compileContinue(){
    if(onAction=="compile"){
        controller(connectorPointer);

      }else{
        classify(nodePointer);
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


   
 
   
