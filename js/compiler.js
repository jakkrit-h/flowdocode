
var nodePointer=undefined;
var connectorPointer=undefined;
var inputSuccess=false;
var onDebug=false;
var onAction=undefined;
var onSkip=false;
var nodeOnSkip =false;
var interval=undefined;
function stop(){
    $(".ondebug").hide();
    $("#stop").hide();
    $("#play-refresh").hide();
    $("#play").show();
    $("#debug").show();
    $(".shape").each(function(){
    
        unHightLight(this);
    });
    clearInterval(interval);
}

function clearOnDebug(){
    $("#debug").html("<i class='fas fa-bug'></i>");
    $(".ondebug").hide();
    onDebug=false;
}
function onButtonClick(){
    $("tbody").empty();
    $("#console").empty(); 
    unHightLight($(".shape"));
    $("#play").hide();
    $("#debug").hide();
    $("#stop").show();
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
      interval=setInterval(function(){
        if($(connectorPointer).attr("data-to")==undefined||$(connectorPointer).attr("data-to")=="#end" ){
            

            $("#play").html("<i class='fas fa-play'></i>");
            stop();
            // break;
        }else{
            nodePointer=$(connectorPointer).attr("data-to");
            let result=classify(nodePointer);
           
            if (result) {
                clearInterval(interval);
                stop();

                // break;        
            }else{
                connectorPointer=$(nodePointer).attr("data-connector");
            }
            

         

        }
     },0);
    // while(true){
       

        
    // }
    
   
   
}
function controllerOnDebug(){
    
    if($(connectorPointer).attr("data-to")==undefined||connectorPointer==undefined){
        clearOnDebug();
        stop();
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
    // console.log(Function('"use strict";return (' + str + ')')());
    if(str.trim().match(/^[A-Za-z$_][A-Za-z$_0-9]*(\+\+|\-\-)$/)){
        let temp =str.split("++");
        str="++"+temp[0];
    }else if(str.trim().match(/^[A-Za-z$_][A-Za-z$_0-9]*(\+\+|\-\-)$/)){
        let temp =str.split("--");
        str="--"+temp[0];
    }
    l=""
 
    if(onSkip){
        l='(By Skip)';
        onSkip=false;

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
        // debugger;
        if(!inputSuccess){
            $("#InputDialog").modal("show");
           
            $("#inputtitle").html("Assign Value Variable <strong>"+$(node).find(".text").text()+"</strong>");
            $('#InputDialog').on('shown.bs.modal', function (e) {
                $("#inputBox").val("");
                    $("#inputBox").focus();

             
              })

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
    $("#console").scrollTop($("#console").prop('scrollHeight'));
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


   
 
   
