/*
  
  Sis.
  
  Ok, so. The first thing is to use Express. It's a package for Node that folk made
  and it makes servers.

*/

express = require ( 'express' );

/*
  
  When you're hosting it, this is the file that runs on the hosting's server computer,
  and Express lets us tell it what to do.
  
*/

app = express ( );

/*
  
  Since this app will run entirely in the browser, we're just using this to serve
  files. The use method adds simple behaviors to the app. Static is the name
  of this particular behavior of express and 'public' is the folder where it can
  find those files.

*/

app.use( express.static('public') );

/*

  This runs the express server. 3000 is the port, which if you want to deploy it
  on the web, will be 80. It's a different number for development, since your
  computer's already using 80 for browsing the web.
  
*/

app.listen ( 3000 );
