//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*ChangerUnités
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        Ce script permet de changer rapidement les unités de règle et d'épaisseur de contour et, en option, celle du corps
        de texte dans les préférences d'Illustrator ainsi que l'unité de règle du document en cours.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Utilisation :
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
1.  Ouvrez votre document illustrator.
2.  Exécutez le script, Fichier → Scripts → ChangerUnités.jsx.
3.  La boîte de dialogue qui s'ouvre permet de sélectionner l'unité à utiliser.
4. Elle est alors automatiquement changée dans les préférences d'illustrator en qui concerne les unités générales
    et de contours.
5. la boîte de dialogue concernant les unités générales du document en cours s'ouvre alors pour vous permettre
    de les changer aussi. (car cela ne peut pas être effectué automatiquement).
    
Au total, cela va plus vite et assure une cohérence entre les préférence du logiciel et du document en cours.
*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Boîte de dialogue    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var dialog = new Window("dialog"); 
    dialog.text = "Changer unité"; 
    dialog.orientation = "column"; 
    dialog.alignChildren = ["left","top"]; 
    dialog.spacing = 10; 
    dialog.margins = 16; 
//// Groupe_Unités
var grpUnit = dialog.add("group", undefined); 
    grpUnit.orientation = "row"; 
    grpUnit.alignChildren = ["left","center"]; 
    grpUnit.margins = 0; 
var statictext1 = grpUnit.add("statictext", undefined, "Unité"); 
var listeUnites = grpUnit.add("dropdownlist", undefined, ["mm","points","pouces","pixels"]); 
    listeUnites.selection = 0;
    monUnite = 1;
    maRegle= "RulersUnits.Millimeters"
    listeUnites.onChange = function() {
        switch (listeUnites.selection.text) {
            case "mm" :
                monUnite = 3;
                return(monUnite);
                break;
            case "points" :
                monUnite = 2;
                return(monUnite);
                break;
            case "pouces" :
                monUnite = 0;
                return(monUnite);
                break;
            case "pixels" :
                monUnite = 6;
                return(monUnite);
                break;
        };
    };
//// Appliquer_au_texte ?
var ckbTexte = dialog.add("checkBox", undefined, "Y compris textes ?");
        ckbTexte.value = false;
//// Groupe_Boutons
var grpBoutons = dialog.add("group", undefined); 
    grpBoutons.orientation = "row"; 
    grpBoutons.alignChildren = ["left","center"]; 
    grpBoutons.margins = 0; 

var btnOk = grpBoutons.add("button", undefined, "Ok"); 
    btnOk.onActivate = function() {
        app.preferences.setIntegerPreference("rulerType",monUnite);
        app.preferences.setIntegerPreference("strokeUnits",monUnite);
        if(ckbTexte.value){
                app.preferences.setIntegerPreference("text/units",monUnite);
        } else {
                app.preferences.setIntegerPreference("text/units",2);
        };
        lancerAction = false;
        };
var btnAnnuler = grpBoutons.add("button", undefined,  "Annuler", {name: "cancel"});
        btnAnnuler.onClick = function() {lancerAction = false;
                                                            dialog.close()};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
dialog.show();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   Création, lancement, suppression script d'action pour accéder au format du document   //////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if (lancerAction){
var set = 'Unites', // ensemble
    action = 'changerUnites', // nom action
    actionStr = ['/version 3',
        '/name [ ' + set.length,
        ascii2Hex(set),
        ']',
        '/isOpen 0',
        '/actionCount 1',
        '/action-1 {',
        '/name [ ' + action.length,
        ascii2Hex(action),
        ']',
	'/keyIndex 0',
	'/colorIndex 0',
	'/isOpen 0',
	'/eventCount 1',
	'/event-1 {',
		'/useRulersIn1stQuadrant 0',
		'/internalName (adobe_commandManager)',
		'/localizedName [ 32',
			'416363c3a964657220c3a020756e6520636f6d6d616e6465206465206d656e75',
		']',
		'/isOpen 0',
		'/isOn 1',
		'/hasDialog 0',
		'/parameterCount 3',
		'/parameter-1 {',
			'/key 1769238125',
			'/showInPalette -1',
			'/type (ustring)',
			'/value [ 8',
				'646f63756d656e74',
			']',
		'}',
		'/parameter-2 {',
			'/key 1818455661',
			'/showInPalette -1',
			'/type (ustring)',
			'/value [ 18',
				'466f726d617420646520646f63756d656e74',
			']',
		'}',
		'/parameter-3 {',
			'/key 1668114788',
			'/showInPalette -1',
			'/type (integer)',
			'/value 84',
		'}',
	'}',
'}'].join('\n');
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
createAction(actionStr, set);
app.doScript(action, set);
app.unloadAction(set,'');
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createAction (str, act) {
    var f = new File('~/' + act+ '.aia');  
    f.open('w');
    f.write(str);
    f.close();
    app.loadAction(f);
    f.remove();
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function  ascii2Hex (hex) {
    return hex.replace(/./g, function (a) {return a.charCodeAt(0).toString(16)})
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function GBK2Hex (str) {
    var f = File('hex.txt'), hex;
    f.encoding = 'UTF8';
    f.open('w'), f.write(str), f.close();
    f.encoding = 'BINARY';
    f.open('r');
    hex = f.read().toSource().replace(/(?:\(new String\("|"\)\)|\\u00)/g, '');
    f.close(), f.remove();
    return hex
};
