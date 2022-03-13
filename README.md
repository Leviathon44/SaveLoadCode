# SaveLoadCode
**SaveCode &amp; LoadCode Library For Quest 5.8**


Check out the wiki page for more information on how to use this library: https://github.com/Leviathon44/SaveLoadCode/wiki


**Changelog:**

v1.0: 
* Release version

v2.0: 
* Added save/load support for objects created/destroyed during gameplay.


v3.0:
* Support for new game list attributes to help the author save game attributes and timers (see wiki for more details):
    * `game.SaveAtts`
    * `game.SaveTimers`

* Added additional validation checks to ensure that no banned delimiters are present in list or dictionary entries at time of saving.

* `SaveGameCode` now has a `ShowCodePopupFlag` boolean input parameter. When `SaveGameCode(True)` is called, the SaveCode popup box will appear as before. When `SaveGameCode(False)` is called, the popup box will NOT appear.

* `SaveGameCode` now returns the SaveString as an output. (i.e. If you set `X=SaveGameCode(False)` or `X=SaveGameCode(True)`, then X will equal the generated SaveString before it gets encoded to base64)

* New `SaveCheckpoint(CheckpointName)` and `LoadCheckpoint(CheckpointName)` functions! These functions allow you to save and load local checkpoints. See wiki for more details.

* The created SaveCode is now compressed (using excerpt from LZ-string library) to cut down on the length/filesize of the SaveString. This is especially useful now since adding the `SaveCheckpoint` function (as the savecode filesize would increase drastically with each checkpoint saved without compression).

* New `GetSaveGameCodeDelims()` function. This function returns a stringlist of delimiters used by the `SaveGameCode` function. Useful for allowing you to check if user-entered input (i.e. like a "type in your name" input) contains a banned delimiter that would cause issues saving later.

* New `GetSaveCheckpointDelims()` function. This function returns a stringlist of delimiters used by the `SaveCheckpoint` function. Useful for allowing you to check if user-entered input (i.e. like a "type in your name" input) contains a banned delimiter that would cause issues saving later.

