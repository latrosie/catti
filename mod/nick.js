// DENICK
const S3APacketTabComplete = net.minecraft.network.play.server.S3APacketTabComplete;
const C14PacketTabComplete = net.minecraft.network.play.client.C14PacketTabComplete;

function store_uuid(display_name, name) {
  const player = World.getPlayerByName(display_name);
  if (!player) {
    ChatLib.chat(`^^) &5Denick - Couldn't find &7${display_name}&5 in your lobby`);
    return;
  }

  let player_uuids = JSON.parse(FileLib.read('Catti', 'dat/player_uuids.json')) || {};
  player_uuids[player.getUUID().toString()] = name;
  FileLib.write('Catti', 'dat/player_uuids.json', JSON.stringify(player_uuids, null, 2));
}

register('command', (display_name, name) => {
  storeUUID(display_name, name);
}).setName('storeuuid');

function denick(display_name) {
  const player = World.getPlayerByName(display_name);
  if (!player) {
    ChatLib.chat(`^^) &5Denick - Couldn't find &7${display_name}&5 in your lobby`);
    return;
  }
  const player_uuids = JSON.parse(FileLib.read('Catti', 'dat/player_uuids.json')) || {};
  return player_uuids[player.getUUID().toString()] || false;
}

register('command', name => {
  // could be improved
  ChatLib.chat(`^^) (Nicked) ${name} -> ${denick(name) || '?/!nicked'}`);
}).setName('denick');

// denick lobby
let do_denick_lobby = false;
register('command', () => {
  do_denick_lobby = true;
  Client.sendPacket(new C14PacketTabComplete("/stats "));
}).setName('denicklobby').setAliases('dnl');

register('packetReceived', packet => {
  if (!do_denick_lobby) return;
  do_denick_lobby = false;

  const display_names = World.getAllPlayers()
    .filter(p => p.getUUID().version() != 4) // filter NPCs
    .map(p => p.getName());
  // .sort();
  console.log(display_names);

  const completions = packet.func_149630_c(); // getChoices()

  const diff = display_names.filter(e => !completions.includes(e));
  // if only 1 person nicked in lobby then storeuuid them i guess
  diff.forEach(e => ChatLib.chat(`(Nicked) ${e} -> ${denick(e) || '?'}`));
}).setFilteredClass(S3APacketTabComplete);