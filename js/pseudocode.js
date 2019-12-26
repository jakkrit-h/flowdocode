var pseudoCode='';
var row;
var endOfBacket;
var decision="yes";
var tab='';
function pseudocodeController(){
    let nodeList = explorerPseudoCode();
    console.log(nodeList)
    let a = nodeList.map((s,i,arr)=>{
        if($(s.node).hasClass("decision")){
           let a=checkIsLoop(s,nodeList,s.node,undefined,i);  
      
           if(a){
               s.decision = true; //is LOOP
           }else{
               s.decision = false; // is IF
           }
           
           getEndOfDecision(s,nodeList,s.node,i);
     
        }
       
    });
    nodeList.map((s,i,arr)=>{
        if($(s.node).hasClass("decision")){            
           getEndOfDecision(s,nodeList,s.node,i);
     
        }
       
    });
  
  
    generateCode(nodeList);
   
}
function checkIsLoop(nodeData,nodeList,decisionTarget,prevNode,indexTarget) {

    if(nodeData.to){
   
        let index = nodeList.findIndex(s=>s.node == nodeData.to);
        let resultFind =nodeList[index];
        if($(resultFind.node).hasClass("decision")&&resultFind!=prevNode&&indexTarget<index){
         
            resultFind = nodeList.find(s=>s.node == resultFind.to2);
 
        }else if($(resultFind.node).hasClass("decision")&&resultFind!=prevNode&&indexTarget>index){
            return false;
        }

        if(resultFind&&resultFind.node!= decisionTarget){
 
          return checkIsLoop(resultFind,nodeList,decisionTarget,resultFind,indexTarget);
           
        }else{
  
            return true;
           

        }
    }else{

    }
   
}
// function checkIsLoop(nodeData,nodeList,decisionTarget,indexTarget,prevNode,pastWay,n) {

//     if(nodeData.to&&n<=20){
//         n++;
       
      
//         let resultFind = nodeList.find(s=>s.node == nodeData.to);

//         //&&resultFind!=prevNode ใส่กัน stack overflow แต่คำตอบก็ยังผิด
//         // console.log(decisionTarget);
//         // console.log(resultFind.node);
//         // console.log(pastWay);

//         // console.log('-----------');

//         if(resultFind&&resultFind.node!= decisionTarget&&resultFind!=prevNode){
//            pastWay.push(resultFind)
//           return checkIsLoop(resultFind,nodeList,decisionTarget,indexTarget,resultFind,pastWay,n);
           
//         }else{
//             // console.log('------ELSE--------');

//             return true;
           

//         }
//     }else{
//         // console.log('------UNDEFINED--------');
//     }
   
