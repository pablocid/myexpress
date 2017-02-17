# ExpressCeed

## Cableado
- task runner: npm
- compiler: Typscript
- watcher: when .ts or view is modify > compile tsc (watching) and move files to dist folder > then nodemon reload the server > then browserSync reload the page. 
    - server-side: nodemon with config file
    - client-side: browserSync with config file
    - compiler: tsc --watch with config file
