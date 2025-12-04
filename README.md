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
  config:{
      destinationModelConfig: {model: 'api::model-name.model-name', fields: ['field_name'], filters: { field_type: 'type_name' }, sort: { field_name: 'ASC' }  },
      apiRules: [
          {
              "apis": [
                  "api/api-endpoint-1?field_2=value",
              ],
              "ad_type": "ad-type-1",
              "ad_spot": "ad-spot-1",
              "ad_screen": "ad-screen-1"
          }
      ]
  }
  },
};
```

## Usage

After installation, the strapi Ads components will be available in your Strapi admin panel. Navigate to the plugins section to configure and use the custom interfaces.

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