// }
function getEndOfDecision(nodeData,nodeList,decisionTarget,nodeIndex) {
    let currentNode;
    let index=0;
    if(nodeData.decision){ // LOOP
        currentNode=nodeList.find(s=>s.node == nodeData.to);
     
        for(let i=0;i<=nodeList.length;i++){
            
            if(currentNode.to){
              
                if(currentNode.to==nodeData.node){  
                   
            
                    nodeList[index].endyesof=nodeData.node;
                    let tempIndex = nodeList.findIndex(s=>s.node == nodeData.to2);
                    nodeList[tempIndex].endnoof=nodeData.node;

                    nodeList[nodeIndex].endyes=currentNode.node;
                    nodeList[nodeIndex].endno=nodeData.to2;
             
                    break;
                }else{
                    let tempIndx =nodeList.findIndex(s=>s.node == currentNode.node);
                    let temp=nodeList[tempIndx];
                    if($(currentNode.node).hasClass("decision")&&temp.decision&&tempIndx>nodeIndex){
                       
             
                     
                            index=nodeList.findIndex(s=>s.node == currentNode.to2);
                           
                            currentNode=nodeList.find(s=>s.node == currentNode.to2);
                      
                     
                  
                     
                       
                    }else{
                      

                        index=nodeList.findIndex(s=>s.node == currentNode.to);
                 
                
                        currentNode=nodeList[index]
                    
                    }
                
                }
            }else{
              
            }
        }
    }else{// IF
   
        let {yesPath,noPath}=getIfPath(nodeData,nodeList);
   
        let endOfAll = yesPath.filter(value => noPath.includes(value))[0];

        let endOfYes = yesPath.find((s,i,arr)=>{if(s==endOfAll)return (i-1<0)?arr[0]:arr[i-1]})
        let endOfNo=noPath.find((s,i,arr)=>{if(s==endOfAll)return (i-1<0)?arr[0]:arr[i-1]})
        let endOfDecide =endOfYes;

        let tempYesPathIndex=yesPath.findIndex(s=>s==endOfYes);
        endOfYes=yesPath[(tempYesPathIndex>0)?tempYesPathIndex-1:0 ];
 
        let tempNoPathIndex=noPath.findIndex(s=>s==endOfNo);
        endOfNo=noPath[(tempNoPathIndex>0)?tempNoPathIndex-1:0 ];
        nodeList[nodeIndex].endyes=endOfYes;
        nodeList[nodeIndex].endno=endOfNo;

        let tempIndex = nodeList.findIndex(s=>s.node == endOfYes);
       
        nodeList[tempIndex].endyesof=nodeData.node;
      
        tempIndex = nodeList.findIndex(s=>s.node == endOfNo);
      
        nodeList[tempIndex].endnoof=nodeData.node;
        tempIndex=nodeList.findIndex(s=>s.node==endOfDecide);

        nodeList[tempIndex].endofif=nodeList[nodeIndex].node;

    }

    return nodeList;
    

}
function getIfPath(nodeData,nodeList) {
  
    let yesPath=[];
    let noPath=[];
    let currentNode=nodeData;
    let DecisionOnPast=[];
    for(let i = 0; i<nodeList.length;i++){
     
        if(currentNode.to&&!yesPath.includes(currentNode.to)){
          
                if($(currentNode.to).hasClass("decision")&&!DecisionOnPast.includes(currentNode.to)){
                    DecisionOnPast.push(currentNode.to);
                }
                yesPath.push(currentNode.to);
                if(currentNode.to==nodeData.node){
     
                    break;
                }
       
                
      
        }else if(DecisionOnPast.length>0){
            let temp =DecisionOnPast.shift();
            let decide = nodeList.find(s=>s.node == temp);
            currentNode=nodeList.find(s=>s.node == decide.to2);
            yesPath.push(decide.to2);
     
            i--;
            continue;
        }else{
            break;
        }
        currentNode=nodeList.find(s=>s.node == currentNode.to);

    }
    currentNode=nodeList.find(s=>s.node == nodeData.to2);
    noPath.push(nodeData.to2);
    DecisionOnPast=[];

    for(let i = 0; i< nodeList.length;i++){
       

        if (currentNode.to&&!noPath.includes(currentNode.to)) {
                if($(currentNode.to).hasClass("decision")&&!DecisionOnPast.includes(currentNode.to)){
                    DecisionOnPast.push(currentNode.to);
                }
                noPath.push(currentNode.to);
                if (currentNode.to == nodeData.node) {
                    break;
                }
        }else if(DecisionOnPast.length>0){
            let temp =DecisionOnPast.shift();
            let decide = nodeList.find(s=>s.node == temp);
            currentNode=nodeList.find(s=>s.node == decide.to2);
            noPath.push(decide.to2);
     
            i--;
            continue;
        } else {
            break;
        }
        
        currentNode = nodeList.find(s => s.node == currentNode.to);

    }
    return {yesPath,noPath};
}
// function endOfDecision(nodeList) {
//     let value = nodeList.map(s=>s.to);
 
//     let result=nodeList.filter((s,i,arr)=>
//     value.filter(e=>{     
//         return (e==s.to)
//     }).length>1);
//     console.log(result);
//     return result;
// }
// function pseudocodeController2(){
//   pseudoCode="";
//   row=1;
//     let node ="#start";
//     let connector=$("#start").attr("data-connector");
   
//     while($(connector).attr("data-to")!=undefined){
//         generateCode(node);
//         node=$(connector).attr("data-to");
//         if($(node).hasClass("decision")){
//             if(decision=="yes"){
//                 connector=$(node).attr("data-yes");
//                 discision="no";
//             }else{
//                 connector=$(node).attr("data-no");
//                 discision="yes";
//             }
//         }else{
//             connector=$(node).attr("data-connector");

//         }
//         row++;
//         // console.log(connector);

