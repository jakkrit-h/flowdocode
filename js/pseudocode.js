var FDCV_pseudoCode='';
var FDCV_tab='';
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
           getEndOfDecision(s,nodeList,i);
     
        }
       
    });

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

function getEndOfDecision(nodeData,nodeList,nodeIndex) {
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
                        let tempIndex = nodeList.findIndex(s=>s.node == nodeData.to2);

                        if(nodeList[index].endyesof==undefined){
                            nodeList[index].endyesof=[];
                        }
                        nodeList[index].endyesof.push({node:nodeData.node,status:'add' });
                        
                        if(nodeList[tempIndex].endnoof==undefined){
                            nodeList[tempIndex].endnoof=[];
                        }
                        nodeList[tempIndex].endnoof.push({node:nodeData.node,status:'add' });

    
                        nodeList[nodeIndex].endyes={node:currentNode.node,status:'add'};
                        nodeList[nodeIndex].endno={node:nodeData.to2,status:'add'};
                 
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


        nodeList[nodeIndex].endyes={node:endOfYes,status:'add'};
        nodeList[nodeIndex].endno={node:endOfNo,status:'add'};

        let tempIndex = nodeList.findIndex(s=>s.node == endOfYes);
        if(nodeList[tempIndex].endyesof==undefined){
            nodeList[tempIndex].endyesof=[];
        }
       
     
        
        nodeList[tempIndex].endyesof.push({node:nodeData.node,status:'add' });
     

        tempIndex = nodeList.findIndex(s=>s.node == endOfNo);
        if(nodeList[tempIndex].endnoof==undefined){
            nodeList[tempIndex].endnoof=[];
        }
        nodeList[tempIndex].endnoof.push({node:nodeData.node,status:'add' });

        let endOfDecide =noPath[(tempNoPathIndex>0)?tempNoPathIndex:0 ];

        tempIndex=nodeList.findIndex(s=>s.node==endOfDecide);
        if(nodeList[tempIndex].endofif==undefined){
            nodeList[tempIndex].endofif=[];
        }
        nodeList[tempIndex].endofif.push({node:nodeList[nodeIndex].node,status:'add' });
      
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
                if (currentNode.to != nodeData.node) {
                    yesPath.push(currentNode.to);
                }else{
                    break;
                }
        
       
                
      
        }else if(DecisionOnPast.length>0){
            if(currentNode.to==nodeData.node){
     
                break;
            }
            let temp =DecisionOnPast.shift();
            let decide = nodeList.find(s=>s.node == temp);
            currentNode=nodeList.find(s=>s.node == decide.to2);
            if (decide.to2 != nodeData.node) {
                yesPath.push(decide.to2);
            }else{
                break;
            }
     
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
                if (currentNode.to != nodeData.node) {
                    noPath.push(currentNode.to);
                }else{
                    break;
                }
        }else if(DecisionOnPast.length>0){
            let temp =DecisionOnPast.shift();
            let decide = nodeList.find(s=>s.node == temp);
            currentNode=nodeList.find(s=>s.node == decide.to2);
     
            if (decide.to2 != nodeData.node) {
                noPath.push(decide.to2);
            }else{
                break;
            }
     
            i--;
            continue;
        } else {
            break;
        }
        
        currentNode = nodeList.find(s => s.node == currentNode.to);

    }
   
    return {yesPath,noPath};
}

