//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*ChangerUnites
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        Quickly change ruler units, stroke units and in option, body of text units in Illustrator prefs and active document
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Utilisation :
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
1. Open your illustrator document.
2. Run the script, File → Scripts → ChangeUnits.jsx.
3. The dialog box that opens allows you to select the unit to use.
4. It is then automatically changed in Illustrator's preferences regarding general units
     and outlines.
5. the dialog box concerning the general units of the current document then opens to allow you
     change them too. (because this cannot be done automatically).
    
All in all, it goes faster and ensures consistency between the preferences of the software and the current document.
*/
#targetengine 'main'
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Dialog Box    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$.localize = true;
$.locale = null;
if($.locale.substr(0,2) != "fr"){$.locale = "en"};
var dialog = new Window('dialog', {en:"Change units", fr:"Changer unit\351s"}); 
    dialog.orientation = "column"; 
    dialog.alignChildren = ["left","top"]; 
    dialog.spacing = 10; 
    dialog.margins = 16; 
//// Units_Group
var grpUnit = dialog.add("group", undefined); 
    grpUnit.orientation = "row"; 
    grpUnit.alignChildren = ["left","center"]; 
    grpUnit.margins = 0; 
var statictext1 = grpUnit.add("statictext", undefined, {en:"Unit", fr:"Unit\351"}); 
var localiseUnit = {en:"inches", fr:"pouces"};
var listeUnites = grpUnit.add("dropdownlist", undefined, ["mm", "points", localiseUnit, "pixels"]); 
    listeUnites.selection = 0;
    monUnite = 1;
    maRegle= "RulersUnits.Millimeters"
    listeUnites.onChange = function() {
        switch (listeUnites.selection.index) {
            case 0 :
                monUnite = 3;
                return(monUnite);
                break;
            case 1 :
                monUnite = 2;
                return(monUnite);
                break;
            case 2 :
                monUnite = 0;
                return(monUnite);
                break;
            case 3 :
                monUnite = 6;
                return(monUnite);
                break;
        };
    };
//// Apply to text ?
var ckbTexte = dialog.add("checkBox", undefined, {en:"Including text ?", fr:"Y compris textes ?"});
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
        lancerAction = true;
        };
var btnAnnuler = grpBoutons.add("button", undefined,  {en:"Cancel", fr:"Annuler"}, {name:"cancel"}); 
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
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
createAction(actionStr, set);
app.doScript(action, set);
app.unloadAction(set,'');
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
