/*-----------------------------------------------------------------------------------------------------------------------------------------------------
    NuneroterLignes",
/*-----------------------------------------------------------------------------------------------------------------------------------------------------
    en : Add a number in front of each line of the selected text frame.
    fr : "Ajouter un numéro devant chaque lignevdu cdre de texte séléctionné.
/*-----------------------------------------------------------------------------------------------------------------------------------------------------
Auteur : Christian Condamine (christian.condamine@laposte.net)
-------------------------------------------------------------------------------------------------------------------------------------------------------
*/
#targetengine 'main'
app.preferences.setBooleanPreference('ShowExternalJSXWarning', false); // Fix drag and drop a .jsx file
$.localize = true;
$.locale =null;
if($.locale.substr(0,2) != "fr"){$.locale = "en"};
    var monFichier = app.activeDocument;
    var maSelection = monFichier.selection;
    var nbSel = maSelection.length;
    if(maSelection[0].typename != "TextFrame"){
        alert(localize({en:"The selection must consist of only one text frame.", fr:"La s\351lection ne doit \352tre compos\351e que d'un cadre de texte."}));
    }else{
        if (maSelection[0].kind == "TextType.AREATEXT"){
            maSelection[0].convertAreaObjectToPointObject();
            redraw();
            maSelection = app.activeDocument.selection
        };
        boiteDial();
    };
