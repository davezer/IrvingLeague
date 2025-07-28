/*   STEP 1   */
export const leagueID = "1253040502786228224"; // your league ID
export const leagueName = "Irving Champions League"; // your league name
export const dues = 100; // (optional) used in template constitution page
export const dynasty = false; // true for dynasty leagues, false for redraft and keeper
export const enableBlog = true; // requires VITE_CONTENTFUL_ACCESS_TOKEN and VITE_CONTENTFUL_SPACE environment variables

/*   STEP 2   */
export const homepageText = `
  <p>Welcome to the future.</p>
  <p>Introducing the Irving Champions League.</p>
  <p>The Irving Champions League is more than fantasy football—it’s a legacy reborn. Born from the grit and glory of the original Irving League, this rebooted battleground celebrates fierce dedication, unmatched determination, and weekly engagement that borders on obsession. Owners obsess over waiver wires, analyze matchups like coaches, and rally with renewed energy each season. Every point scored and trade debated fuels rivalries and friendships alike. It’s where underdogs rise, champions grind, and every Sunday feels like destiny. Rejuvenated and relentless, the Irving Champions League isn’t just about football—it’s about proving who truly rules the gridiron. Welcome back to greatness.</p>
  
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
      "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      "location": "Bethlehem, PA", // (optional)
      "bio": "Drafted on vibes, fueled by snacks. Fantasy genius? Nope. Lucky? Absolutely. Trash talker? Always.",
      "photo": "/managers/crucible.png", // square ratio recommended (no larger than 500x500)
      "fantasyStart": 2004, // (optional) when did the manager start playing fantasy football
      "favoriteTeam": "nyg", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      "rival": {
        name: "Jeff", // Can be anything (usually your rival's name)
        link: 1, // manager array number within this array, or null to link back to all managers page
        image: "/managers/warriors.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      },
      "draftMoneyCurrentYear": "$200", // This is the amount of money the team has available to draft with in the current draft year
      "draftMoneyNextYear": "$200" , // This is the amount of money available for the next draft year.
      "valuePosition": "RB", // (optional) Favorite position (QB, WR, RB, TE, etc.)
      "rookieOrVets": "Vets", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
      "philosophy": "Spend it all on 4 players and hope for the best",
      "tradingScale": 7, // 1 - 10
      "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
    },
    {

    // array number 1
      "name": "Jeff Cohn",
      "managerID": "76521957268799488",
      "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      "location": "Palm Harbor, FL", // (optional)
      "bio": "Heat, hustle, and havoc — Westlake Warriors bring the smack talk",
      "photo": "/managers/warriors.png", // square ratio recommended (no larger than 500x500)
      "fantasyStart": 2004, // (optional) when did the manager start playing fantasy football
      "favoriteTeam": "mia", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      "rival": {
        name: "Dave", // Can be anything (usually your rival's name)
        link: 0, // manager array number within this array, or null to link back to all managers page
        image: "/managers/crucible.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      },
      "draftMoneyCurrentYear": "$200", // This is the amount of money the team has available to draft with in the current draft year
      "draftMoneyNextYear": "$200", // This is the amount of money available for the next draft year.
      "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
      "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
      "philosophy": "Analyze, Analyze, Analyze. ",
      "tradingScale": 8, // 1 - 10
      "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
    },
  {
    // array number 2
    "name": "Jamie Cohn",
      "managerID": "1253515645044133888",
      "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      "location": "Palm Harbor, FL", // (optional)
      "bio": "Guns n' Sabres",
      "photo": "/managers/lightsabres.png", // square ratio recommended (no larger than 500x500)
      "fantasyStart": 2004, // (optional) when did the manager start playing fantasy football
      "favoriteTeam": "pit", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      "rival": {
        name: "Jeff", // Can be anything (usually your rival's name)
        link: 1, // manager array number within this array, or null to link back to all managers page
        image: "/managers/warriors.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      },
      "draftMoneyCurrentYear": "$200", // This is the amount of money the team has available to draft with in the current draft year
      "draftMoneyNextYear": "$200", // This is the amount of money available for the next draft year.
      "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
      "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
      "philosophy": "Playoffs? PLAYOFFS?!",
      "tradingScale": 8, // 1 - 10
      "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
      },
      {
        // array number 3
      "name": "Kenny Case",
      "managerID": "1005329348477419520",
      "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      "location": "FL", // (optional)
      "bio": "The Lone Rangers? That's original. How can you pluralize 'Lone Ranger'?",
      "photo": "/managers/loneRangers.png", // square ratio recommended (no larger than 500x500)
      "fantasyStart": 2004, // (optional) when did the manager start playing fantasy football
      "favoriteTeam": "mia", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      "rival": {
        name: "Jeff", // Can be anything (usually your rival's name)
        link: 1, // manager array number within this array, or null to link back to all managers page
        image: "/managers/warriors.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      },
      "draftMoneyCurrentYear": "$200", // This is the amount of money the team has available to draft with in the current draft year
      "draftMoneyNextYear": "$200", // This is the amount of money available for the next draft year.
      "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
      "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
      "philosophy": "If it's too loud, you're too old.",
      "tradingScale": 5, // 1 - 10
      "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
      }, 
      {
        // array number 4
      "name": "Clifton McVay",
      "managerID": "1254577682394386432",
      "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      "location": "FL", // (optional)
      "bio": "Fueled by cold brew and fourth-down boldness, the Salem Hipsterjacks bring arcane instincts and vintage swagger to the gridiron. They draft like it’s vinyl-only and call plays like it’s always a foggy Sunday in October.",
      "photo": "/managers/hipsterJacks.png", // square ratio recommended (no larger than 500x500)
      "fantasyStart": 2004, // (optional) when did the manager start playing fantasy football
      "favoriteTeam": "sea", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      "rival": {
        name: "James", // Can be anything (usually your rival's name)
        link: 1, // manager array number within this array, or null to link back to all managers page
        image: "/managers/homers.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      },
      "draftMoneyCurrentYear": "$200", // This is the amount of money the team has available to draft with in the current draft year
      "draftMoneyNextYear": "$200", // This is the amount of money available for the next draft year.
      "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
      "rookieOrVets": "Vets", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
      "philosophy": "Unpredictable, unconventional, and unbothered",
      "tradingScale": 2, // 1 - 10
      "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
      },
      {
        //array number 5
      "name": "Kevin Flanagan",
      "managerID": "1254577895943192576",
      "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      "location": "CT", // (optional)
      "bio": "When fantasy turns Die Hard, the Nakatomi Custodial Crew cleans up. Waiver wire wizards with duct tape grit—yippee-ki-yay, matchup problems.",
      "photo": "/managers/nakatomi.png", // square ratio recommended (no larger than 500x500)
      "fantasyStart": 2004, // (optional) when did the manager start playing fantasy football
      "favoriteTeam": "ne", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      "rival": {
        name: "Dave", // Can be anything (usually your rival's name)
        link: 0, // manager array number within this array, or null to link back to all managers page
        image: "/managers/crucible.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      },
      "draftMoneyCurrentYear": "$200", // This is the amount of money the team has available to draft with in the current draft year
      "draftMoneyNextYear": "$200", // This is the amount of money available for the next draft year.
      "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
      "rookieOrVets": "Vets", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
      "philosophy": "Every week’s a hostage situation, and I’m the negotiator",
      "tradingScale": 7, // 1 - 10
      "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
      },
       {
        //array number 6
      "name": "Drew Goodwin",
      "managerID": "1254578120531390464",
      "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      "location": "FL", // (optional)
      "bio": "Forged in group chats and fueled by spite, Amherst Union stands united against bad trades, bye weeks, and commissioner tyranny. Drafted with pride, managed with memes—solidarity has never been so scrappy.",
      "photo": "/managers/union.png", // square ratio recommended (no larger than 500x500)
      "fantasyStart": 2004, // (optional) when did the manager start playing fantasy football
      "favoriteTeam": "ne", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      "rival": {
        name: "Kenny", // Can be anything (usually your rival's name)
        link: 3, // manager array number within this array, or null to link back to all managers page
        image: "/managers/loneRangers.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      },
      "draftMoneyCurrentYear": "$200", // This is the amount of money the team has available to draft with in the current draft year
      "draftMoneyNextYear": "$200", // This is the amount of money available for the next draft year.
      "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
      "rookieOrVets": "Vets", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
      "philosophy": "Solidarity over strategy, chaos with a cause.",
      "tradingScale": 7, // 1 - 10
      "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
      },
        {
          //array number 7
      "name": "Jason Gray",
      "managerID": "1254584226238447616",
      "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      "location": "CT", // (optional)
      "bio": "Hailing from the heart of small-town grit, the Milford Jayhawks soar with old-school pride and new-school hustle. Built on discipline, instinct, and just a touch of stubbornness—they don’t just play to win, they play to prove a point.",
      "photo": "/managers/jayhawks.png", // square ratio recommended (no larger than 500x500)
      "fantasyStart": 2004, // (optional) when did the manager start playing fantasy football
      "favoriteTeam": "mia", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      "rival": {
        name: "Jamie", // Can be anything (usually your rival's name)
        link: 2, // manager array number within this array, or null to link back to all managers page
        image: "/managers/lightsabres.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      },
      "draftMoneyCurrentYear": "$200", // This is the amount of money the team has available to draft with in the current draft year
      "draftMoneyNextYear": "$200", // This is the amount of money available for the next draft year.
      "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
      "rookieOrVets": "Vets", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
      "philosophy": "Fly straight, hit hard, never back down",
      "tradingScale": 7, // 1 - 10
      "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
      },
      {
        // array number 8
      "name": "Romano DeSimone",
      "managerID": "792114259365597184",
      "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      "location": "FL", // (optional)
      "bio": "Fueled by Duval spirit and Italian swagger, the Jacksonville Vincitori are here to conquer. Bold, relentless, and always hunting victory, this squad dominates Sundays with ruthless efficiency and unwavering confidence.",
      "photo": "/managers/vincintori.png", // square ratio recommended (no larger than 500x500)
      "fantasyStart": 2004, // (optional) when did the manager start playing fantasy football
      "favoriteTeam": "jax", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      "rival": {
        name: "Clifton", // Can be anything (usually your rival's name)
        link: 4, // manager array number within this array, or null to link back to all managers page
        image: "/managers/hipsterJacks.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      },
      "draftMoneyCurrentYear": "$200", // This is the amount of money the team has available to draft with in the current draft year
      "draftMoneyNextYear": "$200", // This is the amount of money available for the next draft year.
      "valuePosition": "RB", // (optional) Favorite position (QB, WR, RB, TE, etc.)
      "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
      "philosophy": "Victory is earned through preparation, discipline, and fearless ambition.",
      "tradingScale": 7, // 1 - 10
      "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
      },
      // {
      //   // array number 9
      // "name": "Adam Lopiano",
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
      // "draftMoneyCurrentYear": "$200", // This is the amount of money the team has available to draft with in the current draft year
      // "draftMoneyNextYear": "$200", // This is the amount of money available for the next draft year.
      // "valuePosition": "RB", // (optional) Favorite position (QB, WR, RB, TE, etc.)
      // "rookieOrVets": "rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
      // "philosophy": "Steady as the snow, fierce as the moose.",
      // "tradingScale": 4, // 1 - 10
      // "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
      // },
      //   {
      //   // array number 10
      // "name": "James Barmore",
      // "managerID": "",
      // "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      // "location": "FL", // (optional)
      // "bio": "The Dunedin Homers run a tight ship built on discipline, data, and deep analytics. Every roster move is calculated, every matchup dissected. No flash, just fundamentals. Rooted in precision and powered by performance metrics, the Homers don’t chase hype — they chase wins.",
      // "photo": "/managers/homers.png", // square ratio recommended (no larger than 500x500)
      // "fantasyStart": 2004, // (optional) when did the manager start playing fantasy football
      // "favoriteTeam": "tb", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      // "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      // "rival": {
      //   name: "Jamie", // Can be anything (usually your rival's name)
      //   link: 2, // manager array number within this array, or null to link back to all managers page
      //   image: "/managers/lightsabres.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      // },
      // "draftMoneyCurrentYear": "$200", // This is the amount of money the team has available to draft with in the current draft year
      // "draftMoneyNextYear": "$200", // This is the amount of money available for the next draft year.
      // "valuePosition": "QB", // (optional) Favorite position (QB, WR, RB, TE, etc.)
      // "rookieOrVets": "vets", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
      // "philosophy": "Trust the data. Execute the plan. Win with precision.",
      // "tradingScale": 4, // 1 - 10
      // "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
      // },
      // {
      //   // array number 11
      // "name": "Brian Chorney",
      // "managerID": "",
      // "tookOver": null, // (optional) used if a manager took over a team, delete this line or change to null otherwise
      // "location": "FL", // (optional)
      // "bio": "The D.C. Rabid Dogs play with unhinged intensity and a hunger that never quits. Fueled by chaos and capital city grit, this squad attacks every matchup with snarling energy and no mercy. Once they’ve got a lead, they don’t let go — they bite down and finish the job.",
      // "photo": "/managers/rabid.png", // square ratio recommended (no larger than 500x500)
      // "fantasyStart": 2004, // (optional) when did the manager start playing fantasy football
      // "favoriteTeam": "tb", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
      // "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
      // "rival": {
      //   name: "Romano", // Can be anything (usually your rival's name)
      //   link: 2, // manager array number within this array, or null to link back to all managers page
      //   image: "/managers/vincintori.png", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
      // },
      // "draftMoneyCurrentYear": "$200", // This is the amount of money the team has available to draft with in the current draft year
      // "draftMoneyNextYear": "$200", // This is the amount of money available for the next draft year.
      // "valuePosition": "QB", // (optional) Favorite position (QB, WR, RB, TE, etc.)
      // "rookieOrVets": "vets", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
      // "philosophy": "Unleash chaos. Control the game.",
      // "tradingScale": 9, // 1 - 10
      // "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
      // },
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
    //   "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    //   "philosophy": "Your fantasy team's philosophy", // (optional)
    //   "tradingScale": 10, // 1 - 10 (optional)
    //   "preferredContact": "Text",  // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
    // },
    