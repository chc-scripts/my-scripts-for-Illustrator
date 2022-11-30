////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Caracteres_Speciaux
>=-----------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=-----------------------------------------------------------------------------------------------------------------------------

Affiche une palette flottante qui permet, lors de la saisie de texte dans Illustrator, d’accéder
facilement à des caractères spéciaux fréquemment utilisés en français mais qui ne sont
pas directement accessibles, comme, par exemple, certaines majuscules accentuées.
Lorsque l’on est dans une zone de texte, il suffit de cliquer sur l’un des boutons pour que
le caractère correspondant apparaisse à l’endroit du curseur.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
#targetengine main
// Déclaration de variables pour le document actif
monFichier = app.activeDocument;
maSelection = monFichier.selection;
var monCar;
function btExecution($script) {
	var btalk=new BridgeTalk();
	btalk.target = "illustrator";
	btalk.body = $script;
	return btalk.send();
};
if (maSelection.typename != 'TextRange') {
    alert("Le curseur doit \352tre plac\351 dans une zone de texte, à l\'endroit o\371 vous souhaitez ins\351rer un caract\350re");
    } else if (maSelection.length !=0) {
        alert("Le curseur doit \352tre plac\351 dans une zone de texte, à l\'endroit o\371 vous souhaitez ins\351rer un caract\350re");
        } else {
        var idx = maSelection.start
         var chars = maSelection.parent.textRange.characters;
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //    Boîte de boiteDialue    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var boiteDial = new Window("palette","Caractères spéciaux",undefined); 
            boiteDial.preferredSize.width = 48; 
            boiteDial.orientation = "row"; 
            boiteDial.alignChildren = ["center","top"]; 
            boiteDial.spacing = 10; 
            boiteDial.margins = 16;
        // ==Boutons
        var btn_1 = boiteDial.add("button",[0,0,25,25],"\300"); 
            btn_1.onClick = function() {btExecution('monCar = "\300"');
                                                       insererCar(idx);
                                                       btn_1.active=false;};
        var btn_2 = boiteDial.add("button",[0,0,25,25],"\311"); 
            btn_2.onClick = function() {btExecution('monCar = "\311"');
                                                       insererCar(idx);
                                                       btn_2.active=false;};
        var btn_3 = boiteDial.add("button",[0,0,25,25],"\310"); 
            btn_3.onClick = function() {btExecution('monCar = "\310"')
                                                       insererCar(idx)
                                                       btn_3.active=false;};
        var btn_4 = boiteDial.add("button",[0,0,25,25],"\331"); 
            btn_4.onClick = function() {btExecution('monCar = "\331"')
                                                       insererCar(idx)
                                                       btn_3.active=false;};
        var btn_5 = boiteDial.add("button",[0,0,25,25],"\307"); 
            btn_5.onClick = function() {btExecution('monCar = "\307"');
                                                       insererCar(idx);
                                                       btn_5.active=false;};
        var btn_6 = boiteDial.add("button",[0,0,25,25],"\306"); 
            btn_6.onClick = function() {btExecution('monCar = "\306"');
                                                       insererCar(idx);
                                                       btn_6.active=false;};
        var btn_7 = boiteDial.add("button",[0,0,25,25],"\u0152"); 
            //btn_7.graphics.font = "Tahoma-Bold:18";
            btn_7.onClick = function() {btExecution('monCar = "\u0152"');
                                                       insererCar(idx);
                                                       btn_7.active=false;};
        var btn_8 = boiteDial.add("button",[0,0,25,25],"\346"); 
            btn_8.onClick = function() {btExecution('monCar = "\346"');
                                                       btn_8.active=false;};
        var btn_9 = boiteDial.add("button",[0,0,25,25],"\u0153"); 
            btn_9.onClick = function() {btExecution('monCar = "\u0153"');
                                                       insererCar(idx);
                                                       btn_9.active=false;};
        var btn_10 = boiteDial.add("button",[0,0,25,25],"\330"); 
            btn_10.onClick = function() {btExecution('monCar = "\330"');
                                                       insererCar(idx);
                                                       btn_10.active=false;};
for (f = 1;f<11;f++){("btn_" + f).font = "Tahoma-Bold:18";};
boiteDial.show();
boiteDial.f
};
function insererCar($ype) { 
btExecution('maSelection = app.activeDocument.selection');
btExecution('maSelection.contents = monCar');
};