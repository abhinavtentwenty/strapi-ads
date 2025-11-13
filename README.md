# Strapi Plugin: strapi-ads

A Strapi plugin that provides Ads components and interfaces for enhanced content management and user experience.

## Features

- Custom admin panel UI components
- Enhanced content type management
- Customizable dashboard widgets
- Extended API endpoints for UI interactions

## Installation

```bash
npm install strapi-plugin-strapi-ads
```

## Configuration

Add the plugin to your Strapi configuration:

```javascript
// config/plugins.js
module.exports = {
  'strapi-ads': {
    enabled: true,
    resolve: './src/plugins/strapi-ads'
  },
};
```

## Usage

After installation, the custom UI components will be available in your Strapi admin panel. Navigate to the plugins section to configure and use the custom interfaces.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run develop

# Build the plugin
npm run build
```

## Requirements

- Strapi v4.x or higher
- Node.js v14.x or higher

## License

MIT
