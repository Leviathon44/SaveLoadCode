//Converts Strings to Base64 for the SaveGame code functionality
function showPopupSave(text) {
    try {
	//Original Popup Function Courtesy of KV. Altered slightly for our specific save code popup.
	$('#msgboxCaption').html(text);

    var msgboxOptions = {
        modal: true,
        autoOpen: false,
        title: "Save Game Code",
        width: "650px",
        height: "auto",
        buttons: [
			{
			    text: 'Copy To Clipboard',
			    //click: function () { $(this).dialog('close'); }
				click: function () {  
					// Select the SaveCode text  
					var SaveCode = document.querySelector('#msgboxCaption');  
					var range = document.createRange();  
					range.selectNode(SaveCode);  
					window.getSelection().addRange(range);  

					try {  
						// Execute the copy command on selected text
						var successful = document.execCommand('copy');  
						//var msg = successful ? 'successful' : 'unsuccessful';  
						//console.log('Copy email command was ' + msg);  
					} 					
					catch(err) {  
					//console.log('Oops, unable to copy');  
					}  

					// Remove the selections 
					window.getSelection().removeAllRanges();  
}
			},
        ],
        closeOnEscape: false,
    };

    $('#msgbox').dialog(msgboxOptions);
    $('#msgbox').dialog('open');
	}
	catch(err) {
		ASLEvent("Log", err);
	}
};

function ConvertToBase64(string) {
  if (string != null && string != "") {
	  try {
	    conversion = btoa(string)
	  }
	  catch(err) {
		conversion = "Error: "+err
	  }
	  finally {
        return conversion;
		//ASLEvent("Log", conversion);	//For Debugging
	  }
  }
}

function ConvertFromBase64(string) {
	if (string != null && string != "") {
      try {
	    conversion = atob(string)
	  }
	  catch(err) {
		conversion = "Error: "+err
	  }
	  finally {
        return conversion;
		//ASLEvent("Log", conversion);	//For Debugging
	  }
    }
}

function CreateSaveCode(string) {
	//Convert the saved attribute data to Base64 to make it harder for the player to manually alter
	converted = ConvertToBase64(string);
	//Post the created Save Code to the player for them to copy and save
	showPopupSave(converted);
}

function LoadSaveCode(LoadCode) {
	//Check if loaded code is encoded in Base64. The SaveGame() code has game.gameid as it's first parameter, so if first 4 characters are "game", assume it hasn't been encoded.
	first4char = LoadCode.substring(0, 4);
	if (first4char == "game") {
		var P = LoadCode
	}
	else {
		var P = ConvertFromBase64(LoadCode)
	}
	//Send the loadcode back to the LoadGame() function in Quest
	ASLEvent("LoadGameCode", P);
}

function LoadGamePrompt() {
	$('#msgboxCaption').html("<form id='LoadCodeForm'><textarea id='LoadCodeBox' cols='55' rows='11' style='overflow:auto;max-width:100%'></textarea></form>");

    var msgboxOptions = {
        modal: true,
        autoOpen: false,
        title: "Paste SaveCode to Load",
		width: "650px",
        buttons: [
			{
			    text: 'Load Saved Game',
				click: function () {  
					// On click, retrieve the pasted load code from the textbox   
					var LoadCode = $("#LoadCodeBox").val();
					if (LoadCode != null && LoadCode != "") {
					  $(this).dialog('close');
					  //document.getElementById("#LoadCodeForm").submit();
					  //var LoadCode = document.getElementById('#LoadCodeBox').value;
					  LoadSaveCode(LoadCode);
					}
}
			},
        ],
        closeOnEscape: false,
    };

    $('#msgbox').dialog(msgboxOptions);
    $('#msgbox').dialog('open');
};