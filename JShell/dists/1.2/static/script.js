let commandHistory = []; // Array to hold history of commands entered
let historyIndex = 0; // Index for current position in command history
let installedCommands = loadInstalledCommands() || {};

function loadInstalledCommands() {
  let commands = localStorage.getItem("installedCommands");
  return commands ? JSON.parse(commands) : {};
}

var term = new Terminal({
  cursorBlink: true,
  convertEol: true,
  fontFamily: "JetBrains Mono", // Set the font family to JetBrains Mono
});

term.prompt = () => {
  if (term._initialized) {
    term.write("\r\n\x1b[33m$ \x1b[37m"); // Subsequent prompts
  } else {
    term.write("\x1b[33m$ \x1b[37m"); // First prompt
    term._initialized = true;
  }
};

// Function to resize the terminal's div container
function resizeTerminalDiv() {
  const terminalDiv = document.getElementById("terminal");
  terminalDiv.style.display = "none"; // Shrink to 30%
  if (!terminalDiv) return;

  setTimeout(() => {
    terminalDiv.style.width = "30%"; // Shrink to 30%
    fitAddon.fit(); // Refit after last resize to adjust to final size
    setTimeout(() => {
      terminalDiv.style.width = "100%"; // Then back to 100%
      fitAddon.fit(); // Refit after last resize to adjust to final size
      setTimeout(() => {
        terminalDiv.style.width = "30%"; // Shrink to 30% again
        fitAddon.fit(); // Refit after last resize to adjust to final size
        setTimeout(() => {
          terminalDiv.style.width = "100%"; // And back to 100% to finalize
          terminalDiv.style.display = "block"; // Shrink to 30%
          fitAddon.fit(); // Refit after last resize to adjust to final size
        }, 50);
      }, 50);
    }, 50);
  }, 50);
}

resizeTerminalDiv(); // Call the resize function

function displayBanner() {
  const bannerText = `
            \x1b[37m
    88             88
    88             88
                   88
    88  ,adPPYba,  88,dPPYba,
    88  I8[    ""  88P'    "8a
    88   \`"Y8ba,   88       88
    88  aa    ]8I  88       88
    88 \`"YbbdP"Y8  88       88
 ,  88
 888P"

 A JavaScript terminal aimed for students. Enter 'help' to see commands.\x1b[0m
`;
  term.writeln(bannerText);
}

// Assuming xterm-addon-fit.js is properly included before this script runs
const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);
term.open(document.getElementById("terminal"));

// Use a timeout to ensure that the DOM has been painted
setTimeout(() => {
  fitAddon.fit();
}, 0);

displayBanner();
term.prompt(); // Initialize prompt at start

let commandLine = "";
let clipboard = "";

term.onKey((key) => {
  const ev = key.domEvent;
  const { keyCode, shiftKey } = ev;
  const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

  // Handle Shift + W + C for Copy
  if (shiftKey && ev.key === "w" && ev.code === "KeyW") {
    // Listen for 'c' immediately after 'w' with Shift still held down
    document.addEventListener(
      "keydown",
      function copyListen(event) {
        if (event.key === "c" && event.shiftKey && event.code === "KeyC") {
          clipboard = commandLine; // Copy current commandLine to clipboard
          console.log("Copied to clipboard: " + clipboard);
          document.removeEventListener("keydown", copyListen); // Remove listener after copy
        }
      },
      { once: true },
    );
  }

  // Handle Shift + W + V for Paste
  else if (shiftKey && ev.key === "w" && ev.code === "KeyW") {
    // Listen for 'v' immediately after 'w' with Shift still held down
    document.addEventListener(
      "keydown",
      function pasteListen(event) {
        if (event.key === "v" && event.shiftKey && event.code === "KeyV") {
          if (clipboard) {
            commandLine += clipboard;
            term.write(clipboard);
          }
          document.removeEventListener("keydown", pasteListen); // Remove listener after paste
        }
      },
      { once: true },
    );
  }

  // Handle other keys
  else if (keyCode === 13) {
    // Enter key
    if (commandLine.trim().length > 0) {
      term.writeln("");
      executeCommand(commandLine);
      commandHistory.push(commandLine);
      historyIndex = commandHistory.length;
      commandLine = "";
    }
    term.prompt();
  } else if (keyCode === 8) {
    // Backspace key
    if (term._core.buffer.x > 2 && commandLine.length > 0) {
      term.write("\b \b");
      commandLine = commandLine.substr(0, commandLine.length - 1);
    }
  } else if (
    keyCode === 37 ||
    keyCode === 39 ||
    keyCode === 38 ||
    keyCode === 40
  ) {
    // Handle arrow keys...
  } else if (keyCode === 9) {
    // Tab key
    ev.preventDefault(); // Prevent default tab behavior
  } else if (printable) {
    commandLine += ev.key; // Add char to command line
    term.write("\x1b[33m" + ev.key + "\x1b[37m"); // Display char in terminal
  }
});

