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


v4.0:
* **BugFixes:**
    * Fixed a bug where functions were previously not properly checking for the D4 parameter in attributenames and attribute values. Fixed now.

    * Added a check to the `game.SaveAtts` variable to check for banned delimiters in the same way it checks for them with other objects/exits.

* **New Features:**
    * Support for new game script attribute to allow author to have certain scripts run after every load: `game.AfterLoadCodeScript`

    * Will now save ALL screen contents at time of save, and properly restore them on load!

    * Added support to check for an `ExcludeSaveAtts` string list attribute on ANY object. This string list should contain the string names of any attributes on the object that you explicitly DON'T want saved. 
        * When saving, it will check the list and see if this attribute exists. If it does, it WON'T save that attribute to the SaveCode
        * Should work for both objects AND exits. 
        * *Reminder that this attribute is not necessary for the `game` object (as saving game attributes requires inclusive callouts, rather than exclusive exclusions.)*

    * Added support to check for a `game.LoadGameCode_OldestVersion` attribute that will replace the hard-coded `OldestAllowedVersion` variable in `LoadGameCode` and `LoadCheckpoint`, if found.
        * This way you can note the oldest allowed version to load within your game rather than having to directly edit your copy of the SaveLoadCodeFunctionsLibrary.
        * Should be of datatype 'double', or at least a string or int that can be converted to a double (otherwise an error will be thrown).
        * If `game.LoadGameCode_OldestVersion` not found, then it will default to a hard-coded value (=0.0 in the SaveLoadCode Library by default).

    * The default delimiters have been changed to less-common characters. Specifically: 
        * D1 has been changed from `|` to `∂`
        * D2 has been changed from `$` to `∏` 
        * D4 has been changed from `@` to `∑`
        * *D3 remains `;` as it is meant to be the delimiter used to separate lists, which is still `;` in Quest, by default*
