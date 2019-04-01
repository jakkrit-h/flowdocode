

function Debugger(text,result){
    text = text.split(",");
    if(text.length == 1 ){
        let temp = text[0].split('=');
        show(temp[0],result);
    }

}
function checkHasVariable(vari){
    
}
function show(vari,result){
    let row=undefined;
    
    if($("#debugger").find("tr").prop("id")==vari){
        let td = "<td>" + vari + "</td>    <td>" + result + "</td>";
        console.log(this);
        
    }else{
        row= "<tr id='"+vari+"'>\
        <td>"+vari+"</td>    <td>"+result+"</td>\
        </tr>";
        $("#debugger").append(row);
    }

   
}