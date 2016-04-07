#Challenge

Hosted on http://daniel-nalbach.github.io

This is a project done for a particular client who wanted a proof of concept for a JavaScript code parsing system.

A quick demo, there may be bugs and issues in this project that need to be identified and fixed.

##Choice of Parsers
Both Esprima and Acorn were evaluated. Esprima was chosen for its superior documentation, active community, maturity, and excellent demos on their website.

##Known Limitations

 - The structure parsing system only supports the top level of code in the syntax tree.
   - A later version could use recursion to support multiple levels of depth.

