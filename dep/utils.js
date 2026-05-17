export function whereami() {
  try { return TabList.getFooter().match(/connected to §a([\w-]+)/).pop() }
  catch(err) { return "skyblock" } // details unrequired as this is a minigames module
}