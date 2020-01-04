/* ----- Note Important -----
    shape= สัญลักษณ์ต่างๆของ flowchart ที่มีหน้าตาแบบต่างๆ
    node= shapeที่สร้างขึ้นมาให้ใข้งานใน ส่วนของ Design
    connector = เส้นที่เชื่อมระหว่าง node
    anchor = หมุดที่ไว้ให้ connector เชื่อมกันได้

    ************ 
    class hide ใน css จะมีความสำคัญมากกว่าปกติ !important ในกรณีที่จะต้อง ซ่อน เฉพาะเจาะจงในขณะที่ตัวอื่นที่มีลักษณะเหมือนกันแสดง
    *************

    data-from = อยู่ใน connector เพื่อบอกว่ามาจาก Node ไหน
    data-anchorfrom= อยู่ใน connector เพื่อบอกว่ามาจาก Anchor ตำแหน่งไหนของ Node ต้นทาง
    data-to = อยู่ใน connector เพื่อบอกว่าชี้ไปหา Node ไหน
    data-anchorto= อยู่ใน connector เพื่อบอกว่าชี้ไปหา Anchor ตำแหน่งไหนของ Node ปลายทาง
    data-connector = อยู่ใน Node เพื่อบอกให้ Node รู้ว่าตัวเองได้มีการเชื่อมต่อ ไปหา Node อิ่นๆ
    */
  

