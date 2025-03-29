interface Cordova {
    platformId: string
}

declare global {
    interface Window {
        cordova: Cordova|undefined
    }
}
