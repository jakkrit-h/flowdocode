var processSyntax=  [
    /^[A-Za-z$_]+[\+\-\*\/]*=([\w\(\)]+([\+\-\*\/]?[\w\(\)]*))+$/,
    /^[A-Za-z$_]+[\+\-\*\/]{2}$/,
];

function testSyntax(str){
    if (str.match(/(\w[^\+\-*\/\<\>\=]*)([\+\-*\/\<\>\=]*)/))
        return true;
    else
        return false;

}
function processSyntax(str){
    if(str.match(processSyntax))
        return true;
    else
        return false;
}