# AccessiWay Accessibility Scanner

A Node.js application that scans public websites for accessibility issues using Puppeteer and Axe-core. This project was built as a take-home challenge for AccessiWay to demonstrate web accessibility scanning capabilities.

## Features

- **Automated Accessibility Scanning**: Uses Puppeteer to programmatically visit websites and Axe-core to run automated accessibility checks
- **RESTful API**: Complete CRUD operations for managing accessibility scans
- **Multiple URL Support**: Scan multiple pages in a single request
- **Real-time Status Tracking**: Monitor scan progress with status updates
- **CSV Export**: Export scan results in CSV format for analysis
- **Comprehensive Testing**: Unit and integration tests with Jest
- **MongoDB Integration**: Persistent storage of scan results
- **Input Validation**: Request validation using Joi
- **Error Handling**: Centralized error handling with proper HTTP status codes

## API Endpoints

### 1. POST /v1/scan
Create a new accessibility scan for the provided URLs.

**Request Body:**
```json
{
  "urls": [
    "https://example.com",
    "https://google.com"
  ]
}
```

**Response:**
```json
{
  "id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "urls": ["https://example.com", "https://google.com"],
  "status": "pending",
  "results": [],
  "error": null,
  "startedAt": "2023-12-19T10:00:00.000Z",
  "completedAt": null,
  "totalViolations": 0,
  "totalPasses": 0,
  "createdAt": "2023-12-19T10:00:00.000Z",
  "updatedAt": "2023-12-19T10:00:00.000Z"
}
```

### 2. GET /v1/scan
Get a list of all scans with optional filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Number of results per page (default: 10)
- `status` (string): Filter by status (pending, running, completed, failed)

### 3. GET /v1/scan/:scanId
Get a specific scan by its ID.

### 4. PATCH /v1/scan/:scanId
Update an existing scan.

**Request Body:**
```json
{
  "urls": ["https://updated-example.com"],
  "status": "pending"
}
```

### 5. DELETE /v1/scan/:scanId
Delete a specific scan.

### 6. POST /v1/scan/:scanId/execute
Execute an accessibility scan for the URLs in the scan.

### 7. GET /v1/scan/:scanId/export
Export scan results to CSV format.

## Installation and Setup

### Prerequisites
- Node.js (>= 12.0.0)
- MongoDB
- Yarn or npm

### Installation Steps

1. **Clone the repository:**
```bash
git clone <repository-url>
cd AccessiWay-home-assessment
```

2. **Install dependencies:**
```bash
yarn install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
# Port number
PORT=3000

# MongoDB connection string
MONGODB_URL=mongodb://127.0.0.1:27017/accessiway-scanner

# JWT secret
JWT_SECRET=thisisasamplesecret

# JWT expiration time
JWT_ACCESS_EXPIRATION_MINUTES=30

# Environment
NODE_ENV=development
```

4. **Start MongoDB:**
```bash
# If using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or start your local MongoDB service
```

5. **Run the application:**
```bash
# Development mode
yarn dev

# Production mode
yarn start
```

The application will be available at `http://localhost:3000`

## Running Tests

### Run all tests:
```bash
yarn test
```

### Run tests in watch mode:
```bash
yarn test:watch
```

### Run tests with coverage:
```bash
yarn coverage
```

## API Documentation

Once the application is running, you can access the interactive API documentation at:
`http://localhost:3000/v1/docs`

## Usage Examples

### 1. Create a new scan:
```bash
curl -X POST http://localhost:3000/v1/scan \
  -H "Content-Type: application/json" \
  -d '{
    "urls": ["https://example.com", "https://google.com"]
  }'
```

### 2. Execute a scan:
```bash
curl -X POST http://localhost:3000/v1/scan/{scanId}/execute
```

### 3. Get scan results:
```bash
curl http://localhost:3000/v1/scan/{scanId}
```

