

function Debugger(node,text,result){
    text = text.split(",");
    if(text.length == 1 ){
        if($(node).hasClass("decision")){
            show(node,text,result);
        }else{
            let temp = text[0].split('=');
            show(node,temp[0],result);
        }
        
    }
  
}

function show(node,variable,result){
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

   
}