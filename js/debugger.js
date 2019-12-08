

function Debugger(node,text,result){

        if($(node).hasClass("decision")){
            let reg = /((\')?([A-Za-z$_][A-Za-z$_0-9]*)(\')?|(\")?([A-Za-z$_][A-Za-z$_0-9]*)(\")?)/gm;
            let str=text.match(reg);
            try{
                let res=str.filter(s=>listOfVar.includes(s));
                res =[...new Set(res)];
                res.map(s=>{
                    let reg2=new RegExp(s,'gm');
                
                    text= text.replace(reg2,s+'('+eval(s)+')');
                });
            }catch(e){}
            text=text.replace(/(&&)/gm,'<br>$1<br>')
             text=text.replace(/(\|\|)/gm,'<br>$1<br>')

           
            show(node,text,result);
        }else{

            let temp = text.split('=');
            show(node,temp[0],result);
        }
    /* } */
  
}

function show(node,variable,result){
    // console.log(variable);
    let row=undefined;
    let type =getNodeType(node);
    if($("#debugger").find("tr").prop("id")==variable){
        let td = "<td>"+type+"</td> <td>" + variable + "</td>    <td>" + result + "</td>";
        $("#"+variable.trim()).html(td);
        
        
    }else{
            row= "<tr id=debug-"+$(node).prop("id")+" data-node=#"+$(node).prop("id")+">\
            <td>"+type+"</td> <td>"+variable+"</td>    <td>"+result+"</td>\
            </tr>";
        

        $("#debugger").append(row);
      
    }
    $("#con-debugger").scrollTop($("#con-debugger").prop('scrollHeight'));
    // console.log();
   
}