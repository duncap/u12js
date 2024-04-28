// Get the element with the ID 'terminal'
    var element = document.getElementById('terminal');

    // Check if the element exists
    if (element) {
        // Create a new iframe element
        var iframe = document.createElement('iframe');

        // Set the iframe's properties
        iframe.src = "https://www.retrogames.cc/embed/42179-sonic-cd-jp.html";
        iframe.width = "100%";
        iframe.height = "100%";  // You can adjust the height as needed
        iframe.frameBorder = "0";

        // Append the new iframe inside the terminal element, not replacing it
        element.appendChild(iframe);

        // Hide all elements with the class 'xterm-screen'
        var viewports = document.querySelectorAll('.xterm-screen');
        viewports.forEach(function(viewport) {
            viewport.style.display = 'none';
        });
    }

    // Key handling for Ctrl/Cmd + E + D to delete iframes and show xterm-screens
    let ePressed = false;
    let dPressed = false;

    document.addEventListener('keydown', function(event) {
        if (event.key === 'e' && (event.ctrlKey || event.metaKey)) {
            ePressed = true;
        } else if (ePressed && event.key === 'd') {
            dPressed = true;
        }

        if (ePressed && dPressed) {
            // Remove the iframe from the terminal element if it exists
            var iframes = element.querySelectorAll('iframe');
            iframes.forEach(function(iframe) {
                element.removeChild(iframe);  // Delete the iframe
            });

            // Show all .xterm-screen elements
            var viewports = document.querySelectorAll('.xterm-screen');
            viewports.forEach(function(viewport) {
                viewport.style.display = 'block';
            });

            // Reset the key press states
            ePressed = false;
            dPressed = false;
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === 'e' || event.key === 'd') {
            ePressed = false;
            dPressed = false;
        }
    });
