# Next.js Server Side Rendering on Firebase with Typescript
This framework is based on the work in https://github.com/jthegedus/firebase-gcp-examples/tree/main/functions-nextjs

Refer to the previously mentioned repo for specifics on the folder structure. This readme only documents the changes I needed to make to run my exisiting Firebase functions project with Next.js 

## How to use this framework 

### Development
- To develop the Next.js app run `npm run next:dev`
- To develop Firebase functions run `npm run fb:dev`

### Production Deployment
When ready to deploy, run `fb:deploy`

Next.js development should not be done using the **Cloud Functions Emulator**, so it is best to not call any endpoints from the Next App served by the cloud functions

### Where to put code 
    ```
    ├ components/
    └ ... Any shared React components use by the project
    ├ helpers/
    └ ... Next app specific helpers
    ├ pages/
    └ ... Next app pages
    ├ public/
    └ ... Public assets
    ├ scripts/
    └ ... Back end scripts (optional)
    ├ .gitignore
    ├ firebase.json     <-- Contains Firebase config for the whole project
    ├ firestore.rules
    ├ next.config.js
    ├ package-lock.json
    ├ package.json
    └ server.js         <-- Next.js Cloud Function prefixed to avoid clashes
    └ src/              <-- All other backend functions
      ├ services/
      ├ ...other dirs and modules specific to the firebase functions/
      └ index.ts        <-- main source file for your Cloud Functions, you can also put services in here and call them from the Next.js app, for example getServerProps
    ```
Things to not forget when setting this up
- Fill out the firebase project/app IDs in `next.config.js` and `firebase.json` respectively

Things to note that are different from the framework this repo is based on:
- `tsconfig.json` was set to output to `dist/`
- When running `next:dev`, `nextjs/` gets filled with the compiled js 
- The package.json `main` property points to the `./dist/server.js` because we want firebase to upload the compiled typescript code which is output to `dist`
- Next.js components and modules can import code from the `./src` dir, for example if you have a service shared between the Next app and firebase backend



