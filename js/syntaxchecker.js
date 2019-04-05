function testSyntax(str){
    if (str.match(/(\w[^\+\-*\/\<\>\=]*)([\+\-*\/\<\>\=]*)/))
        return true;
    else
        return false;

}