var pseudoCode='';
var row;
var endOfBacket;
var decision="yes";
var tab='';
function pseudocodeController(){
    let nodeList = explorerPseudoCode();
    // let a = nodeList.map((s,i,arr)=>{
    //     if($(s.node).hasClass("decision")){
    //        let a=checkIsLoop(s,nodeList,s.node);  
    //        if(a){
    //            s.decision = true; //is LOOP
    //        }else{
    //            s.decision = false; // is IF
    //        }
      
    //        let b=endOfDecision(s,nodeList,s.node,i);
           
    //     }
       
    // });
    // endOfBacket=endOfDecision(nodeList);
    // console.log(nodeList);
    // generateCode(nodeList);
    // pseudocodeController2()
}

function checkIsLoop(nodeData,nodeList,decisionTarget,prevNode) {
    
    if(nodeData.to){
        let resultFind = nodeList.find(s=>s.node == nodeData.to);
        //&&resultFind!=prevNode ใส่กัน stack overflow แต่คำตอบก็ยังผิด
        if(resultFind&&resultFind.node!= decisionTarget&&resultFind!=prevNode){
          return checkIsLoop(resultFind,nodeList,decisionTarget,resultFind);
           
        }else{
            // console.log('------ELSE--------');

            return true;
           

        }
    }else{
        // console.log('------UNDEFINED--------');
    }
   
}
function endOfDecision(nodeData,nodeList,decisionTarget,nodeIndex) {
    let currentNode;
    let index=0;
    if(nodeData.decision){ // LOOP
        currentNode=nodeList.find(s=>s.node == nodeData.to);
        for(let i=0;i<nodeList.length;i++){
            if(currentNode.to){
                if(currentNode.to==nodeData.node){              
                    nodeList[index].endyesof=nodeData.node;
                    let tempIndex = nodeList.findIndex(s=>s.node == nodeData.to2);
                    nodeList[tempIndex].endnoof=nodeData.node;

                    nodeList[nodeIndex].endyes=currentNode.node;
                    nodeList[nodeIndex].endno=nodeData.to2;
             
                    break;
                }else{
                    index=nodeList.findIndex(s=>s.node == currentNode.to);

                    currentNode=nodeList.find(s=>s.node == currentNode.to);
                }
            }else{
              
            }
        }
    }else{// IF
      
        let {yesPath,noPath}=getIfPath(nodeData,nodeList);
        let endOfAll = yesPath.filter(value => noPath.includes(value))[0];
        let endOfYes = yesPath.find((s,i,arr)=>{if(s==endOfAll)return (i-1<0)?arr[0]:arr[i-1]})
        let endOfNo=noPath.find((s,i,arr)=>{if(s==endOfAll)return (i-1<0)?arr[0]:arr[i-1]})
        nodeList[nodeIndex].endyes=endOfYes;
        nodeList[nodeIndex].endno=endOfNo;
        let tempIndex = nodeList.findIndex(s=>s.node == endOfYes);
        nodeList[tempIndex].endyesof=nodeData.node;
        tempIndex = nodeList.findIndex(s=>s.node == endOfNo);
        nodeList[tempIndex].endnoof=nodeData.node;

        // console.log(endOfYes)
        // console.log(endOfNo)
        // console.log('------------------')
    }
    return nodeList;
    

}
function getIfPath(nodeData,nodeList) {
  
    let yesPath=[];
    let noPath=[];
    let currentNode=nodeData;
  
    for(let i = 0; i<nodeList.length;i++){
        if(currentNode.to){
            yesPath.push(currentNode.to);
            currentNode=nodeList.find(s=>s.node == currentNode.to);
        }else{
            break;
        }
        
    }
    currentNode=nodeList.find(s=>s.node == nodeData.to2);
    noPath.push(nodeData.to2)
    for(let i = 0; i< nodeList.length;i++){
        if(currentNode.to){
            noPath.push(currentNode.to);
            currentNode=nodeList.find(s=>s.node == currentNode.to);
        }else{
            break;
        }
        
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
function pseudocodeController2(){
  pseudoCode="";
  row=1;
    let node ="#start";
    let connector=$("#start").attr("data-connector");
   
    while($(connector).attr("data-to")!=undefined){
        generateCode(node);
        node=$(connector).attr("data-to");
        if($(node).hasClass("decision")){
            if(decision=="yes"){
                connector=$(node).attr("data-yes");
                discision="no";
            }else{
                connector=$(node).attr("data-no");
                discision="yes";
            }
        }else{
            connector=$(node).attr("data-connector");

        }
        row++;
        // console.log(connector);

    }
    pseudoCodePage(pseudoCode);
}
function generateCode(nodeList){
    let decisionNode={node:undefined,status:false};
    let currentNode = nodeList[0];
 
     pseudoCode='START\n';
     let i =0;
     while( i<=nodeList.length*2){
 
            if(currentNode==undefined){
                if(nodeList.some(s=>s.status!='pseudoCode')){
                    
                    currentNode=nodeList.filter(s=>$(s.node).hasClass('decision'))[0];

                }else{
                    break;
                }
            }
         console.log(currentNode);
         if(currentNode.status!='pseudoCode'){
            // &&!endOfBacket.map(s=>s.to).includes(currentNode.node)
            gg(currentNode);
          
         }else if(currentNode.status=='pseudoCode'&&$(currentNode.node).hasClass('decision')){
            decisionNode.node =currentNode;
            decisionNode.status = 'yesIswent';
            currentNode=nodeList.find(s=>s.node==currentNode.to2);
            
            tab+='\t';
            continue;
         }
            currentNode.status='pseudoCode';
      
            currentNode=nodeList.find(s=>s.node==currentNode.to);

      
       
        i++;
     }
    
     pseudoCodePage(pseudoCode)
   
}
function gg(s) {
         let type = getNodeType(s.node);
        let text = $(s.node).find(".text").text();
        let code='';
  
        
        switch (type){
           
            case "process":
                code=text;
            break;
            case "input":
                code="INPUT( "+text+")";
            break;
            case "decision":
                if(s.decision){
                    code="LOOP( "+text+") {";
                }else{
                    code="IF( "+text+"){ ";
                }
            break;
            case "display":
                code="DISPLAY("+text+")";
            break;
        }
   
        if(code!=''){
            pseudoCode+=code+"\n";

        }
   
    
}
function generateCode2(node){
    let type=getNodeType(node);
    let text=$(node).find(".text").text();
    let code;
    switch (type){
        case "start-end":
            code="START";
        break;
        case "process":
            code=text;
        break;
        case "input":
            code="INPUT( "+text+")";
        break;
        case "decision":
            if(decision=="yes"){
                code="IF( "+text+") {";
            }else{
                code="ELSE( "+text+") }";
            }
        break;
        case "display":
            code="DISPLAY("+text+")";
        break;
    }
    pseudoCode+=row+". "+code+"<br>";

}
function pseudoCodePage(pseudoCode){
    pseudoCode+="END";
    console.log('\n\n\n'+pseudoCode);
    // let strWindowFeatures = "menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes,width=500,height=700,left=500";
    // let myWindow = window.open('','',strWindowFeatures);

    // myWindow.document.write(pseudoCode);
}
function  explorerPseudoCode() {
    let prevNode =undefined;
    let currentNode="#start";
    let connectorPointer=$(currentNode).attr("data-connector");
    let list =[];
    let indx=0;
    let decisionStack=[];
    
  
    for(let i=0;i<=20;i++){
   

        if(currentNode!=undefined||decisionStack.length>=0){
          
            prevNode=currentNode;
     
            currentNode=$(connectorPointer).attr("data-to");
            if($(currentNode).hasClass("decision")){
                if(decisionStack.map(s=>s.node).includes(currentNode)){
                    let a=decisionStack.shift();
                    connectorPointer=$(a.node).attr('data-no');
                    currentNode=$(connectorPointer).attr("data-to");
                    prevNode=a.node;
                    continue;
                }else{
                    decisionStack.push({node:currentNode,root:prevNode});                        
                    connectorPointer=$(currentNode).attr("data-yes");
                }
               
            }else{
                
                connectorPointer=$(currentNode).attr("data-connector");
            }
       
            
            list.push({node:currentNode,root:prevNode,status:'add'});
        }else{
            break;
        }


    }
    console.log(list);
  
    return list;
}