//     }
//     pseudoCodePage(pseudoCode);
// }
// function ArrangeNode(nodeList){
//     let decisionNode={node:undefined,status:false};
//     let currentNode = nodeList[0];

//      let i =0;
//      while( i<=nodeList.length*2){
 
//             if(currentNode==undefined){
//                 if(nodeList.some(s=>s.status!='arrange')){
                    
//                     currentNode=nodeList.filter(s=>$(s.node).hasClass('decision')&&s.status!='arrange')[0];

//                 }else{
//                     break;
//                 }
//             }
//         //  if(currentNode.status!='pseudoCode'){
//         //     // &&!endOfBacket.map(s=>s.to).includes(currentNode.node)
//         //     gg(currentNode);
          
//          /*}else*/ if(currentNode.status=='arrange'&&$(currentNode.node).hasClass('decision')){
//             decisionNode.node =currentNode;
//             decisionNode.status = 'yesIswent';
//             currentNode=nodeList.find(s=>s.node==currentNode.to2);
            
//             tab+='\t';
//             continue;
//          }
//             currentNode.status='pseudoCode';
      
//             currentNode=nodeList.find(s=>s.node==currentNode.to);

      
       
//         i++;
//      }
//      console.log(nodeList);
//      generateCode(nodeList);

   
// }
function generateCode(nodeList) {

    let code = "<span class='textHighLight'>START</span><br>";
    let endOfIf = [];
    let decisionNode = { node: undefined, status: false };
    let currentNode = nodeList[0];
    let pastWay=[];
    let pastTab=[];
    let addElse=false;
    let tab ="";
    let countDecision=nodeList.filter(s=>$(s.node).hasClass('decision'));
  
    for (let i = 0; i < nodeList.length+countDecision.length; i++) {
 
        if(!pastWay.includes(currentNode.node)||currentNode.node=='#end'){
         
         
            if(pastWay[pastWay.length-2]!='#end'&&pastWay[pastWay.length-1]!='#end'){
             
          
                if(currentNode.node=='#end'){
              
                    pastWay.push(currentNode.node);
                }
                if($(currentNode.root).hasClass('decision')&&!pastTab.includes(currentNode.root)){        
                       
                    tab+="&emsp;";
                    pastTab.push(currentNode.root);
                }else if(currentNode.endofif){
                    tab=tab.replace(/&emsp;/,'');
                
                }
                code+=getpseudoCode(currentNode,addElse,tab,nodeList);
                addElse=false;
            }
        
           
        }

        if(currentNode.to!=undefined){
          


            if(currentNode.endyesof){
                let index =nodeList.findIndex(s=>s.node==currentNode.node); 
                nodeList[index].status='pseudocode';
                currentNode=nodeList.find(s=>s.node==currentNode.endyesof);
                
                i--;
                continue;
            }
  
            pastWay.push(currentNode.node);
         
            if($(currentNode.node).hasClass('decision')&&currentNode.status=='pseudocode'){
          
                addElse=true;
                currentNode=nodeList.find(s=>s.node==currentNode.to2);
            }else{
                let index =nodeList.findIndex(s=>s.node==currentNode.node); 
                nodeList[index].status='pseudocode';
                currentNode=nodeList.find(s=>s.node==currentNode.to);

            }

        }else if(nodeList.some(s=>s.status)){
           currentNode=nodeList.filter(s=>s.status=='add')[0];
           currentNode=nodeList.find(s=>s.node==currentNode.root);
        }





    }
    pseudoCodePage(code);

}
function getpseudoCode(node,addElse,tab,nodeList){
    
    let code=tab;
    let type = getNodeType(node.node);
    
    let text = $(node.node).find(".text").text();
   
    
    if (addElse) {
     
        let decisionNode=nodeList.find(s=>s.node==node.endnoof);
        try{
           
            if(decisionNode&&decisionNode.decision){
                if(node.node=='#end'){
                    
                    code =  '<br>}+1<br>'+tab;
  
                }else{
                    code =  '<br>'+tab.replace(/&emsp;/,'')+'}+2<br>'+tab.replace(/&emsp;/,'');

                }
            }else{
    
                if(($(node.to2).hasClass('decision')||$(node.root).hasClass('decision'))&&$(node.node).hasClass('decision')){

               
                    code = '<br>'+tab.replace(/&emsp;/,'')+'}<span class="textHighLight"> ELSE </span> ';

                }else{
                    code = '<br>'+tab.replace(/&emsp;/,'')+'}<span class="textHighLight"> ELSE </span>{<br>'+tab;

                }
            }
        }catch(e){
        
            code = '<br>'+tab.replace(/&emsp;/,'')+'}<span class="textHighLight"> ELSE </span>{<br>'+tab;
        }
    

    }
   

    switch (type) {
        case "process":
            code += text+';';
            break;
        case "input":
            code += "<span class='textHighLight'> INPUT </span>( " + text + ")"+';';
            break;
        case "decision":
            if (node.decision) {
                code += "<span class='textHighLight'> WHILE </span>(" + text + ") {";
            } else {
                code += "<span class='textHighLight'> IF </span>(" + text + "){ ";
            }
            break;
        case "display":
            code += "<span class='textHighLight'> DISPLAY </span>(" + text + ")"+';';
            break;
    }
    if(node.endnoof){
        // let nodeRoot=nodeList.find(s=>s.node==node.root);
        // if(!$(nodeRoot.to2).hasClass('decision')&&!node.endyesof){
            console.log(node);
        // if(nodeList.find(s=>s.node==node.endnoof).decision){
                code += '<br>'+tab.replace(/&emsp;/,'')+'}+3<br>';

            // }
        // }
      
    }
  
    return code+'<br>';
}


