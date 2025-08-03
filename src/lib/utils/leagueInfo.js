/*   STEP 1   */
export const leagueID = "1253040502786228224"; // your league ID
export const leagueName = "Irving Champions League"; // your league name
export const dues = 100; // (optional) used in template constitution page
export const dynasty = false; // true for dynasty leagues, false for redraft and keeper
export const enableBlog = true; // requires VITE_CONTENTFUL_ACCESS_TOKEN and VITE_CONTENTFUL_SPACE environment variables

/*   STEP 2   */
export const homepageText = `
  
  <p>Introducing the Irving Champions League.</p>
  <p>Born from the ashes of two legendary leagues—The Irving League and DTSP—the <strong>Irving Champions League</strong> unites the fiercest competitors into one ultimate arena. This is no ordinary fantasy football league; it’s a clash of titans, where the best of the best now battle for a single crown. Rivalries are reborn, egos are on the line, and every decision matters. With new alliances, elevated stakes, and unmatched intensity, the <strong>Irving Champions League</strong> marks a new era of dominance. Two leagues may have ended—but from their legacy, a champion’s league rises. Only one will emerge victorious.</p>
  <p><strong>Welcome to the next chapter.</strong></p>
`;

/*   STEP 3   */
/*
3 managers as an example. Uncomment (remove the //) before each line to make it live code
If you're having trouble, reference the Training Wheels' Manager Section
https://github.com/nmelhado/league-page/blob/master/TRAINING_WHEELS.md#ii-adding-managers-and-changing-the-homepage-text
*/

// To omit an optional field, set it's value to null

