#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

function copy(source, destination) {
    const files = fs.readdirSync(source)
    files.map(file => {
        const fileFullPath = path.join(source, file)
        const destPath = path.join(destination, file)
        const stats = fs.statSync(fileFullPath)
        if(stats.isFile()) {
            fs.copyFileSync(fileFullPath, destPath)
        } else if (stats.isDirectory()) {
            fs.mkdirSync(destPath, { recursive: true })
            copy(fileFullPath, destPath)
        }
    })
}

module.exports = function (context) {
    console.log('Running deploy_react.js hook')

    const reactBuildPath = path.join(context.opts.projectRoot, '..', 'web', 'dist')
    if (!fs.existsSync(reactBuildPath)) {
        console.error(`React dist folder not found at ${reactBuildPath}. Please build your React app first.`)
        process.exit(1)
    }

    const cordovaWWWPath = path.join(context.opts.projectRoot, 'www')
    if (fs.existsSync(cordovaWWWPath)) {
        console.log(`Removing existing files in ${cordovaWWWPath}`)
        fs.rmSync(cordovaWWWPath, { recursive: true, force: true })
    }
    fs.mkdirSync(cordovaWWWPath, { recursive: true })

    const files = fs.readdirSync(reactBuildPath)
    files.map(file => {
        const fileFullPath = path.join(reactBuildPath, file)
        const stats = fs.statSync(fileFullPath)
        if(stats.isFile()) {
            const destPath = path.join(cordovaWWWPath, file)
            fs.copyFileSync(fileFullPath, destPath)
        } else if (stats.isDirectory()) {

        }
        console.log(fileFullPath)
    })

    copy(reactBuildPath, cordovaWWWPath)

    const indexFile = path.join(cordovaWWWPath, 'index.html')
    const content = fs.readFileSync(indexFile, 'utf8')
    const newContent = content.replace('</body>', '</body>\n  <script src="cordova.js"></script>')
    fs.writeFileSync(indexFile, newContent, 'utf8')

    console.log('React dist deployed into cordova')
}
