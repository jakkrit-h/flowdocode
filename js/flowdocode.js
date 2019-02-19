function updateSvgPathProcess(){
    // <path d="M 0 0 L 100 0 L 100 50 L 0 50 Z"/>
    let path=$("#con").find("path");      
    let width=$("#con").outerWidth();
    let d= "M 0 0 L "+width+" 0 L "+width+" 50 L 0 50 Z";
    $(path).attr("d",d);
     updateTextbox();
}
function updateSvgPathStartEnd(){
// <path d="M 25 0 C -5,0 -5,50 25,50 L 75 50 C 105,50 105,0 75,0 Z"/>

let path=$("#con").find("path");      
        let width=$("#con").outerWidth();
        let d= "M 25 0 C -5,0 -5,50 25,50 L "+width*95/100+" 50 C "+(width+3)+",50 "+(width+3)+",0 "+(width*95/100)+",0 Z";
        $(path).attr("d",d);
        updateTextbox();

}
function updateSvgPathManualInput(){
    //         <path d="M 0 10 L 100 0 L 100 50 L 0 50 Z"/>


    let path=$("#con").find("path");      
          
    let width=$("#con").outerWidth();
    
            

            let d= "M 0 10 L "+ width+" 0 L "+width+" 50 L 0 50 Z";
            $(path).attr("d",d);
            updateTextbox();
}
function updateSvgPathDecision(){
    //    <path d="M 50 0 L 100 25 L 50 50 L 0 25 Z "/>
    let path=$("#con").find("path");      
            let ratio={
                width:$("#con").outerWidth(),
                height:$("#con").outerHeight(),
                hw:$("#con").outerWidth()/2,
                hH:$("#con").outerHeight()/2

            }
          
            let d= "M "+ratio.hw+" 0 L "+ratio.width+" "+ratio.hH+" L "+ratio.hw+" "+ratio.height+
            " L 0 "+ratio.hH+" Z ";
            $(path).attr("d",d);
            updateTextbox();     
   
}
function updateSvgPathDisplay(){
    // <path d="M 0 25 L 15 50 H 80 C 105 50 ,105 0, 80 0 H 15 L 0,25  "/>

    let path=$("#con").find("path");
    
    let originalWidth=$("#con").outerWidth();
    
    

    if(originalWidth>200){
        let width=originalWidth*93/100;
         d= "M 0 25 L 15 50 H "+width+" C "+(originalWidth+5)+" 50 ,"+(originalWidth+5)+" 0, "+width+" 0 H 15 L 0,25";
    }else{
        let width=originalWidth*80/100;
         d= "M 0 25 L 15 50 H "+width+" C "+(originalWidth+5)+" 50 ,"+(originalWidth+5)+" 0, "+width+" 0 H 15 L 0,25";
    }
    $(path).attr("d",d);
    console.log(path.attr("d"));
}
function updateTextboxPosition(parent){
    let position=$(parent).offset();
    let textbox=$(parent).find(".text").outerHeight(); 
     p={
        top:position.top+(($(parent).outerHeight()/2)-(textbox/2)),
        left:position.left+($(parent).outerWidth()*15/100)
    }   
    $(parent).find(".text").offset(p);

}
