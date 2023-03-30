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
#targetengine 'main'
valeurSortie = 0
defaire = false;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Dialog box   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $.localize = true;
    $.locale = null;
    if($.locale.substr(0,2) != "fr"){$.locale = "en"};
    var boiteDial = new Window("dialog","Conversion"); 
        boiteDial.alignChildren = ["center","top"]; 
//// Value_Panel
    var panValeur = boiteDial.add("panel", [0,10,235,70], {en:"value to convert", fr:"Valeur \340 convertir"});  
        panValeur.orientation = "row"; 
        panValeur.margins = 10; 
    var ettValEntree = panValeur.add("edittext",[10,15,130,38],0); 
        ettValEntree.onChange = function() {lancerConversion(ettValEntree.text,uniteEntree.selection.index,uniteSortie.selection.index,ettDec.text);
                                                                ettValSortie.text = valeurSortie;};
    var localiseUnitEntree2 = {en:"inche\(s\)", fr:"pouce\(s\)"};
    var uniteEntree = panValeur.add("dropdownlist", [140,15,220,38], ["mm", "point\(s\)", localiseUnitEntree2]); 
        uniteEntree.selection = 0; 
        uniteEntree.onChange = function() {lancerConversion(ettValEntree.text,uniteEntree.selection.index,uniteSortie.selection.index,ettDec.text);
                                                                ettValSortie.text = valeurSortie;};
//// Decimals_Panel
    var panDec = boiteDial.add("panel", [0,75,235,120], undefined); 
        panDec.margins = 10; 
    var sttDec= panDec.add("statictext", [10,5,87,33], {en:"Decimals :", fr:"D\351cimales"});
    var ettDec = panDec.add("edittext",[90,5,120,33],2); 
        ettDec.onChange = function() {lancerConversion(ettValEntree.text,uniteEntree.selection.index,uniteSortie.selection.index,ettDec.text);
                                                                ettValSortie.text = valeurSortie;};
//// Result_Panel
    var panResultat = boiteDial.add("panel", [0,105,235,165], {en:"Result", fr:"R\351sultat"}); 
        panResultat.orientation = "row";
    var localiseUnitSortie2 = {en:"inche\(s\)", fr:"pouce\(s\)"};
    var uniteSortie = panResultat.add("dropdownlist", [10,15,90,38], ["mm", "point\(s\)", localiseUnitSortie2]); 
        uniteSortie.selection = 0; 
        uniteSortie.onChange = function() {lancerConversion(ettValEntree.text,uniteEntree.selection.index,uniteSortie.selection.index,ettDec.text);
                                                                ettValSortie.text = valeurSortie;};
    var ettValSortie = panResultat.add("edittext",[100,15,220,38],0); 
    var ok = boiteDial.add("button", undefined, "Ok"); 
    boiteDial.show();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Conversion   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function lancerConversion(valeurEntree,uniteEntree,uniteSortie,dec) {
    switch (uniteEntree) {
            case 0 :
                    switch (uniteSortie) {
                             case 0 :
                                valeurSortie=parseFloat(valeurEntree).toFixed(dec);
                                return (valeurSortie);
                                break;
                            case  1 : 
                                valeurSortie=(parseFloat(valeurEntree*2.834645)).toFixed(dec);
                                return (valeurSortie);
                                break;
                            case 2 :
                                valeurSortie=(parseFloat(valeurEntree/25.4)).toFixed(dec);
                                return (valeurSortie);
                                break;
                    };
            case 1 :
                    switch (uniteSortie) {
                             case 0 :
                                valeurSortie=(parseFloat(valeurEntree/2.834645)).toFixed(dec);
                                return (valeurSortie);
                                break;
                            case  1 : 
                                valeurSortie=parseFloat(valeurEntree).toFixed(dec);
                                return (valeurSortie);
                                break;
                            case  2 :
                                valeurSortie=(parseFloat(valeurEntree*72)).toFixed(dec);
                                return (valeurSortie);
                                break;
                    };
            case 2 :
                    switch (uniteSortie) {
                             case 0 :
                                valeurSortie=(parseFloat(valeurEntree*25.4)).toFixed(dec);
                                return (valeurSortie);
                                break;
                            case  1 : 
                                valeurSortie=(parseFloat(valeurEntree*72)).toFixed(dec);
                                return (valeurSortie);
                                break;
                            case  2 :
                                valeurSortie=parseFloat(valeurEntree).toFixed(dec);
                                return (valeurSortie);
                                break;
                    };
            };  
};