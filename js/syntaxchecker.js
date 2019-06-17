var processSyntax=  [
    /^[A-Za-z$_]+[\+\-\*\/]*=([\w\(\)]+([\+\-\*\/]?[\w\(\)]*))+$/,
    /^[A-Za-z$_]+[\+\-\*\/]{2}$/,
];

function testSyntax(str){
    if (str.match(/(\w[^\+\-*\/\<\>\=]*)([\+\-*\/\<\>\=]*)/))
        return true;
    else
        return false;
    console.log(str.match(/(\w[^\+\-*\/\<\>\=]*)([\+\-*\/\<\>\=]*)/));
}
function processSyntax(str){
    if(str.match(processSyntax))
        return true;
    else
        return false;
}
function checkSyntax(){
    let result=true;
    let processSyntax=/^[A-Za-z$_][A-Za-z$_0-9]*([ ]*=[ ]*[0-9]+|[ ]*=[ ]*['].+[']|[ ]*=[ ]*["].+["])?(([ ]*[,][ ]*[A-Za-z$_][A-Za-z$_0-9]*)([ ]*=[ ]*[0-9]+|[ ]*=[ ]*['].+[']|[ ]*=[ ]*["].+["])?)*$/;
    let decisionSyntax=/(^\([A-Za-z$_][A-Za-z$_0-9]*[ ]*(<=|>=|==|!=|<|>|===|!==){1}[A-Za-z$_0-9]+\)|^[A-Za-z$_][A-Za-z$_0-9]*[ ]*(<=|>=|==|!=|<|>|===|!==){1}[A-Za-z$_0-9]+)((&&|\|\|)([(]*[A-Za-z$_][A-Za-z$_0-9]*[ ]*(<=|>=|==|!=|<|>|===|!==){1}.+[)]|[A-Za-z$_][A-Za-z$_0-9]*[ ]*(<=|>=|==|!=|<|>|===|!==){1}[^\(\)]))*$/;
    let inputSyntax=/^[A-Za-z$_][A-Za-z$_0-9]*$/
    $(".shape").each(function(){
        let text=$(this).find(".text").text();
        let type=getNodeType(this);
        let match=true;
        switch(type){
            case "process":
                match=processSyntax.test(text);
            break;
            case "decision":
                match=decisionSyntax.test(text);
            break;
            case "input":
                match=inputSyntax.test(text);
            break;
        }
        if(!match){
            result=false;
            $(this).addClass("invalid");
        }else{
            $(this).removeClass("invalid");
        }
    });
    return result;
}
// function findVariable(str){
//     let regex=/[A-Za-z$_][A-Za-z$_0-9]*/;
//     let array=
//     while(())
// }
