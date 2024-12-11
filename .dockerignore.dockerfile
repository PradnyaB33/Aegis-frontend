# Ignore node_modules directory (npm install will run inside the container)
node_modules/

# Ignore build artifacts (the build folder created after npm run build)
build/

# Ignore environment variable files
.env

# Ignore logs
*.log

# Ignore Git files and directories
.git/
.gitignore

# Ignore Dockerfile and .dockerignore themselves
Dockerfile
.dockerignore

# Ignore npm cache
npm-debug.log
.yarn-debug.log
.yarn-error.log

# Ignore editor or IDE configuration files
.vscode/
.idea/

# Ignore system files (e.g., macOS, Windows)
.DS_Store
Thumbs.db

# Ignore coverage directory (for test coverage reports)
coverage/

# Ignore GitHub workflow files (optional, if not needed in Docker image)
.github/
