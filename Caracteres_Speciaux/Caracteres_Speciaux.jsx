////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Caracteres_Speciaux
>=-----------------------------------------------------------------------------------------------------------------------------
Auteur : Christian Condamine (condaminech@noos.fr)
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
var btn_1 = boiteDial.add("button"); 
    btn_1.text = "\300"; 
    btn_1.preferredSize.width = 25;
    btn_1.preferredSize.height = 25;
    btn_1.graphics.font = "Tahoma-Bold:18";
    btn_1.onClick = function() {btExecution('monCar = "\300"')
                                               insererCar()}
var btn_2 = boiteDial.add("button"); 
    btn_2.text = "\311"; 
    btn_2.preferredSize.width = 25; 
    btn_2.preferredSize.height = 25;
    btn_2.graphics.font = "Tahoma-Bold:18";
    btn_2.onClick = function() {btExecution('monCar = "\311"')
                                               insererCar()}
var btn_3 = boiteDial.add("button"); 
    btn_3.text = "\310"; 
    btn_3.preferredSize.width = 25; 
    btn_3.preferredSize.height = 25;
    btn_3.graphics.font = "Tahoma-Bold:18";
    btn_3.onClick = function() {btExecution('monCar = "\310"')
                                               insererCar()}  
var btn_4 = boiteDial.add("button"); 
    btn_4.text = "\331"; 
    btn_4.preferredSize.width = 25;
    btn_4.preferredSize.height = 25;
    btn_4.graphics.font = "Tahoma-Bold:18";
    btn_4.onClick = function() {btExecution('monCar = "\331"')
                                               insererCar()}  
var btn_5 = boiteDial.add("button"); 
    btn_5.text = "\307"; 
    btn_5.preferredSize.width = 25;
    btn_5.preferredSize.height = 25;
    btn_5.graphics.font = "Tahoma-Bold:18";
    btn_5.onClick = function() {btExecution('monCar = "\307"')
                                               insererCar()}  
var btn_6 = boiteDial.add("button"); 
    btn_6.text = "\330"; 
    btn_6.preferredSize.width = 25;
    btn_6.preferredSize.height = 25;
    btn_6.graphics.font = "Tahoma-Bold:18";
    btn_6.onClick = function() {btExecution('monCar = "\330"')
                                               insererCar()}  
var btn_7 = boiteDial.add("button"); 
    btn_7.text = "\306"; 
    btn_7.preferredSize.width = 25; 
    btn_7.preferredSize.height = 25;
    btn_7.graphics.font = "Tahoma-Bold:18";
    btn_7.onClick = function() {btExecution('monCar = "\306"')
                                               insererCar()}  
var btn_8 = boiteDial.add("button"); 
    btn_8.text = "\u0152"; 
    btn_8.preferredSize.width = 25;
    btn_8.preferredSize.height = 25;
    btn_8.graphics.font = "Tahoma-Bold:18";
    btn_8.onClick = function() {btExecution('monCar = "\u0152"')
                                               insererCar()}  
var btn_9 = boiteDial.add("button"); 
    btn_9.text = "\346"; 
    btn_9.preferredSize.width = 25; 
    btn_9.preferredSize.height = 25;
    btn_9.graphics.font = "Tahoma-Bold:18";
    btn_9.onClick = function() {btExecution('monCar = "\346"')
                                               insererCar()}  
var btn_10 = boiteDial.add("button"); 
    btn_10.text = "\u0153"; 
    btn_10.preferredSize.width = 25; 
    btn_10.preferredSize.height = 25;
    btn_10.graphics.font = "Tahoma-Bold:18";
    btn_10.onClick = function() {btExecution('monCar = "\u0153"')
                                               insererCar()}  
boiteDial.show();

function insererCar($ype) { 
btExecution('maSelection = app.activeDocument.selection');
btExecution('maSelection.contents = monCar');
};