// Overwrite console methods to redirect their outputs to the terminal
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
};

console.log = (...args) => {
  const message = args
    .map((arg) => (typeof arg === "string" ? parseMarkdown(arg) : arg))
    .join(" ");
  term.writeln(message);
};

console.error = (...args) => {
  const message = `\x1b[31m${args.map((arg) => (typeof arg === "string" ? parseMarkdown(arg) : arg)).join(" ")}\x1b[37m`;
  term.writeln(message);
};

console.info = (...args) => {
  const message = `\x1b[34m${args.map((arg) => (typeof arg === "string" ? parseMarkdown(arg) : arg)).join(" ")}\x1b[37m`;
  term.writeln(message);
};

console.warn = (...args) => {
  const message = `\x1b[38;5;229m${args.map((arg) => (typeof arg === "string" ? parseMarkdown(arg) : arg)).join(" ")}\x1b[37m`;
  term.writeln(message);
};

function executeCommand(command) {
  const args = command.split(" ").map((arg) => arg.trim());
  const cmd = args.shift().toLowerCase(); // extract the command and remove from args

  if (cmd in installedCommands) {
    eval(installedCommands[cmd].execute); // Execute the installed command
    return;
  }

  switch (cmd) {
    case "alleviate":
      shutdownServer();
      break;
    case "install":
      if (args.length) {
        openInstallDialog();
        break;
      } else {
        console.log("Usage: install <command-name>");
      }
      break;
    case "help":
      displayHelp();
      break;
    case "changelog":
      displayChangelog();
      break;
    case "guides":
      if (args.length) {
        openGuide(args[0]);
      } else {
        seeGuides();
      }
      break;
    case "info":
      displayInfo();
      break;
    case "create":
      if (args.length >= 2) {
        createProject(args[0], args.slice(1).join(" "));
      } else {
        console.log("Usage: create <project-name> <contents>");
      }
      break;
    case "download":
      if (args.length) {
        downloadProject(args[0]);
      } else {
        console.log("Usage: download <package-name>");
      }
      break;
    case "import":
      if (args.length) {
        openImportDialog(args[0]);
      } else {
        console.log("Usage: import <project-name>");
      }
      break;
    case "run":
      if (args.length) {
        runProject(args[0]);
      } else {
        console.log("Usage: run <project-name>");
      }
      break;
    case "clear":
      clearAllProjects();
      break;
    default:
      try {
        const result = eval(command);
        if (result !== undefined) {
          console.log(result);
        }
      } catch (error) {
        debugHelper(error);
      }
  }
}

function displayHelp() {
  const helpText = `
Available Commands:
*help* - Displays this help message.
*info* - Displays information about the terminal.
*changelog* - Displays full changelog in all versions.
*create <project> <contents>* - Creates a new project.
*download <project>* - Downloads a project.
*import <project>* - Imports a project.
*run <project>* - Runs a specified project.
*install <command>* - Installs a command library from a JSON file.
*clear* - Clears all stored projects.
*alleviate* - Closes session to free space.
*guides* - Displays guides for learning JavaScript and using the terminal effectively.
                `;
  term.writeln(parseMarkdown(helpText));
}

function displayChangelog() {
  const changelog = `**v1.2:**
• Compiled into executable file.
• Added "alleviate" to command list.
• Able to have 256 sessions and view ports.

**v1.1:**
• Implemented changelog.
• Added "install <command>" statement.
• Added guides accessible through guides.
• Made projects not cap-sensitive.
• Added Debug Assist.`;
  term.writeln(parseMarkdown(changelog));
}