function pseudoCodePage(pseudoCode){
    pseudoCode+="<span class='textHighLight'>END</span>";
    pseudoCode=pseudoCode.replace(/(<br>){3}/gm,'<br>');
    let strWindowFeatures = "menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes,width=500,height=700,left=500";
    let myWindow = window.open('','',strWindowFeatures);

    myWindow.document.write(pseudoCode);
    let bootstrap=myWindow.document.createElement('link');
    let head=myWindow.document.getElementsByTagName('head')[0];

    bootstrap.rel  = 'stylesheet';
    bootstrap.type = 'text/css';
    bootstrap.href = 'css/bootstrap.min.css';
    bootstrap.media = 'all';
    head.appendChild(bootstrap);
    let style=myWindow.document.createElement('link');
    style.rel  = 'stylesheet';
    style.type = 'text/css';
    style.href = 'css/pseudocode.css';
    style.media = 'all';
 
    head.appendChild(style);

}
function  explorerPseudoCode() {
    let prevNode =undefined;
    let currentNode="#start";
    let connectorPointer=$(currentNode).attr("data-connector");
    let list =[];
    let indx=0;
    let decisionStack=[];
    let isNo=false;
  
    list.push({node:currentNode,root:prevNode,status:'add',to:$(connectorPointer).attr('data-to')});
    for(let i=0;i<=$(".shape").length*5;i++){

        if(currentNode!=undefined){
            prevNode=currentNode;
            if(!isNo){
            currentNode=$(connectorPointer).attr("data-to");
            }
            if($(currentNode).hasClass("decision")){
                if(list.map(s=>s.node).includes(currentNode)&&!isNo){
                    currentNode = decisionStack.shift();
                    isNo=true;
                }
          
                if(isNo){
                    connectorPointer=$(currentNode).attr("data-no");
                    isNo=false;
                }else{
                    decisionStack.push(currentNode);                        
                    connectorPointer=$(currentNode).attr("data-yes");
                }
               
            }else{
                
                connectorPointer=$(currentNode).attr("data-connector");
            }
      
            if(!list.map(s=>s.node).includes(currentNode)&&currentNode){
                      // ||currentNode=='#end')&&currentNode
                if($(currentNode).hasClass("decision")){
                    let lineYes =$(currentNode).attr('data-yes')
                    let lineNo =$(currentNode).attr('data-no')

                    list.push({node:currentNode,root:prevNode,status:'add',to:$(lineYes).attr('data-to'),to2:$(lineNo).attr('data-to')});
                }else{
                    list.push({node:currentNode,root:prevNode,status:'add',to:$(connectorPointer).attr('data-to')});
                }

            }
        }else if(decisionStack.length>=0){
            currentNode = decisionStack.shift();
            isNo=true;
        }else{
            break;
        }


    }
  
    return list;
}
