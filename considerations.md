## Future Developer Considerations

If the README.md does not clarify enough - VegaPublish is a three-part system (editor interface, publishing frontend, and API (Saga)) with the addition of a command line tool.

The software was under active development by a team of developers until 2018ish and  was not picked up again until 2020 by (one) developer. While node versions kept updating, Vega did not - hence why many of the npm packages are out of date and rely on version 10 at the latest. Updating to use a newer version of node causes breaking changes.

The system is set to develop locally using different ports - e.g. 3000 (frontend), 3333 (editor), 4000 (API) and a MongoDB database (traditional MERN stack as far as I can tell).

Tested Passport.js (https://www.passportjs.org/) strategies that work within Saga (where they are set up) include Google OAuth, Github, and Outlook to use alongside university ADFS systems that employ Outlook mail.

Weird buggy things that I have noticed within Vega/Saga/Lyra -

Parts of Lyra  are unfinished and it is noted within the code itself. If an object is not assigned a type it breaks the entire system - e.g. the media object was given a type I made up (type: media).
