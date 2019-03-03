var selectedEl=undefined;
var originalPosition = undefined;
var selectAnchor = undefined;
var lineDraw = undefined;
var successStatus = undefined;
var g = undefined
var mouseDown=undefined;

function updateSvgPathProcess(node){
    // <path d="M 1 1 L 199 1 L 199 49 L 1 49 Z"/>
    let path=$(node).find("path");      
    let width=$(node).outerWidth()-1;
    let d= "M 1 1 L "+width+" 1 L "+width+" 49 L 1 49 Z";
    $(path).attr("d",d);
    updateTextboxPosition(node,0);
}
function updateSvgPathStartEnd(node){
    // <path d="M 25 1 C -5,1 -5,49 25,49 L 175 49 C 200,49 200,1 175,1 Z"/>                
    let path=$(node).find("path");      
    let width=$(node).outerWidth();
    let d
    if(width>200)
        d= "M 25 1 C -5,1 -5,49 25,49 L "+(width*93/100)+" 49 C "+(width+8)+",49 "+(width+8)+",1 "+(width*93/100)+",1 Z";
    else
        d= "M 25 1 C -5,1 -5,49 25,49 L "+(width*90/100)+" 49 C "+(width+5)+",49 "+(width+5)+",1 "+(width*90/100)+",1 Z";
    $(path).attr("d",d);
    updateTextboxPosition(node,0);

}
function updateSvgPathInput(node){
    // <path d="M 1 10 L 199 1 L 199 49 L 1 49 Z"/>
    let path=$(node).find("path");      
          
    let width=$(node).outerWidth()-1;          
    let d= "M 1 15 L "+width+" 1 L "+width+" 49 L 1 49 Z";
    $(path).attr("d",d);
    updateTextboxPosition(node,0);
}
function updateSvgPathDecision(node){
    // <path d="M 100 1 L 199 25 L 100 49 L 1 25 Z "/>
    let path=$(node).find("path");      
            let ratio={
                width:$(node).outerWidth()-1,
                height:$(node).outerHeight()-1,
                hw:$(node).outerWidth()/2,
                hH:$(node).outerHeight()/2
            }
     let d= "M "+ratio.hw+" 1 L "+ratio.width+" "+ratio.hH+" L "+ratio.hw+" "+ratio.height+
    " L 1 "+ratio.hH+" Z ";
    $(path).attr("d",d);
    updateTextboxPosition(node,0);
   
}
function updateSvgPathDisplay(node){
    // <path d="M 1 25 L 15 49 H 180 C 205 49 ,205 1, 180 1 H 15 L 1,25  "/>
    let path=$(node).find("path");
    let originalWidth=$(node).outerWidth()-1;
    let width=0;
    if(originalWidth>200){
        width=originalWidth*93/100;
        d= "M 1 25 L 15 49 H "+width+" C "+(originalWidth+9)+" 49 ,"+(originalWidth+9)+" 1, "+width+" 1 H 15 L 1,25";

    }else{
        width=originalWidth*90/100;
        d= "M 1 25 L 15 49 H "+width+" C "+(originalWidth+5)+" 49 ,"+(originalWidth+5)+" 1, "+width+" 1 H 15 L 1,25";

    }

    $(path).attr("d",d);
    updateTextboxPosition(node,0);

}
function updateSvgPath(node,name){
    switch (name){
        case 'start-end':
            updateSvgPathStartEnd(node);
            break;
        case 'process':
            updateSvgPathProcess(node);
            break;
        case 'input':
            updateSvgPathInput(node);
            break;
        case 'decision':
            updateSvgPathDecision(node);
            break;
        case 'display':
            updateSvgPathDisplay(node);
            break;
       
    }
}
function updateTextboxPosition(parent){
    let position=$(parent).offset();
    let textbox=$(parent).find(".text").outerHeight(); 
     p={
        top:position.top+(($(parent).outerHeight()/2)-(textbox/2)),
        left:position.left
    }   
    $(parent).find(".text").offset(p);

}
function updateAnchorPosition(node) {
    updateAnchorTop(node);
    updateAnchorRight(node);
    updateAnchorBottom(node);
    updateAnchorLeft(node);
}
function getPropertyNode(node) {
    let nodePosition = $(node).offset();
    return {
        width: $(node).outerWidth(),
        height: $(node).outerHeight(),
        top: nodePosition.top,
        left: nodePosition.left
    }
}
function updateAnchorTop(node) {
    let anchor = $(node).find(".anchor_top");

    let nodeProperty = getPropertyNode(node);
    let position = {
        top: nodeProperty.top - 4,
        left: nodeProperty.left + (nodeProperty.width / 2) - 4
    }
    $(anchor).offset(position);
}
function updateAnchorRight(node) {
    let anchor = $(node).find(".anchor_right");
    let nodeProperty = getPropertyNode(node);
    let position = {
        top: nodeProperty.top + (nodeProperty.height / 2) - 4,
        left: nodeProperty.left + nodeProperty.width - 5
    }
    $(anchor).offset(position);

}
function updateConnectorPosition(node) {
    let fromNode = $($(node).attr("data-from"));
    let toNode = $($(node).attr("data-to"));
    let pointFrom = $(node).attr("data-anchorfrom");
    let pointTo = $(node).attr("data-anchorto");

    positionFromNode = getPositionByPoint(fromNode, pointFrom);
    positionToNode = getPositionByPoint(toNode, pointTo);
    let linePosition = {
        x1: positionFromNode.x,
        y1: positionFromNode.y,
        x2: positionToNode.x,
        y2: positionToNode.y

    }

    g = $(node).parent("g");
    node = $(node).attr(linePosition);
    $(g).html($(node));
   


}
function getPositionByPoint(node, point) {
    // ไว้ให้ updateConnectorPosition เรียกเพื่อ return  ตำแหน่ง ของ connector โดยยึดตำแหน่งของ Anchor
    let positionNode = $(node).offset();
    switch (point) {
        case "top":
            return {
                x: (positionNode.left + $(node).outerWidth() / 2) + 4,
                y: positionNode.top
            }
            break;
        case "right":
            return {
                x: positionNode.left + $(node).outerWidth(),
                y: positionNode.top + $(node).outerHeight() / 2
            }
            break;
        case "bottom":
            return {
                x: positionNode.left + $(node).outerWidth() / 2 + 4,
                y: positionNode.top + $(node).outerHeight()
            }
            break;
        case "left":
            return {
                x: positionNode.left,
                y: positionNode.top + $(node).outerHeight() / 2
            }
            break;

    }
}
function updateAnchorBottom(node) {
    let anchor = $(node).find(".anchor_bottom");
    let nodeProperty = getPropertyNode(node);
    let position = {
        top: nodeProperty.top + (nodeProperty.height) - 4,
        left: (nodeProperty.left + (nodeProperty.width / 2)) - 4
    }
    $(anchor).offset(position);

}
function updateAnchorLeft(node) {
    let anchor = $(node).find(".anchor_left");
    let nodeProperty = getPropertyNode(node);
    let position = {
        top: nodeProperty.top + (nodeProperty.height / 2) - 4,
        left: nodeProperty.left - 3
    }
    $(anchor).offset(position);

}
function updateConnectorPositionOnAction(node){
    //เอาไว้ตอนที่ Node draggable หรือ resize
    let nodeId = $(node).prop("id");
  


    $("line").each(function () {
        

        if ($(this).hasClass(nodeId)) {
            updateConnectorPosition($(this));
        }

    });

}
function shapeSelectedStyle(){
    try {
      selectedEl.find("svg").css({
        "stroke-dasharray":"5,5"
      });
   
      $(selectedEl).resizable({disabled:false});
      $(selectedEl).find(".con_anchor").addClass("hide");
    } catch (error) {
  
  
    }


  
  
  }