function generateCode(nodeList) {
    path=[]
    let code = "<span class='textHighLight'>START</span><br>";
    let endOfIf = [];
    let decisionNode = { node: undefined, status: false };
    let currentNode = nodeList[0];
    let pastWay=[];
    let pastTab=[];
    let addElse=false;
    FDCV_tab='';
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
                if(currentNode.endyesof.filter(s=>s.status=='write'||s.status=='add').length>0){
                    let index = nodeList.findIndex(s => s.node == currentNode.node);

                    nodeList[index].status = 'pseudocode';
                 

                    currentNode = nodeList.find(s => s.node == currentNode.endyesof.find(s=>s.status=='write'||s.status=='add').node);
                   
    
    
    
    
                    i--;
                    continue;
                }
                
            }
         
         
         

            if($(currentNode.node).hasClass('decision')&&currentNode.status=='pseudocode'||$(currentNode.node).hasClass('decision')&&currentNode.decision=="DOWHILE"){
                if(currentNode.decision=="DOWHILE"){
                    currentNode.status='pseudocode';
                }
                addElse=true;
                currentNode=nodeList.find(s=>s.node==currentNode.to2);
            }else{
                let index =nodeList.findIndex(s=>s.node==currentNode.node); 
                nodeList[index].status='pseudocode';
                currentNode=nodeList.find(s=>s.node==currentNode.to);
               
            }

        }else if(nodeList.some(s=>s.status=='add')){
            
           currentNode=nodeList.filter(s=>s.status=='add'&&s.node!='#start')[0];
        try {
           currentNode=nodeList.find(s=>s.node==currentNode.root);
        } catch (e) { }
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
    let nodeIndex=nodeList.findIndex(s=>s==node);
    
    try{
        let temp=getFrontCloseBackget(node,nodeList,root);
        if(temp.length>0){
            code+=temp
            closeBacket=true;
        }
   
    }catch(e){
       
    }
   
   
    code+=FDCV_tab;

    if(node.startDo){

        code += '<br>'+FDCV_tab+"<span class='textHighLight'>DO </span> { <br>"+FDCV_tab;
        FDCV_tab+="&emsp;";

    }

    switch (type) {
        case "process":
            code += '<br>'+FDCV_tab+text+';';
            break;
        case "input":
            code += "<br>"+FDCV_tab+"<span class='textHighLight'>INPUT </span>(" + text + ")"+';';
            break;
        case "decision":
            if (node.decision=='WHILE') {
                code += "<br>"+FDCV_tab+"<span class='textHighLight'>WHILE </span>(" + text + ") {";
                FDCV_tab+="&emsp;";
            }else if(node.decision=='DOWHILE'){
            
                FDCV_tab=FDCV_tab.replace(/&emsp;/,'');

            }else if(node.decision=='ELSEIF'){
                code = " <span class='textHighLight'>ELSE IF </span>(" + text + "){";
                FDCV_tab+="&emsp;";
            }else  { 
                code += "<br>"+FDCV_tab+"<span class='textHighLight'>IF </span>(" + text + "){";
                FDCV_tab+="&emsp;";
            }
            break;
        case "display":
            code += "<br>"+FDCV_tab+"<span class='textHighLight'>DISPLAY </span>(" + text + ")"+';';
            break;
    }
    try{
        if(node.endyesof.filter(s=>s.status=='add').length>0){
            node.endyesof.reverse().map((s,i)=>{
                if(s.status=='add'){

                    let endyes= node.endyesof[i];
                    let decisionIndex=nodeList.findIndex(s=>s.node == endyes.node);
                    let decisionNode = nodeList[decisionIndex];
                    nodeList[nodeIndex].endyesof[i].status='write';

                    if(decisionNode.decision!='DOWHILE'&&decisionNode.endyes.status=='add'){

                        FDCV_tab=FDCV_tab.replace(/&emsp;/,'');
                        if(decisionNode.decision=='WHILE'){
                            code+='<br>'+FDCV_tab+'}';
                 

                        }else{

                            code+='<br>'+FDCV_tab+'}';

                        }
                        nodeList[decisionIndex].endyes.status='write';
                    }
                }
               
            });
           
        }
   

    }catch(e){

    }

    try{
        if(node.endnoof.filter(s=>s.status=='add').length>0){
            node.endnoof.reverse().map((s,i)=>{
                if(s.status=='add'){
                    let endno= node.endnoof[i];

                    let decisionIndex=nodeList.findIndex(s=>s.node == endno.node);
                    let decisionNode = nodeList[decisionIndex];
        
                    nodeList[nodeIndex].endnoof[i].status='write';
                    if(node.node=='#end'&&node.node==decisionNode.to2){
        
                    }else{
                        if(decisionNode.decision=='IF'||decisionNode.decision=='ELSEIF'){
                            let to2OfdecisionNode=nodeList.find(s=>s.node==decisionNode.to2);
                            let haveElse=true;
                            try{
                                if(to2OfdecisionNode.endofif.length>0){
                                    to2OfdecisionNode.endofif.map(m=>{
                                        if(m.node==s.node){
                                            haveElse=false;
                                        }
                                    });
                                }

                            }catch(e){}
                            if(to2OfdecisionNode.decision!='ELSEIF'&&decisionNode.endno.status=='add'&&haveElse){
                                FDCV_tab=FDCV_tab.replace(/&emsp;/,'');

                                code+='<br>'+FDCV_tab+'}';
                                FDCV_tab=FDCV_tab.replace(/&emsp;/,'');

                                nodeList[decisionIndex].endno.status='write';
                            }
                   
                        }
                    }
                }
            });
           
         
        }

    }catch(e){

    }
 
    return code;
}

