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
    let d= "M 25 1 C -5,1 -5,49 25,49 L "+(width*93/100-1)+" 49 C "+(width+2)+",49 "+(width+2)+",1 "+(width*93/100-1)+",1 Z";
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
    }else{
        width=originalWidth*90/100;
    }
    d= "M 1 25 L 15 49 H "+width+" C "+(originalWidth+5)+" 49 ,"+(originalWidth+5)+" 1, "+width+" 1 H 15 L 1,25";

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
    } catch (error) {
  
  
    }


  
  
  }
  function shapeUnSelectedStyle(){
    try {

      selectedEl.find("svg").css({
        "stroke-dasharray":"0,0"
      });
  
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
  
