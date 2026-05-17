import { whereami } from "../dep/utils";

let chatChannel = 'a'; // S,w,a,p
let whisperingTo = '';

const chatEmojis = {
  '<3': '❤'
};

register('messageSent', (msg, e) => {
  if (msg.startsWith('/') || chatChannel == 'a') return;
  e.setCanceled(true);

  // channels
  switch (chatChannel) {
    case 'p':
      break;
    case 'w':
      ChatLib.command(`w ${whisperingTo} ${msg}`);
      break;
    case 'S':
      if (whereami().startsWith('bw-')) ChatLib.command('shout ' + msg);
      else ChatLib.say(msg);
      break;
  }
})

register('command', (channel, whisTo) => {
  if (!channel) {
    ChatLib.chat('^^) Current chat channel - ' + (chatChannel == 'w' ? `&dwhisper&r (${whisperingTo})` : chatChannel == 'a' ? '&7all' : channel == 'p' ? '&9party' : '&6SHOUT'));
    return;
  }

  switch (channel) {
    case 'a':
    case 'all':
      if (chatChannel === 'p') ChatLib.command('chat a');
      chatChannel = 'a';
      ChatLib.chat('^^) Chat channel - &7all');
      break;
    case 'p':
    case 'party':
      if (chatChannel !== 'p') ChatLib.command('chat p');
      chatChannel = 'p';
      ChatLib.chat('^^) Chat channel - &9party');
      break;
    case 'w': case 'm':
    case 'msg':
      if (!whisTo) {
        ChatLib.chat('^^) &cChat channel - Specify who to whisper to. /chat msg <player>');
        return;
      }

      if (chatChannel === 'p') ChatLib.command('chat a');
      chatChannel = 'w';
      whisperingTo = whisTo;
      ChatLib.chat(`^^) Chat channel - &dmsg (${whisperingTo})`);
      break;
    case 'S': case 's':
    case 'shout':
      if (chatChannel === 'p') ChatLib.command('chat a');
      chatChannel = 'S';
      ChatLib.chat('^^) Chat channel - &6SHOUT');
      break;
    default:
      ChatLib.chat('^^) &cChat channel - Unknown option. (all,party,msg,shout)');

  }
}).setTabCompletions('all', 'party', 'msg', 'shout').setName('chat', true);