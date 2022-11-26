//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Conversion
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      This script is reduced to a dialog box allowing to enter a value in a chosen unit and to obtain in return its conversion
      in another unit.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
#targetengine main
valeurSortie = 0
defaire = false;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Dialog box   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var boiteDial = new Window("dialog","Conversion"); 
        boiteDial.alignChildren = ["center","top"]; 
//// Value_Panel
    var panValeur = boiteDial.add("panel", [0,10,235,70], "value to convert");  
        panValeur.orientation = "row"; 
        panValeur.margins = 10; 
    var ettValEntree = panValeur.add("edittext",[10,15,130,38],0); 
        ettValEntree.onChange = function() {lancerConversion(ettValEntree.text,uniteEntree.selection.text,uniteSortie.selection.text,ettDec.text);
                                                                ettValSortie.text = valeurSortie;};
    var uniteEntree = panValeur.add("dropdownlist", [140,15,220,38], ["mm","points","inches"]); 
        uniteEntree.selection = 0; 
        uniteEntree.onChange = function() {lancerConversion(ettValEntree.text,uniteEntree.selection.text,uniteSortie.selection.text,ettDec.text);
                                                                ettValSortie.text = valeurSortie;};
//// Decimals_Panel
    var panDec = boiteDial.add("panel", [0,75,235,120], undefined); 
        panDec.margins = 10; 
    var sttDec= panDec.add("statictext", [10,5,87,33], "Decimals :");
    var ettDec = panDec.add("edittext",[90,5,120,33],2); 
        ettDec.onChange = function() {lancerConversion(ettValEntree.text,uniteEntree.selection.text,uniteSortie.selection.text,ettDec.text);
                                                                ettValSortie.text = valeurSortie;};
//// Result_Panel
    var panResultat = boiteDial.add("panel", [0,105,235,165],"Result"); 
        panResultat.text = "Résultat"; 
        panResultat.orientation = "row"; 
    var uniteSortie = panResultat.add("dropdownlist", [10,15,90,38], ["mm","points","inches"]); 
        uniteSortie.selection = 0; 
        uniteSortie.onChange = function() {lancerConversion(ettValEntree.text,uniteEntree.selection.text,uniteSortie.selection.text,ettDec.text);
                                                                ettValSortie.text = valeurSortie;};
    var ettValSortie = panResultat.add("edittext",[100,15,220,38],0); 
    var ok = boiteDial.add("button", undefined, "Ok"); 
    boiteDial.show();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Conversion   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function lancerConversion(valeurEntree,uniteEntree,uniteSortie,dec) {
    switch (uniteEntree) {
            case "mm" :
                    switch (uniteSortie) {
                             case "mm" :
                                valeurSortie=parseFloat(valeurEntree).toFixed(dec);
                                return (valeurSortie);
                                break;
                            case  "points" : 
                                valeurSortie=(parseFloat(valeurEntree*2.834645)).toFixed(dec);
                                return (valeurSortie);
                                break;
                            case  "inches" :
                                valeurSortie=(parseFloat(valeurEntree/25.4)).toFixed(dec);
                                return (valeurSortie);
                                break;
                    };
            case "points" :
                    switch (uniteSortie) {
                             case "mm" :
                                valeurSortie=(parseFloat(valeurEntree/2.834645)).toFixed(dec);
                                return (valeurSortie);
                                break;
                            case  "points" : 
                                valeurSortie=parseFloat(valeurEntree).toFixed(dec);
                                return (valeurSortie);
                                break;
                            case  "inches" :
                                valeurSortie=(parseFloat(valeurEntree*72)).toFixed(dec);
                                return (valeurSortie);
                                break;
                    };
            case "inches" :
                    switch (uniteSortie) {
                             case "mm" :
                                valeurSortie=(parseFloat(valeurEntree*25.4)).toFixed(dec);
                                return (valeurSortie);
                                break;
                            case  "points" : 
                                valeurSortie=(parseFloat(valeurEntree*72)).toFixed(dec);
                                return (valeurSortie);
                                break;
                            case  "inches" :
                                valeurSortie=parseFloat(valeurEntree).toFixed(dec);
                                return (valeurSortie);
                                break;
                    };
            };  
};