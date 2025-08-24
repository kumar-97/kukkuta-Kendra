// API Configuration
export const API_CONFIG = {
  // Production Azure Backend URL
  BASE_URL: 'https://kukkuta-kendra-app-fgbaerahbufsage5.centralus-01.azurewebsites.net',
  API_VERSION: 'v1',
  
  // Construct full API URL
  get API_URL() {
    return `${this.BASE_URL}/api/${this.API_VERSION}`;
  },
  
  // Individual service endpoints
  get AUTH_URL() {
    return `${this.API_URL}/auth`;
  },
  
  get FARMERS_URL() {
    return `${this.API_URL}/farmers`;
  },
  
  get ROUTINE_URL() {
    return `${this.API_URL}/routine`;
  },
  
  get MILLS_URL() {
    return `${this.API_URL}/mills`;
  },
  
  get ADMIN_URL() {
    return `${this.API_URL}/admin`;
  },
  
  get PRODUCTION_URL() {
    return `${this.API_URL}/production`;
  }
};

// Development/Testing URLs (uncomment if needed for local development)
// export const DEV_API_CONFIG = {
//   BASE_URL: 'http://192.168.1.19:8000',
//   API_VERSION: 'v1',
//   // ... same structure as above
// }; 