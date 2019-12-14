var pseudoCode='';
var row;
var endOfBacket;
var decision="yes";
var tab='';
function pseudocodeController(){
    let nodeList = explorer(true);
    let a = nodeList.map((s,i,arr)=>{
        if($(s.node).hasClass("decision")){
           let a=checkIsLoop(s,nodeList,s.node);

           if(a){
               s.decision = false;
           }else{
               s.decision = true;
           }
        }
       
    });
    endOfBacket=endOfDecision(nodeList);
    console.log(endOfBacket);
    generateCode(nodeList);
    // pseudocodeController2()
}

function checkIsLoop(nodeData,nodeList,decisionTarget) {

    if(nodeData.to){
        let resultFind = nodeList.find(s=>s.node == nodeData.to);
        if(resultFind&&resultFind.node!= decisionTarget){
          return checkIsLoop(resultFind,nodeList,decisionTarget);
           
        }else{
            console.log('------ELSE--------');

            return true;
           

        }
    }else{
        console.log('------UNDEFINED--------');
    }
   
}
function endOfDecision(nodeList) {
    let value = nodeList.map(s=>s.to);
 
    let result=nodeList.filter((s,i,arr)=>
    value.filter(e=>{
       

        return (e==s.to)
    }).length>1);
    return result;
}
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
         
         if(currentNode.status!='pseudoCode'){
            console.log(decisionNode.node ==currentNode);
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
                    code="IF( "+text+") {";
                }else{
                    code="LOOP( "+text+"){ ";
                }
            break;
            case "display":
                code="DISPLAY("+text+")";
            break;
        }
        if(endOfBacket.includes(s)){
            code+='\n}ELSE{'
       
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
// function explorer(node){
//     let connectorYes=$(node).attr("data-yes");
//     let connectorNo=$(node).attr("data-no");
//     let connector=connectorYes;
//     let endOfYes="";
//     let endOfNo="";
//     while($(connector).attr("data-to")!=undefined||$(connector).attr("data-to")=="#end"){
    
//     }
// }