function seeGuides() {
  const guidesText = `
**JavaScript Guides**:
1. *Basic JS*: Learn the fundamentals of JavaScript.
2. *Functions*: Dive into functions and how to use them.
3. *ES6+*: Explore modern JavaScript features.
4. *DOM Manipulation*: Learn how to manipulate the Document Object Model.
5. *Asynchronous JS*: Understand callbacks, promises, and async/await.

**JSH Guides**:
6. *Creating Commands*: Learn how to create commands to be used in JSH.
7. *Build a GUI application*: Start embedding iFrames into the terminal and learn how JSH renders.

Type *guides <number>* to explore a specific topic.`;
  term.writeln(parseMarkdown(guidesText));
}

function openGuide(number) {
  const guides = {
    1: `**Basic JavaScript**:
*Variables*:
- **var**: Declares a variable, optionally initializing it to a value.
- **let**: Declares a block-scope local variable, optionally initializing it to a value.
- **const**: Declares a block-scope read-only variable.

*Data Types*:
- **String**, **Number**, **Boolean**, **Null**, **Undefined**, **Object**

*Operators*:
- Arithmetic: +, -, *, /, %
- Comparison: ==, !=, ===, !==, >, <, >=, <=
- Logical: &&, ||, !
- Assignment: =, +=, -=, *=, /=

*Control Structures*:
- **if-else**, **switch**, **for**, **while**, **do-while**

*Functions*:
- Function declaration: function name() {}
- Function expression: const x = function() {}
- Arrow function: const y = () => {}

*Example*:
function greet(name) {
    console.log("Hello, " + name);
}
greet("Alice");

Output: Hello, Alice`,
    2: `**Functions**:
*Concept*:
- Functions are blocks of code designed to perform a particular task.

*Types*:
- **Function Declarations**
- **Function Expressions**
- **Arrow Functions**

*Usage*:

function square(number) {
    return number * number;
}

const square = function(number) {
    return number * number;
};

const square = (number) => {
    return number * number;
};`,
    3: `**ES6+ Features**:
*Let & Const*:
- Block-scope variables declaration.

*Template Literals*:
- String interpolation feature.

*Default Parameters*:
- Allows initializing named parameters with default values if no values or undefined are passed.

*Spread/Rest Operator*:
- Allows an iterable such as an array expression or string to be expanded in places.

*Example*:

const greet = (name, greeting = "Hello") => \`\${greeting}, \${name}!\`;
console.log(greet("Alice"));

Output: Hello, Alice`,
    4: `**DOM Manipulation**:
*Accessing Elements*:
- document.getElementById()
- document.querySelectorAll()

*Changing Elements*:
- element.innerHTML = "new html"
- element.attribute = "new value"
- element.style.property = "new style"

*Adding/Removing Elements*:
- document.createElement()
- parentNode.appendChild(childNode)
- parentNode.removeChild(childNode)

*Event Handling*:
- button.onclick = function() {
     alert("Clicked!");
}

*Example*:

document.getElementById("demo").innerHTML = "Hello JavaScript!";`,
    5: `**Asynchronous JavaScript**:
*Callbacks*:
- A function passed into another function as an argument.

*Promises*:
- Represents a value that may not be available yet but will be resolved at some point in the future.

*Async/Await*:
- Modern way to handle asynchronous operations, syntactic sugar for Promises.

*Example*:

async function getData() {
   let data = await fetch('https://api.example.com');
   console.log(data);
}
getData();`,

    6: `**Creating Commands in JSH**:
*Command Structure*:
Each command is a JSON object:

{
  "name": "greet",
  "execute": "console.log('Hello, world!')"
}

*Creating a JSON Command File*:
Commands can be single objects or arrays of objects for multiple commands.

*Installing Commands*:
Use the **install** command and select the JSON file to install new commands.

*Example*:
Create a file ***custom_commands.json\`*** with the following content:

{
  "name": "greet",
  "execute": "console.log('Hello, this is a custom command!')"
}

Install it using **install**, then run **greet** in the terminal.

*Troubleshooting*:
Check JSON format, JavaScript syntax, and console for errors.`,
    7: `**Embedding Iframe Content in JSH**:
*Embedding an Iframe*:
Create and append an iframe to the terminal's DOM element.

*Example*:

var iframe = document.createElement('iframe');
iframe.src = "https://example.com";
iframe.width = "100%";
iframe.height = "100%";
iframe.frameBorder = "0";
document.getElementById('terminal').appendChild(iframe);

*Toggling Visibility*:
Use CSS to hide or show terminal elements.

*Removing an Iframe*:
Use JavaScript to select and remove iframe elements.

*Key Bindings*:
Set up Ctrl/Cmd + E + D to delete iframes and restore the view.`,
  };

  if (guides[number]) {
    term.writeln(parseMarkdown(guides[number]));
  } else {
    term.writeln(
      parseMarkdown("*Guide not found. Please enter a valid guide number.*"),
    );
  }
}

