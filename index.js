// meow
import { MODULE_NAME, metadata, should_i_update, update } from "./dep/update";

import "./mod/nick";
import "./mod/self_chat_bot";

const NO_OF_MODS = new java.io.File(`config/ChatTriggers/modules/${MODULE_NAME}/mod`).list().length;
const CMD_ARGS = [
  "check_update", "update", "help"
]
register('command', (arg0, arg1) => {
  switch (arg0) {
    case "check_update":
      new Thread(should_i_update()).start();
      break;
    case "update":
      update(arg1 === "true");
      break;
    case "help":
      ChatLib.chat(ChatLib.getChatBreak());
      ChatLib.chat(ChatLib.getCenteredText(`[${MODULE_NAME}]`));
      ChatLib.chat(ChatLib.getChatBreak());
      ChatLib.chat(ChatLib.getCenteredText(`Available commands (${CMD_ARGS.length})`));
      ChatLib.chat(CMD_ARGS.join('\n'));
      ChatLib.chat(ChatLib.getChatBreak());
      break;
    default:
      ChatLib.chat(ChatLib.getChatBreak());
      ChatLib.chat(ChatLib.getCenteredText(`[${MODULE_NAME}]`));
      ChatLib.chat(ChatLib.getChatBreak());
      ChatLib.chat(`Creator: ${metadata.creator}`);
      ChatLib.chat(`Version: ${metadata.version}`);
      ChatLib.chat(`Modules: ${NO_OF_MODS}`);
      ChatLib.chat(ChatLib.getChatBreak());
  }
}).setTabCompletions(CMD_ARGS).setName('catti');