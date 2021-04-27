# data-table

## Demo
[https://datatable-app.netlify.app/](https://datatable-app.netlify.app/)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Know issues

The app's UI thread is blocked while generating records. We can fix this problem using a [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers).
