var listOfVar=new Array;
// const processSyntax=/^[A-Za-z$_][A-Za-z$_0-9]*([ ]*=[ ]*[0-9]+|[ ]*=[ ]*['].+[']|[ ]*=[ ]*["].+["])?(([ ]*[,][ ]*[A-Za-z$_][A-Za-z$_0-9]*)([ ]*=[ ]*[0-9]+|[ ]*=[ ]*['].+[']|[ ]*=[ ]*["].+["])?)*$/;
// let processSyntax=/^[A-Za-z$_][A-Za-z$_0-9]*(([ ]*=[ ]*)([0-9]+|['][^\'\"]+[']|["][^\'\"]+["])([\+\-\*\/][0-9]+|[+][ ]*(['][^\'\"]+[']|["].+["]))*)?$/;
const inputSyntax=/^[A-Za-z$_][A-Za-z$_0-9]*$/;

function checkSyntax(){
    let result=true;
      listOfVar=[];
    listVariable();
    $(".shape").each(function(){
        let text=$(this).find(".text").text();
        let type=getNodeType(this);
        let match=true;

        switch(type){
            case "process":
                    // listVariable(text);
                match=processChecker(text);
                 

              
            break;
            case "decision":
                match=decisionChecker(text);
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

    let abstainWord=generateAbstainWordOfVar(text,'process');

    

    let processSyntax=new RegExp("^[A-Za-z$_][A-Za-z$_0-9]*(([ ]*=[ ]*)([0-9]+|['][^\'\"]+[']|[\"][^\'\"]+[\"]"+abstainWord+")([\+\\-\*\/][0-9]+|[+][ ]*(['][^\'\"]+[']|[\"].+[\"]"+abstainWord+"))*)?$");
    return processSyntax.test(text);


}
function decisionChecker(text){
    console.log(listOfVar);
      let openBacket=0,closeBacket=0;
      let abstainWord=generateAbstainWordOfVar(text,'decision');
       
      try{      
  
        openBacket=text.match(/\(/gm).length;
        closeBacket=text.match(/\)/gm).length;

      }catch(e){} 
   
      console.log(abstainWord);
      let result = false;
      const decisionSyntax=new RegExp("^(([0-9(]+|['][a-zA-Z0-9()]+[']|[\"][a-zA-Z0-9(]+[\"]"+abstainWord+")(>|<|>=|<=|==|===|!=|!==)(([0-9()]+|['][a-zA-Z0-9()]+[']|[\"][a-zA-Z0-9()]+[\"]"+abstainWord+"))+)(((\&\&)|(\\|\\|))(([0-9()]+|['][a-zA-Z0-9()]+[']|[\"][a-zA-Z0-9()]+[\"]"+abstainWord+")(>|<|>=|<=|==|===|!=|!==)(([a-zA-Z0-9()]+|['][a-zA-Z0-9()]+[']|[\"][a-zA-Z0-9()]+[\"]"+abstainWord+"))+))*$");
      console.log(decisionSyntax);
      if(decisionSyntax.test(text)&&openBacket==closeBacket&&!/(\)[a-z0-9\>\<\=\!]*\()/.test(text)){
        

          result=true;
      }
 
    return result ;

}
function generateAbstainWordOfVar(text,type){
    let allWord=[],wordIsString=[],wordIsVariable=[],abstainWord="";
    try{
        if(type=="process"){
            let temp=text.match(/(?<=\=).*/)[0];
           
            allWord=temp.match(/[^\+\-\*\/]*|'.*'|".*"/gm).filter(s=>s.length>0);
            if(temp.match(/'.*'|".*"/gm)){
                wordIsString=temp.match(/'.*'|".*"/gm).filter(s=>s.length>0);
        
            }
            
            wordIsVariable= allWord.filter(s=>!wordIsString.includes(s)&&listOfVar.includes(s));
            wordIsVariable.map(s=>abstainWord+='|'+s);
       


         
    
        }else{
            allWord=text.match(/[a-zA-Z0-9]*/gm).filter(s=>s.length>0);
            // console.log(allWord);
            
            if(text.match(/'.*'|".*"/gm)){
                wordIsString=text.match(/'.*'|".*"/gm).filter(s=>s.length>0).map(s=>s.replace(/[\'\"]/gm,""));
        
            }
            // console.log(wordIsString);
            wordIsVariable= allWord.filter(s=>!wordIsString.includes(s)&&listOfVar.includes(s));
            wordIsVariable.map(s=>abstainWord+='|['+s+'()]+');

        }


    }catch(e){
        console.log(e);
    }finally{
        return abstainWord;

    }
   
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
function listVariable(t){
     let listVar;
   
     $(".process").each(function(){ 
        
         let text= $(this).find(".text").text(); 
      
        const syntax=/([A-Za-z$_][A-Za-z$_0-9]*(?=\=)|(?<=,)[A-Za-z$_][A-Za-z$_0-9]*)/gm;
        
        while((listVar=syntax.exec(text) )!== null){
            listOfVar.push(listVar[0]);
   
            
        }
     
        listOfVar=[...new Set(listOfVar)];
     }); 
    //  console.log(listOfVar);

    
}
// function findVariable(str){
//     let regex=/[A-Za-z$_][A-Za-z$_0-9]*/;
//     let array=
//     while(())
// }
