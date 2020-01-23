
$(document).on("click","#play",function(){
 
    clearOnDebug();
    if(!checkSyntax()||!structureChecker()){

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
    if(!checkSyntax()||!structureChecker()){

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
$(document).on("click","#pseudocode",function (){


    if(!checkSyntax()||!structureChecker()){

        return false;
    }
    pseudocodeController();
});
$(document).on("click","#delete-node",function(){
    $(this).tooltip('dispose');

    checkConnectorOnNodeDelete(selectedEl);

    $(selectedEl).remove();
    $('.container-node-tool').remove();

    hasEnd();
});
$(document).on("click","#switch-decision",function(){
    $(this).tooltip('dispose');


    $('.container-node-tool').remove();
    shapeUnSelectedStyle();

});
// $(document).on("click","#change-node-start",function(){
//     onChangeTypeNode(this,'process');

// });
$(document).on("click",".btn-node-tool",function(){
    shapeUnSelectedStyle();
    $(this).tooltip('dispose');
    onChangeTypeNode(this,$(this).attr('data-change'));

    

});


// $(document).on("click","id="change-node-start"")