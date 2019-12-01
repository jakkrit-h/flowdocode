var pseudoCode;
var row;
var decision="yes";
function pseudocodeController(){
    let nodeList = explorer();
    console.log(nodeList)
    pseudocodeController2()
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
function generateCode(node){
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
    let strWindowFeatures = "menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes,width=500,height=700,left=500";
    let myWindow = window.open('','',strWindowFeatures);

    myWindow.document.write(pseudoCode);
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