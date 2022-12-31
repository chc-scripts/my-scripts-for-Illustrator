﻿//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*ExportChoixdpi
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      Export each layer in a separate file with choice of its resolution
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
#targetengine main
var fileName = '';
monFichier = app.activeDocument;
chemin = monFichier.path;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Dialog Box    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var boiteDial = new Window("dialog","Choose format and resolution"); 
    boiteDial.orientation = "column"; 
    boiteDial.alignChildren = ["left","top"]; 
////  Groupe Format
var grpFormat = boiteDial.add("group", undefined); 
    grpFormat.orientation = "row"; 
    grpFormat.alignChildren = ["left","center"]; 
    grpFormat.spacing = 28;
    var sttFormat = grpFormat.add("statictext", undefined, "Format"); 
    var ddl_Format = grpFormat.add("dropdownlist", undefined, [".png","jpg"]);
      ddl_Format.selection = 0; 
////  Groupe Résolution
var grpResol = boiteDial.add("group", undefined); 
       grpResol.orientation = "row"; 
       grpResol.alignChildren = ["left","center"]; 
       var sttResol = grpResol.add("statictext", undefined, "Resolution"); 
       var edtResol = grpResol.add("edittext", undefined, 300);
             edtResol.characters = 4;
////  Groupe boutons
var grBoutons = boiteDial.add("group", undefined); 
      grBoutons.orientation = "row"; 
      grBoutons.alignChildren = ["left","center"]; 
      grBoutons.spacing = 10; 
      grBoutons.margins = 0; 
      var btnOk = grBoutons.add("button", undefined, "Ok"); 
            btnOk.onClick= function() {maResolution = parseFloat(edtResol.text)
                                                if(ddl_Format.selection.text === ".png"){
                                                    processPNG(monFichier)
                                                }else{
                                                    processJPG(monFichier)
                                                };
                                                boiteDial.close();
                                            };
      var btnAnnuler = grBoutons.add("button", undefined, "Cancel"); 
boiteDial.show();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Launch process export in png    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function processPNG(monFichier){
    var nbCalques = monFichier.layers.length;
    var fname = monFichier.name;
    fname = fname.substr(0,fname.lastIndexOf("."));
    fileName = "" == monFichier.name ? fname : "";
    while (nbCalques--){
        var calqueEnCours = monFichier.layers[nbCalques];
 // If the layer is not locked
        if(calqueEnCours.locked == false){
            unhideAllUnlocked();
            calqueEnCours.visible=true;
            app.redraw();
            var suffix =  true ? calqueEnCours.name:nbCalques;
                    exportPNG(suffix);
         };
     };
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Export to PNG  format     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function exportPNG(num){
    var exportOptions = new ImageCaptureOptions();  
    var exportName = (chemin+"/"+ fileName+""+num+".png");
    var dest = new File(exportName);
    var type =ExportType.PNG24;
    monFichier.layers[num].hasSelectedArtwork = true;
    app.executeMenuCommand('group');
    var limites = monFichier.selection[0].visibleBounds
     exportOptions.antiAliasing = true;
     exportOptions.artBoardClipping=false;
     exportOptions.transparency=true ;
     exportOptions.horizontalScale = 100;
     exportOptions.verticalScale = 100;
     exportOptions.resolution = maResolution;
    monFichier.imageCapture(dest,limites,exportOptions);
        app.executeMenuCommand('ungroup');
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Launch process export in JPG    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function processJPG(monFichier){
    monFichier = monFichier;
    var nbCalques = monFichier.layers.length;
    var fname = monFichier.name;
    fname = fname.substr(0,fname.lastIndexOf("."));
    fileName = "" == monFichier.name ? fname : "";
    while (nbCalques--){
        var calqueEnCours = monFichier.layers[nbCalques];
        var monDossier = (chemin);
 // If the layer is not locked
        if(calqueEnCours.locked == false){
            unhideAllUnlocked();
            calqueEnCours.visible=true;
            app.redraw();
        calqueEnCours.hasSelectedArtwork = true;
        var calqueActif = monFichier.assets.addFromSelection();
        calqueActif.assetName = calqueEnCours.name;
            exportItem(calqueActif, monDossier);
         };
     };
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Export to JPG format   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function exportItem (item, monDossier) {
app.preferences.setIntegerPreference('plugin/SmartExportUI/CreateFoldersPreference',0); //disable subfolder creation
var whatToExport = new ExportForScreensItemToExport();
whatToExport.assets = [item.assetID]; //Export the active layer
whatToExport.artboards = ' '; // Do not export the artboard
whatToExport.document = false; // // Do not export the all document
var jpgOptions = new ExportForScreensOptionsJPEG;
jpgOptions.antiAliasing = AntiAliasingMethod.ARTOPTIMIZED;  // Smooth edges of the picture
jpgOptions.compressionMethod = JPEGCompressionMethodType.BASELINEOPTIMIZED; // Standard baseline
jpgOptions.scaleType = ExportForScreensScaleType.SCALEBYRESOLUTION;
jpgOptions.scaleTypeValue = maResolution;
activeDocument.exportForScreens (monDossier, ExportForScreensType.SE_JPEG100, jpgOptions, whatToExport);
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Make all layers visible (Except locked layers)    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function unhideAllUnlocked(){
    var all = monFichier.layers.length;
    while(all--){
        if( monFichier.layers[all].locked==false){
        monFichier.layers[all].visible=false;
        };
     };
};