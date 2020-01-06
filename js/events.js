
$(document).on("click","#play",function(){
 
    clearOnDebug();
    if(!checkSyntax()){

        return false;
    } 
    $("#stop").show();
    $("#play-refresh").show();

   
    $("#play").hide();
    onButtonClick();
    onAction="compile";

    controller($("#start").attr("data-connector"));
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
    $("#skip").show();
    $("#skip").attr("disabled",true);

    hightLight($("#start"), "#27ae60");
    $("tr").last().addClass("font-weight-bold");


    
});
$(document).on("click","#stop",function (){stop()});
$(document).on("click","#next",function () { 
     nodeOnSkip =$(connectorPointer).attr('data-to');
    if($(nodeOnSkip).hasClass("decision")){
        $("#skip").attr("disabled",false);
      
    }else{
        $("#skip").attr("disabled",true);

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
        $("#skip").attr("disabled",false);
      
    }else{
        $("#skip").attr("disabled",true);

    }
    let  text=$(node).find(".text").text();
    $("tr").last().removeClass("font-weight-bold");
    Debugger(node,text,'false <br><span style="color:red;">(By Skip)</spn>')
    unHightLight(nodePointer);
    controllerOnDebug();
});
$(document).on("click","#play-refresh",function(){
    stop();
    $("#play").trigger("click");
});
$(document).on("click","#refresh",function(){
    stop();
    $("#debug").trigger("click");
});