//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Conversion
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      Ce script se réduit à une boite de Dialogue permettant de saisir une valeur dans une unité donnée et d'obtenir en
      retour sa conversion dans une autre unité.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
#targetengine main
valeurSortie = 0
defaire = false;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Boîte de Dialogue    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var boiteDial = new Window("dialog","Conversion"); 
        boiteDial.alignChildren = ["center","top"]; 
//// Panneau_Valeur
    var panValeur = boiteDial.add("panel", [0,10,235,70], "valeur à convertir");  
        panValeur.orientation = "row"; 
        panValeur.margins = 10; 
    var ettValEntree = panValeur.add("edittext",[10,15,130,38],0); 
        ettValEntree.onChange = function() {lancerConversion(ettValEntree.text,uniteEntree.selection.text,uniteSortie.selection.text,ettDec.text);
                                                                ettValSortie.text = valeurSortie;};
    var uniteEntree = panValeur.add("dropdownlist", [140,15,220,38], ["mm","points","pouces"]); 
        uniteEntree.selection = 0; 
        uniteEntree.onChange = function() {lancerConversion(ettValEntree.text,uniteEntree.selection.text,uniteSortie.selection.text,ettDec.text);
                                                                ettValSortie.text = valeurSortie;};
//// Panneau_Décimales
    var panDec = boiteDial.add("panel", [0,75,235,120], undefined); 
        panDec.margins = 10; 
    var sttDec= panDec.add("statictext", [10,5,87,33], "D\351cimales :");
    var ettDec = panDec.add("edittext",[90,5,120,33],2); 
        ettDec.onChange = function() {lancerConversion(ettValEntree.text,uniteEntree.selection.text,uniteSortie.selection.text,ettDec.text);
                                                                ettValSortie.text = valeurSortie;};
//// Panneau_Résultat
    var panResultat = boiteDial.add("panel", [0,105,235,165],"Résultat"); 
        panResultat.text = "Résultat"; 
        panResultat.orientation = "row"; 
    var uniteSortie = panResultat.add("dropdownlist", [10,15,90,38], ["mm","points","pouces"]); 
        uniteSortie.selection = 0; 
        uniteSortie.onChange = function() {lancerConversion(ettValEntree.text,uniteEntree.selection.text,uniteSortie.selection.text,ettDec.text);
                                                                ettValSortie.text = valeurSortie;};
    var ettValSortie = panResultat.add("edittext",[100,15,220,38],0); 
    var ok = boiteDial.add("button", undefined, "Ok"); 
    boiteDial.show();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Conversion   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
                            case  "pouces" :
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
                            case  "pouces" :
                                valeurSortie=(parseFloat(valeurEntree*72)).toFixed(dec);
                                return (valeurSortie);
                                break;
                    };
            case "pouces" :
                    switch (uniteSortie) {
                             case "mm" :
                                valeurSortie=(parseFloat(valeurEntree*25.4)).toFixed(dec);
                                return (valeurSortie);
                                break;
                            case  "points" : 
                                valeurSortie=(parseFloat(valeurEntree*72)).toFixed(dec);
                                return (valeurSortie);
                                break;
                            case  "pouces" :
                                valeurSortie=parseFloat(valeurEntree).toFixed(dec);
                                return (valeurSortie);
                                break;
                    };
            };  
};