function getFrontCloseBackget(node,nodeList,root) { 
 
        let code='';
    if($(root.node).hasClass("decision")&&node.node==root.to2){
        FDCV_tab=FDCV_tab.replace(/&emsp;/,'');
        code+=FDCV_tab;
        if(root.decision=='IF'){
            if($(node.node).hasClass("decision")&&root.to2==node.node){
                code+='<br>'+FDCV_tab+'<span class="textHighLight">ELSE </span>';
                 
            }else{

                code+='<span class="textHighLight">ELSE </span>{<br>';
                FDCV_tab+="&emsp;";

            }
        }else if(root.decision=='ELSEIF'){
            if($(node.node).hasClass("decision")&&root.to2==node.node){
                code+='<br>'+FDCV_tab+'<span class="textHighLight">ELSE </span>';
            }else{

                code+='<span class="textHighLight">ELSE </span>{<br>';
                FDCV_tab+="&emsp;";

            }
          

        }else if(root.decision=='DOWHILE'){
            let text = $(root.node).find(".text").text();
      

            code+='<br>'+FDCV_tab+'} <span class="textHighLight">WHILE</span> ('+text+');';
        }else{
            if(node.endnoof.filter(s=>s.status=='add').length>0){
              
                let endnoofIndex = node.endnoof.reverse().findIndex(s=>s.status=='add');
                let index = nodeList.findIndex(s=>s.node == node.node);
                let decisionIndex = nodeList.findIndex(s=>s.node==root.node);
                if(node.endnoof[endnoofIndex].status=='add'&&root.endno.status=='add'){
                    nodeList[index].endnoof[endnoofIndex].reverse().status='write';
                    nodeList[decisionIndex].endno.status='write';
                    code+='<br>'+FDCV_tab+'}';

                }
                node.endnoof[endnoofIndex]
            }
        }
        
       
    }
   
   
    return code;
 }



function pseudoCodePage(pseudoCode){
    pseudoCode+="<br><span class='textHighLight'>END</span>";
    // console.log(pseudoCode.replace(/(<br>)/gm,'\n+nl'));
    pseudoCode=pseudoCode.replace(/(<br>){2,3}/gm,'<br>');
    let strWindowFeatures = "menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes,width=500,height=700,left=500";
    let myWindow = window.open('','',strWindowFeatures);
    myWindow.document.write(pseudoCode);

    let bootstrap=myWindow.document.createElement('link');
    let title= myWindow.document.createElement("title");
    title.text=$(".page.active").text()+" | PSEUDOCODE"
    let head=myWindow.document.getElementsByTagName('head')[0];
    head.appendChild(title)
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
