
$(document).on("click","#play",function(){
    onButtonClick();

    clearOnDebug();
    if(!checkSyntax()||!structureChecker()){
        stop()
        return false;
    } 
    $("#stop").show();
    $("#play-refresh").show();

   
    $("#play").hide();
    FDCV_onAction="compile";

    controller($("#start").attr("data-connector"));
});
$(document).on("click","#debug",function(){
    onButtonClick();

    if(!checkSyntax()||!structureChecker()){
        stop()
        return false;
    } 

    FDCV_onAction = "debug";
    FDCV_nodePointer = $("#start");
    FDCV_connectorPointer = $("#start").attr("data-connector");
    FDCV_onDebug = true;
    // controllerOnDebug();
    $(".ondebug").show();
    $("#skip").show();
    $("#skip").attr("disabled",true);

    hightLight($("#start"), "#27ae60");
    $("tr").last().addClass("font-weight-bold");


    
});
$(document).on("click","#stop",function (){stop()});
$(document).on("click","#next",function () { 
     FDCV_nodeOnSkip =$(FDCV_connectorPointer).attr('data-to');
    if($(FDCV_nodeOnSkip).hasClass("decision")){
        $("#skip").attr("disabled",false);
      
    }else{
        $("#skip").attr("disabled",true);

    }
    unHightLight(FDCV_nodePointer);
    $("tr").last().removeClass("font-weight-bold");
    controllerOnDebug();

    let obj    = $('#con-debugger');
    let height = obj[0].scrollHeight;
    obj.scrollTop(height);
    $(this).tooltip('hide');

});
$(document).on("click","#skip",function(){
    FDCV_connectorPointer=$(FDCV_nodeOnSkip).attr("data-no");
    let node=FDCV_nodeOnSkip;
    FDCV_nodeOnSkip =$(FDCV_connectorPointer).attr('data-to');

    if($(FDCV_nodeOnSkip).hasClass("decision")){
        $("#skip").attr("disabled",false);
      
    }else{
        $("#skip").attr("disabled",true);

    }
    let  text=$(node).find(".text").text();
    $("tr").last().removeClass("font-weight-bold");
    Debugger(node,text,'false <br><span style="color:red;">(By Skip)</spn>')
    unHightLight(FDCV_nodePointer);
    controllerOnDebug();
    $(this).tooltip('hide');

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
    $(this).tooltip('hide');

});
$(document).on("click","#delete-node",function(){
    $(this).tooltip('dispose');

    checkConnectorOnNodeDelete(FDCV_selectedEl);

    $(FDCV_selectedEl).remove();
    $('.container-node-tool').remove();

    hasEnd();
    updateSession($(".page.active").attr("data-page"));

});
$(document).on("click","#switch-decision",function(){
    $(this).tooltip('dispose');

    switchTrueFalse(FDCV_selectedEl);
    $('.container-node-tool').remove();
    shapeUnSelectedStyle();
    updateSession($(".page.active").attr("data-page"));

});
// $(document).on("click","#change-node-start",function(){
//     onChangeTypeNode(this,'process');

// });
$(document).on("click",".btn-node-tool",function(){
    shapeUnSelectedStyle();
    $(this).tooltip('dispose');
    onChangeTypeNode(this,$(this).attr('data-change'));
    updateSession($(".page.active").attr("data-page"));

    

});


// $(document).on("click","id="change-node-start"")