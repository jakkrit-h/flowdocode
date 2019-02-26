
var objArr;
var pointer;
$(document).on("click","button",function(){
    // var rawCode="";
    // collectPath();
    // console.log(window.objArr);
    $("#console").empty();
    controller();

  
 
});
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
function controller(){
    var nodePointer=$("#start").attr("data-next");
    let i=1
    while(i<=2){
        var node=$("#"+nodePointer);
        
        i++;
        // nodePointer=classify(node);
        // if(nodePointer=="end"){
        //     break;
        // }
    }
  
}
function compiler(str){
    
    return eval(str);
}

function classify(node){

 
    var result=compiler(node.text());
    if(node.hasClass("monitor")){
         displayConsole(result);
    }
    if(node.hasClass("decision")){
       if(result){
           node.attr("data-next",node.attr("data-true"));
       }else{
            node.attr("data-next",node.attr("data-false"));

       }
       
    }
    return node.attr("data-next");
    

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



   function generateConnector(){
    $("g").empty();
    var node=$("#start");
    var targetNode=$("#"+$(node).attr("data-next"));
 
    while(node.attr("id")!="end"){
     //  console.log("node "+node.attr("id"));
     //    console.log("targetNode "+targetNode.attr("id"));
     drawConnector(node,targetNode);
     node=targetNode;
     targetNode=$("#"+$(node).attr("data-next"));
   
    }
     $("g").html($("g").html());
 
  }
 function drawConnector(sourceNode,destinationNode){
   //  console.log("node "+sourceNode.attr("id"));
   //      console.log("targetNode "+destinationNode.attr("id"));
   // var arrow=$("path #"+sourceNode.attr("id")+destinationNode.attr("id"));
   var arrow=document.createElement("line");
   arrow=$(arrow);
   arrow.attr("id",sourceNode.attr("id")+"--"+destinationNode.attr("id"));
   var Soffset=sourceNode.offset();
   var Doffset=destinationNode.offset();
 
   var positionS={
     x: Soffset.left + sourceNode.outerWidth()/2,
     y: Soffset.top  + sourceNode.outerHeight()
   
   }
  
   var positionD={
     x: Doffset.left + destinationNode.outerWidth()/2,
     y: Doffset.top-8
   }
   
   // var str =
   //     "M " +
   //     (positionS.x) + "," + (positionS.y) + " " +
   //     "C " +
   //     (positionS.x) + "," + (positionS.y) + " " +
   //     (positionD.x ) + "," + (positionD.y) + " " +
   //     (positionD.x      ) + "," + (positionD.y);
 
       arrow.attr("x1",positionS.x);
       arrow.attr("y1",positionS.y);
       arrow.attr("x2",positionD.x);
       arrow.attr("y2",positionD.y);
 
   
       $("g").append(arrow);
    
 
   
  }
function createHandle(){

}
 