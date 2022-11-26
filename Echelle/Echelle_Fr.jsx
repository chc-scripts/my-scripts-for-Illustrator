//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Echelle
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        Ce script permet :
        - de récupérer le facteur d'échelle entre 2 objets sélectionnés,
        - de sélectionner un ou plusieurs autres objets pour diminuer ou 
            agmenter leur taille suivant le facteur d'échelle précdememnt acquis.
        Fonctionne avec  Illustrator à partir de la version 24
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
#targetengine main
var monFichier = app.activeDocument;
var maSelection = monFichier.selection;
if (maSelection.length != 2) {
    alert( "La s\351lection ne doit comporterque 2 éléments distincts (objets ou groupes) afin de comparer leurs dimensions.");
} else {
var LargeurObj_1 = maSelection[0].geometricBounds[2] - maSelection[0].geometricBounds[0]
var HauteurObj_1 = maSelection[0].geometricBounds[1] - maSelection[0].geometricBounds[3]
var LargeurObj_2 = maSelection[1].geometricBounds[2] - maSelection[1].geometricBounds[0]
var HauteurObj_2 = maSelection[1].geometricBounds[1] - maSelection[1].geometricBounds[3]
var rapport_L1_sur_L2 = (LargeurObj_1 / LargeurObj_2) * 100;
var rapport_L2_sur_L1 = (LargeurObj_2 / LargeurObj_1) * 100;
var rapport_H1_sur_H2 = (HauteurObj_1 / HauteurObj_2) * 100;
var rapport_H2_sur_H1 = (HauteurObj_2 / HauteurObj_1) * 100;
var boiteEchelle = new Window("palette", "Echelle");
var monEchelle;
defaire = false;
dialogueEchelle();
};
function dialogueEchelle() {
//Pallette
boiteEchelle.orientation = "column"; 
boiteEchelle.alignChildren =  ["left","center"]; 
boiteEchelle.spacing = 10; 
boiteEchelle.margins = 16;
        //Groupe supérieur
            var groupSup = boiteEchelle.add("group", undefined); 
                    groupSup.orientation = "row"; 
                    groupSup.alignChildren = ["left","center"];
                    groupSup.spacing = 10;
                    //Groupe Dimensions
                        var groupDimensions = groupSup.add("group", undefined); 
                                groupDimensions.orientation = "column"; 
                                groupDimensions.alignChildren = ["left","center"];
                                groupDimensions.spacing = 5;
                                //Groupe largeur
                                    var groupLarg = groupDimensions.add("group", undefined); 
                                            groupLarg.orientation = "row"; 
                                            groupLarg.alignChildren = ["left","center"];
                                            groupLarg.spacing = 10;
                                            var lblLargeur = groupLarg.add("statictext", undefined, "Largeur");
                                            lblLargeur.characters = 5;
                                            var divider_v0 = groupLarg.add("panel"); 
                                            divider_v0.alignment = "fill"; 
                                            var grpLargObjets = groupLarg.add("group", undefined); 
                                            grpLargObjets.orientation = "column"; 
                                            grpLargObjets.alignChildren = ["left","center"];
                                            grpLargObjets.spacing = 8;
                                                   //Groupe largeur objet_1
                                                    var grpLargObj_1 = grpLargObjets.add("group", undefined); 
                                                    grpLargObj_1.orientation = "row";
                                                    grpLargObj_1.alignChildren = ["left","center"];
                                                    grpLargObj_1.spacing = 10;
                                                    var lblLargObj_1 = grpLargObj_1.add("statictext", undefined, "objet_1"); 
                                                    var txtLargObj_1 = grpLargObj_1.add('edittext');
                                                    txtLargObj_1.characters = 10
                                                    txtLargObj_1.text = (LargeurObj_1/2.834645).toFixed(2);
                                                    var lblUnitLargObj_1 = grpLargObj_1.add("statictext", undefined, "mm"); 
                                                    var divider_v1 = grpLargObj_1.add("panel"); 
                                                    divider_v1.alignment = "fill";
                                             var divider_h0 = grpLargObjets.add("panel"); 
                                             divider_h0.alignment = "fill"; 
                                                   //Groupe largeur objet_2
                                                    var grpLargObj_2 = grpLargObjets.add("group", undefined); 
                                                    grpLargObj_2.orientation = "row"; 
                                                    grpLargObj_2.alignChildren = ["left","center"];
                                                    grpLargObj_2.spacing = 10;
                                                    var lblLargObj_2 = grpLargObj_2.add("statictext", undefined, "objet_2"); 
                                                    var txtLargObj_2 = grpLargObj_2.add('edittext');
                                                    txtLargObj_2.text = (LargeurObj_2/2.834645).toFixed(2);
                                                    txtLargObj_2.characters = 10
                                                    var lblUnitLargObj_2 = grpLargObj_2.add("statictext", undefined, "mm"); 
                                                    var divider_v2 = grpLargObj_2.add("panel"); 
                                                    divider_v2.alignment = "fill"; 
                                             var divider_h1 = groupDimensions.add("panel"); 
                                             divider_h1.alignment = "fill";
                                //Groupe hauteur
                                    var groupHaut = groupDimensions.add("group", undefined); 
                                            groupHaut.orientation = "row"; 
                                            groupHaut.alignChildren = ["left","center"];
                                            groupHaut.spacing = 10;
                                            var lblHauteur = groupHaut.add("statictext", undefined, "Hauteur");
                                            lblHauteur.characters = 5;
                                            var divider_v3 = groupHaut.add("panel"); 
                                            divider_v3.alignment = "fill"; 
                                            var grpHautObjets = groupHaut.add("group", undefined); 
                                            grpHautObjets.orientation = "column"; 
                                            grpHautObjets.alignChildren = ["left","center"];
                                            grpHautObjets.spacing = 10;
                                                   //Groupe hauteur objet_1
                                                    var grpHautObj_1 = grpHautObjets.add("group", undefined); 
                                                    grpHautObj_1.orientation = "row";
                                                    grpHautObj_1.alignChildren = ["left","center"];
                                                    grpHautObj_1.spacing = 10;
                                                    var lblHautObj_1 = grpHautObj_1.add("statictext", undefined, "objet_1"); 
                                                    var txtHautObj_1 = grpHautObj_1.add('edittext');
                                                    txtHautObj_1.characters = 10
                                                    txtHautObj_1.text = (HauteurObj_1/2.834645).toFixed(2);
                                                    var lblUnitHautObj_1 = grpHautObj_1.add("statictext", undefined, "mm"); 
                                                    var divider_v4 = grpHautObj_1.add("panel"); 
                                                    divider_v4.alignment = "fill"; 
                                            var divider_h2 = grpHautObjets.add("panel"); 
                                            divider_h2.alignment = "fill"; 
                                                   //Groupe hauteur objet_2
                                                    var grpHautObj_2 = grpHautObjets.add("group", undefined); 
                                                    grpHautObj_2.orientation = "row"; 
                                                    grpHautObj_2.alignChildren = ["left","center"];
                                                    grpHautObj_2.spacing = 10;
                                                    var lblHautObj_2 = grpHautObj_2.add("statictext", undefined, "objet_2"); 
                                                    var txtHautObj_2 = grpHautObj_2.add('edittext');
                                                    txtHautObj_2.text = (HauteurObj_2/2.834645).toFixed(2);
                                                    txtHautObj_2.characters = 10
                                                    var lblUnitHautObj_2 = grpHautObj_2.add("statictext", undefined, "mm"); 
                                                    var divider_v5 = grpHautObj_2.add("panel"); 
                                                    divider_v5.alignment = "fill"; 
        //Groupe Boutons
            var groupBoutons = groupSup.add("group", undefined); 
                    groupBoutons.orientation = "row"; 
                    groupBoutons.alignChildren = ["left","center"];
                    groupBoutons.spacing = 16;
                    //Groupe boutons Radio
                        var groupRadioBtn = groupBoutons.add("group", undefined); 
                                groupRadioBtn.orientation = "column"; 
                                groupRadioBtn.alignChildren = ["left","center"];
                                groupRadioBtn.spacing = 22;
                                        var rdbApercuLarg_1 = groupRadioBtn.add("radiobutton", undefined, "Aper\347u");
                                                rdbApercuLarg_1.height =  20;
                                                rdbApercuLarg_1.onClick = function () { if ( rdbApercuLarg_1.value === true) {
                                                                                                                    monEchelle = rapport_L1_sur_L2;
                                                                                                                    majApercu();
                                                                                                              }
                                                                                                          }
                                        var rdbApercuLarg_2 = groupRadioBtn.add("radiobutton", undefined, "Aper\347u");
                                                rdbApercuLarg_2.height =  20;
                                                rdbApercuLarg_2.onClick = function () { if ( rdbApercuLarg_2.value === true ) {
                                                                                                                    monEchelle = rapport_L2_sur_L1;
                                                                                                                    majApercu()
                                                                                                              }
                                                                                                          }
                                        var rdbApercuHaut_1 = groupRadioBtn.add("radiobutton", undefined, "Aper\347u");
                                                rdbApercuHaut_1.height =  20;
                                                rdbApercuHaut_1.onClick = function () { if ( rdbApercuHaut_1.value === true ) {
                                                                                                                    monEchelle = rapport_H1_sur_H2;
                                                                                                                    majApercu()
                                                                                                              }
                                                                                                          }
                                        var rdbApercuHaut_2 = groupRadioBtn.add("radiobutton", undefined, "Aper\347u");
                                                rdbApercuHaut_2.height =  20
                                                rdbApercuHaut_2.onClick = function () { if (rdbApercuHaut_2.value === true ) {
                                                                                                                    monEchelle = rapport_H2_sur_H1;
                                                                                                                    majApercu()
                                                                                                              }
                                                                                                          }
                    //Groupe valeurs %
                        var groupTxtPourCent = groupBoutons.add("group", undefined); 
                                groupTxtPourCent.orientation = "column"; 
                                groupTxtPourCent.alignChildren = ["left","center"];
                                groupTxtPourCent.spacing = 18;
                                var pC_LargObj_1 = groupTxtPourCent.add("edittext", undefined, (rapport_L1_sur_L2).toFixed(2) + "\%");
                                pC_LargObj_1.characters = 8;
                                var pC_LargObj_2 = groupTxtPourCent.add("edittext", undefined, (rapport_L2_sur_L1).toFixed(2) + "\%");
                                pC_LargObj_2.characters = 8;
                                var pC_HautObj_1 = groupTxtPourCent.add("edittext", undefined, (rapport_H1_sur_H2).toFixed(2) + "\%");
                                pC_HautObj_1.characters = 8;
                                var pC_HautObj_2 = groupTxtPourCent.add("edittext", undefined, (rapport_H2_sur_H1).toFixed(2) + "\%");
                                pC_HautObj_2.characters = 8;
    var divider_h6 = boiteEchelle.add("panel"); 
    divider_h6.alignment = "fill"; 
    //Groupe transformation
        var groupTransformation = boiteEchelle.add("group", undefined); 
                groupTransformation.orientation = "row"; 
                groupTransformation.alignChildren = ["left","center"];
                var lblTransform = groupTransformation.add("statictext", undefined, "Transformation");
                        var dividerv7 = groupTransformation.add("panel"); 
                        dividerv7.alignment = "fill";
                        rdbGroupee = groupTransformation.add("radiobutton", undefined, "Group\351e");
                        rdbGroupee.onClick = function () { majApercu()};
                var rdbRepartie = groupTransformation.add("radiobutton", undefined, "R\351partie");
                        rdbRepartie.value = true;
                        rdbRepartie.onClick = function () { majApercu()};
var divider_h7 = boiteEchelle.add("panel"); 
    divider_h7.alignment = "fill"; 
        //Groupe options
            var groupOptions = boiteEchelle.add("group", undefined);
                    var ckbContours = groupOptions.add("checkbox", undefined, "Traiter les contours et effets \?");
                        ckbContours.value = true;
                        mesContours = 1;
                        ckbContours.onClick = function () { ckbContours.value === true ? mesContours = 1 : mesContours = 0;
                                                                                                majApercu()};
                            var dividerv8 = groupOptions.add("panel"); 
                            dividerv8.alignment = "fill";
                            var groupEspace = groupOptions.add("group", [16,26,68,66]);
                            var boutonAppliquer = groupOptions.add("button",undefined, "Appliquer",{name:'ok'});
                            boutonAppliquer.onClick = function() { boiteEchelle.close();};
                            var boutonAnnuler = groupOptions.add("button",undefined, "Annuler",{name:'cancel'});
                            boutonAnnuler.onClick = function() {
                                                                  if (defaire) { btExecution('app.undo();')}
                                                                        boiteEchelle.close();
                                                                  };
    boiteEchelle.show();
    btExecution('app.executeMenuCommand("deselectall");')
    alert ("Vous pouvez maintenant sélectionner\n les objets à mettre à l\'\351chelle puis\n cliquer sur l\'une des options d\'aper\347u.");
};
function echelleRepartie($type) {
            btExecution("\
                                for (x = 0 ; x < app.activeDocument.selection.length ; x++) {\
                                app.activeDocument.selection[x].resize("+ monEchelle + "," + monEchelle + ",true,true,true,true," + monEchelle + ")\
                                };")
};
function echelleRepartieSANS($type) {
            btExecution("\
                                for (x = 0 ; x < app.activeDocument.selection.length ; x++) {\
                                app.activeDocument.selection[x].resize("+ monEchelle + "," + monEchelle +")\
                                };")
};
function echelleGroupee($type) {
    btExecution("app.executeMenuCommand('group');\
                        maSelection = app.activeDocument.selection[0];\
                        maSelection.resize("+ monEchelle + "," + monEchelle + ",true,true,true,true," + monEchelle + ");\
                        app.executeMenuCommand('ungroup');")
};
function echelleGroupeeSANS($type) {
    btExecution("app.executeMenuCommand('group');\
                        maSelection = app.activeDocument.selection[0];\
                        maSelection.resize("+monEchelle + "," + monEchelle +");\
                        app.executeMenuCommand('ungroup');")
};
function btExecution($script) {
	var btalk=new BridgeTalk();
	btalk.target = "illustrator";
	btalk.body = $script;
	return btalk.send();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Mise à jour de l'aperçu    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function majApercu() {
        if (defaire) {
            btExecution('app.undo();')
        }else{
            defaire = true;
            btExecution('app.redraw();')
        };
        if (rdbGroupee.value === true) {
                if (mesContours ==1) {
                    echelleGroupee()
                } else {
                    echelleGroupeeSANS()
                }
        } else {
                if (mesContours == 1) {
                     echelleRepartie()
                } else {
                    echelleRepartieSANS()
                }
         }
            btExecution('app.redraw();')
};