export const managers = [
       {
        // array number 0
      "managerID": "1253772062900621312",
      "name": "Dave Oliverio",
      "teamName": "Lehigh Crucible", // (optional) team name, if not provided, will default to manager's name
      "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      "location": "PA", // (optional)
      "bio": "Drafted on vibes, fueled by snacks. Fantasy genius? Nope. Lucky? Absolutely. Trash talker? Always.",
      "photo": "/managers/crucible.png", // square ratio recommended (no larger than 500x500)
      "fantasyStart": 2004, // (optional) when did the manager start playing fantasy football
      "favoriteTeam": "nyg", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      "rival": {
        name: "Kevin", // Can be anything (usually your rival's name)
        link: 5, // manager array number within this array, or null to link back to all managers page
        image: "/managers/nakatomi.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      },
      "yearsOfService": "Twenty", // (optional) How Many Years has the manager been in the league? 'Ten' 'Twenty'
      "persona": "The Wolf", // (optional) 'The Wolf', 'The Kornacki', 'The Littlefinger', 'The Flacco'
      "philosophy": "Spend it all on 4 players and hope for the best",
      "championship": {
        league: 'Irving',  //'Irving', 'DTSP', or 'ICL' Won championship
        years: '2004'    // years(s) the manager won the championship, separated by commas
      },
      "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
      
    },
    {

    // array number 1
      "name": "Jeff Cohn",
      "teamName": "Ultimate City Warriors", // (optional) team name, if not provided, will default to manager's name
      "managerID": "76521957268799488",
      "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      "location": "FL", // (optional)
      "bio": "Heat, hustle, and havoc — Westlake Warriors bring the smack talk",
      "photo": "/managers/warriors.png", // square ratio recommended (no larger than 500x500)
      "fantasyStart": 2004, // (optional) when did the manager start playing fantasy football
      "favoriteTeam": "mia", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      "rival": {
        name: "Jamie", // Can be anything (usually your rival's name)
        link: 2, // manager array number within this array, or null to link back to all managers page
        image: "/managers/warriors.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      },
      "yearsOfService": "Twenty", // (optional) How Many Years has the manager been in the league? 'Ten' 'Twenty'
      "persona": "The Littlefinger", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
      "philosophy": "Analyze, Analyze, Analyze. ",
      "championship": {     
        league: 'Irving',  //'Irving', 'DTSP', or 'ICL' Won championship
        years: '2009, 2011, 2019, 2021'    // years(s) the manager won the championship, separated by commas
      },
      "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
    },
  {
    // array number 2
    "name": "Jamie Cohn",
    "teamName": "Dagobah Lightsabres", // (optional) team name, if not provided, will default to manager's name
      "managerID": "1253515645044133888",
      "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      "location": "FL", // (optional)
      "bio": "The Dagobah Lightsabres blend Jedi focus with fantasy football firepower. Guided by the Force and fearless strategy, they strike down opponents with precision, turning every matchup into an intergalactic battle for league dominance.",
      "photo": "/managers/lightsabres.png", // square ratio recommended (no larger than 500x500)
      "fantasyStart": 2004, // (optional) when did the manager start playing fantasy football
      "favoriteTeam": "pit", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      "rival": {
        name: "Jeff", // Can be anything (usually your rival's name)
        link: 1, // manager array number within this array, or null to link back to all managers page
        image: "/managers/warriors.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      },
      "yearsOfService": "Twenty", // (optional) How Many Years has the manager been in the league? 'Ten' 'Twenty'
      "persona": "The Kornacki", // (optional) 'The Wolf', 'The Kornacki', 'The Littlefinger', 'The Flacco'
      "philosophy": "Trust the Force. Draft wisely. Strike fast. Dominate every matchup.",
      "championship": {     
        league: 'Irving',  //'Irving', 'DTSP', or 'ICL' Won championship
        years: '2008, 2018'    // years(s) the manager won the championship, separated by commas
      },  
      "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
      },
      {
        // array number 3
      "name": "Kenny Case",
      "teamName": "Rebel Radio Lone Rangers", // (optional) team name, if not provided, will default to manager's name
      "managerID": "1005329348477419520",
      "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      "location": "FL", // (optional)
      "bio": "The Lone Rangers? That's original. How can you pluralize 'Lone Ranger'?",
      "photo": "/managers/loneRangers.png", // square ratio recommended (no larger than 500x500)
      "fantasyStart": 2011, // (optional) when did the manager start playing fantasy football
      "favoriteTeam": "ne", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      "rival": {
        name: "James Barmore", // Can be anything (usually your rival's name)
        link: 10, // manager array number within this array, or null to link back to all managers page
        image: "/managers/homers.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      },
      "yearsOfService": "Ten", // (optional) How Many Years has the manager been in the league? 'Ten' 'Twenty'
      "persona": "The Flacco", // (optional) 'The Wolf', 'The Kornacki', 'The Littlefinger', 'The Flacco'
      "philosophy": "If it's too loud, you're too old.",
      "championship": {     
        league: 'Irving',  //'Irving', 'DTSP', or 'ICL' Won championship
        years: '2013, 2017'    // years(s) the manager won the championship, separated by commas
      },  
      "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
      }, 
      {
        // array number 4
      "name": "Clifton McVay",
      "teamName": "Salem Hipsterjacks", // (optional) team name, if not provided, will default to manager's name
      "managerID": "1254577682394386432",
      "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      "location": "FL", // (optional)
      "bio": "Fueled by cold brew and fourth-down boldness, the Salem Hipsterjacks bring arcane instincts and vintage swagger to the gridiron. They draft like it’s vinyl-only and call plays like it’s always a foggy Sunday in October.",
      "photo": "/managers/hipsterJacks.png", // square ratio recommended (no larger than 500x500)
      "fantasyStart": 2015, // (optional) when did the manager start playing fantasy football
      "favoriteTeam": "gb", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      "rival": {
        name: "Brian James", // Can be anything (usually your rival's name)
        link: 13, // manager array number within this array, or null to link back to all managers page
        image: "/managers/kodachromes.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      },
      "yearsOfService": "Ten", // (optional) How Many Years has the manager been in the league? 'Ten' 'Twenty'
      "persona": "The Wolf", // (optional) 'The Wolf', 'The Kornacki', 'The Littlefinger', 'The Flacco'
      "philosophy": "Unpredictable, unconventional, and unbothered",
      "championship": {     
        league: 'DTSP',  //'Irving', 'DTSP', or 'ICL' Won championship
        years: '2023'    // years(s) the manager won the championship, separated by commas
      },  
      "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
      },
      {
        //array number 5
      "name": "Kevin Flanagan",
      "teamName": "Nakatomi Custodial Crew", // (optional) team name, if not provided, will default to manager's name 
      "managerID": "1254577895943192576",
      "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      "location": "CT", // (optional)
      "bio": "When fantasy turns Die Hard, the Nakatomi Custodial Crew cleans up. Waiver wire wizards with duct tape grit—yippee-ki-yay, matchup problems.",
      "photo": "/managers/nakatomi.png", // square ratio recommended (no larger than 500x500)
      "fantasyStart": 2005, // (optional) when did the manager start playing fantasy football
      "favoriteTeam": "ne", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      "rival": {
        name: "Dave", // Can be anything (usually your rival's name)
        link: 0, // manager array number within this array, or null to link back to all managers page
        image: "/managers/crucible.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      },
      "yearsOfService": "Twenty", // (optional) How Many Years has the manager been in the league? 'Ten' 'Twenty'
      "persona": "The Littlefinger", // (optional) 'The Wolf', 'The Kornacki', 'The Littlefinger', 'The Flacco'
      "philosophy": "Every week’s a hostage situation, and I’m the negotiator",
      "championship": {     
        league: 'Irving',  //'Irving', 'DTSP', or 'ICL' Won championship
        years: '2016, 2023, 2024'    // years(s) the manager won the championship, separated by commas
      },  
      "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
      },
       {
        //array number 6
      "name": "Drew Goodwin",
      "teamName": "Amherst Union", // (optional) team name, if not provided, will default to manager's name 
      "managerID": "1254578120531390464",
      "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      "location": "FL", // (optional)
      "bio": "Forged in group chats and fueled by spite, Amherst Union stands united against bad trades, bye weeks, and commissioner tyranny. Drafted with pride, managed with memes—solidarity has never been so scrappy.",
      "photo": "/managers/union.png", // square ratio recommended (no larger than 500x500)
      "fantasyStart": 2022, // (optional) when did the manager start playing fantasy football
      "favoriteTeam": "cle", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      "rival": {
        name: "Brian Chorney", // Can be anything (usually your rival's name)
        link: 11, // manager array number within this array, or null to link back to all managers page
        image: "/managers/rabid.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      },
      "yearsOfService": null, // (optional) How Many Years has the manager been in the league? 'Ten' 'Twenty'
      "persona": "The Flacco", // (optional) 'The Wolf', 'The Kornacki', 'The Littlefinger', 'The Flacco'
      "philosophy": "Solidarity over strategy, chaos with a cause.",
      "championship": {     
        league: 'DTSP',  //'Irving', 'DTSP', or 'ICL' Won championship
        years: '2024'    // years(s) the manager won the championship, separated by commas
      },  
      "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
      },
        {
          //array number 7
      "name": "Jason Gray", 
      "teamName": "Milford Jayhawks", 
      "managerID": "1254584226238447616",
      "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      "location": "CT", // (optional)
      "bio": "Hailing from the heart of small-town grit, the Milford Jayhawks soar with old-school pride and new-school hustle. Built on discipline, instinct, and just a touch of stubbornness—they don’t just play to win, they play to prove a point.",
      "photo": "/managers/jayhawks.png", // square ratio recommended (no larger than 500x500)
      "fantasyStart": 2004, // (optional) when did the manager start playing fantasy football
      "favoriteTeam": "mia", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      "rival": {
        name: "Adam", // Can be anything (usually your rival's name)
        link: 9, // manager array number within this array, or null to link back to all managers page
        image: "/managers/mounties.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      },
      "yearsOfService": "Twenty", // (optional) How Many Years has the manager been in the league? 'Ten' 'Twenty'
      "persona": "The Flacco", // (optional) 'The Wolf', 'The Kornacki', 'The Littlefinger', 'The Flacco'
      "philosophy": "Fly straight, hit hard, never back down",
      "championship": {     
        league: 'Irving',  //'Irving', 'DTSP', or 'ICL' Won championship
        years: '2005'    // years(s) the manager won the championship, separated by commas
      },  
      "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
      },
      {
        // array number 8
      "name": "Romano DeSimone",
      "teamName": "Jacksonville Vincitori", // (optional) team name, if not provided, will default to manager's name
      "managerID": "792114259365597184",
      "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      "location": "FL", // (optional)
      "bio": "Fueled by Duval spirit and Italian swagger, the Jacksonville Vincitori are here to conquer. Bold, relentless, and always hunting victory, this squad dominates Sundays with ruthless efficiency and unwavering confidence.",
      "photo": "/managers/vincitori.png", // square ratio recommended (no larger than 500x500)
      "fantasyStart": 2015, // (optional) when did the manager start playing fantasy football
      "favoriteTeam": "ne", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      "rival": {
        name: "Brian Marx", // Can be anything (usually your rival's name)
        link: 13, // manager array number within this array, or null to link back to all managers page
        image: "/managers/tribe.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      },
      "yearsOfService": "Ten", // (optional) How Many Years has the manager been in the league? 'Ten' 'Twenty'
      "persona": "The Flacco", // (optional) 'The Wolf', 'The Kornacki', 'The Littlefinger', 'The Flacco'
      "philosophy": "Victory is earned through preparation, discipline, and fearless ambition.",
      "championship": {     
        league: 'DTSP',  //'Irving', 'DTSP', or 'ICL' Won championship
        years: '2016, 2017, 2018'    // years(s) the manager won the championship, separated by commas
      },
      "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
      },
      // {
      //   // array number 9
      // "name": "Adam Lopiano",
      // "teamName": "Saskatchewan Mounties", // (optional) team name, if not provided, will default to manager's name
      // "managerID": "",
      // "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      // "location": "CT", // (optional)
      // "bio": "The Saskatchewan Mounties ride with pride, grit, and icy resolve. Patrolling the fantasy frontier with iron will and northern toughness, this squad enforces dominance with old-school grit and cold-blooded precision. Respect is earned — and the Mounties always get their win.",
      // "photo": "/managers/mounties.png", // square ratio recommended (no larger than 500x500)
      // "fantasyStart": 2004, // (optional) when did the manager start playing fantasy football
      // "favoriteTeam": "nyg", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      // "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      // "rival": {
      //   name: "Jay", // Can be anything (usually your rival's name)
      //   link: 7, // manager array number within this array, or null to link back to all managers page
      //   image: "/managers/jayhawks.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      // },
      // "yearsOfService": "Twenty", // (optional) How Many Years has the manager been in the league? 'Ten' 'Twenty')
      // "persona": "The Flacco", // (optional) 'The Wolf', 'The Kornacki', 'The Littlefinger', 'The Flacco'
      // "philosophy": "Steady as the snow, fierce as the moose.",
      // "championship": {     
      //  league: 'Irving',  //'Irving', 'DTSP', or 'ICL' Won championship
      //  years: '2006'    // years(s) the manager won the championship, separated by commas
      // },  
      // "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
      // },
        {
        // array number 10
      "name": "James Barmore",
      "teamName": "Dunedin Homers", // (optional) team name, if not provided, will default to manager's name
      "managerID": "1256695342544453632",
      "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      "location": "FL", // (optional)
      "bio": "The Dunedin Homers run a tight ship built on discipline, data, and deep analytics. Every roster move is calculated, every matchup dissected. No flash, just fundamentals. Rooted in precision and powered by performance metrics, the Homers don’t chase hype — they chase wins.",
      "photo": "/managers/homers.png", // square ratio recommended (no larger than 500x500)
      "fantasyStart": 2007, // (optional) when did the manager start playing fantasy football
      "favoriteTeam": "tb", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      "rival": {
        name: "Kenny", // Can be anything (usually your rival's name)
        link: 3, // manager array number within this array, or null to link back to all managers page
        image: "/managers/lightsabres.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      },
      "yearsOfService": "Ten", // (optional) How Many Years has the manager been in the league? 'Ten' 'Twenty'
      "persona": "The Kornacki", // (optional) 'The Wolf', 'The Kornacki', 'The Littlefinger', 'The Flacco'
      "philosophy": "Trust the data. Execute the plan. Win with precision.",
      "championship": {     
        league: 'Irving',  //'Irving', 'DTSP', or 'ICL' Won championship
        years: '2020'    // years(s) the manager won the championship, separated by commas
      },  
      "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
      },
      {
        // array number 11
      "name": "Brian Chorney",
      "teamName": "D.C. Rabid Dogs", // (optional) team name, if not provided, will default to manager's name 
      "managerID": "733869885704261632",
      "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      "location": "FL", // (optional)
      "bio": "The D.C. Rabid Dogs play with unhinged intensity and a hunger that never quits. Fueled by chaos and capital city grit, this squad attacks every matchup with snarling energy and no mercy. Once they’ve got a lead, they don’t let go — they bite down and finish the job.",
      "photo": "/managers/rabid.png", // square ratio recommended (no larger than 500x500)
      "fantasyStart": 2018, // (optional) when did the manager start playing fantasy football
      "favoriteTeam": "phi", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      "rival": {
        name: "Drew Goodwin", // Can be anything (usually your rival's name)
        link: 6, // manager array number within this array, or null to link back to all managers page
        image: "/managers/union.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      },
      "yearsOfService": null, // (optional) How Many Years has the manager been in the league? 'Ten' 'Twenty'
      "persona": "The Kornacki", // (optional) 'The Wolf', 'The Kornacki', 'The Littlefinger', 'The Flacco'
      "philosophy": "Unleash chaos. Control the game.",
      "championship": {     
        league: null,  //'Irving', 'DTSP', or 'ICL' Won championship
        years: null    // years(s) the manager won the championship, separated by commas
      },  
      "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
      },
        {
        // array number 12
      "name": "Brian James",
      "teamName": "Kansas City Kodachromes", // (optional) team name, if not provided, will default to manager's name
      "managerID": "1256320322135674880",
      "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      "location": "FL", // (optional)
      "bio": "The Kansas City Kodachromes play fantasy football with vintage flair and bold precision. Inspired by classic film, they thrive on vivid matchups, boom-or-bust drama, and highlight-worthy moments. Every week is a reel in the making—colorful, unpredictable, and unforgettable. This team doesn’t just win—they develop greatness in full color.",
      "photo": "/managers/kodachromes.png", // square ratio recommended (no larger than 500x500)
      "fantasyStart": 2018, // (optional) when did the manager start playing fantasy football
      "favoriteTeam": "kc", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      "rival": {
        name: "Biran Chorney", // Can be anything (usually your rival's name)
        link: 11, // manager array number within this array, or null to link back to all managers page
        image: "/managers/rabid.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      },
      "yearsOfService": null, // (optional) How Many Years has the manager been in the league? 'Ten' 'Twenty'
      "persona": "The Wolf", // (optional) 'The Wolf', 'The Kornacki', 'The Littlefinger', 'The Flacco'
      "philosophy": "Draft bold. Trust instincts. Play smart. Chase color. Win with style.",
      "championship": {     
        league: null,  //'Irving', 'DTSP', or 'ICL' Won championship
        years: null,   // years(s) the manager won the championship, separated by commas
      },  
      "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
      },
      {
           // array number 13
      "name": "Brian Marx",
      "teamName": "Tallahassee Tribe", // (optional) team name, if not provided, will default to manager's name
      "managerID": "857309838424809472",
      "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      "location": "FL", // (optional)
      "bio": "The Tallahassee Tribe brings unity, grit, and Southern swagger to the fantasy gridiron. Built on loyalty, bold picks, and relentless hustle, this team plays with heart and hunts for victory every single week.",
      "photo": "/managers/tribe.png", // square ratio recommended (no larger than 500x500)
      "fantasyStart": 2023, // (optional) when did the manager start playing fantasy football
      "favoriteTeam": "tb", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      "rival": {
        name: "Drew Goodwin", // Can be anything (usually your rival's name)
        link: 6, // manager array number within this array, or null to link back to all managers page
        image: "/managers/union.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      },
      "yearsOfService": null, // (optional) How Many Years has the manager been in the league? 'Ten' 'Twenty'
      "persona": "The Littlefinger", // (optional) 'The Wolf', 'The Kornacki', 'The Littlefinger', 'The Flacco'
      "philosophy": "Loyal to the core. Draft tough. Compete harder. Win together.",
      "championship": {     
        league: 'DTSP',  //'Irving', 'DTSP', or 'ICL' Won championship
        years: '2022'    // years(s) the manager won the championship, separated by commas
      },  
      "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
      },
      
  ]
  

  
  
  /*   !!  !!  IMPORTANT  !!  !! */
  /*
  Below is the most up to-date version of a manager. Please leave this commented out
  and don't delete it. This will be updated if any fields are added, removed or changed
  and will allow updates without causing merge conflicts
  */
  
    // {
    //   "roster": 3,  // (DEPRECATED! Don't use this anymore) ID of the roster that the manager manages (look at the order of the power rankings graph)
    //   "managerID": "12345678",  // the user's manager ID, go to https://api.sleeper.app/v1/league/<your_league_id>/users to find user IDs (you can use older leagueIDs to find user IDs for managers that are no longer in the league)
    //   "name": "Your Name",
    //   "tookOver": 2020, // (DEPRECATED! You don't need to use this anymore) (optional) used if a manager took over a team, delete this line or change to null otherwise
    //   "location": "Brooklyn", // (optional)
    //   "bio": "Lorem ipsum...",
    //   "photo": "/managers/name.jpg", // square ratio recommended (no larger than 500x500)
    //   "fantasyStart": 2014, // (optional) when did the manager start playing fantasy football
    //   "favoriteTeam": "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    //   "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    //   "rival": {
    //     name: "Rival", // Can be anything (usually your rival's name)
    //     link: 6, // manager array number within this array, or null to link back to all managers page
    //     image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    //   },
    //   "favoritePlayer": 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    //   "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    //   "persona": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    //   "philosophy": "Your fantasy team's philosophy", // (optional)
    //   "tradingScale": 10, // 1 - 10 (optional)
    //   "preferredContact": "Text",  // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
    // },
    