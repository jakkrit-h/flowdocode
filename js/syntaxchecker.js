var FDCV_listOfVar=new Array;
const FDCV_inputSyntax=/^[\s]*[A-Za-z$_][A-Za-z$_0-9]*[\s]*$/;

function checkSyntax(){
    let FDCVL_result=true;
      FDCV_listOfVar=[];
    let FDCVL_nodeList=explorer(true).map(FDCVL_s=>$(FDCVL_s.node));
    $(FDCVL_nodeList).each(function(FDCVL_i){
        let FDCVL_text=$(this).find(".text").text();
        let FDCVL_type=getNodeType(this);
        let FDCVL_match=true;
      
        switch(FDCVL_type){
            case "process":
                    listVariable(FDCVL_text);
                    FDCVL_match=processChecker(FDCVL_text);
                 

              
            break;
            case "decision":
                FDCVL_match=decisionChecker(FDCVL_text);
            break;
            case "input":
       
                FDCVL_match=(FDCV_listOfVar.includes(FDCVL_text.replace(/\s/gm,''))&&FDCV_inputSyntax.test(FDCVL_text.replace(/\s/gm,'')))?true:false; 
            break;
            case "display":
                FDCVL_match=   displayChecker(FDCVL_text);
            break;
        }
        if(!FDCVL_match){
            FDCVL_result=false;
            $(this).addClass("invalid");
        }else{
            $(this).removeClass("invalid");
        }
    });
    if(FDCVL_result){
        assignVariable();
    }else{
        $("#console").html('  <div class="alert alert-danger py-0  my-0" role="alert"> ผังงานไม่ถูกต้อง </div>')

    }
    return FDCVL_result;
}
function assignVariable(){
    FDCV_listOfVar.map(FDCVL_s=>{
        let FDCVL_text = FDCVL_s+"=''";
        compiler(FDCVL_text);
    });
}
function structureChecker() {
    let FDCVL_result=true;
    // console.log(nodeList.filter(s=>$(s).attr('id')=='#end'));
    $(".shape").each(function(FDCVL_i){
        let FDCVL_match = true;
      
        if($(this).attr("id")!='end'&&!$(this).hasClass('decision')&&!$(this).attr('data-connector')){
            FDCVL_match=false;
        }else if($(this).attr("id")!='end'&&$(this).hasClass('decision')){
        
            if(!$(this).attr('data-yes')||!$(this).attr('data-no')){
               

                FDCVL_match=false;
            }
        }
        if(!FDCVL_match){
            FDCVL_result=false;
            $(this).addClass("invalid");
        }else{
            $(this).removeClass("invalid");
        }
    });
    if(!FDCVL_result){
        $("#console").html('  <div class="alert alert-danger py-0 my-0" role="alert"> ผังงานไม่ถูกต้อง </div>')

    }
    return FDCVL_result;
}
function processChecker(FDCVL_text){
    FDCVL_text=FDCVL_text.trim();

    let FDCVL_abstainWord=generateAbstainWordOfVar(FDCVL_text,'process');
    let FDCVL_processSyntax=new RegExp("^([A-Za-z$_][A-Za-z$_0-9]*([\\s]*=[\\s]*)([(]*[\\s]*)*(([(]*[\\s]*[)]*)*(\\-)?[0-9]+(\.[0-9]+)?([(]*[\\s]*[)]*)*|['][\\s]*[^\'\"]*[\\s]*[']|[\"][\\s]*[^\'\"]*[\\s]*[\"]"+FDCVL_abstainWord+")([\\s]*[\+\\-\*\/\%][\\s]*(([(]*[\\s]*[)]*)*(\\-)?[0-9]+(\.[0-9]+)?([\\s]*[)]*)*|"+FDCVL_abstainWord+")|[\\s]*[+][\\s]*(([(]*[\\s]*[)]*)*['][\\s]*[^\'\"]*[\\s]*[']([(]*[\\s]*[)]*)*|([(]*[\\s]*[)]*)*[\"][\\s]*[^\'\"]*[\\s]*[\"]([(]*[\\s]*[)]*)*"+FDCVL_abstainWord+"))*)?$");
    let FDCVL_backet = checkCountOfBacket(FDCVL_text);
    let FDCVL_result =false;
 

    if(FDCVL_processSyntax.test(FDCVL_text)&&FDCVL_backet&&!/(\)[a-zA-z0-9]*\()/.test(FDCVL_text)){
        

        FDCVL_result=true;
    }

    return FDCVL_result;

}
function decisionChecker(FDCVL_text){
    FDCVL_text=FDCVL_text.trim();

      let FDCVL_abstainWord=generateAbstainWordOfVar(FDCVL_text,'decision');
       
     
   
      let FDCVL_result = false;
     
      const FDCVL_decisionSyntax=new RegExp("^([\\s]*([(]*[\\s]*(\\-)?[0-9]+(\.[0-9]+)?[\\s]*|['][a-zA-Z0-9()\\s]+[']|[\"][a-zA-Z0-9(\\s]+[\"][\\s]*"+FDCVL_abstainWord+"[\\s]*)[\\s]*(>|<|>=|<=|==|===|!=|!==)[\\s]*[()]*[\\s]*(\-)?[0-9]+(\.[0-9]+)?[\\s]*[()]*[\\s]*|['][a-zA-Z0-9()\\s]+[']|[\"][a-zA-Z0-9()\\s]+[\"][\\s]*"+FDCVL_abstainWord+"[\\s]*)[\\s]*(((\&\&)|(\\|\\|))[\\s]*(([\\s]*[()]*[\\s]*(\-)?[0-9]+(\.[0-9]+)?[\\s]*[()]*[\\s]*|['][a-zA-Z0-9()\\s]+[']|[\"][a-zA-Z0-9()\\s]+[\"][\\s]*"+FDCVL_abstainWord+"[\\s]*)[\\s]*(>|<|>=|<=|==|===|!=|!==)[\\s]*(([\\s]*[()]*[\\s]*(\-)?[0-9]+(\.[0-9]+)?[\\s]*[()]*[\\s]*|[a-zA-Z0-9()\\s]+|['][a-zA-Z0-9()\\s]+[']|[\"][a-zA-Z0-9()\-]+[\"][\\s]*"+FDCVL_abstainWord+"[\\s]*))+)[\\s]*)*$");
    let FDCVL_backet = checkCountOfBacket(FDCVL_text);
      if(FDCVL_decisionSyntax.test(FDCVL_text)&&FDCVL_backet&&!/(\)[a-z0-9\>\<\=\!]*\()/.test(FDCVL_text)){
        

        FDCVL_result=true;
      }
 
    return FDCVL_result ;

}
function displayChecker(FDCVL_text){
    FDCVL_text=FDCVL_text.trim();
    let FDCVL_abstainWord=generateAbstainWordOfVar(FDCVL_text,'display');
    let FDCVL_displaySyntax=new RegExp("^[\\s]*([\'][\\s]*[^\'\"]*[\\s]*[\']|[\"][\\s]*[^\'\"]*[\\s]*[\"]"+FDCVL_abstainWord+")[\\s]*([\\s]*[+][\\s]*([\'][\\s]*[^\'\"]*[\\s]*[\']|[\"][\\s]*[^\'\"]*[\\s]*[\"]"+FDCVL_abstainWord+"))*$");
  

    return FDCVL_displaySyntax.test(FDCVL_text);
}
function checkCountOfBacket(FDCVL_text){
    let FDCVL_openBacket=0,FDCVL_closeBacket=0;
    let FDCVL_result = false;
    try{      
  
        FDCVL_openBacket=FDCVL_text.match(/\(/gm).length;
        FDCVL_closeBacket=FDCVL_text.match(/\)/gm).length;
      }catch(e){
      }finally{
        FDCVL_result =(FDCVL_openBacket==FDCVL_closeBacket)?true:false;

          return FDCVL_result;
      }
}
function generateAbstainWordOfVar(FDCVL_text,FDCVL_type){
    let FDCVL_allWord=[],FDCVL_wordIsString=[],FDCVL_wordIsVariable=[],FDCVL_abstainWord="";
    try{
        if(FDCVL_type=="process"){
            let FDCVL_temp=FDCVL_text.match(/(?<=\=).*/)[0];
           
            FDCVL_allWord=FDCVL_temp.match(/[^\+\-\*\/\(\)%]*|'[^\(\)]*'|"[^\(\)]*"/gm).filter(FDCVL_s=>FDCVL_s.length>0);
            if(FDCVL_temp.match(/'[^\(\)]*'|"[^\(\)]*"/gm)){
                FDCVL_wordIsString=FDCVL_temp.match(/'[^\(\)]*'|"[^\(\)]*"/gm).filter(FDCVL_s=>FDCVL_s.length>0);
        
            }
            FDCVL_wordIsVariable= FDCVL_allWord.filter(FDCVL_s=>!FDCVL_wordIsString.includes(FDCVL_s)&&FDCV_listOfVar.includes(FDCVL_s));
     

            FDCVL_wordIsVariable.map(FDCVL_s=>FDCVL_abstainWord+='|[()]*[\\s]'+FDCVL_s+'[\\s][()]*');
       


         
    
        }else{
            FDCVL_allWord=FDCVL_text.match(/[a-zA-Z0-9]*/gm).filter(FDCVL_s=>FDCVL_s.length>0);
            // console.log(allWord);
            
            if(FDCVL_text.match(/'[^\(\)]*'|"[^\(\)]*"/gm)){
                FDCVL_wordIsString=FDCVL_text.match(/'[^\(\)]*'|"[^\(\)]*"/gm).filter(FDCVL_s=>FDCVL_s.length>0).map(FDCVL_s=>FDCVL_s.replace(/[\'\"]/gm,""));
        
            }
            FDCVL_wordIsVariable= FDCVL_allWord.filter(FDCVL_s=>!FDCVL_wordIsString.includes(FDCVL_s)&&FDCV_listOfVar.includes(FDCVL_s));
            FDCVL_wordIsVariable.map(FDCVL_s=>FDCVL_abstainWord+='|([()]*'+FDCVL_s+'[()]*)');

        }


    }catch(e){
        // console.log(e);
    }finally{
        return FDCVL_abstainWord;

    }
   
}
// function checkIsVar(text){
//     const syntax=/([A-Za-z$_][A-Za-z$_0-9]*(?=,)|(?<=\=)[A-Za-z$_][A-Za-z$_0-9]*)/gm;
    
   
//     let list=new Array;
//     while((listVar=syntax.exec(text) )!== null){
//         list.push(listVar[0]);
//         console.log(listVar[0])
        
//     }
    
//     console.log(list.some(r=>FDCV_listOfVar.indexOf(r) >= 0));
//     return  list.some(r=>FDCV_listOfVar.indexOf(r) >= 0);
// }
function listVariable(FDCVL_text){
     let FDCVL_listVar;
    //  $(".process").each(function(){ 
        
        //  let text= $(this).find(".text").text(); 
      
        const FDCVL_syntax=/([\s]*[A-Za-z$_][A-Za-z$_0-9]*[\s]*(?=\=)|(?<=,)[\s]*[A-Za-z$_][A-Za-z$_0-9]*)[\s]*/gm;
        
        while((FDCVL_listVar=FDCVL_syntax.exec(FDCVL_text) )!== null){
            
            FDCV_listOfVar.push(FDCVL_listVar[0].replace(/\s/gm,''));
   
            
        }
        FDCV_listOfVar=[...new Set(FDCV_listOfVar)];

    //  }); 
    //  console.log(FDCV_listOfVar);

    
}
// function findVariable(str){
//     let regex=/[A-Za-z$_][A-Za-z$_0-9]*/;
//     let array=
//     while(())
// }
