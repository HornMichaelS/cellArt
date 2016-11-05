module.exports = {
    "extends": "google",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },

    "plugins": [
        "react"
    ],

    "settings": {
        "react": {
            "createClass": "createClass", // Regex for Component Factory to use, default to "createClass" 
            "pragma": "React",  // Pragma to use, default to "React" 
            "version": "15.0" // React version, default to the latest React stable release 
        }
    },

    "rules": {
        "react/jsx-uses-vars": 2
    },
};