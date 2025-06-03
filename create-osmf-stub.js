const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const CONFIG = {
  FLEX_SDK: path.join("libs", "Flex_4.16.1_AIR_32.0"),
  PROJECT: ".",
  TARGET_PLAYER: "27.0",
};

console.log("🔧 Creating OSMF library stub...");

// Create ActionScript stub file
const osmfStubAS = `
package org.osmf.events {
  import flash.events.Event;
  
  public class TimeEvent extends Event {
    public static const COMPLETE:String = "complete";
    public static const CURRENT_TIME_CHANGE:String = "currentTimeChange";
    public static const DURATION_CHANGE:String = "durationChange";
    
    public var time:Number;
    
    public function TimeEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false, time:Number = NaN) {
      super(type, bubbles, cancelable);
      this.time = time;
    }
    
    public override function clone():Event {
      return new TimeEvent(type, bubbles, cancelable, time);
    }
  }
}
`;

// Create directory for the stub
const stubDir = path.join("temp", "osmf-stub", "org", "osmf", "events");
if (!fs.existsSync(stubDir)) {
  fs.mkdirSync(stubDir, { recursive: true });
}

// Save ActionScript file
const timeEventPath = path.join(stubDir, "TimeEvent.as");
fs.writeFileSync(timeEventPath, osmfStubAS.trim());

console.log("📝 TimeEvent.as created");

// Compile to SWC
const compcCommand = [
  `"${path.join(CONFIG.FLEX_SDK, "bin", "compc.bat")}"`,
  `-target-player=${CONFIG.TARGET_PLAYER}`,
  `-external-library-path+="${path.join(
    CONFIG.FLEX_SDK,
    "frameworks",
    "libs",
    "player",
    CONFIG.TARGET_PLAYER,
    "playerglobal.swc"
  )}"`,
  `-source-path+="${path.join("temp", "osmf-stub")}"`,
  `-include-sources+="${path.join("temp", "osmf-stub")}"`,
  `-output "${path.join("libs", "osmf.swc")}"`,
  `-compiler.debug=false`,
  `-compiler.optimize=true`,
  `-warnings=false`,
].join(" ");

console.log("🔨 Compiling SWC...");

// Define environment variables
const env = {
  ...process.env,
  PLAYERGLOBAL_HOME: path.resolve(
    path.join(CONFIG.FLEX_SDK, "frameworks", "libs", "player")
  ),
};

exec(compcCommand, { env: env }, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Error compiling SWC: ${stderr || error.message}`);
    return;
  }

  if (fs.existsSync(path.join("libs", "osmf.swc"))) {
    console.log("✅ OSMF stub created successfully!");

    // Clean temporary files
    fs.rmSync(path.join("temp"), { recursive: true, force: true });
    console.log("🧹 Temporary files removed");
  } else {
    console.error("❌ Failed to create osmf.swc");
  }
});
