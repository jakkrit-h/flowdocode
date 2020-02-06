

function Debugger(FDCVL_node,FDCVL_text,FDCVL_result){

        if($(FDCVL_node).hasClass("decision")){
            let FDCVL_reg = /((\')?([A-Za-z$_][A-Za-z$_0-9]*)(\')?|(\")?([A-Za-z$_][A-Za-z$_0-9]*)(\")?)/gm;
            let FDCVL_str=FDCVL_text.match(FDCVL_reg);
            try{
                let FDCVL_res=FDCVL_str.filter(FDCVL_s=>FDCV_listOfVar.includes(FDCVL_s));
                FDCVL_res =[...new Set(FDCVL_res)];

                FDCVL_res.map(FDCVL_s=>{
                  
                    let FDCVL_reg2=new RegExp(FDCVL_s,'gm');
                    FDCVL_text= FDCVL_text.replace(FDCVL_reg2,FDCVL_s+'(<span class="textHighLight"> '+eval(FDCVL_s)+' </span>)');
                });
            }catch(e){}
            FDCVL_text=FDCVL_text.replace(/(&&)/gm,'<br>$1<br>')
            FDCVL_text=FDCVL_text.replace(/(\|\|)/gm,'<br>$1<br>')

           
            show(FDCVL_node,FDCVL_text,FDCVL_result);
        }else{

            let FDCVL_temp = FDCVL_text.split('=');
            show(FDCVL_node,FDCVL_temp[0],FDCVL_result);
        }
    /* } */
  
}

function show(FDCVL_node,FDCVL_variable,FDCVL_result){
    // console.log(variable);
    let FDCVL_row=undefined;
    let FDCVL_type =getNodeType(FDCVL_node);
    if($("#debugger").find("tr").prop("id")==FDCVL_variable){
        let FDCVL_td = "<td>"+FDCVL_type+"</td> <td>" + FDCVL_variable + "</td>    <td>" + FDCVL_result + "</td>";
        $("#"+FDCVL_variable.trim()).html(FDCVL_td);
        
        
    }else{
        FDCVL_row= "<tr id=debug-"+$(FDCVL_node).prop("id")+" data-node=#"+$(FDCVL_node).prop("id")+">\
            <td>"+FDCVL_type+"</td> <td>"+FDCVL_variable+"</td>    <td>"+FDCVL_result+"</td>\
            </tr>";
        

        $("#debugger").append(FDCVL_row);
      
    }
    $("#con-debugger").scrollTop($("#con-debugger").prop('scrollHeight'));
    // console.log();
   
}