//-----------------------------------------------------------------------------------------------------------------------------------------------------
function boiteDial(){
//-----------------------------------------------------------------------------------------------------------------------------------------------------
var boiteDial = new Window("dialog",{en:"Start of numbering",fr:"D\351but de la num\351rotation"}); 
boiteDial.alignChildren = ["center","top"]; 
var grp_1 = boiteDial.add('group');
grp_1.orientation = "row"; 
grp_1.margins = 10; 
var stt_1= grp_1.add("statictext", undefined, {en:"Start at", fr:"D\351marrer \340 :"});
var edt_1 = grp_1.add("edittext",undefined,1); 
edt_1.characters = 6;
debut = edt_1.text
edt_1.onChange = function() {debut = edt_1.text };
var grpBoutons = boiteDial.add("group")
var bin_Ajout = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x19\x00\x00\x00\x19\b\x06\x00\x00\x00\u00C4\u00E9\u0085c\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x02$IDATx\u00DA\u00A4\u0096\u00ADO\u00C3@\x14\u00C0_ab$\u0088\u00E2&H\u00A8D\x167Y\u0082\x00\x12\x12\u0086\"(6\u0087[\u00F6\x17\u00ACS\u00C8mn\u00A8\rA\bj\u009B\"\u00A8\u00B5\x0E\x14\u00C5\u0081Z\u00E7\u00EA(\tb\u0082d\u00BCw\u00BD\u0083\u00D2\u00DD\u00D6\x0F^r\u00CD\u00A5\u00D7{\u00BF\u00F7u\u00EF\u00AA@\x121A\u00C7\u00A7\u0081c\x0B\u0087\u00CE\u00DF\u00FA8^p8\u00B8>X\u00B6]\u0089Q^\u00C6g\x1D\u0087\x16c\x06\x01\t\u00D4\u00C0=n2H`y7duR\u00F19\u00A8\x15~\u00B9\u00BA\u00C0\u00FA\u00DB\x04\u00D6\u00CB$\u008F\u00E3\x00\x03\u00AB\u0081\x05C9\u00C4\u0084\x12\x07\u00E4!\u00A3\x18\x1A\u00A5\x0Et\u00BF\u00E8\u00FF\u0080VC\x00\u00B2\u00FC>+@\u00CD\u00ABp\u00B9w\t\u009D\u00A3\x0E\u009B\x0F\u00DF\u0086:z\u00F4\u0081\u00A0\u00C7\\\u00E8;\u00CA\u0081\u009A\x05\u00A0\x17t\u00E8\u009F\u00F6AS\u0083\bO>&b\u00A9I\u0095\u00A7p/\u00C8\u00C7Q\x16@Y/Cs\u00BF\u00C9\u00AC\u00F7\u00A7>\u009C\u00DC\u009D\u0080\u00E5Z\u00E1Oz\u00C2\u0093jV@\u00F7\u00B8\u00CB\u00E6\u00AE\u00EF2\u0080\u00E39s\u009F\tH\u00E9?\x00R\u00BC{\u00BD\u00CB<\u0091\u00C9\n\x0FUf\u0080\b\u00D1\"@\x00Iy\x1E(\u00C9a\x00y@\u00A1Z&\u00A9 \u0094\u00DC\u00D1\u00F9o}\u00D4\x1Ej\u00B2\x1CH!sR\u00DA.\u00C1\u00B8:\u0086Y}\u00F6c5\t\u0095)\u0081HZ\u008F-\u00E89\u00BDD\u00C6\u00E5X\x17\u008D\x00HY8\u00FE\u00F6\u00C4f\u00CA\u00F9if\u00E1i\u00D8\u008D\u00C4!Vx3|\u008E.\x10\u0088\u0080B)A\u0084\x17\u0094\u0087\u00C8Y\u0080\u00F8Vo\u00C2{\u00F4\u00B4\u0093B\n\u0099P,d\u00F0:`\u00D5\u0094F\u0082\u00DEe\u00C0v\u00B4\u00ADO\u00BF\u00A6PX/@q\u00B3\u00F8g\u00C3\u00E1\u00CD\u00E1\u00D2r\u0095\u00B5\x7F\u0091\u00F8\u00B6l\u00B5\u00FD\u00D4\u009E\u00F3\"\u00AE\\ej\x02O,\u00F0\u00D8\x1D\x10\u00F1\u0086,\u00A6dS\u00E3\u00A3yeX\x01\u00EF\u00D3K{\u0089\u009D\u00FD\u00B6z\x03l|^D[\u00FD\u00C6\u00DA\x06\x0B\u00DB\u00CE\u00D5N\x16/\u00CE0\u00DF\u008E\"\u00B9vG\u00E1\"\x10\u0089O\u0099\x07v\u0094P_M~\u00C7K@\x19\u0084\u00EEy3\u00EEGB\u00E5\u0097X\u00DA\u00EEL\u00F1\u00AC\u00E0~+\u00CD/\u0091\u00C1\u00EF\u009A8\u0098\u00C3*\u00D4\x04i\u009F\u00F9\x16`\x00\u0087\u00E7\u00C34!\u008B\x19\u00EF\x00\x00\x00\x00IEND\u00AEB`\u0082"
var btnAjout = grpBoutons.add("iconbutton", undefined, File.decode(bin_Ajout), { name: 'ok' });
btnAjout.helpTip = {en:"Number the lines", fr:"Num\351roter les lignes"};
var bin_Suppr ="\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x19\x00\x00\x00\x19\b\x06\x00\x00\x00\u00C4\u00E9\u0085c\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x02\x0EIDATx\u00DA\u00ACV=S\u00C2@\x10\u00DD0\x16\u0096\u00D8\u00D9\u0089\u0095\u0096\u00B1\u00D2\u008EPY\u0082\u00BF\u0080PQ\n\u00BF\u0080PZ\x01\u00BF PZ\u0089\u00A5\x15\u00D0iE\u00E8\u00EC\u00C4N;J:\u00DD7l\u00C8\x1D\u00B9|\u0080\u00EE\u00CC\u00CD\r\u00B9c\u00DF\u00BE\u00DD\u00B7wgQ\x0E\u00FB\u00F1\u00C8\u00E1\t\u00E3\u008CGI>/y|\u00F2\x18[\x1E\x05i\u00FF\u00B7R\x1C\x17yj\u00F1\u00A8+\u008E\u0093\f\u0080#\x1E}\x06\\\u00E5\x02a\u0080\x1AO>\u008F\"\u00EDg\x00k0\u00D0T\u00FDX0\x00x<=\x1D\x00@\u00C2x\u00C2>\u00DCD&\x02\u00D0\u00A1\u00FF10\x1AjL$Eq\u0080c&\u00D4\u009Co\u00E6\u00FD\u00CC\x17\u00C1l@\u00A4\u00C8=\u00E3\u00D6\u00FA\u0084\u00E8\u00D4\u00E6D8\u0087\u00B0\u00F1U&-\u00A3\u0082\x1Co\x03\x00\u00BB\u00A8\u0092\u0091e\u00D5\u00DF\x04\x12\x06\u00B3S#\u00D4\u00C7\x12&\x1FF\x10\u00FCQe\u00F0pB\u00B4\x16\u0085\u00C2!\u00D6\u00D54bmp\x1E\u00ED\x11\u00C5\x15\x18\u00C0N\u00EC\u0083\u00F5\u008E\u00E4\u00CB\u009Dd\u0080p\x7F<\u00AD\u00A5#\u00E9d\u00B3\u00BD\r\u0088.k\u00D1\u00EF\x1B\u00CE\u00EA\u00F7\u0082\u00E8\u00B6\x17\x07\u0098u\u0089^\u00FB\u00F1\u00C0\u00A4&\u00C9\u00B2YrO\u00BD\u008F\u00F5o\u00A8\u00C1n\u008A\x1E\u00EF\u0088\u00A6\u009E\x11 \x04)\u00A7\u00EA\u00E3\u00B9A\u00B4ZRb:G\u0095x \x06\u0090U\u00EA\u008E0RS\u0094\x00\u00F8\n2u\f\u0090E\u00E6\u00AEb\u00C9\u00DC\u008C\u00D7\u00F7\u00B9\u009A4\u009B\t\u0094T\u00F5\u00CDk\u00B6\u009B\u00D4\x1F\u00FA),\x12\u009EG\u0082\x13\u00B1\u00A1\x0EpR\u00EE\u00C4\u00D3g\u008A\x1Ei\u00C3\x1AXCi\u00C1P? \u00B5fDT\u00CD\u00B99$8B\x1D a\u00DB5\u00EFAph\u00C8\u00C8\u0082\u00F0X\u00E9j\u008Ef\u00DDd\x00D\x0B\u00C5\u0099\u00F6\u0084\u00FD\u00A2\u00DB\u00C0RNa\u0084\x1F%\x17\u00D1\u00A2\u00F9`\u0090(\x1C\u00EF*\f\u00A9E:\u00C3\x14\u00A3\x19_\u00DA\x1A\x0B>\u00EE\u00AFT\x10\u00BD6\x7F7DT\u00C1\u00FD\u00BF\u00BDO\u00E41\u00D0\u00F8G\u0090v\u00F8\u00C0\u00D0\u00AE_\u00B9\u00C9\x1A\u0099\u00B2\u00CEf\u00B0\u00BD\x15\u00D3\x1E\x12\u00B6\\8\u00F6\u009E\x00S\u0095A\u00E6\u0093H\u00C0\\y\x1299\u009C\u008F\u00D4\u00E8U\u00FB\x15`\x00,c\u00B7\u00B93V\u0090G\x00\x00\x00\x00IEND\u00AEB`\u0082"
var btnSuppr = grpBoutons.add("iconbutton", undefined, File.decode(bin_Suppr));
btnSuppr.helpTip = {en:"Remove Numbering", fr:"Supprimer la num\351rotation"};
var bin_Annul = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x19\x00\x00\x00\x19\b\x06\x00\x00\x00\u00C4\u00E9\u0085c\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x01\u00D5IDATx\u00DA\u00B4V\u00BBN\x02A\x14\u00BDK\u00D6B\x0BB\u00B0%qm,l\u0080\u00C4\u00C2\u008E\u00A5\u00A7\u00C0/`\u00FD\x02\u00DC/\x00\u00BF\x00\u00FC\x02\u00E0\x0B\u00D0\u0084~\u0097\u00D8\u00D8\u00B16\x16V[\u00D8j6\x16Rh\u00E1\u009D\x17\x0E\u00B3\x0F\u0096\u0089{\u0092\u0093\u00C9\u00BE\u00E6\u00CC\u00DE{\u00CF\u00DC1 \x07\x16\x00\x16\x0E]\u00E4\t\u00B2\u00C1oG\u00C8gd\u0080\u00F4;\u00EC:\x11\u00C6\u008E\u00C9\x1D\x1C\u00FA\u00D2\u00C4Y\u0098\"oQ,\u00CC%\u00C2W>A\u00DA\u00B0?\u0088\u00D00Sd\u00C1V\u00ED!+\u00A0\x0F\x1Fy%BX*@\x00x\x04\u00BC\u00D8\u009F,\u00D8\u00C4+`\u00A1\u00DA\u00E0\u00D8\u00B6\u00A1\u00DCh@\u00B9^g#\u00F2\u00A9\u00DD\u00A6\u00F7e\u00BC\u00FB>\u00A5\u00821\u00FE\u008DkJ7F\u00B2@\u00CDq\u00A0>\u0099$.\u00F3\u00D0\u00B2\u00A0\u00DAjm\u00AE\u008F,k#\u00A4\u00E0\x06\x17\u00FF`J\u0089v\u00E4\u00A7\u00E2\u00C3$\u00BCM\u00A7\u0094\x02g\u00C3aV\u00E8\x06\"'}(\x0E\u00B6\x10\u00E9\x16(\x02%\u009EpK\u00E7cR\x04\x17\u00F39|\u0085!e\x1A\u00CC\u009Cn\u008E\u0081\x14\u00C6\u00F9h\u00C4&\u00A9\u00B0\u008A\u00AF\u00F5z,g\u00B3\u00D9V\u00CEL]\x01\u00B9\u00F2\u00D4r\u00FEX.\u00B7\u00C3\u00A5\x1B\u00E7\u00EF(\u00CA\u00FD\u00AE\u00D6\u009F\u0090P|\x06\x01\\z\x1E\u00FC\u00A0\x18\t\u008FjLU$\u00D0\x11\"\"\u008F\u00CD&\u009C\u00F6\u00FF\u00AA\u00FF5\u00C5/%\u00BE\u0089i\t\u00AD\u00B1\u00A2^\\ww\t\u00F3qV\u00A8O\u00A4\u0086\x13\x15\u00A4qOEx\u00C8\u00EE\u00E4'\u00C4\\$\u00EEi%L\u0092.(\u00FC\u0091\x02\u00D7P\u00FA\u00C9J5\u00E7\x01\x1A\u008D8\u009Bn\u00F9\u00B8\u00DDWq$\tW7P\u00B2\u00A8u\u00DC\u00F5\u00B4K\x1A\tmw\u00F5\x0FM\u008B\u00A6\x00\x05\u00AEcf\u00E4\u0087\u0080\u00B6n\u00B5%\t$:\u00BE\u00C3\x04\u0088\u00D0Xc\u00F2\u0088\u00F7\u00F6\u00EB}\u008ED$|\x03\u00DE\n\u00B2B\x18r\x1B\u008C\u0093\u00CE_\u00BF\x02\f\x00\u0082\u00C8\u0091\x1D\u00EEsT\u00CC\x00\x00\x00\x00IEND\u00AEB`\u0082"
var btnAnnul = grpBoutons.add("iconbutton", undefined, File.decode(bin_Annul), { name: 'cancel' });
btnAnnul.helpTip = {en:"Close", fr:"Quitter"};
btnAjout.onClick =  function() {
                            boiteDial.close();
                            ajouterNum();
                          };
btnSuppr.onClick =  function() {
                            boiteDial.close();
                            supprimerNum();
                          };
btnAnnul.onClick =  function() {
                            boiteDial.close();
                          };
boiteDial.onClose = function(){return(debut)};
boiteDial.show();
};
//-----------------------------------------------------------------------------------------------------------------------------------------------------
function ajouterNum(){
//-----------------------------------------------------------------------------------------------------------------------------------------------------
    var nbLignes = parseInt(debut);
        for (x = 0; x < maSelection[0].textRange.lines.length ; x++) {
               maSelection[0].textRange.lines[x].contents = nbLignes + "\t"  +  maSelection[0].textRange.lines[x].contents;
               nbLignes = nbLignes + 1;
        };
};
//-----------------------------------------------------------------------------------------------------------------------------------------------------
function supprimerNum(){
//-----------------------------------------------------------------------------------------------------------------------------------------------------
    var nbLignes = parseInt(debut);
        for (x = 0; x < maSelection[0].textRange.lines.length ; x++) {
              nbCar = maSelection[0].textRange.lines[x].contents.length;
              posTab= maSelection[0].textRange.lines[x].contents.match("\t").index;
              maSelection[0].textRange.lines[x].contents = maSelection[0].textRange.lines[x].contents.substr(posTab+1, nbCar - posTab);
        };
};