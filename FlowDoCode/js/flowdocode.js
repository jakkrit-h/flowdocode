

$(document).on("click","button",function(){
    var text= "";
    var row=1;
    $("#content").find(".shape").each(function(){
        
       text+= row+". &emsp;&emsp;"+$(this).text()+"<br>";
       row++;
    });
    $("#console").html(text);
 
});