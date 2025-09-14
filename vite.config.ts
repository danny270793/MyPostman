import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Resolve aliases for cleaner imports
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@store': resolve(__dirname, 'src/store'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@i18n': resolve(__dirname, 'src/i18n'),
      '@types': resolve(__dirname, 'src/types'),
    }
  },

  // Development server configuration
  server: {
    port: 5174,
    host: true, // Allow external connections
    open: true, // Auto-open browser
    cors: true, // Enable CORS for API testing
    hmr: {
      overlay: false // Disable error overlay for better UX
    }
  },

  // Build optimizations
  build: {
    // Generate source maps for production debugging
    sourcemap: false,
    
    // Minimize bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    },
    
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for third-party libraries
          vendor: ['react', 'react-dom'],
          
          // Redux chunk
          redux: ['@reduxjs/toolkit', 'react-redux', 'redux-saga'],
          
          // i18n chunk
          i18n: ['react-i18next', 'i18next', 'i18next-browser-languagedetector']
        },
        
        // Asset file naming
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split('.').at(-1)
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType ?? '')) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/woff2?|eot|ttf|otf/i.test(extType ?? '')) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        
        // Chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    
    // Target modern browsers
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    
    // Asset optimization
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    
    // CSS code splitting
    cssCodeSplit: true
  },

  // Preview server configuration (for production build testing)
  preview: {
    port: 4173,
    host: true,
    cors: true
  },

  // Optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'redux-saga',
      'react-i18next',
      'i18next',
      'i18next-browser-languagedetector'
    ]
  },

  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
})