var selectedEl=undefined;// Node or Connector ที่กำลังถูก select อยู่
var originalPosition = undefined;// ตำแหน่งของ Anchor ก่อนโดน Drag ไว้ใช้ตอนให้ Anchor กลับไปอยู่ที่เดิมหลัง Drag เสร็จ
var lineDraw = undefined;// connector ตอนกำลังถูกสร้าง
var successStatus = undefined;// สถานะเมื่อมีการ Drag เส้นไป หา Node ได้สำเร็จ
var g = undefined;// container ของ connector
var mouseDown=undefined;//สถานะว่ากำลัง mousedown อยู่จริง
var onHoverAnchor=undefined;
var onClose=undefined;
var currentPageName=undefined;
var wallsArea=[];
function updateSvgPathProcess(node){    //ปรับขนาดของ shape Process ตอน Resize


    // <path d="M 1 1 L 199 1 L 199 49 L 1 49 Z"/>
    let path=$(node).find("path");      
    let width=$(node).outerWidth()-1;
    let d= "M 1 1 L "+width+" 1 L "+width+" 49 L 1 49 Z";
    $(path).attr("d",d);
}
function updateSvgPathStartEnd(node){        //ปรับขนาดของ shape Start-End ตอน Resize


    // <path d="M 25 1 C -5,1 -5,49 25,49 L 175 49 C 200,49 200,1 175,1 Z"/>                
    let path=$(node).find("path");      
    let width=$(node).outerWidth();
    let widthByRation=width
    let d;
    d="M 25 1 C -5,1 -5,49 25,49 L "+(width-25)+" 49 C "+(width+5)+",49 "+(width+5)+",1 "+(width-25)+",1 Z";
    $(path).attr("d",d);


}
function updateSvgPathInput(node){        //ปรับขนาดของ shape Input ตอน Resize


    // <path d="M 1 10 L 199 1 L 199 49 L 1 49 Z"/>
    let path=$(node).find("path");      
          
    let width=$(node).outerWidth()-1;          
    let d= "M 1 15 L "+width+" 1 L "+width+" 49 L 1 49 Z";
    $(path).attr("d",d);

}
function updateSvgPathDecision(node){        //ปรับขนาดของ shape Decision ตอน Resize


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
 
   
}
function updateSvgPathDisplay(node){    //ปรับขนาดของ shape Display ตอน Resize


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


}
function updateSvgPath(node,name){    //ปรับขนาดของ shape ตอน Resize โดย คัดจาก class แล้วเรียกไปที่ function เฉพาะของ shape นั้นๆ


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
function setTextboxPosition(node){//ทำให้ textbox อยู่ใน shape (ถ้าไม่ทำจะเคลือนไปอยู่ใต้ shpae อาจเป็นเพราะ position แบบ relative)

    let position=$(node).offset();
    let textbox=$(node).find(".text").outerHeight(); 
     p={
        top:position.top+(($(node).outerHeight()/2)-(textbox/2))-($(node).hasClass("decision")?5:0),
        left:position.left
    }   
    
    $(node).find(".text").offset(p);

}
function updateAnchorPosition(node) {    // เพื่อเรียก function เปลี่ยนที่อยู่ของ Anchor ตอน Resize กับ Drag ให้ไปตาม Parent Node ของตัวเอง
    updateAnchorTop(node);
    updateAnchorRight(node);
    updateAnchorBottom(node);
    updateAnchorLeft(node);
}
function getPropertyNode(node) {    //ไว้ใช้ get width,height,top,left,ของ node เพื่อนำไปใช้งาน

    let nodePosition = $(node).offset();

    return {
        width: $(node).outerWidth(),
        height: $(node).outerHeight(),
        top: nodePosition.top,
        left: nodePosition.left
    }
}
function updateAnchorTop(node) {    // เพื่อเปลี่ยนตำแหน่งของ Anchor Top Resize กับ Drag ให้ไปตาม Parent Node ของตัวเอง


    let anchor = $(node).find(".anchor_top");

    let nodeProperty = getPropertyNode(node);
    let topP=nodeProperty.top - 5;
   
    if($(node).hasClass("input")){
       topP= nodeProperty.top + 3
    }
 
    let position = {
        top:topP ,
        left: nodeProperty.left + (nodeProperty.width / 2) -5
    }
    $(anchor).offset(position);
}
function updateAnchorRight(node) {    // เพื่อเปลี่ยนตำแหน่งของ Anchor Right Resize กับ Drag ให้ไปตาม Parent Node ของตัวเอง


    let anchor = $(node).find(".anchor_right");
    let nodeProperty = getPropertyNode(node);
    let position = {
        top: nodeProperty.top + (nodeProperty.height / 2) - 5,
        left: nodeProperty.left + nodeProperty.width - 5
    }
    $(anchor).offset(position);

}
function updateAnchorBottom(node) {    // เพื่อเปลี่ยนตำแหน่งของ Anchor Bottom Resize กับ Drag ให้ไปตาม Parent Node ของตัวเอง


    let anchor = $(node).find(".anchor_bottom");
    let scroll=$("#con-design").scrollTop();
    let nodeProperty = getPropertyNode(node);


   /*  if($(node).hasClass("decision")){
      leftP=leftP-4;
    } */
    let position = {
        top: nodeProperty.top + (nodeProperty.height) - 5,
        left: nodeProperty.left + (nodeProperty.width / 2) -5
    }

    $(anchor).offset(position);

}
function updateAnchorLeft(node) {    // เพื่อเปลี่ยนตำแหน่งของ Anchor Left Resize กับ Drag ให้ไปตาม Parent Node ของตัวเอง


    let anchor = $(node).find(".anchor_left");
    let nodeProperty = getPropertyNode(node);
    let position = {
        top: nodeProperty.top + (nodeProperty.height / 2) - 5,
        left: nodeProperty.left - 4
    }
    $(anchor).offset(position);

}
function updateConnectorPosition(connector,noswapAnchor) {    //ไว้ใช้เปลี่ยนตำแหน่งของ เส้น connector ตอน node มีการ drag และ resize โดยใช้ค่า from to เพื่อบอก ว่า จาก Node ไหนไป Node ไหน
  
    let fromNode = $(connector).attr("data-from");//เก็บ Id ของ Node ต้นทาง
    let toNode = $(connector).attr("data-to");//เก็บ Id ของ Node ปลายทาง
    let pointFrom = $(connector).attr("data-anchorfrom");//เก็บ ตำแหน่งที่ชี้ ของ Node ต้นทาง
    let pointTo = $(connector).attr("data-anchorto");//เก็บ ตำแหน่งที่ชี้ ของ Node ปลายทาง
    let margin=0;
    positionFromNode = getPositionByPoint(fromNode, pointFrom);
    positionToNode = getPositionByPoint(toNode, pointTo);    
    if($(toNode).hasClass("input") && pointTo=="top"){
        positionToNode.y+=5;
    }else if($(fromNode).hasClass("input") && pointFrom=="top"){

        positionFromNode.y+=7;
    }
    if(pointTo=="top"||pointTo=="bottom"){
      margin=4;
    }
    let scroll=$("#con-design").scrollTop();
    let p0={x:positionFromNode.x-margin,y:positionFromNode.y+scroll,point:pointFrom};
    let p100={x:positionToNode.x-margin,y:positionToNode.y+scroll,point:pointTo};
    prototypeDrawLine(p0,p100);
    let distanceX =p100.x-p0.x;
    let distanceY = p100.y-p0.y;
    let p25=linePlot25_75(p0.x,p0.y,pointFrom,distanceX,distanceY);

    let p75=linePlot25_75(p100.x,p100.y,pointTo,distanceX,distanceY);
    let jsonData={
        p0,p25,p75,p100,fromNode,toNode,pointFrom,pointTo,distanceX,distanceY,connector
    }
  
    let linePosition={"points":line50(jsonData,noswapAnchor)};
   
    // let linePosition = {
    //   "points":jsonToPoint(p0)+" "+jsonToPoint(p25)+" "+jsonToPoint(p50)+" "+jsonToPoint(p75)+" "+jsonToPoint(p100)


    // }

    g = $(connector).parent("g");
    connector = $(connector).attr(linePosition);
    
    $(g).html($(connector));
/*     console.log(linePosition);
 */
    updateTextLabelPosition(connector);
}

function prototypeDrawLine(startPoint,endPoint){
  

  let pointer=[];
  pointer.push(startPoint);
  pointer.push(midPoint);
  pointer.push(endPoint);
  return pointer;
}

function generatePathForConnector(arr){
  let str="";

  arr.map(function (a) {  
    str += a.x+","+a.y+" ";
  });
  return str;
}
function midPoint(startPosition,endPosition){
  let midPoint= {x:(parseInt(startPoint.x)+parseInt(endPoint.x))/2,
    y:(parseInt(startPoint.y)+parseInt(endPoint.y))/2};
  return midPoint;
}

function linePlot25_75(x,y,po,distanceX,distanceY){
  if(distanceX<0||distanceY<0){
 
    distanceX=Math.abs(distanceX);
    distanceY=Math.abs(distanceY);
  }else{

  }
  
switch(po){
  case "top":
    return {x:parseInt(x),y:y-distanceY/2};

  case "right":
 
      return  {x:parseInt(x)+distanceX/2,y:y} ;


  case "bottom":


    return  {x:parseInt(x),y:parseInt(y)+distanceY/2};
  
  case "left": 
      return  {x:parseInt(x)-distanceX/2,y:y} ;
    
}
}
function line50(json,noswapAnchor){
  let p1 = { x: 0, y: 0 };
  let p2={ x: 0, y: 0 };
  // if(noswapAnchor!=true){
  // json.pointTo=swapAnchor(json);
  // }
  switch (json.pointTo) {
    case "top":
      if(json.p0.y>=json.p75.y){
     
        p1.x = Math.floor(((json.p25.x+json.p75.x)/2));
        p1.y = parseInt(json.p25.y);
       
        p2.x=p1.x;
        p2.y=json.p75.y;
       
        // console.log(jsonToPoint(json.p0)+" "+jsonToPoint(json.p25)+" "+jsonToPoint(p1)+" "+jsonToPoint(p2)+" "+jsonToPoint(json.p75)+" "+jsonToPoint(json.p100))
      }else{
     
        if(json.p75.y<json.p25.y){
          json.p25.y=json.p75.y;
       
        }
        p1.x = json.p75.x;
        p1.y = json.p25.y;
        p2=p1;
      }
     
      break;
    case "right":
      if (json.p25.x > json.p75.x) {
        p1.x = json.p25.x;
        p1.y = json.p75.y;
      } else {
       
        p1.x = json.p75.x;
        p1.y = json.p25.y;
      }
      p2=p1;
      break;
    case "left":
      if (json.p25.x < json.p75.x) {
        p1.x = json.p25.x;
        p1.y = json.p75.y;
      } else {
        
        p1.x = json.p75.x;
        p1.y = json.p25.y;
      }
      p2=p1;
      break;
    case "bottom":
      if (json.p25.y > json.p75.y) {
        json.p75.y = json.p25.y;
        p1.x = json.p25.x;
        p1.y = json.p25.y;
      } else {
        if (json.pointFrom == "top" || json.pointFrom == "bottom") {
          json.p25.y = json.p75.y;
          p1.x = json.p75.x;
          p1.y = json.p25.y;
        } else {
          p1.x = json.p25.x;
          p1.y = json.p75.y;
        }

      }
      p2=p1;
      break;

  }

 

  return jsonToPoint(json.p0)+" "+jsonToPoint(json.p25)+" "+jsonToPoint(p1)+" "+jsonToPoint(p2)+" "+jsonToPoint(json.p75)+" "+jsonToPoint(json.p100);
}
// function swapAnchor(json){
//   let fromNode=$(json.fromNode).offset();

//   fromNode.left+=$(json.fromNode).outerWidth();
//   fromNode.top+=$(json.fromNode).outerHeight();
//   fromNode['width']=$(json.fromNode).outerWidth();
//   fromNode['height']=$(json.fromNode).outerHeight();

//   let toNode=$(json.toNode).offset();
//   toNode.left+=$(json.toNode).outerWidth();
//   toNode.top+=$(json.toNode).outerHeight();
//   toNode['width']=$(json.toNode).outerWidth();
//   toNode['height']=$(json.toNode).outerHeight();
//   let forReturn="";
 


//   if(toNode.top>fromNode.top+fromNode.height){
//     forReturn="top";
//   }else if(toNode.top<fromNode.top-fromNode.height){
//     forReturn="bottom";
//   }
//   else if(fromNode.left<toNode.left ){
//     forReturn="left";
//   }else if(fromNode.left>toNode.left){
//     forReturn="right";
//   }
//   swapAnchorNodeFrom(json.connector,fromNode,toNode,forReturn)
//   $(json.connector).attr("data-anchorto",forReturn);
//   return forReturn;
// }
// function swapAnchorNodeFrom(connector,fromNode,toNode,toAnchorResult){
//   switch (toAnchorResult) {
//     case "top":
//       swapAnchorNodeFromOnRsTop(connector,fromNode,toNode);
//       break;
//     case "right":
//       swapAnchorNodeFromOnRsRight(connector,fromNode,toNode);
//     case "bottom":
//       swapAnchorNodeFromOnRsBottom(connector,fromNode,toNode);
//       break;
//     case "left":
//       swapAnchorNodeFromOnRsLeft(connector,fromNode,toNode);
//       break;
//   }
 
  

// }
// function swapAnchorNodeFromOnRsTop(connector,fromNode,toNode){

//   if(toNode.left<fromNode.left-fromNode.width/2-40){
//     $(connector).attr("data-anchorfrom","left");
//   }else if(toNode.left>fromNode.left+fromNode.width/2+40){
//     $(connector).attr("data-anchorfrom","right");

//   }else {
//       $(connector).attr("data-anchorfrom","bottom");

   

//   }

// }
// function swapAnchorNodeFromOnRsRight(connector,fromNode,toNode){
//   if(fromNode.left>toNode.left){
//     $(connector).attr("data-anchorfrom","left");

//   }
// }
// function swapAnchorNodeFromOnRsBottom(connector,fromNode,toNode) {
//   if(toNode.left<fromNode.left-fromNode.width/2-40){
//     $(connector).attr("data-anchorfrom","left");
//   }else if(toNode.left>fromNode.left+fromNode.width/2+40){
//     $(connector).attr("data-anchorfrom","right");

//   }else{
//     $(connector).attr("data-anchorfrom","top");

//   }
// }
// function swapAnchorNodeFromOnRsLeft(connector,fromNode,toNode){
//   if(fromNode.left+200<toNode.left){
//     $(connector).attr("data-anchorfrom","right");
//   }
// } 

// function line50(p25,p75,destinationPosition){
// let x= 0;
// let y=0;
// if(destinationPosition =="top" || destinationPosition =="right"){
//   if(p25.x>p75.x){
//     x= p25.x;
//     y= p75.y;

//   }else{
//     x= p75.x;
//     y=p25.y;

//   } 
 


  
  
// }else{
//    x= (p25.x>p75.x ? p75.x:p25.x) ;
//    y= (p25.x>p75.x ? p25.y:p75.y) ;
// }

// return {x,y};
// }
function getPositionByPoint(node, point) {// ไว้ให้ updateConnectorPosition เรียกเพื่อ return  ตำแหน่ง ให้ connector โดย อ้างอิงจาก ตำแหน่งของ Node และ ตำแหน่งของ Anchor เพื่อจะได้ชี้ไปถูกว่ามาจากทางไหน(บน,ล่าง,ซ้าย,ขวา)
    
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

function updateConnectorPositionOnAction(node,noswapAnchor){    //เอาไว้ตอนที่ Node draggable หรือ resizeโดยจะอิงเมื่อมี Node นั้นมีความเกี่ยวข้องกับ connector นั้นๆ จาก class ของ connector จะตรงกับ Id ของ Node นั้นๆ

    let nodeId = $(node).prop("id");
  


    $("polyline").each(function () {
        

        if ($(this).hasClass(nodeId)) {
            updateConnectorPosition($(this),noswapAnchor);
        }

    });

}
function shapeSelectedStyle(){    // ไว้กำหนด ว่า Node นั้นกำลังถูกเลือก ให้เกิด effect และเปลี่ยน function บางอย่าง

    try {
      if(selectedEl.hasClass("shape")){
        selectedEl.find("svg").css({
          "stroke-dasharray":"5,5"
        });
        $(selectedEl).resizable({disabled:false});// resize ตอนโดนเลือก
  
         
        $(selectedEl).find(".con_anchor").addClass("hide");//ซ่อน Anchor ตอนโดนเลือก
      }else{
        selectedEl.css({"stroke-dasharray":"5,5"});
      }

      
    } catch (error) {
  
  
    }


  
  
  }
function shapeUnSelectedStyle(){    // ไว้ยกเลิก Node ที่กำลังถูกเลือก


    try {
      if(selectedEl.hasClass("shape")){

      selectedEl.find("svg").css({
        "stroke-dasharray":"0,0"
      });

        $(selectedEl).resizable({disabled:true});
        // resize ตอนโดนเลือก

     
      $(selectedEl).find(".con_anchor").removeClass("hide");
      }else{   
         selectedEl.css({"stroke-dasharray":"0,0"});
      }

    } catch (error) {
  
  
    }finally{
      disContentEdit();
      selectedEl=undefined;
  
    }
    
  
   
  
  }
function disContentEdit(){  //ไว้ปิดไม่ให้ textbox แก้ไขได้กรณีไม่ได้ถูกเลือก ถ้าถูกเลือกจะเปิดให้แก้ไขโค๊ดได้

  $(selectedEl).find(".text").prop("contenteditable","false");

    $(selectedEl).draggable({ disabled: false });

  
  document.body.style.cursor="";
  }
function checkConnectorOnNodeDelete(node){ /*ไว้เมื่อมี Node โดนลบ จะค้นหาว่าเส้นนั้นมีความเกี่ยวข้องมั้ยโดยเอา idของ Node มาเทียบกับ class 
    ใน connector ถ้ามีเส้นนั้นจะโดนลบออกไป และ ให้ Node ต้นทางของเส้นไม่มีเส้นเป็นของตัวเอง*/
   $("polyline").each(function(){
        if($(this).hasClass($(node).prop("id"))){
            let nodeFrom= $(this).attr("data-from");  
            let connectorId="#"+$(this).attr("id");
            if($(nodeFrom).attr("data-yes")==connectorId){

              $(nodeFrom).removeAttr("data-yes");
            }else if($(nodeFrom).attr("data-no")==connectorId){
              $(nodeFrom).removeAttr("data-no");
            }
            $(nodeFrom).removeAttr("data-connector");//ให้ Node ต้นทางของเส้นไม่มีเส้นเป็นของตัวเอง  
            let label="#"+$(this).attr("data-label");
            $(label).remove();
            $(this).parent("g").remove();
            
        }
   });
}
function onConnectorDelete(connector){


  let fromNode=$(connector).attr("data-from");
  let connectorId="#"+$(connector).attr("id");
  if($(fromNode).hasClass("decision")){
    let label="#"+$(connector).attr("data-label");
    $(label).remove();
    if($(fromNode).attr("data-yes")==connectorId){

      $(fromNode).removeAttr("data-yes");
    }else if($(fromNode).attr("data-no")==connectorId){
      $(fromNode).removeAttr("data-no");
    }
  }

  $(fromNode).removeAttr("data-connector");
}


function onDropItemSuccess(type,posX,posY) {    //เมื่อมีการลากวางNode จาก Toolbox ลงมาในส่วนของ Design

    if (type != null) {
      

      if ($("#design").find("." + type + "").last().index() == -1) {
        var index = 0;
      } else {
        var str = $("#design").find("." + type + "").last().prop("id");
        str = str.split("-");
        var index = str[str.length - 1];
        index++;
      }//เพื่อกำหนด index ของ node ตามประเภทของ shape

      let attrObj = {
        id: (type + "-" + index),// set id ของ node โดยใช้ ประเภทของ shape - index ที่ process มาจาก if
      }
      if(posX==undefined||posY==undefined){
        posX=event.clientX ;
        posY=event.clientY;
      }
     let modX=posX%10;
     let modY=posY%10;
     let mousePoint = {// get ตำแหน่งของ cursor mouse เพื่อจะได้ set ตำแหน่งให้ Node ลงถูกจุด
       top: posY -modY,
       left:posX - 100-modX,
      
     }
      let node = $("template#" + type).html();//สร้าง node โดยอิงจาก template Id ประเภทของ shape
      node=$(node).css("position","absolute");
      node = $(node).draggable(nodeDraggableProperty(node));//ใส่ความสามารถ Draggableให้กับ Node
      node = $(node).resizable(nodeResizableProperty(type));//ใส่ความสามารถ Resizable Node
     
      $("#design").append($(node));//เพิ่ม node ที่สร้างลงในส่วน Design 
      $(node).offset(mousePoint);//set ตำแหน่งให้ Node โดยใช้ตำแหน่งของ mouse
      if(type =="start-end"){
        $(node).prop("id","end");// set property ให้ Node
        $("#con-toolbox").find("#start-end").attr("draggable","false");
      }else{
        $(node).prop(attrObj);// set property ให้ Node
        $(node).find(".con_anchor").draggable(conAnchorDraggableProperty());//ใส่ความสามารถ Draggableให้กับ Anchor ใน Node

      }

      $(node).find(".con_anchor").droppable(conAnchorDroppableProperty());//ใส่ความสามารถ Resizableให้กับ Anchor ใน Node
      setTextboxPosition(node);
      updateAnchorPosition(node);
    }
}
function nodeDraggableProperty(node){// returnความสามารถของ Node ในการ Draggable
  let oldPos;
  return{
        containment:"#design-containment",
      
        // cursorAt:{left:$(node).outerWidth()/2,top:$(node).outerHeight()/2},
        opacity: 0.5,
        grid: [ 10, 10 ], 
        snap: false,
        snapTolerance: 20,
        snapMode: "inner",
        scroll: true,
        stack: ".shape",
        scrollSensitivity: 20,
        scrollSpeed: 20,
        start:function(){
          // createDistanceWalls(this);
          oldPos=$(this).offset();
        },
        drag: function (event,ui) {
      
          // let result=calculateObstacle(this);
          // let currentPos=$(this).offset();
          // let width=$(this).outerWidth();
          // let height=$(this).outerHeight();
          // let boundaryLine=result.boundaryLine;

          // if(result.response){
          //   console.log(boundaryLine.side=='left'&&currentPos.left+width>=boundaryLine.x1);
          //   if(boundaryLine.side=='top'&&currentPos.top>oldPos.top){
          //     console.log(boundaryLine);
          //     ui.offset({top:boundaryLine.y1-5,left:currentPos.left});
          //     // ui.position.top=190;
             
          //   }else if(boundaryLine.side=='left'&&currentPos.left+width>=boundaryLine.x1){
          //     ui.position.left=190;

          //   }

        
          // }
      
         
         
          shapeUnSelectedStyle();
          updateConnectorPositionOnAction(this);
          updateAnchorPosition(this);
          $(".con_anchor").css("opacity","0");
          selectedEl = $(this);

        }
        , stop: function () {//ตอนหยุด Drag จะทำงานหลังตอนโดน Drop
        
          let position=$(this).offset();
          let top=position.top%10;
          let left=position.left%10;
          position.top-=top;
          position.left-=left;
      
          $(this).offset(position);
          // $(".wall").remove();
          wallsArea=[];
        }
      }
    
}
function nodeResizableProperty(type){// returnความสามารถของ Node ในการ Resizable
    return{
        disabled:"true",
        handles: "w,e", 
        grid: [ 10, 10 ],
        resize: function () {
          updateSvgPath(this, type);
          updateConnectorPositionOnAction(this);
          updateAnchorPosition(this);

        }
      }
}
function conAnchorDraggableProperty(){// returnความสามารถของ Anchor ในการ Draggable
    return{   
     
        snap: ".con_anchor",
        grid: [ 10, 10 ], drag: function () {//ตอนกำลังโดน Drag
          document.body.style.cursor = "";
          shapeUnSelectedStyle();
          let parent="#"+$(this).parent().prop("id");// ให้ Anchorที่กำลังโดน Drag ถูกซ่อนเพื่อไม่ให้บังหัวลูกศร
        
           $(parent).find(".con_anchor").addClass("hide"); 
            if($(this).parents().prop("id")!="start"){
              $("#start").find(".con_anchor").addClass("hide");
              
            }
            $(".con_anchor").css("opacity", "1");// ให้ Anchor ทั้งหมด แสดงขึ้นมาเพื่อ ให้Dragไปหาได้
            $(".hide").droppable({disabled: true});

          
          let currentPosition = $(this).offset();// get ตำแหน่งปัจจุบันตอน Anchor โดน Drag
          lineDraw = document.createElementNS("http://www.w3.org/2000/svg", "polyline");// สร้าง connector
          $(lineDraw).attr("id", "line_" + $(this).parent().prop("id"));//เพิ่ม id ให้ connector
          let scroll=$("#con-design").scrollTop();
          let p0;
          if($(this).parent().offset().top<=0){
            p0={x:originalPosition.left + 4,y:originalPosition.top + 3};
          }else{
            p0={x:originalPosition.left + 4,y:originalPosition.top + 3+scroll};
          }

          let p100={x:currentPosition.left + 5 ,y:currentPosition.top+scroll};

          let distanceX = p100.x-p0.x;

          let distanceY = p100.y-p0.y;
          let pointTo=getTypePosition(originalPosition,$(this).attr("data-point"));
          
          let p25=linePlot25_75(p0.x,p0.y,$(this).attr("data-point"),distanceX,distanceY);
          
          let p75=linePlot25_75(p100.x,p100.y,pointTo,distanceX,distanceY);
          let jsonData={
            p0,p25,p75,p100,pointFrom:$(this).attr("data-point"),pointTo,distanceX,distanceY
    
    
          }
          let p50= line50(jsonData,true);
          console.log(p50);
          let lineProperty = {//เพิ่มตำแหน่งของ connector ว่าจากไหนไปไหน และ เพิ่ม Node ต้นทาง
            
            "points":p50,
            "data-from": "#" + $(this).parent().prop("id"),//ใช้บอกว่ามาจาก Node ไหน โดยใช้ id ของ Node
            "data-anchorfrom": $(this).attr("data-point")//ใช้บอกว่ามาจาก หมุด ตำแหน่งไหนของ Node ต้นทาง

          }

          $(lineDraw).addClass($(this).parent().prop("id"));
          //เพิ่ม class เพื่อบอก ว่า connector นี้ มีส่วนเชื่อมยังกับ Node(ต้นทาง) ใช้ check ตอน Node เกิดการเปลี่ยนแปลง

          $(lineDraw).attr(lineProperty);
          //เพิ่ม attr position ให้ กับ line connector

          $(g).html($(lineDraw));// เพิ่ม connector ลงไปใน g(container ของ line)
        }, stop: function () {//ตอนหยุด Drag จะทำงานหลังตอนโดน Drop

          if (successStatus) {// ถ้า connector ถูกลากให้ไปเชื่อมกับ Anchor สำเร็จ

            $(".con_anchor").css("opacity", "0");//ให้ Anchorมั้งหมด ถูกซ่อน
                       

            if($(this).parent().hasClass("decision")){
                if($(this).parent().attr("data-yes")!= undefined && $(this).parent().attr("data-no")!= undefined){
                    let connector= $(this).parent().attr("data-yes");
                    let label="#"+$(connector).attr("data-label");
                    $(label).remove();
                    $(connector).parent().remove();
    
                    connector= $(this).parent().attr("data-no");
                    label="#"+$(connector).attr("data-label");
                    $(label).remove();
                    $(connector).parent().remove();
    
                    $(this).parent().removeAttr("data-yes");
                    $(this).parent().removeAttr("data-no");
                }

                if($(this).parent().attr("data-yes")== undefined ){
                    $(lineDraw).prop("id",$(lineDraw).prop("id")+"-yes");
                    $(this).parent().attr("data-yes", "#" + $(lineDraw).prop("id"));
                    addTextLabelForDecision(lineDraw,"YES");
                }else{
                  
                    $(lineDraw).prop("id",$(lineDraw).prop("id")+"-no");
                    $(this).parent().attr("data-no", "#" + $(lineDraw).prop("id"));
                    addTextLabelForDecision(lineDraw,"NO");
                }
                
            }else{
                if ($(this).parent().attr("data-connector") != undefined) {//ถ้า Node นั้นเคยมีConnector เก่าให้ลบออก
                    // data-connector คือ Node นั้นมี line ของตัวเองมั้ยแล้วชื่ออะไร
      
                    let connector = $(this).parent().attr("data-connector");
                    $(connector).parent().remove();
      
                  }
                $(this).parent().attr("data-connector", "#" + $(lineDraw).prop("id"));
                //เพิ่ม connector ลงไปใน Node เพื่อให้รู้ว่า Node นี้มี Connector เป็นของตัวเอง
            }


            updateConnectorPosition(lineDraw);
            successStatus = undefined;
          }else {
            $(g).remove();
            $(".con_anchor").css("opacity", "0");
          }
          $(".hide").droppable({
            disabled: false
          })
          $(".hide").removeClass("hide");// ลบ class hide ออกให้เป็น Anchor ปกติ
        
          $(this).offset(originalPosition);//ให้ Anchor กลับไปอยู่ที่เดิมของตัวเองก่อนถูก Drag
      
        }
    }
}
function createDistanceWalls(node){
  wallsArea=[]
  $(".shape").each(function(){
    if(node!=this){
   
    let nodeWidth=$(this).outerWidth()+200;
    let nodeHeight=$(this).outerHeight()+200;

    let wall = document.createElement("div");
    $(wall).addClass("wall");
    $(wall).outerWidth(nodeWidth);
    $(wall).height(nodeHeight);
    let offset = $(this).offset();
    offset.top-=100;
    offset.left-=100;
    // let area ={x1:offset.left,y1:offset.top,x2:offset.left+nodeWidth,y2:offset.top+nodeHeight};
    let area ={x:offset.left,y:offset.top,width:nodeWidth,height:nodeHeight,own:this};

    wallsArea.push(area);
    $("#design").append(wall);
    $(wall).offset(offset);
      $(wall).droppable({drop:function(event, ui){
        let node =ui.draggable;
        // $(node).draggable({
          
        //   revert:true,
        //   revertDuration:0
        // });
        // setTimeout(() => {
        //   updateConnectorPositionOnAction(node);
        //   $(node).draggable({
        //     revert:false,
        //   });
        // }, 0);
        
      }
      });
  }
   
  });
}
function calculateObstacle(node){
  let nodePos= $(node).offset();
  let width=$(node).outerWidth();
  let height=$(node).outerHeight();

  let clientX=event.clientX;
  let clientY=event.clientY;
 
    for(let i =0;i<wallsArea.length;i++){
     
      let area =wallsArea[i];
     
      if (!(nodePos.left > (area.x + area.width) ||
        (nodePos.left + width) < area.x ||
        nodePos.top > (area.y + area.height) ||
        (nodePos.top + height) < area.y)) {
          let boundaryLine;
          if(nodePos.left<area.x&&
            (nodePos.top+height>area.y)){
              boundaryLine={
                x1:area.x,
                y1:area.y,
                x2:area.x,
                y2:area.y+area.height,
                side:'left'};
          } if((nodePos.left + width)>(area.x + area.width)&&
          (nodePos.top>area.y)            ){
            boundaryLine={
              x1:area.x+area.width,
              y1:area.y,
              x2:area.x+area.width,
              y2:area.y+area.height,
              side:'right'};
          } if( nodePos.top <area.y &&(nodePos.left>area.x)){
            boundaryLine={
              x1:area.x,
              y1:area.y,
              x2:area.x+area.width,
              y2:area.y,
              side:'top'};
          } if((nodePos.top+height) > (area.y + area.height)){
            boundaryLine={
              x1:area.x,
              y1:area.y+area.height,
              x2:area.x+area.width,
              y2:area.y+area.height,
              side:'bottom'};
          }
        return {response :true,boundaryLine};
      }
  }
    return {response:false};

  
}
// function wallDroppableProperty(){

// }
function getTypePosition(position,pointFrom){
  switch(pointFrom) {
    case "top":
      if(event.clientX<position.left-150){
        return "right";
      }else if(event.clientX>position.left+150){
        return "left";
      }else{
        return "bottom";
      }
    break;
    case "right":
      if(event.clientY<position.top-30){
        return "bottom";

      }else if(event.clientY>position.top+30){
        return "top";
      }else{
        return "left";
      }
    break;
    case "bottom":
      if (event.clientX < position.left - 150) {
        return "right";
      } else if (event.clientX > position.left + 150) {
        return "left";
      } else {
        return "top";
      }
    break;
    case "left":
      if (event.clientY < position.top - 30) {
        return "bottom";

      } else if (event.clientY > position.top + 30) {
        return "top";
      } else {
        return "right";
      }
  }
  /* if(event.clientX>(position.left+25)&&(event.clientY>(position.top+50)||(event.clientY)){
    
    return "left";
  }else if(event.clientX<(position.left-25)){
    return "right";
  }else if(event.clientY>(position.top+30)){
    return "top";
  }else if(event.clientY<(position.top-30)){
    return "bottom";
  }else{
    return "top";
  } */

}
function conAnchorDroppableProperty(){// returnความสามารถของ Anchor ในการ Droppable
    return{
        accept: ".con_anchor",
        classes: {
          "ui-droppable-hover": "anchor-accept"
        },
        drop: function () {// เมื่อ  Anchor โดน Drop 
          successStatus = true;// set ว่าได้ถูกเชื่อมเรียบร้อยแล้ว

          lineAttr = {// set 
            "data-to": "#" + $(this).parent().prop("id"),//ใช้บอกว่ามาจาก Node ไหน โดยใช้ id ของ Node(ปลายทาง)
            "data-anchorto": $(this).attr("data-point")//ใช้บอกว่ามาจาก หมุด ตำแหน่งไหนของ Node ปลายทาง

          }
          $(lineDraw).addClass($(this).parent().prop("id"));//
            //เพิ่ม class เพื่อบอก ว่า connector นี้ มีส่วนเชื่อมยังกับ Node(ปลายทาง) ใช้ check ตอน Node เกิดการเปลี่ยนแปลง

          $(lineDraw).attr(lineAttr);

        }
      }
}
function addTextLabelForDecision(connector,word){


    let label=document.createElement("label");// สร้าง text  yes,no
    let labelId=$(connector).prop("id")+"-"+word;
    $(label).addClass("connector-description");

    $(label).text(word);
    $(label).prop("id",labelId);
    $("#design").append(label);
    $(connector).attr("data-label",labelId);
    updateTextLabelPosition(connector);
   

}
function updateTextLabelPosition(connector){
    let label="#"+$(connector).attr("data-label");
    let points =$(connector).attr("points");
    let temp = points.split(" ");
    let tempStart=temp[2].split(",");
    let tempEnd=temp[4].split(",");
    let scroll=$("#con-design").scrollTop();
     labelPosition={
        top:((parseFloat(tempStart[1])+parseFloat(tempEnd[1]))/2)-scroll,
        left:(parseFloat(tempStart[0])+parseFloat(tempEnd[0]))/2
    }
    $(label).offset(labelPosition);

}

function hightLight(node,color){
    $(node).find("svg").css("stroke",color); 
    $(node).find("svg").addClass("hightlight"); 
    // $(node).find("svg").css("fill",color); 
    $(node).addClass("font-weight-bold");
}
function unHightLight(node){
    $(node).find("svg").css("stroke","#4f7df9"); 
    $(node).find("svg").removeClass("hightlight"); 

    // $(node).find("svg").css("fill","#fff"); 
    $(node).removeClass("font-weight-bold");
}


function save(fileName){
  
    let width =$(window).width();
    let height=$(window).height();
    let design = $("#design").html();
    let text ={"design":design,"resolution":{"width":width,"height":height}};
   

    createDownloadFile(fileName,text);
   
}
function saveAll(){
  


  for(let i =0;i<sessionStorage.length;i++){
    let name=sessionStorage.key(i);

      text =JSON.parse(sessionStorage.getItem(name));

    createDownloadFile(name,text); 
  }
}
function createDownloadFile(fileName,text){
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(text)));
  //JSON.stringify(text)
  element.setAttribute('download', fileName+".fdc");

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
function openFile() {
    if ($("#openfile").val().lastIndexOf(".fdc") == -1) {
      alert("ชนิดของไฟล์ไม่ถูกต้อง");
      return false;
    } else {

      var file = document.querySelector('input[type=file]').files[0];
      let fileName=file.name.split(".");
      fileName=fileName[0];
      fileName=this.checkSamePageNameAndChangeName(fileName);
      $("#assignment").val(fileName);
      $("title").html(fileName+" | FLOWDOCODE");
      var reader = new FileReader();

        reader.onload = function (event) {
          addToStorageCache(fileName,event.target.result);
          writeCodeToDesign(event.target.result);
        

        }
   
      reader.readAsText(file);
    }
    $("#openfile").val("");
    
  }

function writeCodeToDesign(text) { 
  text=JSON.parse(text);
  $("#design").html(text.design);
  let width=$(window).width();
  let height=$(window).height();
  let oldResolution=text.resolution;
 

  $("#canvas").css("width",width);
  $("#canvas").css("height","10000px");
  $("#con-design").scrollTop("0");
  $("#canvas").offset({ top: 0, left: 0 });


  $(".shape").each(function(){
    let position=$(this).offset();
 
    if(oldResolution.width!=width&&oldResolution.height!=height){              
     let topRatio=position.top*100/oldResolution.height;
      let leftRatio=position.left*100/oldResolution.width;
      position.top=(height*topRatio/100)-((height*topRatio/100)%10);
      position.left=(width*leftRatio/100)-((width*leftRatio/100)%10);
      $(this).offset(position);
      updateConnectorPositionOnAction(this,true);

    }
    $(this).find("svg").css( "stroke-dasharray","0,0");
    $(this).removeClass("ui-draggable ui-draggable-handle ui-resizable ui-resizable-disabled");
    $(this).find(".con_anchor").removeClass("ui-draggable ui-draggable-handle ui-droppable ui-draggable-disabled");
    $(this).find("ui-resizable-handle").remove();
    $(this).draggable(nodeDraggableProperty(this));
    setTextboxPosition(this);
    $(this).find(".con_anchor").draggable(conAnchorDraggableProperty());
    $(this).find(".con_anchor").droppable(conAnchorDroppableProperty());
    $(this).resizable(nodeResizableProperty(getNodeType(this)));
    if($(this).find(".ui-resizable-w").get(1)!=undefined){
     
      $(this).find(".ui-resizable-w").get(1).remove();
      $(this).find(".ui-resizable-e").get(1).remove();
    }else{
      init(true);
    }

  });
  hasEnd();
 }
function addToStorageCache(name,text){

  let label=document.createElement("div");
  $(".active").removeClass("active");


  $(label).addClass("btn  page active row  pr-0");
  // if(name=="untitled"){
 

  //   if($(".page[data-untitled]").last().attr("data-untitled")!=undefined){
  //     let num=parseInt($(".page[data-untitled]").last().attr("data-untitled"))+1;
  //     $(label).attr("data-untitled",num);
  //     name+=num;

  //   }else{
  //     $(label).attr("data-untitled",0);
  
  //   }
  // }
  $(label).html("<div class='page-text'>"+name+"</div><div class='close p-0'><i class='far mx-2 py-auto  fa-times-circle'></i></div>");
  $(label).prop("id",name.replace(/\(|\)| /gm,'---'));
  $(label).attr("data-page",name);


  $("#pagination").append($(label));
  sessionStorage.setItem(name,text);
  $("title").html(name+" | FLOWDOCODE");

}
function getNodeType(node){
    if($(node).hasClass("start-end")){         
        return "start-end";
      }else if($(node).hasClass("process")){
        return "process";
      }else if($(node).hasClass("input")){
        return "input";
      }else if($(node).hasClass("decision")){
        return "decision";
      }else if($(node).hasClass("display")){
        return "display";
      }
}
function getAnchorType(anchor){
  if($(anchor).hasClass("anchor_top")){         
    return "top";
  }else if($(anchor).hasClass("anchor_right")){
    return "right";
  }else if($(anchor).hasClass("anchor_left")){
    return "left";
  }else if($(anchor).hasClass("anchor_bottom")){
    return "bottom";
  }
}
function jsonToPoint(json){
  return json.x+","+json.y+" ";
}
function addNewPage(design){
  let width =$(window).width();
  let height=$(window).height();
  if(design==undefined){
    design=$("#newpage").html();


  }
  let text ={"design":design,"resolution":{"width":width,"height":height}};
  addToStorageCache(checkSamePageNameAndChangeName("untitled-1"),JSON.stringify(text));
}
function init(noRisize){
  $("#stop").hide();
  $("#play-refresh").hide();
  if(!noRisize){

    let design = $("#design").html();
    addNewPage(design);
    $("#start").resizable(nodeResizableProperty("start-end"));
    
  }

    $(".ondebug").hide();
    $("#con-right").css("top",$("nav").outerHeight());
  
 
    

    $('[data-toggle="tooltip"]').tooltip();


    $("#start").find(".con_anchor").draggable(conAnchorDraggableProperty());
    $("#start").find(".con_anchor").droppable(conAnchorDroppableProperty());
    $("#start").draggable(nodeDraggableProperty($("#start")));
  
    updateAnchorPosition($("#start"));
    setTextboxPosition($("#start"));
    let modX=($(document).width()/2)%10;
    let p = {
      top: 160,
      left: ($(document).width() / 2-modX) - 100

    }
   
    // let conDesignHeight =$(document).outerHeight()-$("#con-console").outerHeight()-100;
    $("#con-design").css("height",$("#con-console").offset().top-100);
    console.log($("#con-design").offset())
    $("#design-containment").offset($("#con-design").offset());
  

    $("#design-containment").css('width',$("#con-design").outerWidth());

    $("#design-containment").css('height',$("#con-design").outerHeight());
    $("#design-containment").css('position','fixed');

    $("#start").offset(p);
    $("#canvas").css("width",$(window).width());
 
    $("#canvas").css("height","50000px" );
    $("#canvas").offset({ top: 0, left: 0 });
    let debuggerHeight=$(document).height()-$("#con-debugger").offset().top;
 
    $("#con-debugger").height(debuggerHeight-50);
    hasEnd();

}
function readPage(page,action){
 

  let width = $(window).width();
  let height = $(window).height();

  let text = { "design":  $("#design").html(), "resolution": { "width": width, "height": height } };

  let presentPage=$(".active").attr("data-page");
  sessionStorage.setItem(presentPage,JSON.stringify(text));
  if(action=="switch"){
    $(".active").removeClass("active");

  }
  let a="";


  $(page).addClass("active");
  text = sessionStorage.getItem($(page).attr("data-page"));
  $("title").html($(page).attr("data-page")+" | FLOWDOCODE");

  writeCodeToDesign(text); 
}
function hasEnd(){
  
  if($("#end").prop("id")=="end"){
    $("#con-toolbox").find("#start-end").attr("draggable","false");

  }else{
    $("#con-toolbox").find("#start-end").attr("draggable","true");

  }
}
function getLatestNode(){
  let node =$("#start");
  let connector=$(node).attr("data-connector");  
  while(true){
      if($(connector).attr("data-to")==undefined||$(connector).attr("data-to")=="#end" ){        
          break;
      }else{
        node=$(connector).attr("data-to");

        connector=$(node).attr("data-connector");
      }

      
  }
  return node;
  
}
function checkSamePageNameAndChangeName(fileName){

  let list=[];
  for(let i =0;i<sessionStorage.length;i++){
    list.push(sessionStorage.key(i));
  }
  list.sort();
  list.sort((a,b)=>{    
    return compare(a,b);
  });
  for(let i =0;i<list.length;i++){
    let temp =list[i].split('-');
    let number;
    if(temp[0]==fileName.split('-')[0]){
      if(!temp[1]){
        number=2;
      }else{
        number=parseInt( temp[1])+1;
      }
  
 
    }
  
    if(list[i]==fileName){
      fileName=temp[0]+'-'+number;
    }
  }
  return fileName;
}
function compare(a,b){
  let tempA= a.split('-');
  let tempB= b.split('-');
  
  if(tempA[0]==tempB[0]&&parseInt( tempA[1]) < parseInt(tempB[1])){
    return -1;
  }else{
    return 1;
  }
}
function changePageName(page) {
  let page_text = $(page).find('.page-text');
  let text = $(page_text).text();
  if (text == '') {
    $(page_text).text(currentPageName);
  }else if(page_text.text()!=$(page).prop('id')){
    $(page_text).text(checkSamePageNameAndChangeName(text));
  }
  $(page).attr("contenteditable", "false");
  $(page).removeClass("page-edit");
  let storage = sessionStorage.getItem($(page).attr("data-page"));
 
  sessionStorage.removeItem($(page).attr("data-page"));
  sessionStorage.setItem($(page).text(), storage);
 
  $(page).attr("data-page", $(page).text());
  $(page).attr("id", $(page).text());
  $("title").html($(page).attr("data-page")+" | FLOWDOCODE");

  if ($(page).text() != "untitled") {
    $(page).removeAttr("data-untitled");
  }

}

function explorer(distinct){
  // console.log(distinct);
  let prevNode =undefined;
  let currentNode="#start";
  let connectorPointer=$(currentNode).attr("data-connector");
  let list =[];
  let indx=0;
  list.push({node:currentNode,root:prevNode,status:'add'});


  for(let i=0;i<=list.length;i++){
 
    // console.log(i);
    
    // console.log(list.length);
    // console.log(list);
    // console.log('-------');
    if(list.filter(s=>s.status=='add').length>0&&currentNode!=undefined){
     
      if($(currentNode).hasClass("decision")){
        let tempConnPointer =$(currentNode).attr("data-yes")
        let tempConnPointer2=$(currentNode).attr("data-no");
    

        list[indx].to=$(tempConnPointer).attr("data-to");
        list[indx].to2=$(tempConnPointer2).attr("data-to");

      }else{

        list[indx].to=$(connectorPointer).attr("data-to");
        
      }

      prevNode=currentNode;
      indx=list.findIndex(s=>s.status=='add');
   
      currentNode=list[indx].node;
      list[indx].status='went';
      if($(currentNode).hasClass("decision")){
 

          let tempConnPointer =$(currentNode).attr("data-yes")
          list.push({node:$(tempConnPointer).attr("data-to"),root:currentNode,status:'add'});
    
          tempConnPointer =$(currentNode).attr("data-no")
          list.push({node:$(tempConnPointer).attr("data-to"),root:currentNode,status:'add'});

    
        }else{
  
          connectorPointer=$(currentNode).attr("data-connector");
          temp=$(connectorPointer).attr("data-to");
          // if(temp&&!list.map(s=>s.node).includes(temp)){
            list.push({node:temp,root:currentNode,to:temp,status:'add'});

          // }
   
        }
    
    } else {
      break;
    }
  

   
   
  }

  list =list.filter(s=>s.node!=undefined);
  if(distinct){
    list =list.filter((s,i,arr)=>{
      return arr.map(m=>m.node).indexOf(s.node)===i&&s.node!=undefined;
    });
  }
 
  return list;

}