function shapeUnSelectedStyle(){
    try {

      selectedEl.find("svg").css({
        "stroke-dasharray":"0,0"
      });
      $(selectedEl).resizable({disabled:true});
      $(selectedEl).find(".con_anchor").removeClass("hide");
  
    } catch (error) {
  
  
    }finally{
      disContentEdit();
      selectedEl=undefined;
  
    }
    
  
   
  
  }
function disContentEdit(){
  
  $(selectedEl).find(".text").prop("contenteditable","false");
  $(selectedEl).draggable({ disabled: false });
  document.body.style.cursor="";
  }
function checkConnectorOnNodeDelete(node){
   $("line").each(function(){
        if($(this).hasClass($(node).prop("id"))){
            let parent= $(this).attr("data-from");  
            $(parent).attr("data-connector","undefined");
            $(this).parent("g").remove();
            
        }
   });
}


function onDropItemSuccess(type) {
    if (type != null) {

      if ($("#content").find("." + type + "").last().index() == -1) {
        var index = 0;
      } else {
        var str = $("#content").find("." + type + "").last().prop("id");
        str = str.split("-");
        var index = str[str.length - 1];
        index++;
      }
      let attrObj = {
        id: (type + "-" + index),
      }
      let mousePoint = {
        left: event.clientX - 100,
        top: event.clientY - 25
      }
      let node = $("template#" + type).html();

      node = $(node).draggable(nodeDraggableProperty());
      node = $(node).resizable(nodeResizableProperty(type));



      $("#content").append($(node));
      
      $(node).offset(mousePoint);
      $(node).prop(attrObj);
      $(node).find(".con_anchor").draggable(conAnchorDraggableProperty());
      $(node).find(".con_anchor").droppable(conAnchorDroppableProperty());
      
      updateTextboxPosition(node);
      updateAnchorPosition(node);
    }
}
function nodeDraggableProperty(){
    return{
        containment:"#content",opacity: 0.5, drag: function () {
          shapeUnSelectedStyle();
          updateConnectorPositionOnAction(this);
          updateAnchorPosition(this);
          selectedEl = $(this);
        }
      }
    
}
function nodeResizableProperty(type){
    return{
        disabled:"true",
        handles: "w,e", resize: function () {
          updateSvgPath(this, type);
          updateConnectorPositionOnAction(this);
          updateAnchorPosition(this);

        }
      }
}
function conAnchorDraggableProperty(){
    return{
        snap: ".con_anchor", opacity: 0.01, drag: function () {
         
          $(this).addClass("hide");
          $(".con_anchor").css("opacity", "1");
          let currentPosition = $(this).offset();
          lineDraw = document.createElementNS("http://www.w3.org/2000/svg", "line");
          $(lineDraw).attr("id", "line_" + $(this).parent().prop("id"));

          let linePosition = {

            x1: originalPosition.left + 4,
            y1: originalPosition.top + 3,
            x2: currentPosition.left + 5,
            y2: currentPosition.top,

            "data-from": "#" + $(this).parent().prop("id"),//ใช้บอกว่ามาจาก Node ไหน
            "data-anchorfrom": $(this).attr("data-point")//ใช้บอกว่ามาจาก หมุด ตำแหน่งไหนของ Node ต้นทาง

          }

          $(lineDraw).addClass($(this).parent().prop("id"));
          //เพิ่ม class เพื่อบอก ว่า connector นี้ มีส่วนเชื่อมยังกับ Node(ต้นทาง) ใช้ check ตอน Node เกิดการเปลี่ยนแปลง


          $(lineDraw).attr(linePosition);
          //เพิ่ม attr position ให้ กับ line connector

          $(g).html($(lineDraw));
        }, stop: function () {

          if (successStatus) {

            $(".con_anchor").css("opacity", "0");

            if ($(this).parent().attr("data-connector") != undefined) {
              // data-connector คือ Node นั้นมี line ของตัวเองมั้ยแล้วชื่ออะไร

              let connector = $(this).parent().attr("data-connector");
              $(connector).parent().remove();

            }

            $(this).parent().attr("data-connector", "#" + $(lineDraw).prop("id"));

            successStatus = undefined;
          }else {
            $(g).remove();
          }
          $(this).removeClass("hide");

          $(this).offset(originalPosition);

        }
    }
}
function conAnchorDroppableProperty(){
    return{
        accept: ".con_anchor",
        drop: function () {
          successStatus = true;

          lineAttr = {
            "data-to": "#" + $(this).parent().prop("id"),
            "data-anchorto": $(this).attr("data-point")
          }
          $(lineDraw).addClass($(this).parent().prop("id"));

          $(lineDraw).attr(lineAttr);

        }
      }
}
