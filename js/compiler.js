
var nodePointer=undefined;
var connectorPointer=undefined;
var inputSuccess=false;
var onDebug=false;
var onAction=undefined;
var onSkip=false;
var nodeOnSkip =false;
$(document).on("click","#play",function(){
    clearOnDebug();
    if(!checkSyntax()){

        return false;
    }
    onButtonClick();
    onAction="compile";

    controller($("#start").attr("data-connector"));
    stop();
});
$(document).on("click","#debug",function(){
    if (!checkSyntax()) {
        return false;
    }
    onButtonClick();

    onAction = "debug";
    nodePointer = $("#start");
    connectorPointer = $("#start").attr("data-connector");
    onDebug = true;
    // controllerOnDebug();
    $(".ondebug").show();
    $("#skip").hide();
    hightLight($("#start"), "#27ae60");
    $("tr").last().addClass("font-weight-bold");


    
});
$(document).on("click","#stop",function (){stop()});
$(document).on("click","#next",function () { 
     nodeOnSkip =$(connectorPointer).attr('data-to');
    if($(nodeOnSkip).hasClass("decision")){
        $("#skip").show();
      
    }else{
        $("#skip").hide();

    }
    unHightLight(nodePointer);
    $("tr").last().removeClass("font-weight-bold");
    controllerOnDebug();

    let obj    = $('#con-debugger');
    let height = obj[0].scrollHeight;
    obj.scrollTop(height);
});
$(document).on("click","#skip",function(){
    connectorPointer=$(nodeOnSkip).attr("data-no");
    let node=nodeOnSkip;
    nodeOnSkip =$(connectorPointer).attr('data-to');

    if($(nodeOnSkip).hasClass("decision")){
        $("#skip").show();
      
    }else{
        $("#skip").hide();

    }
    let  text=$(node).find(".text").text();
    $("tr").last().removeClass("font-weight-bold");
    Debugger(node,text,'false <br><span style="color:red;">(By Skip)</spn>')
    unHightLight(nodePointer);
    controllerOnDebug();
});
$(document).on("click","#refresh",function(){
    stop();
    $("#debug").trigger("click");
});
function stop(){
    $(".ondebug").hide();
    $("#stop").hide();
    $("#play").show();
    $("#debug").show();
    $(".shape").each(function(){
    
        unHightLight(this);
    });
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


   
 
   
