# Define variables
TARGET = /usr/local/bin/u12.js

# Default target
all: install

# Install target
install:
	chmod +x u12.js
	ln -sf $(CURDIR)/u12.js $(TARGET)
	@echo "Installed u12.js!"

# Uninstall target
uninstall:
	rm -f $(TARGET)
	@echo "Uninstalled u12.js."

# Help target
help:
	@echo "Makefile to install u12.js as a global command"
	@echo "Usage:"
	@echo "  make        - Installs u12.js as a global command"
	@echo "  make help   - Shows this help message"
	@echo "  make uninstall - Removes the global command"

.PHONY: all install uninstall help