function displayInfo() {
  const startTime = performance.now();
  fetch("/server-info")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch server information");
      }
      return response.json();
    })
    .then((info) => {
      const endTime = performance.now();
      const speed = endTime - startTime;
      const infoText = `
        **xTerm jsh v1.2** - A JS development environment for students in your browser.
        Support for basic *Markdown* for **bold**, *italics*, and \`monospace\`.

        Server Information:
        - Port: ${info.port}
        - Uptime: ${info.uptime}
        - Speed: ${speed.toFixed(2)} milliseconds
      `;
      term.writeln(parseMarkdown(infoText));
    })
    .catch((error) => {
      console.error("Error fetching server information:", error);
      term.prompt();
    });
}

function createProject(name, contents) {
  const lowerName = name.toLowerCase();
  localStorage.setItem(lowerName, contents); // Store content by lowercase name
  localStorage.setItem(`originalName:${lowerName}`, name); // Store original name for display
  console.log(`Project '${name}' created with the content '${contents}'.`);
}

function downloadProject(inputName) {
  const lowerInputName = inputName.toLowerCase(); // Normalize input for comparison
  const originalNameKey = `originalName:${lowerInputName}`;
  const originalName = localStorage.getItem(originalNameKey); // Retrieve original capitalization

  if (originalName && localStorage.getItem(lowerInputName)) {
    let projectContent = localStorage.getItem(lowerInputName);
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(projectContent),
    );
    element.setAttribute("download", originalName + ".jsh");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    console.log(`Project '${originalName}' downloaded.`);
  } else {
    console.log(`Project '${inputName}' not found.`);
  }
}

function openImportDialog(projectName) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".jsh, .js"; // Accept only JavaScript or custom .jsh files
  input.onchange = (event) => handleFileSelect(projectName, event);
  input.click();
}

function handleFileSelect(projectName, event) {
  const file = event.target.files[0];
  if (!file) {
    console.log("No file selected.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const fileContent = event.target.result;
      importProject(projectName, fileContent, () => {
        term.prompt();
      });
    } catch (e) {
      console.error("Error reading file:", e);
    }
  };
  reader.readAsText(file);
}

function importProject(projectName, fileContent, callback) {
  try {
    const contents = fileContent;
    const name = projectName.toLowerCase();
    localStorage.setItem(name, contents);
    localStorage.setItem(`originalName:${name}`, projectName); // Store original name for display purposes
    console.log(`Project '${projectName}' imported successfully.`);
    if (callback) {
      callback(); // Execute the callback function to refresh the prompt or UI
    }
  } catch (error) {
    term.writeln(`\x1b[31mError importing project: ${error}\x1b[37m`);
  }
}

function openInstallDialog() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = handleFileInstall;
  input.click();
}

