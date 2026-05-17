// meow
import { MODULE_NAME, metadata, update } from "./dep/update";

import "./mod/nick";
import "./mod/self_chat_bot";

const no_of_mods = new java.io.File(`config/ChatTriggers/modules/${MODULE_NAME}/mod`).list().length;
register('command', (arg0, arg1) => {
  switch(arg0) {
    case "update":
      update(arg1.toLowerCase() === "true");
      break;
    default:
      ChatLib.chat(ChatLib.getChatBreak());
      ChatLib.chat(ChatLib.getChatMessage(`[${MODULE_NAME}]`));
      ChatLib.chat(ChatLib.getChatBreak());
      ChatLib.chat(`Creator: ${metadata.creator}`);
      ChatLib.chat(`Version: ${metadata.version}`);
      ChatLib.chat(`Modules: ${no_of_mods}`);
      ChatLib.chat(ChatLib.getChatBreak());
  }
}).setTabCompletions("update").setName('catti');