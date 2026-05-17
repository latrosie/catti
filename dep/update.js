// JAVA
const URL = Java.type("java.net.URL");
const ZipInputStream = Java.type("java.util.zip.ZipInputStream");
const File = Java.type("java.io.File");
const FileOutputStream = Java.type("java.io.FileOutputStream");
const Byte = Java.type("java.lang.Byte");

// CONFIG
export const MODULE_NAME = "Catti";
const GITHUB_REPO = "latrosie/catti";

export const metadata = JSON.parse(FileLib.read(MODULE_NAME, 'metadata.json'));
export function should_i_update() {
  const local_version = metadata.version;
  const cloud_version = JSON.parse(FileLib.getUrlContent(`https://raw.githubusercontent.com/${GITHUB_REPO}/main/metadata.json`)).version;
  if (local_version === cloud_version) {
    ChatLib.chat(`^^) Update - You are already on the latest version. (${cloud_version})`);
    return false;
  } else {
    ChatLib.chat(`^^) Update - New release ${cloud_version} found! Local: ${local_version}`);
    return true;
  }
}

export function update(force) {
  new Thread(() => {
    try {
      if(!should_i_update()) return;
      const url = new URL(`https://github.com/${GITHUB_REPO}/archive/refs/heads/main.zip`);
      const zip_input_stream = new ZipInputStream(url.openStream());
      let entry;

      const local_dir = new File(`config/ChatTriggers/modules/${MODULE_NAME}`);
      const clone_dir = new File(`config/ChatTriggers/modules/${MODULE_NAME}_temp`);

      if (clone_dir.exists()) FileLib.deleteDirectory(clone_dir);
      clone_dir.mkdirs();

      while ((entry = zip_input_stream.getNextEntry()) !== null) {
        // Github zip files have a repo_name/ directory at their root
        let entry_name = entry.getName().split('/');
        entry_name.shift();
        const internal_path = entry_name.join('/');
        if (internal_path === "") continue;

        const target = new File(clone_dir, internal_path);
        if (entry.isDirectory()) target.mkdirs()
        else {
          target.getParentFile().mkdirs();
          let out_stream = new FileOutputStream(target);
          let buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 4096);
          let len;

          while ((len = zip_input_stream.read(buffer)) > 0) {
            out_stream.write(buffer, 0, len);
          }
          out_stream.close();
        }
        zip_input_stream.closeEntry();
      }
      zip_input_stream.close();

      FileLib.deleteDirectory(local_dir);
      const success = clone_dir.renameTo(local_dir);
      if (success) {
        ChatLib.chat("^^) &aUpdate - success. Reloading...");
        Thread.sleep(500);
        ChatLib.command("ct load", true);
      } else ChatLib.chat("^^) &cUpdate - fail. Manual fix may be required.");
    } catch (err) {
      ChatLib.chat("^^) &cUpdate - fail. Check console for the error log.");
      console.error("Error while updating:\n" + err);
    }
  }).start();
}
