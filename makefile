# Define variables
TARGET = /usr/local/bin/u12.js

# Default target
all: install

# Install target
install:
	# Ensure u12.js is executable
	chmod +x u12.js
	# Create a symlink in /usr/local/bin
	ln -sf $(CURDIR)/u12.js $(TARGET)

# Uninstall target
uninstall:
	# Remove the symlink
	rm -f $(TARGET)

# Help target
help:
	@echo "Makefile to install u12.js as a global command"
	@echo "Usage:"
	@echo "  make        - Installs u12.js as a global command"
	@echo "  make help   - Shows this help message"
	@echo "  make uninstall - Removes the global command"

.PHONY: all install uninstall help