### 4. Export results to CSV:
```bash
curl http://localhost:3000/v1/scan/{scanId}/export -o results.csv
```

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── docs/           # API documentation
├── middlewares/    # Custom express middlewares
├── models/         # Mongoose models
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
├── validations/    # Request data validation schemas
├── app.js          # Express app
└── index.js        # App entry point
```

## Design Decisions

### 1. **Technology Stack**
- **Express.js**: Chosen for its simplicity and extensive middleware ecosystem
- **MongoDB + Mongoose**: Provides flexible schema for storing scan results with complex nested data
- **Puppeteer**: Industry-standard for browser automation and web scraping
- **Axe-core**: De facto standard for automated accessibility testing
- **Jest**: Popular testing framework with excellent async support

### 2. **Architecture**
- **Service Layer**: Separates business logic from controllers for better testability
- **Repository Pattern**: Models handle data persistence
- **Middleware Pattern**: Reusable validation and error handling
- **Async/Await**: Modern JavaScript patterns for better error handling

### 3. **Data Model**
- **Scan Model**: Stores scan metadata and results
- **Nested Results**: Each URL scan result contains violations, passes, inapplicable, and incomplete checks
- **Status Tracking**: Tracks scan progress (pending, running, completed, failed)
- **Timestamps**: Records start and completion times

### 4. **Error Handling**
- **Centralized Error Handling**: Consistent error responses across the API
- **Validation**: Input validation using Joi schemas
- **Graceful Degradation**: Continues scanning other URLs if one fails

### 5. **Performance Considerations**
- **Headless Browser**: Puppeteer runs in headless mode for better performance
- **Timeout Handling**: 30-second timeout for page loading
- **Resource Cleanup**: Proper browser cleanup after each scan

## Time Spent

- **Project Setup**: 30 minutes
- **Model Design**: 45 minutes
- **Service Layer**: 1 hour
- **API Endpoints**: 1.5 hours
- **Testing**: 1 hour
- **Documentation**: 45 minutes
- **Postman Collection**: 30 minutes
- **Bug Fixes & Refinements**: 1 hour

**Total Time**: ~7 hours

## Future Improvements

Given more time, I would implement the following enhancements:

### 1. **Authentication & Authorization**
- JWT-based authentication
- Role-based access control
- API key management for external integrations

### 2. **Advanced Features**
- **Concurrent Scanning**: Process multiple URLs simultaneously
- **Scheduled Scans**: Recurring accessibility checks
- **Webhook Notifications**: Real-time scan completion notifications
- **Custom Rules**: Allow users to define custom accessibility rules
- **Screenshot Capture**: Store screenshots of violations for visual review

### 3. **Performance Optimizations**
- **Caching**: Redis for caching scan results
- **Queue System**: Bull/Agenda for handling large scan queues
- **Database Indexing**: Optimize MongoDB queries
- **CDN Integration**: Serve static assets via CDN

### 4. **Enhanced Reporting**
- **PDF Reports**: Generate detailed PDF accessibility reports
- **Dashboard**: Web-based dashboard for scan management
- **Trend Analysis**: Track accessibility improvements over time
- **Comparison Reports**: Compare accessibility scores between versions

### 5. **Integration Capabilities**
- **CI/CD Integration**: GitHub Actions, GitLab CI, Jenkins
- **Slack/Teams Notifications**: Integration with team communication tools
- **Jira Integration**: Create tickets for accessibility violations
- **Email Reports**: Automated email reports for stakeholders

### 6. **Monitoring & Observability**
- **Health Checks**: Application health monitoring
- **Metrics**: Prometheus metrics for monitoring
- **Logging**: Structured logging with correlation IDs
- **Alerting**: Proactive alerts for scan failures

### 7. **Security Enhancements**
- **Rate Limiting**: Prevent API abuse
- **Input Sanitization**: Enhanced security measures
- **Audit Logging**: Track all API operations
- **CORS Configuration**: Proper cross-origin resource sharing

## Testing Strategy

The application includes comprehensive testing:

- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **Fixtures**: Reusable test data
- **Mocking**: External service mocking for reliable tests

## Deployment

The application can be deployed using:

- **Docker**: Containerized deployment
- **PM2**: Process management for production
- **Environment Variables**: Configuration management
- **Health Checks**: Application monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License. 