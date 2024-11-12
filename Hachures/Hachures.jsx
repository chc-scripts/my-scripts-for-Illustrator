//==================================== NOTES =======================================//
/***
  {
    "name" : "02_Hachures",
    "note" : "Hachurer le tracé sélectionné",
    "image" : "02_Hachures.png",
  }
***/
/*=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - (christian.condamine@laposte.net)
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
En:     This script allows you to add vector hatches to the selected object (path or compoundpath). A preview function
            allows you to view live changes related to settings. The values entered in the dialog box are saved in a .json file to
            be reloaded on the next launch of the script.
>=----------------------------------------------------------------------------------------------------------------------------------------------------------------
Fr ;      Ce script permet d’ajouter des hachures vectorielles à l’objet sélectionné (tracé ou tracé transparent). Une fonction
            d’aperçu permet de visualiser en direct les changements liés aux réglages. Les valeurs entrées dans la boite de
            dialogue sont conservées dans un fichier .json pour être rechargées au lancement suivant du script.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
#targetengine 'main'
app.preferences.setBooleanPreference('ShowExternalJSXWarning', false); // Fix drag and drop a .jsx file
$.localize = true;
$.locale =null;
if($.locale.substr(0,2) != "fr"){$.locale = "en"};
var nomScript = 'Hachures',
    fichierParam = {
        name: nomScript + '_param.json',
        folder: Folder.myDocuments + '/CC_Scripts/'
    };
    selection = app.activeDocument.selection;
    coeff = 2.8346;
    monCalque = selection[0].layer
    var nbSel = selection.length;
    typeObj=0
    valeur_Type = "A";
    if (nbSel === 1){
        coulParDefaut = new RGBColor();coulParDefaut.red = 0;coulParDefaut.green = 0;coulParDefaut.blue = 0;
            if(selection[0].typename === "PathItem"){
                typeObj = "P"
                    if(selection[0].stroked===true){
                            couleur = selection[0].strokeColor;
                            selection[0].filled = false;
                    }else{
                            couleur = selection[0].fillColor;
                            selection[0].filled = false;
                            selection[0].strokeColor = couleur;
                    };
            };
            if(selection[0].typename === "CompoundPathItem"){
                typeObj = "C"
                    if(selection[0].pathItems[0].stroked===true){
                            couleur = selection[0].pathItems[0].strokeColor;
                    }else{
                            couleur = selection[0].pathItems[0].fillColor;
                    };
            };
            if (typeObj !=0){
                    selection[0].name = "baseSelection";
                    perim = parseFloat((selection[0].width*2+selection[0].height).toFixed(0));
                    x0 = selection[0].left;
                    y0 = selection[0].top;
                    L0 = selection[0].width;
                    H0 = selection[0].height;
     defaire = false;
      boiteDial = new Window ('dialog', {en:"Hatch", fr:"Hachurer"});
      boiteDial.orientation = "column";
      boiteDial.alignChildren =  ["fill", "center"];
      boiteDial.alignment = "left";
      var grpEspacement = boiteDial.add('group',[5,5,200,25]);
            grpEspacement.orientation = "row";
      var lblEspacement = grpEspacement.add ("statictext", [0,0,79,18], {en:"Spacing:", fr:"Espacement :"});
      var txtEspacement = grpEspacement.add ("edittext", [82,0,130,23], 4);
            txtEspacement.characters = 3;
      var lblUnitEsp = grpEspacement.add ("statictext", [133,0,160,18], 'mm');
      var grpAngle = boiteDial.add('group',[5,28,200,52]);
            grpAngle.orientation = "row";
      var lblAngle = grpAngle.add ("statictext", [0,0,79,18], {en:"Gradient:", fr:"Inclinaison :"});
      var txtAngle = grpAngle.add ("edittext", [82,0,130,23], 45);
            txtAngle.characters = 3;
      var lblUnitAngle = grpAngle.add ("statictext", [133,0,175,18], {en:"Degrees", fr:"Degr\351s"});
      var grpEpTrait = boiteDial.add('group',[5,55,200,79]);
            grpEpTrait.orientation = "row";
      var lblEpTrait = grpEpTrait.add ("statictext", [0,0,79,18], {en:"Thickness:", fr:"\311paisseur :"});
      var txtEpTrait = grpEpTrait.add ("edittext", [82,0,130,23], 0.5);
            txtEpTrait.characters = 3;
      var lblUnitEpTrait = grpEpTrait.add ("statictext", [133,0,160,18], 'mm');
      var panType = boiteDial.add("panel",[0,85,260,190],{en:"Curves", fr:"Courbes"});
             panType.orientation = "column";
             panType.spacing = 5;
             var grpBic_1 = panType.add("group",[10,15,210,45]);
                    grpBic_1.orientation = "row";
                   grpBic_1.alignChildren = ["left","top"];
                   var img_A = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x19\x00\x00\x00\x19\b\x06\x00\x00\x00\u00C4\u00E9\u0085c\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x01\u00F5IDATx\u00DAbd \x02<\u00E4\u00964\x00R\x0E@\u00AC\x0F\u00C4\nHR\x07\u0081\u00F8\x01\x10o\u0090\u00FF\u00FA\u00FC\x03.\u00FD\u008C\x04\fO\x00R\u00F5h\x06\u00E3\x02\x0B\u0080\u00B8\x11h\u00D9\x03\u00A2,\u0081\u00BA|>\x10\x1B0\u0090\x0E@\x165\u00E0\u00B5\x04j\u00C1~ \x16@\x16g\u00E2\u00E7c`\u00D3\u00D3\u00C10\u00F1\u00C7\u00E1c\u00D8,\u00BA\x00\u00C4\u008E\u00B0 d!\u00C6\x02\x10\u00E0\u00AF*f\u00E0\u00CDN\u00C50\u00ED\u0099\u00B69\u00C3\u009F\u0087\u008F\u00D1\u0085a\u00E6\x18\u0082\x1D\u0088d\u0081\x00.\x0B@\u0080\u00D3\u00D7\x03k\u00D8p\u00FAx\u00E0\n6\x03\u00A0\u0099\u00FD(\u0096\x00A?.\x0BX\u00E4e\x19X\u00E4d\u00B1\u009A\u00C4\x1D\x1D\u0086/~\n\u0080\x1690A}\x01J=\t\u00B8T\u00E2q-0\u009E\u00B4\u00C1\u008E\u00C0\x03\u00EAa>\u00C9\u00C7\u00A7\u008A\u0080k\u00F1:\x02\u0094\u00BF`\u0096\x04\u00E0R\x01r%\u00C8\u00B5\u00C8\u00E0\u00E7\u00E1\u00E3$9\u0082\t\x1AT\n\u00A4\u00B8\u00F2\u00CB\u00D2\u0095$\x05\x19\x13\u00A1\u00DC\u008C\u00EE\u00CA\u00EF[v`\u00F8\u0084P\u00901\u00E1\u00B3\x00[P\u00FD\x00Z\x00\u00CA\x17\u00BF.]%:\u00C8\u0098H\u008DP\u0090\u00A5\u00A0\u008CIJ*c!5U\u00E1s1\u00C8Q\u009F\u00A7\u00CE\u00C6\u00EA\u0093\x0B\u00C4\x06\x15!\u0080\u00CB\x01L\u00D0B\u00EC\x02\u0089i\u009F\u00A4\u008C\t\u008B\u0093\u008D\u00C4\u00B8\u00EA}y=\u00C3+\u00CF\x108\x06\u00A54b\x1C\u00C7\u0088T8\u00DE\u0087\u0095] \u00D7H]=\u0089\u00A2\u00F0\u00DF\u00C7O\fO\u00A45P\x1D\x12\x13\u00C6 <c\x02\u008A\x18(\u00D5\u00BD\u00B0rE\u00A9\u00CC\u00C0>\u0081\x06\u00D9D|\u00AE\u00C1\u00E6\u00EA\u00EF\u009Bw\x10\n2\u0090\u00B9\u008D\u008Ch\u00F5\u00C9yP\x11\rR\u00C8\u00C4\u00CF\u008F\u00A2\u00F9\u00CF\u00A3\u00C7\u00D8\u00EA\r\x06lj\x7F]\u00BA\x02\u00F69\x10\x14\x02=0\x01\u00DD\x12\u0094`\u00A3\x10,\x00Z\u0090\u0088\u0091\x19\u00A1\u00C1\u00A6\u0088+Y\u0093\x00&\u00C0,\u00C0\u009A\u00E3\u00A1\x169\u0082\x14\u0092a8\u00A8\u00A5\x12\b4\u00A3\u0090\u0094&\u0091\x02\u00B4I\x14@ \bA>_\b\r\"\u008C\u00F6\x17@\u0080\x01\x00\u00FD~\u00A8\x07\x195\u00BE\x19\x00\x00\x00\x00IEND\u00AEB`\u0082"
                   var bic_A = grpBic_1.add('iconbutton', [0,5,32,34], File.decode(img_A));
                   var img_B = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x19\x00\x00\x00\x19\b\x06\x00\x00\x00\u00C4\u00E9\u0085c\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x02\u008EIDATx\u00DA\u00ACV=l\u00D3P\x10>G\x06D\"\u0095J4f\x00U^\u00A8P#\u00A4\"\u0095\x00Sc\u00FE\x06\u00B2\u0080J3\u00D2fEH\u0094\u0089\u00AD\u00C6\x0BSP\u00CB\n\u0083\u00D3\x05A\x00\u0091\x01:U\u00C40 h\u0096,\u00A9\x10\f1\x19\u0090\u00B0\u00F9\u00A9\u008AR\u0089\u008AJ\u00DC\u0099\u00D7\u00CA~\u00B1\x1D\u009B\u00F0I'?\u00F9\u00FC\u00DE\u00F7\u00EE\u00BD\u00FB\u00EE,@\x0F\u00FC\u00B6\u0086\x07\u00F1\u0091C\x1BC\u009Bp\u00B9L\u00B4OhUQj7\u00C2\u00D6\x10B\x16\u0097\u00F1\u00A1\u00A2\u00CD@o\x10\u00A1\u0086d\u00E5\u00C8$Hp\u008B\x11\u00C4\x05ET\u00E4#\x13|\b\u00F4\u0088\u00BB\x0F\u00C2\x1A\u00DA\rwTB\x18\u00816\x7F$t5\u00F9\u00D0\u0086c\u00E3c? \u00B5w\u008Bw_B\u00A2*\rD\u00EE\u0088<\x11\b\u00BBN\u0082\u00A6i\u0081$\u00CDf\x13L\u00D3\u0084\u009B\u00B7\x1F\u00C0\u00D4\u0085\u00F70q\u00EA\u00AB\u00DB\u00AD\u00E3\u009A\r$2\x13\u00DC%\u00C7B&\u0093\u0081|>\x0F\u00A5;\u00F7`\u00E9\u00B5\x02\u00F6\u00B7=n7e%\u009D\f$\u00D8\x0B\u00B5\u008F;\u0080T*\x05\u0085B\x01\u0096^\x1E\u00E0]9\f '2\x1DD\u00BA\u00E8J\u00A5\x02+o\u00CA\u0090Ln\u00C1\u00C6\u00E6Q(\u0095J;\u00BEl6\x0B\u00CF\u00ABI\u00BFi\u00D3t'\x17\u00E3\u00ECzz\u00AA\r\u00A3#?1)\u00BC\u00EF;\u009DN\u00D0\u0094\x19\u0091SqO\x18o\u0087`\u00F5\u00E3\x00\u00D8\u00DF\u0087<\u00EF\u00EB\u00F5\u00BA\u0093i~ \x129*\u0081\u00A2(`Y\x19g|:/y\u00B2\u00EC\u00D1\u00C3\u00FB\u00A0\u00CE~\t$\u0089\u008Ct:\u00ED\x18\x7FOdW\u00AF\u00B4 \u00BD\u00FFW\u00FF$~\u00A0\u00AC\u00A2T\u00D6u\u00CA\u00D6\x1A\u00AF\u0095\u00F8$\u0086a@\u00ADV\u00F3\u00A4\u00AD,\u00CB\x0E\t\u0089V\u009D[G\u00F5/w\u00A9?\u00C1\u008AZ$X\u0096\x05\u0097\u00CF?\u0085\u00B9ke\u0098<\u00A7;\u00C7\u00E4\u00D6J\u00F6\u00C4YX\u00FD0\u00D05\u008FH^\u00C1\x7F\u0082$I\u00A8\u00FA\u00DD]\x05\u0093\u008E\u00CB`\u0095s0\u008A\u00B2\x17\x1F\x0F\u00FF\x1D\u00EF;\x0E\u00C5b\u00C1\u00E3o\u00B5Z0>\u00D2\u0095\u00C6U\x11\x0B\u00D8\x1A\u00AA\u00FEn\u0094\u00D2Bu\u008A\u00CC\x0F$\u00C6\u0095w\u00CB0y\u00A6\u008BD\u00DB\u00AE]\x0B,\u009A\x7F\u0082m\u00DB\u00A0\u00AA\u00AAS\u0089\u00B9K_\u00A0*\u00ECd\x17\u008B\u00A6\u0088\u00C3g\u00FC\u00EEHhA;\u00A72Of}6v\u00CA\r\u00DF\u0092\u00FD\u009A\u0096\u00A7\u00ED>yq04\u0082\u00D1\u00C3\u00EB(\u00C0M?\x11\u00D2\u00A9(\u00DBm\u00D8\u00AF\u00FD\u00CE\u00E2c\u00BE\u008F$3YWl\u00B8S\u00D8\u00ABN\u00A9M\u00F7\u00A3\u00B0\u008F\u00E3\u0082\u00FA\u00FA\u00B1\u009E?\x12\\T\u00D4g\u00AE\u00B3\x7F\u00AE\u00B0\x1F\x07\u00EA\u00E5\u008B\u00B8\u00B8\u00E1\u00F7\u00C1\x1F\x01\x06\x00\x1D\u008E\u00F1,Y\u00ADB;\x00\x00\x00\x00IEND\u00AEB`\u0082"
                   var bic_B = grpBic_1.add('iconbutton', [35,5,67,34], File.decode(img_B));
                   var img_C ="\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x19\x00\x00\x00\x19\b\x06\x00\x00\x00\u00C4\u00E9\u0085c\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x02\fIDATx\u00DA\u00ACV\u00BFO\u00C2`\x10=\b\u0089\u008B&$8\x18Y0ap\u0092\u00EE\u009A\u00B4n8Q\x12wa\u00C6\x04\u00DC\x1D qp\u00A3\f\u009D\u00E1\x0F0\x01'\u009D\u00A4$n\fV'\x07\x13q\u00D088`d\u00D1\u00C9;\u00F8\u008A\u00B5\u00BD\u00AF\x14\u00F4%W\u00A0\u00A5\u00F7z\u00EF~5\x02a`\u00AA\x1A\x1E\u00C92hqqv\u0088v\u008BfA\u00A9g\x05\u00DD\x1E\tpL\u00CE*he\u0097c\x19\u0088\u00B0\u0081f \u00E10\x1C\u0089\u00A9\u00EAxl\u0086p\u00CE\u0091\x15\u0091\u00A8\u00E3>\x19e\b\u00AAxl/@\x00\u00E2\u009E6\u00FA\u00A8\u00CB#1U\u0092\u00A7\u00CE\u00DD\u009DZY\x03}c\x07\u00E2K\u00CB\u0090YM\u00C3\u00E0\u00E3\x15\u00DE?G`\u00BF=\u0080\u00F5b\u00C3\x10\u00BF{P\u00C3\u0088\u00AA\u00BFI&\u00C9\u00ED\u00FA\x1E\r\u009D\u00D6\u00B7\x0F\u00A1\u00B0\u0099\u0095k\u0084\x04\u00BB\u00E7\u00951\u00A1\x07y\u0092.\u00E6Jr\u0093#\u00E8\u00E6\fP\u00F0\u00C9\x035\u00C2\u00FF\u00911h\u00A2o\u00CB\u00C9I\u0081\x14\u00F1\u00FE\u00A3\u00BDw2\u0093 D\u008E*1\u00F1\u00A3\u00EC\u00BDJ\u00F2h\u00EB\n+M\u00E7\u00F1\x1A\u009E0'jR\x01%\u0091\u0096E\u00E1\u00E0 \u0086\u00E1(\\\x149L\u00B2\x17\u00A49i?Mr\x7F\u00F2Q\u00D9\u00DA\u00E7\x12?\u00AD\u0099\u0098\u00E8d\x1Ft\u0086$\x7Fq\u00CC:3\u00EE\u00CE\x025\u008Br\u00FD\u00C0\u0085O%K\u00B6\b\u00A2\u00DCI.\u00D9\u008B\x12HI\u00FE\x1B,\u0089\u00F5l\u00FB\u00A3K\u00A4\u00FFD2\u0090u\u00B17OZR\tl\u00C8 \x12v\x17P/\u00F8\u009A3\u00EBoN\u00AA\u00C2\u00AEn\u008C\u00CB8x\u009F\u0098\u00EA\r)\u00E2\u00BE@OM#\u0085\u0083Si\u00EEf\u00AD\u00F5[PEc`;9ipy\u00E1\u00A2q&27\r$hLHJ\u00BD\x16'[\u00F1\u00EA\u0094\u009B\u00AC\u00F3\u00C0&\u00DF\u00EE\u00EA:\x12\u009B\u00CD7\u00C2I\u008A\u0080\u00B1\x01\u00AD\u00FBK.\u00EA\u00C9\u0096d\u0096\u0096.\u00B6\"\x0B\u00CD5\x10)\u00C2\u00E1\u00D7\u0088-wG\b\u00A1\x10\u00B3\u00E3\x17\u00DF\u00EF\u00D2=/{\u0091H\t\"mN\x02K\x10\f\u00C2\u00BD\x12\u00FD\u00ACd\u00DA5\u00FA\f\u00E7\u009Dq\u0085J\u00DE\u00BF\u00BE\x05\x18\x00\u0093\u00BE\u00C1\u00BE%\u00DB\x17q\x00\x00\x00\x00IEND\u00AEB`\u0082"
                   var bic_C = grpBic_1.add('iconbutton', [70,5,102,34], File.decode(img_C));
                   var img_D = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x19\x00\x00\x00\x19\b\x06\x00\x00\x00\u00C4\u00E9\u0085c\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x01\u00F7IDATx\u00DAbd \x02p\u00CE\u00BC\u00A6\x00\u00A4\x02\u0080X\x1F\u0088\x15\u0090\u00A4.\x00\u00F1E \u00DE\u00F0=]\u00EB\x03.\u00FD\u008C\x04\fO\x00R\u00F9@l@\u0084[6\x00q#\u00D0\u00B2\x0BDY\x02u\u00F9| v` \x1DL\u0080Z\u00F6\x01\u00A7%@\x0B@\u00AE\u00DE\x0F\u00C4\x02\f\u00E4\x03\u0090o\x1Ca\x161\u00E2\u00B3 F\u008D\u009FA\u009E\u0097\r\u00AB)\u0097\u00DE\u00FE`\u00F8\u00F8\u00EB/\u00C3\u00A1g\u00DF\bZ\u00C4\u0082d\x01\u00C8\u00E0\u00F5\u00C8>\u0088U\x17`\u00B0\u0095\u00E4\u00C2\u00EBd\u0090E\u009B\x1F|a(=\u00F6\x12\u00CCF\x02\x06\u00D0 \x0FdB\x12\u00ACGK9D\x01~6f\u00B0\u008FoD)3\u00E8\ts\u00A0K\x07\x00\x1D\x1F\u00C0\u0084\x14\u00D1\x05\x14\u00C4\x01\u00D8\u00B2\u009D\u00BEr\u00D8,\u00EA\u0087\u00F9$\u0081X\u00C3\u0096\u00DC\u00FA\u00C80\u00E5\u00F2;\u0086\u0087\u009F\x7Fc\u00B5\u00A8\u00DBJ\x1C]X\x01f\u0089?\u00F1\u0096|`(;\u00FE\u0092As\u00F9\x1D\u0086\u00D6\u00B3o0\u00E4Aq(\u00CF\u00CB\u008A\"\u00C6\u0084\x14I$\u0083\u00D6\u00B3\u00AF\x19\x0E?\u00C7L]\u00BE\n\u00BC\u00A8\u0096\x00\u00E3\u00C3\u0081\u0092\u00B8\u00D8\u00FC\u00E03\u00D6`\u00C3\u00E6\x13\u00B2\x01(\u00BF\u00A0\x03;).\u00EAZ\u0082\r|\u00F8\u00F9\x17\u00C3\u0092\x0F\u0094\x18h+\u00C9\u008D\u00C5w?Q-\u00C1Vj\u0092\x02@\x19\x11\x1D<\u00FC\u00FC\x0Bkp\x1D '\u00F3\u00CDr\u0090\u00C2H\u00AE\u0090\u00C4\u00F0\x05\u0085\x0F+\u00BB6\x12[\u00ACwY\u008A\x03\u00CB\u00A8\x7F8\u00CB4PFE+\u00C3\u00E0>Y@l\u00DC\u0080\u008A\r\\\x16\u0080R\x1A\u0096\fz\x00l\t\u00B4\u00DCo\u00A4$n@\u0099\u00D2}\u00F3#\f_\x00A!<\t\x03-\u009A@N\u00DC\u00802c\u00DA\u0081g@\x0B\x1Eb\u00B3\x00\\\x1D\u00A3WZ\x02\u00D0J\u00CB\x00\x164\x02\u00ECL8\u00F2\u00C2?\u00AC\x19\x11\t,\x00Z\u0090\u0088\u00AB\u00FAE\u00B1\u0088L\x00\u00B7\x00ok\x05hY\x03\u00B4\"#)\u00B3\x03q\"\u00D0\u0082\r\u00A44\u0089\x14\u00A0\x16\x05\x10hX<\x00\u00E2\u0089P\x1F`\u00A4R\u0080\x00\x03\x00\u008A!\u00B9\u00B6\u00DB\u00963\x1D\x00\x00\x00\x00IEND\u00AEB`\u0082"
                   var bic_D = grpBic_1.add('iconbutton', [105,5,137,34], File.decode(img_D));
                   var img_E = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x19\x00\x00\x00\x19\b\x06\x00\x00\x00\u00C4\u00E9\u0085c\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x01\u00A6IDATx\u00DAbd \x02\u00E8\u00E8U\x1B\x00\u00A9\x00 \u0096\x07b\x05$\u00A9\u0083@|\x01\u0088\x0F\\\u00B9\u00D4\u00FA\x01\u0097~F\x02\u0086'\x00\u00A9z4\u0083\u00B1\x01\u0090\x05\x1B\u0080\u00B8\x11h\u00D9\x03\u00A2,\u0081\u00BA|=\x11\u0086c\u00B3\fd\u00D1\x04dAf\x1C\u00AE\u00DF\x0E\u00C4\x02\f\u00A4\x03\x0E \u00F6\x10\x13\u00B7Sx\u00F5\u00F2\u00F0F\u00AC>\u0081Z0\x1F\u00C6\u0097\u0092\x12d\b\u00F07$\u00CA\u00F4\u00D3\u00A7\u00EF3\u009C>s\x1FYh\x01\u00D0G\u0089 \x06\x0B\u0092\x05\u00A0\u00A0\u00E9GV%-%\u00C0\u0090\u0099\u00E1D\u00A4'\u00F6\u00A1[\u0092\x004\u00F3!\u00D0\u00A2\x06&$\u00C1\u00F9d\x06\x11>P\x0Fr<\x13\u00D4\x17\x0E@\u00CA\u0081\u00816\u00A0\x1E\x16\\\u00F9\u00C4\u00EA\u00D8\u00B8\u00E9<\u00C3\u00C6\u008D\u00E70\u00C4\u009F>\u00C3\u0099M\x12`\u0096\x04\x10k\u00C9\u00B3g\u00EF\u00D1\u00C3\u009E `\u0082\x06\x15M\x01\x0B\u00A9\x19\x0E\u0094\u00DA\u00B0\u00A58]\u00FD\x1A\u00DC>!#W\u0093\f\u0098\x18\u00E8\x00X\u00A0\u00A5(\x03\u00F1\x11\u00FF\x01\u0098\u0092\u00DE\u0093l\u00C9\x03R4l\u00DCt\u008Ea\u00DA\u00F4}\u00A4\x05\x170\u00DB_\u0080\u0096\u009E4\r.\x06h]\u0090@\u008C\x06\x13\x13E\u0086\u00ACL\u00CC\u00D4\u00F5\u00F4\u00E9\x07\u00B0/\u00B1\x15\u00FF0K\x1A\u0089\u00B5\u00C4\x14h\t\bc\u0094\u00C2\u00C0\f\u008A\u00C3\u0092\u0089\u00E0\u00D4\x05\u00AD\u00CD\x16\u00D0 \u00A4@\u00D10\x019\t\x17\u0092\u009A\b\u0088\x00\u0089\u00A0\u00BA\u009F\x11K\u00B5\u00BB\x1FV\u00E4\u00F3\u00F2r0h\u00A8K\x12e\u00DA\u00E7\u00CF?\x18n\u00DC|\u008En\u00C1\x02\u00ACu<\x05\u00F5;V\x0B\u00B0\u00E6xh\u00926\u0084\u00A68R\x01(\u00B8\x1D\u0091- \u00A6I\x04*\u00A1\u00E3\u0089Hy \u0087MD7\x1C\x06\x00\x02\f\x00T\u0081\u008C\u0086N\u0090\u00CE\u0087\x00\x00\x00\x00IEND\u00AEB`\u0082"
                   var bic_E = grpBic_1.add('iconbutton', [140,5,172,34], File.decode(img_E));
             var grpBic_2 = panType.add("group",[10,48,210,88]);
                    grpBic_2.orientation = "row";
                   grpBic_2.alignChildren = "left";
                   var img_F = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x19\x00\x00\x00\x19\b\x06\x00\x00\x00\u00C4\u00E9\u0085c\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x01\x7FIDATx\u00DAbd \x00\x1E\u00F1\u00D5\t\x00)\x07 6\x00b{$\u00A9\x07@|\x11\u0088\x0F\u00C8}j\u00BA\u0080\u00CF\fF<\u0086+\x00\u00A9z N` \f@\x166\x02-[@\u00B4%@\x0B\x1A\u00A0\x16\u0090\n@>JD\u00F7\x19#\u0096\u00A0\u0099\x0F\u00C4\x01\f\u00E4\u0083\x0FP\u008B6\u00E0\u00B2d?4\u00FC\u00C1\u0080;\u00CA\u0080\u0081E^\u0090(\u0093\u00BF.=\u00CF\u00F0\u00E7\u00D1\x07d!G\u00A0E\x07P,\x01Z\u00D0\x0F\u00A4\n\u0090U\u0089mMd`\u00B7Q \u00CA\u0092W\u00DE\u00F3\x19~\x1Ey\u0080\u00EE#E\u00A0E\x1F\u0098\u00A0\x16\x18\u00A0[@\x05\x00\x0Bz\x06&\u00A8@?\x03m@\x00\u00C8\x03,\u00D0\u00A4\u00EA@t\u00ACVlg\u00F8u\u00F9\x05\u0086\u00F8o,bP\u0090\u00CFBjJ\x02Y\u0080\x16\u00F6\x04}\u00C3\u0084\u0096\u008Bi\x01\x04X\u00A0\x11D4\x00\u00A58t\x00\u00F2\x19(u\u00E1\x02L\u00D02\u0089\u00A6\u0080\tZ\u00EE\u00D0\x14\u00B0@3\r\u00D1\x00\u0094\u008A\u00FE}\u00FC\u0081\u0091\x18\bYB\u0092O\u00DE\x03\u00930\u0089\u00A9\x0B\x1C\\\x07i\x1CZ\x0F@\u0096l\u00A0\u00B1%\x1B\u0098@\x05\x18\u0090\u00B1\u0080\u0086\u0096L\u0084\u0095]\u008D\u00A4&\x00\"\u00C1\x04\u00A0'\u00C0\u00C1\u00C5\x00b\x00\u00A9B*[p\x01\u00EAx\u008CJk>r\u009D\u00CE\u00AA+\u00C1\u00C0\u00C4\u00CFA0\t\u00E3\u00A8\x1D\r\u00A1\u008E\u00C7\u00AC\u00E3)\u00A8\u00DFq\u00D6\u00F3\u00B8\x1A\x12\x0E\u00D0\nG\u0081\u00D48\u0080\u00B6Z>\x10\u00D5$\u0082Z\x06\n\u00BA|\x02\u00E5\u00DB\x07h6h\u0084\x05\x0F:\x00\b0\x00\x16s\u0089j\\\u00D6\u00B1\u00A3\x00\x00\x00\x00IEND\u00AEB`\u0082"
                   var bic_F = grpBic_2.add('iconbutton', [0,5,32,34], File.decode(img_F));
                   var img_G = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x19\x00\x00\x00\x19\b\x06\x00\x00\x00\u00C4\u00E9\u0085c\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x02\x19IDATx\u00DA\u00BCV\u00BDN\x02A\x10\u00DE;OAc\f\r\u009D\x05\u0086\u008EF\u00E8\u00E8\u0080\u00C6\u00CE\b\u00B5\u0085\u00C7\x13\x00O\x00>\x01\u00BC\x01\u00D0\u009BHbg\x05\x1D\u009D\u00D8\u00D0\u0099`bG\x03&*\u0088\u00A23\u00EB\x1Ep{\u00B3\u00F7\u00A3\u0089\u0093L\u00EE\u00B2,\u00F3\u00CD|\u00F3w\x1A\u00F3\u0090I\u009DE\u00E0\u0091\x05M\u0082f6~\x1A\u0081>\u0082v\"\x156p\u00B3\u00A1\u00B9\x18\u008F\u00C1\u00A3\nj2oA\u00C0K\x00k\u00F9\x06\x01\u0080\u00B2\x00\u0088\u00B0`\u0082\x11\x15\u00E5\u00C84\x02\u00A0\u00E9\u00D3{7)nF\u00A5\u00F9\x050\x0E\u00B3\\Q\u00F4\u00E81[\u008E\u00EF\u00F9\u00FB\u00F2y\u00C4>\u009E\u00BA\u00FC)I\x01\u0080:6\x10\x00\u00A8\t\u008Al\x12N\u00D7\u00D8N\u00AA\u00C4\u00B4\u0090;s\b\u00F4r\u0095\u00B3\u00F9\f\u009A\x02\u00A0\u0091!%y\u00CD#\x18\u00DD;\u00BD^y\u00EF%\u00C4=\u00F4\n\u0099\u00C9\u00E9\u00E2\u00C0\x11\u00C1\u00EEI\u00D37\u0080\u008Bd!\u0080\u00AC!\u00FA\u00C0\u0094\u00BD\u00DA\u008E\u00E7\x1D\u00FF@\u00DE\x17\u00C36\u00A7\x06#\u00DD\u008A&\u0099\x11?\u00E3O\x17)!]\x0Ek\u0098\x03\u008A\u00F3\u00D7\u009B\x02\u00FB\u009AOVg\u008B\x07\u00C8k\u00BF\u00C6\u00F4\u0083\x18\x0B\u00A5\u00AB*\u0090\u00BC.u1\x17*\u008A\u00B7\u00DB\u00A2\r@\u008E\x10\x7FW\u00E6\x0B4\u00B6y\u0080^QF\u00AC\x12\u00DDI\u0098\u00E4\x1D\u0094Y\u00BF\u00A6\x04a~@VQ&.\u0094\x05\u00A1\x02\u00D1\u00D9?\u0088\x03\u00E4s\u00EC\x1C\u00A8*z\u0082\u0080\u00D8\u00ACbr\u00E5\x04#\u0088\x054\u00EBUxgS\u00CE\u00B8\u0081\u00F4\u00E4C^\u009ADsbo\u00A0q,gU\u00A5QC\x1D\x13\u00DF\x15sf5\u009C\u00B0\u00E1\u00B0\u008A\u00E4\x06\u00DD?\u00BF\u00FBq`>\rBaGS\r\u00C7p\u00A6\u00CEB\u00A9r \u00EE\u00A7\rr=\x1DY\u0089o\u0088h\u00D6\u00E5\b\u00DC\u00BF\x0F[\x7F-\u00AC\x16Na\x0E\x02/\bP\u00A4\u00BA\x1CG\u0089W\u0092\u0091B\u00BCG\u00AC\u00E4\n\u00B5\u00B4\u0090\u009F:Y!\u00A2\u00C2\u00ACFD`L>\x16\x01\u0095l\x1C\u00F1\u00D6\x1A\u00A6\u00D6\u00AF)\u00F6\u00C0oe$\u00B6\u00E2@\u00D9\u008Cb7\u00E7\u00C4\u00E5\u00C09\x10\u00DBp\u00E0\u00EB\u0093h#\u00AA\u0092\u00F8\u00E6R^\u00C32\x05m\u0083q\u0092\u00BBo\x01\x06\x00\u00BA7\u00CE\u00B6\u00C0\u0087\x19\x06\x00\x00\x00\x00IEND\u00AEB`\u0082"
                   var bic_G = grpBic_2.add('iconbutton', [35,5,67,34], File.decode(img_G));
                   var img_H ="\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x19\x00\x00\x00\x19\b\x06\x00\x00\x00\u00C4\u00E9\u0085c\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x01}IDATx\u00DAbd \x00&\u00EEW\x10\x00R\x0E@l\x00\u00C4\u00F6HR\x1F\u0080\u00F8\"\x10o\u00C8w|p\x01\u009F\x19\u008Cx\fW\x00R\u00F5@\x1C\x00\u00C4\x02\x04\u00DC\u00F2\x00\u00A4\x05h\u00D9\x04\u00A2-\x01ZP\x00\u00B5\u0080\u0090\u00E1\u00D8,\x0BD\u00F7\x19#\x16\x0B\u00E6\x03\u00A9\x04\x06\u00CA@\"\u00D0\u00A2\x05X-\u0081Y\u00C0\u00C7!\u00C3\u00A0)\x11\u0082\u00A2\u00EB\u00D3\u008F'\f\u00D7_\u00ACA\x113\x07{\x18\x15\u009CD\u0084\x18\u00DC\"F\u00B4 \u00EA\x07\u00B1e\x04,\x18\u0082\f\u0096\u00A3h~\u00FA\u00E1\x04\u00C3\u00DA\x0B\u0091(by\x0E\u00F71,\u0099t@\x119a8\u0082\u0082\u008E\t-\u0092\u00A9\t\x04`\u008Ef\u0082\n\u0090\x13\u00C9\u00C4\x00\x07\u00A0\x07\x1C\u0098\u00A0\u00F9 \u0081\u0081v \u009F\t\u009A\x0Fh\t\x02X\u0080\u0084>1*\u00D9X\u00F8\u00C0\t\u0082\x1C\u00C0\x02-.\b\x02Q\x1E-\u008C\x14G,`b\u00A0\x03\u00A0\u008B%,\u00C4*\u00FC\u00F9\u00E7\x13\u00C3\u009B/\u00D7P\u00C4\u00A4\u0089\u008C#\u0090%\x07\u00A1E9^\x00\u00B2\u0080\u0098\x1C\u008F+\u00B8.\u00D08\u00B4>0\x01\u00CB\u0096\r\u00D0r\u0086V`\x03,\u00E2'\u00D2\u00D0\u0092\u00890K&\u00D0\u00C87\x0B\u00E0\u00A50\u0090\x01\u00B2 \u0091\u00DAq\x01\u00C4\u0085\u00D8*-PA9\u009F\x1DX\u0084\u0080r8z\x12~\u008D\u0096\u0084\u00B1\x153O\u0080\u00F5\x0Er]\u0082\u00AB\u00FA\x05[D\u00A1\x0F\x1C\u0091\u00EBy\u008C\x1C\x0F\u00AD2\r\u00A1\u008D\x02\u0092S\x12\x10+\x12lH`\u00F1U>\x11\u0085(\u00C8a\x0B\u0081\u0086\x1F\u00C0&\t\x10`\x00\u008B\u00DF}\u00AD\u00B4\u00BB\u0093\u00F0\x00\x00\x00\x00IEND\u00AEB`\u0082"
                   var bic_H = grpBic_2.add('iconbutton', [70,5,102,34], File.decode(img_H));
                   var img_I = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x19\x00\x00\x00\x19\b\x06\x00\x00\x00\u00C4\u00E9\u0085c\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x01xIDATx\u00DAbd \x02\x1C\u009B\u0095f\x00\u00A4\x02\u0080X\x1F\u0088\x05\u0090\u00A4\x0E\x02\u00F1\x05\u00AB\u00B4Y\x1B\u00F0\u00E9g\u00C4c0\u00C8\u00B0\x02 \u008E\x07b\x05\x02\u00EE\u00F8\x00\u00C4 \u008B\x1A\u0081\x16> \u00CA\x12\u00A0\x05\x0E@j>\x11\u0086c\u00B3\fd\u00D1\x04\u00BC\u0096\x00-H\u0080Z@\tX\x00\u00B4(\x11\u00AB%\u00D8,\x10U\u00B3d\u00E0\u00E0\x15!h\u00EA\u00E3\u00B3\u009BqZ\u00C4\u0088\x16\u00B9\u00E7\u00D1Uj\u00FB\x143\u00F0I\u00AA\x11\u00B4\u00E4\u00F8\u00ECtl\u00C2\u0085\u00A0\u00A0cB\x12\u00A04\u0088\u00B0\u0081z\u00A0\u00E3\x15\u0098\u0090\u0082\u00C9\u0080\x06\u0096\u0080Rh=\x0B\u0094\u00E3\u008FK\u00D5\u0083\u00E3\u00AB\x18\u0098\u00D98\x19\u00B8\u0085e\x19\x14,\u00C3P\u00E4^\u00DF:\u00CE\u00F0\u00EA\u00D61B\x16\x05\u00B0@\u00F3C\x00.\x15_\u00DF>\u00C6\u00A9\u00FB\u00E7\u0097\u00B7\f\u009F\u009E\u00DF\"\u00E8\x1B&\x1A\x05\x13\n\x00Y\u00E2@\x0FK\x18\u0086\u008D%\x1F\u00E8a\u00C9\x05\u009A[\x02\u00CC\u00F6\x07hm\t,3.\x00\u00E2\x04l\n`\x05$;\u008F0\u0086\x1C\u00A8L\u00935\u00F6\u00C5U@\u00C2\u00F33\u00CC\u0092\u0085\u00B8,\x11S\u00B3\u00C2Y@\u0082\u00C4arx,Y\bN]\u00D0 \u00DB@\u0083\u0090\x02\u00D5\u0092(\u00A5p\"\rRZ\"\u00D0\x03\x1F\x18\u00B14\x18\u00F6#7\x16@\x05#\u00A8\u0080$\x04\u00B0\u0094a \x0B\x16\u00E0\u00AA~1,\"\u00D3\x07\x0Bp\u00E6x\u00A0$(\u00DF(\u0092\x19G \u00BD\u0086\u00C8\x16\u00E0m\x12!\u00B5Z\u00F2\u00F1U\x05H\u0086OD7\x1C\x06\x00\x02\f\x00\u00B5\x0Fq\u00CD(7~$\x00\x00\x00\x00IEND\u00AEB`\u0082"
                   var bic_I = grpBic_2.add('iconbutton', [105,5,137,34], File.decode(img_I));
                   var img_J = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x19\x00\x00\x00\x19\b\x06\x00\x00\x00\u00C4\u00E9\u0085c\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x01\u0092IDATx\u00DAbd \x00RU\u00EA\x05\u0080\u0094\x03\x10\x1B\x00\u00B1=\u0092\u00D4\x03 ~\b\u00C4\x1Bf\u00DFi\u00BC\u0080\u00CF\fF<\u0086+\x00\u00A9z N` \f@\x166\x02-[@\u00B4%@\x0B\n\u00A0\x16\b0\u0090\x06@>JD\u00F7\x19#\x16\x0B\u00E6\x13\u00E9z| \x11\u00D9W\u008C\u0084,\u00F0\u00CDs \u00CA\u00D4\u00CD\u0093\x0E\u00A0\x0B\x05\x02-\u00DA\u0080b\t\u00D0\u0082\x06h\x10\u00A1\u0080Y\u00B7\x1B\u0088\u00B2$M\x15C\u00DD\x07 6\x04Z\u00F4\u0080\t-\u0092\u00A9\t@\u00F1\t\n\x19\x06&\u00A8\x00\u00B5-\u0080\x01\x07\u00A0\x07\x1CX\u00A0\u00F9\x00gD\u00F7\u00C6`\u00A6\u00CA\u00E2%$\u00A5\u008B|\x16 \x11\u0080O\u00C5\u00CD\u0093\x0F(\u00F5M\x00\x13Z.\u00A6\t\x00Y\u00A2@\x0FK\x18F-!\u00C5\u0092\x0B\u00A4h\u00E0\u00E2\u00E3 \u00CB\u0092\u0083\u00B8$\u00AD\u0082\f\x18\u00C2\u00AB=\x18\u00D4\u00CD\x11i\u00C39\u00C1\x02C\u00DD\u00DB\u00A7\x1F\u00F0\u00D9\u00F1\x01\u0094O\x0E@\u00CB\x19\u008Cb]XF\x00l(6\u0083\u0091\u00C1\u00E3\u00EB/\u00F0Io`\x02\x16` \x0B&R\x12\u00E6\x17v\u00DF\u00C0'\u00DD\b\u008B\u00F8\tP\u00DF\u0090\fn\x01K\u0084c\u00EBpF\u00EB\x02x)\f\u00F5M\"F0\\{\u00C1\u00F0\u00ED\u00D3\x0F\u00AC\u00BAA\u00E2\u009B'\x1F`\u00E8\u0089Y\u0080\u00AFJ.\u00C4Vi\u0081\u00AA\u00DD~\u008C\u00B8\u0091\x16`\x10\u0091\x11 \u00A5L\x039\u00DA\x11V\rc\u00AB~\x13`\u00F5\x00\u0099\u00E0\x01\u00B4V\u00BC\u008033B\u00EBfG\u00A8bR\u00C1\x02hmx\u0081\u00A8&\x11\u0092\u00AF\u00F2\u00A1m.|A\x03\u00AA\u00CB\x17\x02\r?\u0080M\x01@\u0080\x01\x00\u00A5\u00AD\u0083\u0085m\u00AB\u008At\x00\x00\x00\x00IEND\u00AEB`\u0082"
                   var bic_J = grpBic_2.add('iconbutton', [140,5,172,34], File.decode(img_J));
      var ckbConserCoul = boiteDial.add("checkbox", undefined, {en:"Preserve color", fr:"Conserver couleur"});
            ckbConserCoul.alignment = "left";
      var grpBoutons = boiteDial.add('group');
            grpBoutons.orientation = "row";
            grpBoutons.alignChildren =  ["fill", "center"];
      var btnOk = grpBoutons.add("button", undefined, 'OK', {name: 'ok'});
      var btnAnnuler = grpBoutons.add("button", undefined, {en:"Cancel", fr:"Annuler"}, {name: 'cancel'});
      //---------------------------------------------------------------------------------------------------------------------------------------------------------------------
     txtEspacement.onChange = function() {majApercu();};
     txtAngle.onChange = function() {majApercu();};
     txtEpTrait.onChange = function() {majApercu();};
     bic_A.onClick =  function() {valeur_Type = "A";majApercu();};
     bic_B.onClick =  function() {valeur_Type = "B";majApercu();};
     bic_C.onClick =  function() {valeur_Type = "C";majApercu();};
     bic_D.onClick =  function() {valeur_Type = "D";majApercu();};
     bic_E.onClick =  function() {valeur_Type = "E";majApercu();};
     bic_F.onClick =  function() {valeur_Type = "F";majApercu();};
     bic_G.onClick =  function() {valeur_Type = "G";majApercu();};
     bic_H.onClick =  function() {valeur_Type = "H";majApercu();};
     bic_I.onClick =  function() {valeur_Type = "I";majApercu();};
     bic_J.onClick =  function() {valeur_Type = "J";majApercu();};
     ckbConserCoul.onClick =  function() {majApercu();};
     btnOk.onClick = function () {valider();boiteDial.close();};
     btnAnnuler.onClick = function() {  if (defaire) {
                                                            app.activeDocument.selection[0].remove();
                                                            gBN(typeObj,"baseSelection").selected = true;
                                                            defaire = false;
                                                        };
                                                    boiteDial.close();}
      boiteDial.onClose = function() {sauverParametres()};
      //---------------------------------------------------------------------------------------------------------------------------------------------------------------------
      verifDossierParam();
      chargerParametres ();
      boiteDial.center();
      majApercu();
      boiteDial.show();
              } else {
                    alert(localize({en:"You must select one path or one compound path.", fr:"La s\351lection doit \352tre compos\351e d\un trac\351ou d'un trac\351 transparent"}));
              };
     } else {
        alert(localize({en:"You must select one path or one compound path.", fr:"La s\351lection doit \352tre compos\351e d\un trac\351ou d'un trac\351 transparent"}));
     };
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function majApercu() {
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    if (defaire) {
       app.activeDocument.selection[0].remove();
       app.activeDocument.selection = null;
       gBN(typeObj,"baseSelection").selected = true;
    }else{
        defaire = true;
        app.redraw();
    };
    action()
    app.redraw();
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function recueilDonnees() {
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    espacement = parseFloat(txtEspacement.text*2.834645);
    epTrait = parseFloat(txtEpTrait.text*2.834645);
    angle = parseFloat(txtAngle.text);
    switch(valeur_Type){
           case "A" :
                poignees_p1_x = 0;poignees_p1_y = 0;poignees_p2_x = 0;poignees_p2_y = 0;break;
           case "B" :
                poignees_p1_x = 0;poignees_p1_y = 0;poignees_p2_x = perim/(-1.8);poignees_p2_y = perim/1.8;break;
           case "C" :
                poignees_p1_x = 0;poignees_p1_y = 0;poignees_p2_x = 0;poignees_p2_y = perim/1.8;break;
           case "D" :
                poignees_p1_x = perim/1.8;poignees_p1_y = perim/(-1.8);poignees_p2_x = perim/1.8;poignees_p2_y = perim/1.8;break;
           case "E" :
                poignees_p1_x = perim/1.8;poignees_p1_y = perim/(-1.8);poignees_p2_x = perim/(-1.8);poignees_p2_y = perim/1.8;break;
           case "F" :
                poignees_p1_x = perim/1.8;poignees_p1_y = perim/1.8;poignees_p2_x = perim/(-1.8);poignees_p2_y = perim/(-1.8);break;
           case "G" :
                poignees_p1_x = perim/1.8;poignees_p1_y = 0;poignees_p2_x = perim/(-1.8);poignees_p2_y = perim/1.8;break;
           case "H" :
                poignees_p1_x = perim/1.8;poignees_p1_y = 0;poignees_p2_x = perim/(-1.8);poignees_p2_y = perim/(-1.8);break;
           case "I" :
                poignees_p1_x = perim/1.8;poignees_p1_y =perim/1.8;poignees_p2_x = perim/(-1.8);poignees_p2_y = 0;break;
           case "J" :
                poignees_p1_x = perim/1.8;poignees_p1_y = perim/(-1.8);poignees_p2_x = perim/(-1.8);poignees_p2_y = 0;break;
           default :
                poignees_p1_x = 0;poignees_p1_y = 0;poignees_p2_x = 0;poignees_p2_y = 0;break;
    };
    ConserCoul = ckbConserCoul.value
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
  function action(){
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    recueilDonnees();
    app.copy();
    app.executeMenuCommand('pasteFront');
    selection[0].name = "copieBaseSelection";

    if(selection[0].typename == "PathItem"){
            selection[0].filled = true;
            selection[0].stroked = false;
    }else{
            for(n=0;n<selection[0].pathItems.length;n++){
                    selection[0].pathItems[n].filled = true;
                    selection[0].pathItems[n].stroked = false;
            };
     };
   var grpHachures = monCalque.groupItems.add();
   grpHachures.name = "grpHachures";
   var lignes = new Array();
   var p1 = new Array();
   var p2 = new Array();
           for (i=0;i<(perim)/espacement;i++){
                    lignes[i] = grpHachures.pathItems.add();
                    lignes[i].name = "ligne" + i
                    p1[i] = lignes[i].pathPoints.add();
                    p1[i].anchor = [x0, y0-(espacement*i)];
                    p1[i].rightDirection = p1[i].leftDirection = [p1[i].anchor[0]+poignees_p1_x,p1[i].anchor[1]+poignees_p1_y];
                    p2[i] = lignes[i].pathPoints.add();
                    p2[i].anchor = [(x0+perim), y0-(espacement*i)];
                    p2[i].rightDirection = p2[i].leftDirection = [p2[i].anchor[0]+poignees_p2_x,p2[i].anchor[1]+poignees_p2_y];
                    
                    lignes[i].stroked = true;
                    lignes[i].strokeWidth = epTrait;
                    if (ConserCoul){
                        lignes[i].strokeColor = couleur
                    }else{
                        lignes[i].strokeColor = coulParDefaut;
                    };
           };
    grpHachures.rotate(angle, true, false, false, false, Transformation.CENTER)
    grpHachures.left = x0-(grpHachures.width - L0)/2;
    grpHachures.top = y0+(grpHachures.height - H0)/2;
    var limGH_0=grpHachures.geometricBounds[0]-10;
    var limGH_1=grpHachures.geometricBounds[1]+10;
    var limGH_2=grpHachures.geometricBounds[2]+10;
    var limGH_3=grpHachures.geometricBounds[3]-10;
    var masque = monCalque.pathItems.add();
            masque.name = "masque";
            masque.setEntirePath([[limGH_0,limGH_1], [limGH_0, limGH_3], [limGH_2, limGH_3], [limGH_2, limGH_1]]);
            masque.closed = true;
    monCalque.selection = null;
    var groupeTemp = monCalque.groupItems.add();
    gBN(typeObj,"copieBaseSelection").move(groupeTemp, ElementPlacement.PLACEATBEGINNING)
    gBN("P","masque").move(groupeTemp, ElementPlacement.PLACEATBEGINNING)
    groupeTemp.selected = true;
    app.executeMenuCommand('compoundPath');
    gBN("G","grpHachures").selected = true;
    app.executeMenuCommand('ungroup');
     if (typeObj =="P"){app.executeMenuCommand('ungroup');};
    app.executeMenuCommand('Make Planet X');
    app.executeMenuCommand('Expand Planet X');
    app.executeMenuCommand('ungroup');
    var j=k=0;
           for (j;j<2;j++){
                       if(app.activeDocument.selection[j].pageItems[0].typename == "CompoundPathItem"){
                           k=j
                      };
                       if(app.activeDocument.selection[j].pageItems[0].filled == true){
                           k=j
                      };
           };
    app.activeDocument.selection[k].remove();
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function gBN(typeObj,objet) {
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    if (typeObj === "C") {
        monItem = monCalque.compoundPathItems.getByName(objet);
    }else if (typeObj === "G") {
        monItem = monCalque.groupItems.getByName(objet);
    }else{
        monItem = monCalque.pathItems.getByName(objet);
    };
    return (monItem);
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function verifDossierParam() {
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    var monDossier = new Folder(fichierParam.folder);
    if (!monDossier.exists) monDossier.create();
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function sauverParametres() {
//---------------------------------------------------------------------------------------------------------------------------------------------------------  
    try{
    var paramHach = new File(fichierParam.folder + fichierParam.name),
        donnees = [txtEspacement.text,txtAngle.text,txtEpTrait.text,ckbConserCoul.value].toString();
        paramHach.open('w');
        paramHach.write(donnees);
        paramHach.close();
    }catch(e){$.errorMessage(e);}
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function chargerParametres() {
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    var paramHach = File(fichierParam.folder + fichierParam.name);
    if (paramHach.exists) {
        try {
            paramHach.open('r');
            var donnees = paramHach.read().split('\n'),
            mesValeurs = donnees[0].split(',');
            txtEspacement.text = parseFloat(mesValeurs[0]);
            txtAngle.text = parseFloat(mesValeurs[1]);
            txtEpTrait.text = parseFloat(mesValeurs[2]);
            ckbConserCoul.value = (mesValeurs[3]==='true');
            } catch (e) {}
        paramHach.close();
    };
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function valider() {
//---------------------------------------------------------------------------------------------------------------------------------------------------------
   app.activeDocument.selection = null;
   gBN(typeObj,"baseSelection").selected = true;
    selection[0].name = "";
    perim = "";
    x0 = "";
    y0 = "";
    L0 = "";
    H0 = "";
};