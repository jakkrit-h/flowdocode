var pseudoCode='';
var row;
var endOfBacket;
var decision="yes";
var tab='';
function pseudocodeController(){
    let nodeList = explorerPseudoCode();
    let a = nodeList.map((s,i,arr)=>{
        if($(s.node).hasClass("decision")){
           let a=checkIsLoop(s,nodeList,s.node,undefined,i,[]);  
           if(a){
               s.decision = checkIsDoWhile(s,arr,i) ; //is LOOP
           }else{
               s.decision =checkIsElseIf(s,arr,i) ; // is IF
           }
           
     
        }
       
    });
    nodeList.map((s,i,arr)=>{
        if($(s.node).hasClass("decision")){            
           getEndOfDecision(s,nodeList,s.node,i);
     
        }
       
    });
    console.log(nodeList);

  
    generateCode(nodeList);
 
}
function checkIsLoop(nodeData,nodeList,decisionTarget,prevNode,indexTarget,decisionPass) {

    if(nodeData.to){
   
      
        let index = nodeList.findIndex(s=>s.node == nodeData.to);
        let resultFind =nodeList[index];
        if($(resultFind.node).hasClass("decision")&&resultFind!=prevNode&&indexTarget<index){
         
            resultFind = nodeList.find(s=>s.node == resultFind.to2);
 
        }else if($(resultFind.node).hasClass("decision")&&resultFind!=prevNode&&indexTarget>index){
            if(resultFind.decision=='IF'||resultFind.decision=='ELSEIF'){
                return true;
            }else{
                return false

            }

        }

        if(resultFind&&resultFind.node!= decisionTarget){
 
          return checkIsLoop(resultFind,nodeList,decisionTarget,resultFind,indexTarget);
           
        }else{
  
            return true;
           

        }

    }else{

    }
   
}
function checkIsElseIf(node,nodeList,i) {
    let nodeRoot= nodeList.find(s=>s.node==node.root);
    if($(nodeRoot.node).hasClass("decision")&&nodeRoot.to2==node.node){
        return "ELSEIF";
    }else{
        return "IF";
    }
}
function checkIsDoWhile(node,nodeList,i) {
    let nodeRoot= nodeList.find(s=>s.node==node.root);
    let currentNode = nodeRoot;
    let result = 'WHILE';
    for(let i = 0; i<nodeList.length;i++){
        if(currentNode.to!=nodeRoot.node){

            currentNode=nodeList.find(s=>s.node==currentNode.to);
      

        }else{
            result ='DOWHILE';
            break;
        }
    }

    return result;
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
    if(nodeData.decision=='WHILE'||nodeData.decision=='DOWHILE'){ // LOOP
        currentNode=nodeList.find(s=>s.node == nodeData.to);
        index=nodeList.findIndex(s=>s.node == nodeData.to);

        if(nodeData.decision=='DOWHILE'&&index< nodeIndex){
            nodeList[index].startDo=true;
            
            
            
        }else if(nodeData.decision=='DOWHILE'&&index> nodeIndex) {
            let tempI=nodeList.findIndex(s=>s.node ==  currentNode.to);
            nodeList[tempI].startDo=true;

            //ถ้า ตัว ถัดไป ของ currentNode ดัน เป็น decision ต้องเลือก to หรือ to 2 อาจจะเอา  index ของ ตัวใดตัวนึงมาเปรียบเทียบอะไรสักอย่างนึง จะน้อยกว่าหรือมากกว่าอะไรสักอย่าง
        }
            index=0;
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
      

        let tempYesPathIndex=yesPath.findIndex(s=>s==endOfYes);
        endOfYes=yesPath[(tempYesPathIndex>0)?tempYesPathIndex-1:0 ];
 
        let tempNoPathIndex=noPath.findIndex(s=>s==endOfNo);
        endOfNo=noPath[(tempNoPathIndex>0)?tempNoPathIndex-1:0 ];
        nodeList[nodeIndex].endyes=endOfYes;
        nodeList[nodeIndex].endno=endOfNo;

        let tempIndex = nodeList.findIndex(s=>s.node == endOfYes);
        // let tempArr= [];
        // if(nodeList[tempIndex].endyesof){
            
        //     nodeList[tempIndex].endyesof.map(s=>tempArr.push(s));
        // }
        // tempArr.push(nodeData.node);
        nodeList[tempIndex].endyesof=nodeData.node;
        // nodeList[tempIndex].endyesof=tempArr;
        // nodeList[tempIndex].endyesofcounter=0;

        tempIndex = nodeList.findIndex(s=>s.node == endOfNo);
        // tempArr=[];
        // if(nodeList[tempIndex].endnoof){
            
        //     nodeList[tempIndex].endnoof.map(s=>tempArr.push(s));
          
        // }
        // tempArr.push(nodeData.node);
        // nodeList[tempIndex].endnoof=tempArr;
        // nodeList[tempIndex].endnoofcounter=0;
        nodeList[tempIndex].endnoof=nodeData.node;
        let endOfDecide =noPath[(tempNoPathIndex>0)?tempNoPathIndex:0 ];
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
    tab='';
    let countDecision=nodeList.filter(s=>$(s.node).hasClass('decision'));
    for (let i = 0; i < nodeList.length+countDecision.length; i++) {
        if(!pastWay.includes(currentNode.node)){
          

               
             

                 code+= getpseudoCode(currentNode,addElse,nodeList);
            
                addElse=false;
         
        
           
        }else if(currentNode.node=='#end'){
            
            if(pastWay[pastWay.length-2]!='#end'&&pastWay[pastWay.length-1]!='#end'){
                code+=getpseudoCode(currentNode,addElse,nodeList);
                addElse=false;
            }
        }
        pastWay.push(currentNode.node);
      
        if(currentNode.to!=undefined){
           

            if (currentNode.endyesof) {
                let index = nodeList.findIndex(s => s.node == currentNode.node);
                nodeList[index].status = 'pseudocode';
                currentNode = nodeList.find(s => s.node == currentNode.endyesof);

                // if (Array.isArray(currentNode.endyesof)
                //     && currentNode.endyesof.length > 1
                //     && currentNode.endyesofcounter < currentNode.endyesof.length - 1) {

                //     let tempEndYesOf = currentNode.endyesof[currentNode.endyesofcounter];
                //     currentNode.endyesofcounter++;
                //     currentNode = nodeList.find(s => s.node == tempEndYesOf);
                //     console.log(currentNode);
                // } else if (!Array.isArray(currentNode.endyesof)) {

                //     console.log(currentNode);
                //     currentNode = nodeList.find(s => s.node == currentNode.endyesof[0]);
                //     console.log(currentNode);
                // }




                i--;
                continue;
            }


         
            if($(currentNode.node).hasClass('decision')&&currentNode.status=='pseudocode'){
          
                addElse=true;
                currentNode=nodeList.find(s=>s.node==currentNode.to2);
            }else{
                let index =nodeList.findIndex(s=>s.node==currentNode.node); 
                nodeList[index].status='pseudocode';
                currentNode=nodeList.find(s=>s.node==currentNode.to);

            }

        }else if(nodeList.some(s=>s.status=='add')){
            
           currentNode=nodeList.filter(s=>s.status=='add'&&s.node!='#start')[0];
        //    console.log(currentNode);
        try {
           currentNode=nodeList.find(s=>s.node==currentNode.root);
        } catch (e) { }
            // console.log(currentNode);
        }




    }
    pseudoCodePage(code);
}
function getpseudoCode(node,addElse,nodeList){

    let code='';
    let type = getNodeType(node.node);
    
    let text = $(node.node).find(".text").text();
    let closeBacket=false;
    let root=nodeList.find(s=>s.node==node.root);
    try{
        code+=getFrontCloseBackget(node,nodeList,root);
        closeBacket=true;
    }catch(e){
       
    }

    code+=tab;

    if(node.startDo){
        tab+="&emsp;";

        code += "<span class='textHighLight'>DO </span> { <br>"+tab;
    }
    console.log(code);

    switch (type) {
        case "process":
            code += text+';';
            break;
        case "input":
            code += "<span class='textHighLight'>INPUT </span>(" + text + ")"+';';
            break;
        case "decision":
            if (node.decision=='WHILE') {
                code += "<span class='textHighLight'>WHILE </span>(" + text + ") {";
                tab+="&emsp;";
            }else if(node.decision=='DOWHILE'){
                // code += "<span class='textHighLight'>DO </span> {";
                // tab+="&emsp;";

               code= code.replace('&emsp;','');
            } 
            else  { 
                code += "<span class='textHighLight'>IF </span>(" + text + "){ ";
                tab+="&emsp;";
            }
            break;
        case "display":
            code += "<span class='textHighLight'>DISPLAY </span>(" + text + ")"+';';
            break;
    }

    code+=getBehideCloseBackget(node,nodeList,closeBacket);

  
    return code+'<br>';
}

function getFrontCloseBackget(node,nodeList,root) { 
    let code='';
    if($(root.node).hasClass("decision")&&node.node==root.to2){
        tab=tab.replace(/&emsp;/,'');
        code+=tab;
        if(root.decision=='IF'){
            if($(node.node).hasClass("decision")&&root.to2==node.node){
                code+='} <span class="textHighLight">ELSE </span>';
                 
            }else{
                code+='} <span class="textHighLight">ELSE </span>{<br>';
                tab+="&emsp;";
            }
        }else if(root.decision=='ELSEIF'){
            if($(node.node).hasClass("decision")&&root.to2==node.node){
                code+='} <span class="textHighLight">ELSE </span>';
            }else{
                code+='} <span class="textHighLight">ELSE </span>{<br>';
                tab+="&emsp;";
            }
          

        }else if(root.decision=='DOWHILE'){
            let text = $(root.node).find(".text").text();
            code+='} <span class="textHighLight">WHILE</span> ('+text+');<br>';
        }else{
            code+='}<br>';
        }
        
       
    }else if(node.node=='#end'&&(node.endyesof||node.endnoof||node.endofif)){
        tab=tab.replace(/&emsp;/,'');
        code+=tab;
        let decide=undefined;
        decide =(node.endyesof)?node.endyesof:(node.endnoof)?node.endnoof:node.endofif;
        decide = nodeList.find(s=>s.node == decide);
     
            if(decide.to2!='#end'&&decide.decision!='IF'){
                if(decide.decision=='DOWHILE'){
                    let text = $(root.node).find(".text").text();
                    code='} <span class="textHighLight">WHILE</span> ('+text+');<br>';
                }else{
                    code='}<br>';
                }
               
            }
    
         
    }
   
    return code;
 }
function getBehideCloseBackget(node,nodeList,closeBacket) { 
    let code='';
        let nodeRoot = nodeList.find(s => s.node == node.root);
    
    if (node.endnoof&&(nodeRoot.decision!='WHILE'&&nodeRoot.decision!='DOWHILE'&&nodeRoot.decision!='ELSEIF')) {
        tab=tab.replace(/&emsp;/,'');
        code+=tab;
      
        let nodeRootDecision = nodeList.find(s => s.node == node.endnoof);
        let nodeNextTo2OfRootDecision=nodeList.find(s => s.node == nodeRootDecision.to2);
        try {
            if (nodeNextTo2OfRootDecision.decision != 'ELSEIF') {
                code += '<br>' + tab + '}<br>';
                // if (!$(nodeRoot.node).hasClass('decision') && !$(nodeRoot.to2).hasClass('decision')) {
            }
        } catch (e) {
            code += '<br>' + tab + '}<br>';
        }
     
        // }
        // if(!$(nodeRoot.to2).hasClass('decision')&&!node.endyesof){

        // if(nodeList.find(s=>s.node==node.endnoof).decision){
        // code += '<br>'+tab.replace(/&emsp;/,'')+'}+3<br>';

        // }
        // }

    }

    return code;
 }

function pseudoCodePage(pseudoCode){
    pseudoCode+="<span class='textHighLight'>END</span>";
    // console.log(pseudoCode.replace(/(<br>)/gm,'\n'));
        pseudoCode=pseudoCode.replace(/(<br>){2,3}/gm,'<br>');
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
