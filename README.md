# SaveLoadCode
**SaveCode &amp; LoadCode Library For Quest 5.8**


Check out the wiki page for more information on how to use this library: https://github.com/Leviathon44/SaveLoadCode/wiki


**Changelog:**

**v1.0:** 
* Release version

**v2.0:**
* Added save/load support for objects created/destroyed during gameplay.


**v3.0:**
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


**v4.0:**
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


**v5.0 - ("Final" Version):**
* **BugFixes:**
    * Fixed a major bug that was preventing checkpoints from persisting properly across SaveCodes. Should be working now.
    
    * The library will now properly save and persist whether `{once}` and `{notfirst}` textprocessor commands have triggered (stored by the built-in `game.textprocessor_seen` attribute)!

* **New Features:**
    * `SaveGameCode` and `SaveGameCheckpoint` now save additional game parameters by default (that get made in-game by the baseline Quest 5.8). See wiki for details if interested.

    * `LoadGameCode` and `LoadGameCheckpoint` can now handle `game.version` entries with more than two decimal levels, (however they will still only compare the first two levels and ignore everything after the second decimal when determining compatibility). See Limitations section of wiki for more details.
    
    * Added `firsttimeSLC (idString) {script}` and `otherwiseSLC (idString) {script}` to replace the base `firsttime{}` and `otherwise{}`, making firsttime/otherwise capabilities compatible with the SaveLoadCode Library! **See install instructions and wiki for details on how to use!**
        * Simply replace all existing "firsttime {" occurences with "first_timeSLC("") {" and replace all existing "otherwise {" occurences with "other_wiseSLC("") {" and it should work as long as no two firsttime or otherwise instances share the same code. 
        * If two or more instances DO share the same code (comments do not count), simply add your own custom `idString` as input instead of an empty string. _**NOTE** that first_timeSLC and other_wiseSLC pairs must EACH have their own DIFFERENT uniqueids for them to behave properly._ Again, see the install instructions and wiki for further details.
