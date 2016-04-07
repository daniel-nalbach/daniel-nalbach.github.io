#Challenge

Hosted on http://daniel-nalbach.github.io

This is a project done for a particular client who wanted a proof of concept for a JavaScript code parsing system.

A quick demo, there may be bugs and issues in this project that need to be identified and fixed.

##Choice of Parsers
Both Esprima and Acorn were evaluated. Esprima was chosen for its superior documentation, active community, maturity, and excellent demos on their website.

##Vision
The client objective was to create a code testing framework that could provide feedback to a user on whether they created the required statements and structure.

I designed this project with the idea of a statement label system that would allow visual administration of settings in addition to supporting string arrays passed in as settings. This is different than the way that unit tests use a sentence type string.

There was not enough time in the project to perform the UI interactivity that I had originally intended. This was my first experience with a code parser, and it took more time than expected to come up to speed.

##Known Limitations

 - The structure parsing system only supports the top level of code in the syntax tree.
   - A later version would use recursion to support multiple levels of depth.
 - IE 8 does not work with this project currently.
   - There is an angular issue that needs to be resolved. The allotted time ran out before it could be addressed.
   - Lodash also needs to be dropped to a lower version.
 - White and black listed statements are not currently found inside other statement blocks, only at the top level.
   - Recursive tree parsing will resolve this in a future release.
 - Next release to contain a dictionary for user-facing terminology instead of syntax tree names
