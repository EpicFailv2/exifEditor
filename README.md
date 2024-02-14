# trackme - position sharing website (Vue2 version)

This project has 3 goals:

1. learn how to run a webserver on my own PC
2. learn something new in Vue/JS/CSS/HTML

## Project setup

#### Prerequisites:

- Node.js/NPM - get LTS version from [here](https://nodejs.org/en/);
- Vue-cli - install after Node is installed using `npm install -g @vue/cli` in command prompt;
- VS Code with these extensions:
  - Auto Close Tag
  - Auto Rename Tag
  - ESLint
  - Git History
  - GitLens — Git supercharged
  - HTMLHint
  - IntelliSense for CSS class names for HTML
  - jshint
  - npm
  - npm intellisense
  - Path Intellisense
  - Prettier - Code formatter
  - Vetur
  - vue-buetify

(Requiring VSCode because of Prettier formatter - i require good formatting discipline in my projects, because otherwise in JS it gets out of hand fast...)

#### Vue part setup and use:

To get the project ready, run `npm install` in project root dir.

To test localy with hot-reload, use `npm run serve`.

To compile optimized code for production, use `npm run build` (results will be in dist folder).

#### Apache configuration for CORS nonsense workaround

To start off, download fresh appache distro and install it as a service. Then if you've left default settings in `package.json`, frontend is running on port 55000 and backend will be running on port 55005. Webpage is accessible on default HTTP port (80) so the routing rules are handled by this block that you should add at the end of `httpd.conf`:

```
<VirtualHost *:80>
    RewriteEngine on

    RewriteCond %{REQUEST_URI}  ^/services/
    RewriteRule "/(.*)"  http://localhost:55005/$1 [P,END]
    
    RewriteCond %{REQUEST_URI} ^/
    RewriteRule "/(.*)"  http://localhost:55000/$1 [P,END]
</VirtualHost>
```

And uncomment `proxy_module`, `proxy_ajp_module`, `proxy_connect_module`, `proxy_http_module`, `rewrite_module` module imports - at least some of these are required in the above `VirtualHost` rule.

#### Backend

It's gonna be a separate Java/Spring project. Will update readme when i'll finalize the setup and upload source to Git.

## Project progress

**Done:**

- initialize project structure
- setting up and configuring Apache to route traffic serverside (not frontend calling different address (avoiding CORS nonsense))

**In progress:**

- waiting for the right mood or external impetus

**Todo:**

- the rest
