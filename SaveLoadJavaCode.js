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
					} 					
					catch(err) {  
					console.log(err);  
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
		console.log(err);
	}
};

function ConvertToBase64(string) {
  if (string != null && string != "") {
	  try {
	    conversion = btoa(string)
	  }
	  catch(err) {
		conversion = "Error: "+err
		console.log(conversion)
	  }
	  finally {
        return conversion;
		//ASLEvent("Log", conversion);	//For Debugging
	  }
  }
};

function ConvertFromBase64(string) {
	if (string != null && string != "") {
      try {
	    conversion = atob(string)
	  }
	  catch(err) {
		conversion = "Error: "+err
		console.log(conversion)
	  }
	  finally {
        return conversion;
		//ASLEvent("Log", conversion);	//For Debugging
	  }
    }
};

function SaveCheckpoint(stringCheck, CheckpointName) {
	//New with v4.0, copy all text currently on screen to be loaded later
	//Add @@$%$@@ checkpoint delimiter
	var ScreenTextCheck = "@@$%$@@" + document.querySelector('div#divOutput').innerHTML;
	//ScreenTextCheck += document.querySelector('div#divOutput').innerHTML;
	//Replace all double-quotes with single quotes so Quest can pass it through JS.eval later
	ScreenTextCheck = ScreenTextCheck.replace(/"/g, "'");
	//There's extra space in the HTML that will cause problems when we try to pass it back into Quest and innerHTML. Let's remove that...
	ScreenTextCheck = ScreenTextCheck.replace(/(?:\r\n|\r|\n)/g, '')
	ScreenTextCheck = ScreenTextCheck.replace("@@$%$@@            <div", "@@$%$@@<div")
	ScreenTextCheck = ScreenTextCheck.replace("</div>                    <div", "</div><div")
	//Add screen contents to end of savestring
	stringCheck += ScreenTextCheck
	//Also copy the location text at top of screen for later
	var LocationTextCheck = "@@$%$@@" + document.getElementById('location').textContent
	//LocationTextCheck += document.getElementById('location').textContent
	stringCheck += LocationTextCheck
	//Add CheckpointName to end of string. It has its own delimiter !@@$%$@@!
	var ChkPtDelim = "!@@$%$@@!" + CheckpointName
	//ChkPtDelim += CheckpointName
	stringCheck += ChkPtDelim
	//Send to Quest function SaveLoadCode_StoreCheckpoint() to store the (un-converted) string to the game.checkpoints dictionary
	ASLEvent("SaveLoadCode_StoreCheckpoint", stringCheck);
};

function CreateSaveCode(stringSC) {
	//New with v4.0, copy all text currently on screen to be loaded later
	console.log("FLAG1: "+stringSC)
	//Add @@&%&@@ delimiter
	var ScreenText = "@@&%&@@" + document.querySelector('div#divOutput').innerHTML;
	//ScreenText += document.querySelector('div#divOutput').innerHTML;
	//Replace all double-quotes with single quotes so Quest can pass it through JS.eval later
	ScreenText = ScreenText.replace(/"/g, "'");
	//There's extra space in the HTML that will cause problems when we try to pass it back into Quest and innerHTML. Let's remove that...
	ScreenText = ScreenText.replace(/(?:\r\n|\r|\n)/g, '')
	ScreenText = ScreenText.replace("@@&%&@@            <div", "@@&%&@@<div")
	ScreenText = ScreenText.replace("</div>                    <div", "</div><div")
	//Add screen contents to end of savestring
	stringSC += ScreenText
	//Also copy the location text at top of screen for later
	var LocationText = "@@&%&@@" + document.getElementById('location').textContent
	//LocationText += document.getElementById('location').textContent
	stringSC += LocationText
	//Convert the saved attribute data to Base64 to make it harder for the player to manually alter
	//converted = ConvertToBase64(string);
	console.log("FLAG2: "+stringSC)
	var converted = compressToBase64(stringSC)
	//Post the created Save Code to the player for them to copy and save
	showPopupSave(converted);
};

function ReplaceScreenHTMLContent(StringInput) {
	//In Quest, the contents of the screen are under the <div> header with id="divOutput".
	document.querySelector('div#divOutput').innerHTML = StringInput
	_currentDiv = $("#outputData").attr("data-currentdiv")
    _divCount = parseInt($("#outputData").attr("data-divcount"))
};

function LoadSaveCode(LoadCode) {
	//Check if loaded code is encoded in Base64. The SaveGame() code has game.gameid as it's first parameter, so if first 4 characters are "game", assume it hasn't been encoded.
	first4char = LoadCode.substring(0, 4);
	if (first4char == "game") {
		var P = LoadCode
	}
	else {
		//var P = ConvertFromBase64(LoadCode)
		var P = decompressFromBase64(LoadCode)
	}
	//Send the loadcode back to the LoadGame() function in Quest
	ASLEvent("LoadGameCode", P);
};

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
					  $('div.ui-widget-overlay.ui-front').css('cursor', 'wait');
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



// The below is adapted from Pieroxy's LZ-string javascript library. An excerpt from LZ-string was pulled in and adapted to allow for string compression to cut down on the length of the savecode (especially when the savecode contains multiple checkpoints)...

// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4

function getBaseValue(alphabet, character) {
  var f = String.fromCharCode;
  var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
  var baseReverseDic = {};
  if (!baseReverseDic[alphabet]) {
    baseReverseDic[alphabet] = {};
    for (var i=0 ; i<alphabet.length ; i++) {
      baseReverseDic[alphabet][alphabet.charAt(i)] = i;
    }
  }
  return baseReverseDic[alphabet][character];
}

function compressToBase64(input) {
    try {
	  var f = String.fromCharCode;
      var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
      var baseReverseDic = {};
      if (input == null) return "";
      var res = _compress(input, 6, function(a){return keyStrBase64.charAt(a);});
      switch (res.length % 4) { // To produce valid Base64
      default: // When could this happen ?
      case 0 : return res;
      case 1 : return res+"===";
      case 2 : return res+"==";
      case 3 : return res+"=";
      }
    }
	catch(err) {
	return "Error: "+err;
	}
}

function decompressFromBase64(input) {
    try {
	  var f = String.fromCharCode;
      var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
      var baseReverseDic = {};
      if (input == null) return "";
      if (input == "") return null;
      return _decompress(input.length, 32, function(index) { return getBaseValue(keyStrBase64, input.charAt(index)); });
    }
	catch(err) {
	  return "Error: "+err;
	}
}

function compress(uncompressed) {
    return _compress(uncompressed, 16, function(a){return f(a);});
}
   
function _compress(uncompressed, bitsPerChar, getCharFromInt) {
  try {
	var f = String.fromCharCode;
    var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
    var baseReverseDic = {};
    if (uncompressed == null) return "";
    var i, value,
        context_dictionary= {},
        context_dictionaryToCreate= {},
        context_c="",
        context_wc="",
        context_w="",
        context_enlargeIn= 2, // Compensate for the first entry which should not count
        context_dictSize= 3,
        context_numBits= 2,
        context_data=[],
        context_data_val=0,
        context_data_position=0,
        ii;

    for (ii = 0; ii < uncompressed.length; ii += 1) {
      context_c = uncompressed.charAt(ii);
      if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
        context_dictionary[context_c] = context_dictSize++;
        context_dictionaryToCreate[context_c] = true;
      }

      context_wc = context_w + context_c;
      if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
        context_w = context_wc;
      } else {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
          if (context_w.charCodeAt(0)<256) {
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<8 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          } else {
            value = 1;
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1) | value;
              if (context_data_position ==bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<16 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }


        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        // Add wc to the dictionary.
        context_dictionary[context_wc] = context_dictSize++;
        context_w = String(context_c);
      }
    }

    // Output the code for w.
    if (context_w !== "") {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
        if (context_w.charCodeAt(0)<256) {
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<8 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<16 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        delete context_dictionaryToCreate[context_w];
      } else {
        value = context_dictionary[context_w];
        for (i=0 ; i<context_numBits ; i++) {
          context_data_val = (context_data_val << 1) | (value&1);
          if (context_data_position == bitsPerChar-1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }


      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
    }

    // Mark the end of the stream
    value = 2;
    for (i=0 ; i<context_numBits ; i++) {
      context_data_val = (context_data_val << 1) | (value&1);
      if (context_data_position == bitsPerChar-1) {
        context_data_position = 0;
        context_data.push(getCharFromInt(context_data_val));
        context_data_val = 0;
      } else {
        context_data_position++;
      }
      value = value >> 1;
    }

    // Flush the last char
    while (true) {
      context_data_val = (context_data_val << 1);
      if (context_data_position == bitsPerChar-1) {
        context_data.push(getCharFromInt(context_data_val));
        break;
      }
      else context_data_position++;
    }
    return context_data.join('');
  }
  catch(err) {
    return "Error: "+err;
  }
}

function decompress(compressed) {
    if (compressed == null) return "";
    if (compressed == "") return null;
    return _decompress(compressed.length, 32768, function(index) { return compressed.charCodeAt(index); });
}

function _decompress(length, resetValue, getNextValue) {
  try {
	var f = String.fromCharCode;
    var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
    var baseReverseDic = {};
    var dictionary = [],
        next,
        enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        entry = "",
        result = [],
        i,
        w,
        bits, resb, maxpower, power,
        c,
        data = {val:getNextValue(0), position:resetValue, index:1};

    for (i = 0; i < 3; i += 1) {
      dictionary[i] = i;
    }

    bits = 0;
    maxpower = Math.pow(2,2);
    power=1;
    while (power!=maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index++);
      }
      bits |= (resb>0 ? 1 : 0) * power;
      power <<= 1;
    }

    switch (next = bits) {
      case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 2:
        return "";
    }
    dictionary[3] = c;
    w = c;
    result.push(c);
    while (true) {
      if (data.index > length) {
        return "";
      }

      bits = 0;
      maxpower = Math.pow(2,numBits);
      power=1;
      while (power!=maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb>0 ? 1 : 0) * power;
        power <<= 1;
      }

      switch (c = bits) {
        case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }

          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 2:
          return result.join('');
      }

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

      if (dictionary[c]) {
        entry = dictionary[c];
      } else {
        if (c === dictSize) {
          entry = w + w.charAt(0);
        } else {
          return null;
        }
      }
      result.push(entry);

      // Add w+entry[0] to the dictionary.
      dictionary[dictSize++] = w + entry.charAt(0);
      enlargeIn--;

      w = entry;

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

    }
  }
  catch(err) {
	return "Error: "+err;
  }
}