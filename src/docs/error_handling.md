# Error Handling Documentation

## Overview

This API uses a centralized error handling system that provides consistent, user-friendly error responses across all endpoints.

---

## Standard Error Response Format

All errors follow this consistent JSON structure:
```json
{
  "success": false,
  "statusCode": <HTTP_STATUS_CODE>,
  "message": "<Human-readable error message>",
  "errors": [<Optional array of validation errors>],
  "stack": "<Stack trace (development only)>"
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `success` | boolean | ✅ Yes | Always `false` for errors |
| `statusCode` | number | ✅ Yes | HTTP status code (400, 401, 403, 404, 409, 422, 500) |
| `message` | string | ✅ Yes | Human-readable error description |
| `errors` | array | ❌ No | Detailed validation errors (422 only) |
| `stack` | string | ❌ No | Error stack trace (development mode only) |

---

## HTTP Status Codes

### 400 - Bad Request
**When:** Client sends invalid or malformed data

**Example:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Title is required"
}
```

**Common Causes:**
- Missing required fields
- Invalid data format
- Malformed request body
- Invalid parameter values

---

### 401 - Unauthorized
**When:** User is not authenticated

**Example:**
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Not authenticated. Please login."
}
```

**Common Causes:**
- No authentication token provided
- Invalid authentication token
- Expired authentication token
- Incorrect username/password

---

### 403 - Forbidden
**When:** User is authenticated but lacks permission

**Example:**
```json
{
  "success": false,
  "statusCode": 403,
  "message": "Access denied. You do not have permission to perform this action."
}
```

**Common Causes:**
- Insufficient role/permissions
- Attempting to modify another user's data
- Blocked or suspended account

---

### 404 - Not Found
**When:** Requested resource doesn't exist

**Example:**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Post not found"
}
```

**Common Causes:**
- Resource ID doesn't exist
- Resource has been deleted
- Incorrect endpoint URL
- Typo in route path

---

### 409 - Conflict
**When:** Request conflicts with existing data

**Example:**
```json
{
  "success": false,
  "statusCode": 409,
  "message": "Email 'user@example.com' is already in use"
}
```

**Common Causes:**
- Duplicate email address
- Duplicate username
- Duplicate slug/identifier
- Concurrent modification conflict

---

### 422 - Unprocessable Entity (Validation Error)
**When:** Request data fails validation

**Example:**
```json
{
  "success": false,
  "statusCode": 422,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

**Common Causes:**
- Schema validation failures (Zod)
- Invalid email format
- Password too short
- Missing required fields

---

### 500 - Internal Server Error
**When:** Unexpected server error occurs

**Example (Production):**
```json
{
  "success": false,
  "statusCode": 500,
  "message": "Something went wrong. Please try again later."
}
```

**Example (Development):**
```json
{
  "success": false,
  "statusCode": 500,
  "message": "Cannot read property 'id' of undefined",
  "stack": "Error: Cannot read property 'id' of undefined\n    at ..."
}
```

**Common Causes:**
- Unhandled exceptions
- Database connection failures
- Third-party service errors
- Bugs in application code

---

## Database Error Responses

### Duplicate Entry (PostgreSQL 23505)
```json
{
  "success": false,
  "statusCode": 409,
  "message": "Email 'test@example.com' is already in use"
}
```

### Foreign Key Violation (PostgreSQL 23503)
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Referenced Author does not exist"
}
```

### Not Null Violation (PostgreSQL 23502)
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Content is required and cannot be empty"
}
```

### Invalid Data Format (PostgreSQL 22P02)
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid integer value: 'abc'. Please check your input format."
}
```

---

## Authentication Errors

### No Token Provided
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Not authenticated. Please login."
}
```

### Invalid Token
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid authentication token. Please login again."
}
```

### Expired Token
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Authentication token has expired. Please login again."
}
```

---

## How to Handle Errors (Client-Side)

### Example: JavaScript/TypeScript
```typescript
async function createPost(data: PostData) {
  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!result.success) {
      // Handle error based on status code
      switch (result.statusCode) {
        case 400:
          console.error('Bad request:', result.message);
          break;
        case 401:
          console.error('Please login');
          // Redirect to login
          break;
        case 403:
          console.error('Access denied:', result.message);
          break;
        case 404:
          console.error('Not found:', result.message);
          break;
        case 409:
          console.error('Conflict:', result.message);
          break;
        case 422:
          console.error('Validation errors:', result.errors);
          // Display field-specific errors
          break;
        case 500:
          console.error('Server error. Please try again later.');
          break;
      }
      return null;
    }

    return result.data;
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}
```

---

## Development vs Production

### Development Mode
- ✅ Detailed error messages
- ✅ Stack traces included
- ✅ Database error details
- ✅ Field names exposed

### Production Mode
- ✅ Generic error messages (security)
- ❌ No stack traces
- ❌ Limited error details
- ✅ User-friendly messages

---

## Error Codes Quick Reference

| Code | Name | Common Cause | Fix |
|------|------|--------------|-----|
| 400 | Bad Request | Missing/invalid data | Check request payload |
| 401 | Unauthorized | Not logged in | Login/refresh token |
| 403 | Forbidden | Insufficient permissions | Check user role |
| 404 | Not Found | Resource doesn't exist | Verify ID/slug |
| 409 | Conflict | Duplicate data | Use different value |
| 422 | Validation Error | Invalid format | Fix validation errors |
| 500 | Server Error | Unexpected error | Contact support |

---

## Testing Error Responses

### Using cURL
```bash
# Test 404
curl http://localhost:3000/api/posts/99999

# Test 401
curl http://localhost:3000/api/posts \
  -H "Content-Type: application/json"

# Test 400
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": ""}'

# Test 409
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "existing@email.com", "password": "pass123"}'
```

### Using Postman

1. Create a collection for error testing
2. Add requests for each error type
3. Save expected responses
4. Run collection to verify consistency

---

## Best Practices

### For API Consumers

1. ✅ Always check `success` field
2. ✅ Handle each status code appropriately
3. ✅ Display `message` to users
4. ✅ Parse `errors` array for validation feedback
5. ✅ Implement proper error logging
6. ✅ Never expose error details to end users in production

### For API Developers

1. ✅ Use appropriate status codes
2. ✅ Provide clear, actionable error messages
3. ✅ Include field information in validation errors
4. ✅ Never leak sensitive data in errors
5. ✅ Log errors server-side for debugging
6. ✅ Test all error scenarios

---

## Support

If you encounter an error not documented here:
1. Check the `message` field for details
2. Review the `statusCode` to understand the error type
3. In development, check the `stack` trace
4. Contact support with the error details