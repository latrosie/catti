import { whereami } from "../dep/utils";

// party regex
register('chat', (name, cmd) => {
  cmd = cmd.split(' ');
  switch (cmd[0]) {
    case 'ping':
      ChatLib.command(`pc ${Server.getPing()}ms`);
      break;
    case 'stats':
    case 'stat':
      if(!whereami().startsWith('bw-')) {
        ChatLib.command("pc ^^) Can only use this command in game");
        return;
      }

      stats.whos = cmd[1] ? cmd[1] : name;
      stats.send = true;

      ChatLib.command('stats ' + stats.whos);
      break;
    case 'meow':
      ChatLib.chat('meow');
      ChatLib.command('pc meow');
      break;
  }

  // p leader
  // if(Party.getLeader() != Player.getName()) return;
  switch(cmd[0]) {
    case 'warp':
      ChatLib.command('p warp');
      break;
    case 'inv':
      if(!cmd[1]) {
        ChatLib.command('pc Who should I invite idiot??');
        return;
      }
      ChatLib.command('p invite ' + cmd[1])
      break;
    case 'ptme':
      ChatLib.command('p promote ' + name);
      break;
  }
}).setCriteria(/^Party > (?:\[[^\]]+?\] )?(\w{3,16}): ;(.+)$/);

// stats regex
let stats = {
  'send': false,
  'whos': '',
  'total': 0,
  'wins': 0,
  'fkills': 0,
  'fDeaths': 0
};
// stats.seal();

register('chat', (fld, val, e) => {
  if(!stats.send) return;
  e.setCanceled(true);
  switch (fld) {
    case "Games played": stats.total = val; break;
    case "Wins": stats.wins = val; break;
    case "Final kills": stats.fkills = val; break;
    case "Final Deaths": stats.fDeaths = val; break;
    case "Broken beds":
      stats.send = false;
      setTimeout(() => {
        const loses = stats.total - stats.wins;
        if(stats.whos == 'Catrophie') ChatLib.command(`pc Catrophie | WLR: Undefeated FKDR: Undefeated | Planetery level threat`);
        else ChatLib.command(`pc ${stats.whos} | WLR: ${(stats.wins / loses).toFixed(2)} FKDR: ${(stats.fkills / stats.fDeaths).toFixed(2)}`);
        stats.whos = '';
        stats.total = 0;
        stats.wins = 0;
        stats.fkills = 0;
        stats.fDeaths = 0;
      }, 1500);
      break;
  }
}).setCriteria(/^- (.+): (\d+)$/);