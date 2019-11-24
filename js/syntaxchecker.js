var listOfVar=new Array;
// const processSyntax=/^[A-Za-z$_][A-Za-z$_0-9]*([ ]*=[ ]*[0-9]+|[ ]*=[ ]*['].+[']|[ ]*=[ ]*["].+["])?(([ ]*[,][ ]*[A-Za-z$_][A-Za-z$_0-9]*)([ ]*=[ ]*[0-9]+|[ ]*=[ ]*['].+[']|[ ]*=[ ]*["].+["])?)*$/;
// let processSyntax=/^[A-Za-z$_][A-Za-z$_0-9]*(([ ]*=[ ]*)([0-9]+|['][^\'\"]+[']|["][^\'\"]+["])([\+\-\*\/][0-9]+|[+][ ]*(['][^\'\"]+[']|["].+["]))*)?$/;
const decisionSyntax=/(^\([A-Za-z$_][A-Za-z$_0-9]*[ ]*(<=|>=|==|!=|<|>|===|!==){1}[A-Za-z$_0-9]+\)|^[A-Za-z$_][A-Za-z$_0-9]*[ ]*(<=|>=|==|!=|<|>|===|!==){1}[A-Za-z$_0-9]+)((&&|\|\|)([(]*[A-Za-z$_][A-Za-z$_0-9]*[ ]*(<=|>=|==|!=|<|>|===|!==){1}.+[)]|[A-Za-z$_][A-Za-z$_0-9]*[ ]*(<=|>=|==|!=|<|>|===|!==){1}[^\(\)]))*$/;
const inputSyntax=/^[A-Za-z$_][A-Za-z$_0-9]*$/;

function checkSyntax(){
    let result=true;
    listVariable();
 
    $(".shape").each(function(){
        let text=$(this).find(".text").text();
        let type=getNodeType(this);
        let match=true;
        switch(type){
            case "process":
                match=processChecker(text);
                 

              
            break;
            case "decision":
                match=decisionSyntax.test(text);
            break;
            case "input":
                match=(listOfVar.includes(text)&&inputSyntax.test(text))?true:false; 
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
function processChecker(text){
    temp=text.match(/(?<=\=).*/)[0];
    console.log('---');
  
       
    let allWord=temp.match(/[^\+\-\*\/]*|'.*'|".*"/gm).filter(s=>s.length>0);
    

    let wordIsString=[];
    if(temp.match(/'.*'|".*"/gm)){
        wordIsString=temp.match(/'.*'|".*"/gm).filter(s=>s.length>0);

    }
    let wordIsVariable= allWord.filter(s=>!wordIsString.includes(s)&&listOfVar.includes(s));
 

    let abstainWord="";
    wordIsVariable.map(s=>abstainWord+='|'+s);
   
    

    let processSyntax=new RegExp("^[A-Za-z$_][A-Za-z$_0-9]*(([ ]*=[ ]*)([0-9]+|['][^\'\"]+[']|[\"][^\'\"]+[\"]"+abstainWord+")([\+\\-\*\/][0-9]+|[+][ ]*(['][^\'\"]+[']|[\"].+[\"]"+abstainWord+"))*)?$");
    console.log( processSyntax)
    return processSyntax.test(text);


}
// function checkIsVar(text){
//     const syntax=/([A-Za-z$_][A-Za-z$_0-9]*(?=,)|(?<=\=)[A-Za-z$_][A-Za-z$_0-9]*)/gm;
    
   
//     let list=new Array;
//     while((listVar=syntax.exec(text) )!== null){
//         list.push(listVar[0]);
//         console.log(listVar[0])
        
//     }
    
//     console.log(list.some(r=>listOfVar.indexOf(r) >= 0));
//     return  list.some(r=>listOfVar.indexOf(r) >= 0);
// }
function listVariable(){
     let listVar;
     listOfVar=[];
     $(".process").each(function(){ 
        
         let text= $(this).find(".text").text(); 
      
        const syntax=/([A-Za-z$_][A-Za-z$_0-9]*(?=\=)|(?<=,)[A-Za-z$_][A-Za-z$_0-9]*)/gm;
        
        while((listVar=syntax.exec(text) )!== null){
            listOfVar.push(listVar[0]);
   
            
        }
     
        listOfVar=[...new Set(listOfVar)];
        
     }); 
     
    
}
// function findVariable(str){
//     let regex=/[A-Za-z$_][A-Za-z$_0-9]*/;
//     let array=
//     while(())
// }
