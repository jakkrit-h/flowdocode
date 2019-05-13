var pseudoCode;
var row;
function pseudocodeController(){
  pseudoCode="";
 row=1;
    let node ="#start";
    let connector=$("#start").attr("data-connector");
    while($(connector).attr("data-to")!=undefined){
        generateCode(node);
        node=$(connector).attr("data-to");
       
        connector=$(node).attr("data-connector");
        row++;
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
            code="INPUT( "+text+")";
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