function handleFileInstall(event) {
  const file = event.target.files[0];
  if (!file) {
    console.log("No file selected.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const commands = JSON.parse(event.target.result);
    if (Array.isArray(commands)) {
      commands.forEach((command) => {
        installedCommands[command.name] = command;
        console.log(`Command "${command.name}" installed.`);
        term.prompt();
      });
    } else {
      installedCommands[commands.name] = commands;
      console.log(`Command "${commands.name}" installed.`);
      term.prompt();
    }
  };
  reader.readAsText(file);
}

function debugHelper(error) {
  const errorsList = {
    ReferenceError:
      "Looks like there's a typo or an undefined variable. Check for misspellings or uninitialized variables.",
    TypeError:
      "This usually means a wrong type of value was used. Check if your variables are the correct type (e.g., string, number, array).",
    SyntaxError:
      "There's a syntax mistake in your code. This could be a missing bracket, parenthesis, or misplaced operator.",
    RangeError:
      "Your code tried to access something out of bounds, such as an array index that doesn't exist.",
    URIError:
      "There is an issue with URI handling functions. Check if you're using encodeURI or decodeURI with proper parameters.",
    EvalError:
      "An issue has arisen with the eval() function. Ensure eval() is used correctly and sparingly.",
    InternalError:
      "JavaScript engine internal error: stack overflow, too much recursion, etc. Check for any infinite loops or excessive recursions.",
    SecurityError:
      "A security error occurred. This might relate to issues like cross-origin violations.",
    QuotaExceededError:
      "The storage quota has been exceeded. Check if your application is exceeding storage limits set by the browser.",
    TimeoutError:
      "An operation timed out. Ensure your asynchronous operations are completing in a timely manner.",
    InvalidStateError:
      "An operation was performed in an inappropriate state. Ensure your objects are in the correct state when performing operations.",
  };

  // Determine if the error matches any known error types in the list
  const errorType = Object.keys(errorsList).find((key) =>
    error.toString().includes(key),
  );

  if (errorType) {
    term.writeln(
      `\x1b[38;5;229m${errorsList[errorType]} (\x1b[31m${error}\x1b[38;5;229m) \x1b[38;5;229m`,
    );
  } else {
    term.writeln(
      `\x1b[38;5;229mAn error occurred but I'm not sure what the specific issue is. Please check your code logic. (\x1b[31m${error}\x1b[38;5;229m)\x1b[38;5;229m`,
    );
  }
}

function runProject(inputName) {
  const lowerInputName = inputName.toLowerCase(); // Normalize input for comparison
  const originalNameKey = `originalName:${lowerInputName}`;
  const originalName = localStorage.getItem(originalNameKey); // Retrieve original capitalization

  if (originalName && localStorage.getItem(lowerInputName)) {
    const projectContent = localStorage.getItem(lowerInputName);
    console.log(`Running project '${originalName}'...`); // Display using original capitalization
    try {
      eval(projectContent);
    } catch (e) {
      console.error(`Error executing project '${originalName}': ${e}`);
      debugHelper(e);
    }
  } else {
    console.log(`Project '${inputName}' not found.`);
  }
}

function shutdownServer() {
  fetch("/close", { method: "POST" })
    .then((response) => {
      console.log("Server is closing...");
      setTimeout(() => {
        // Check if it's allowed to close the window
        if (window.closeAllowed) {
          window.close(); // This will only work if the script is running from a window that was opened by another script
        } else {
          window.location.reload();
        }
      }, 1000); // 1000 milliseconds = 1 seconds
    })
    .catch((error) => console.error("Error closing the server:", error));
}

// Initialize closeAllowed based on how the window was opened
window.closeAllowed = window.opener != null;

function clearAllProjects() {
  Object.keys(localStorage).forEach((key) => localStorage.removeItem(key));
  console.log("All projects cleared.");
}

function parseMarkdown(mdText) {
  return mdText
    .replace(/```(.*?)```/gs, "\x1b[35m$1\x1b[37m") // monospace (greedy to lazy quantifier)
    .replace(/\*\*(.*?)\*\*/gs, "\x1b[1m$1\x1b[22m") // bold (greedy to lazy quantifier)
    .replace(/\*(.*?)\*/gs, "\x1b[3m$1\x1b[23m") // italics (greedy to lazy quantifier)
    .replace(/`(.+?)`/gs, "\x1b[35m$1\x1b[37m") // inline code (already correct)
    .replace(/~~(.*?)~~/gs, "\x1b[8m$1\x1b[28m"); // invisible text (greedy to lazy quantifier)
}
