
var FDCV_nodePointer=undefined;
var FDCV_connectorPointer=undefined;
var FDCV_inputSuccess=false;
var FDCV_onDebug=false;
var FDCV_onInput=false;
var FDCV_onAction=undefined;
var FDCV_onSkip=false;
var FDCV_nodeOnSkip =false;
var FDCV_interval=undefined;
function stop(){
    $(".ondebug").hide();
    $("#stop").hide();
    $("#play-refresh").hide();
    $("#play").show();
    $("#debug").show();
    $("#pseudocode").show();

    $(".shape").each(function(){
    
        unHightLight(this);
    });
    clearInterval(FDCV_interval);
    FDCV_onDebug=false;
}

function clearOnDebug(){
    $("#debug").html("<i class='fas fa-bug'></i>");
    $(".ondebug").hide();
    FDCV_onDebug=false;
}
function onButtonClick(){
    $("tbody").empty();
    $("#console").empty(); 
    unHightLight($(".shape"));
    $("#play").hide();
    $("#debug").hide();
    $("#pseudocode").hide();
    $("#stop").show();
    FDCV_inputSuccess=false;
    FDCV_onAction=undefined;


}

function controller(starterConnector){
     FDCV_connectorPointer=starterConnector;  
     FDCV_interval=setInterval(function(){
        if($(FDCV_connectorPointer).attr("data-to")==undefined||$(FDCV_connectorPointer).attr("data-to")=="#end" ){
            

            $("#play").html("<i class='fas fa-play'></i>");
            stop();
            if($(FDCV_connectorPointer).attr("data-to")=="#end"){
                Debugger('#end','END','END');
            }
            // break;
        }else{
            FDCV_nodePointer=$(FDCV_connectorPointer).attr("data-to");
            let FDCVL_result=classify(FDCV_nodePointer);
           
            if (FDCVL_result) {
                clearInterval(FDCV_interval);
                stop();

                // break;        
            }else{
                FDCV_connectorPointer=$(FDCV_nodePointer).attr("data-connector");
            }
            

         

        }
     },0);
    // while(true){
       

        
    // }
    
   
   
}
function controllerOnDebug(){
    
    if($(FDCV_connectorPointer).attr("data-to")==undefined||FDCV_connectorPointer==undefined){
        clearOnDebug();
        stop();
        FDCV_onDebug=false;
    }else{
        FDCV_nodePointer=$(FDCV_connectorPointer).attr("data-to");
        if(FDCV_nodePointer!="#end"){
            let FDCVL_result=classify(FDCV_nodePointer);
        }
        FDCV_connectorPointer=$(FDCV_nodePointer).attr("data-connector");
      

        hightLight(FDCV_nodePointer,"#27ae60");
        $("tr").last().addClass("font-weight-bold");
    }
}
function compiler(FDCVL_str){
    // console.log(Function('"use strict";return (' + str + ')')());
    if(FDCVL_str.trim().match(/^[A-Za-z$_][A-Za-z$_0-9]*(\+\+|\-\-)$/)){
        let FDCVL_temp =FDCVL_str.split("++");
        FDCVL_str="++"+FDCVL_temp[0];
    }else if(FDCVL_str.trim().match(/^[A-Za-z$_][A-Za-z$_0-9]*(\+\+|\-\-)$/)){
        let FDCVL_temp =FDCVL_str.split("--");
        FDCVL_str="--"+FDCVL_temp[0];
    }

    return eval(FDCVL_str);
}

function classify(FDCVL_node){
    let FDCVL_result;
    let FDCVL_text;

    if(!$(FDCVL_node).hasClass("input")){
        FDCVL_text=$(FDCVL_node).find(".text").text();

        if($(FDCVL_node).hasClass("process")){
            FDCVL_text = FDCVL_text.split(",");
            FDCVL_text.forEach(FDCVL_element => {
                FDCVL_result=compiler(FDCVL_element);
                Debugger(FDCVL_node,FDCVL_element,FDCVL_result);
            });
            return null;
        }else{
            
            FDCVL_result=compiler(FDCVL_text);
        }

       
    
    }
  
    if($(FDCVL_node).hasClass("display")){
         displayConsole(FDCVL_result);
    }
    if($(FDCVL_node).hasClass("decision")){
        if(FDCVL_result){
            $(FDCVL_node).attr("data-connector",$(FDCVL_node).attr("data-yes"));
        }else{
            $(FDCVL_node).attr("data-connector",$(FDCVL_node).attr("data-no"));

        }
    }
    if($(FDCVL_node).hasClass("input")){
        // debugger;
        if(!FDCV_inputSuccess){
            $("#InputDialog").modal("show");
            FDCV_onInput=true;
           
            $("#inputtitle").html("Assign Value Variable <strong>"+$(FDCVL_node).find(".text").text()+"</strong>");
            $('#InputDialog').on('shown.bs.modal', function (e) {
                $("#inputBox").val("");
                    $("#inputBox").focus();

             
              })

            return true;
        }else{

            FDCVL_text=$(FDCVL_node).find(".text").text()+"="+$("#inputBox").val()+"";
       
            FDCVL_result=compiler(FDCVL_text);
            FDCV_inputSuccess=false;
            FDCV_onInput=false;

            if(FDCV_onDebug){
                $("tr").last().removeClass("font-weight-bold");

            }
        }
       
    }
    
    Debugger(FDCVL_node,FDCVL_text,FDCVL_result);
    if($(FDCVL_node).hasClass("input")&&FDCV_onDebug){
        $("tr").last().addClass("font-weight-bold");

    }
    

}
function compileContinue(){
    if(FDCV_onAction=="compile"){
        controller(FDCV_connectorPointer);

      }else{
        classify(FDCV_nodePointer);
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

function displayConsole(FDCVL_rsCompile){
 
    $("#console").append(FDCVL_rsCompile+"<br>");
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


   
 
   
