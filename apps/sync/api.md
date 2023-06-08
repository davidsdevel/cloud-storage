# API Plan

Plan API

## Structure

### Auth Routes

POST - /api/auth

body {
  email: String,
  password: String
}

response {
  accessToken: String
}

statuses
  - 200
  - 400
  - 401

### Authorization

Headers {
  access-token: String
}

### Files

#### File creation

`POST - /api/file`

Headers {
  content-type: multipart/form-data   
}

Body {
  file: Blob
  path: String
}

Statuses
  - 201
  - 400
  - 401
  - 402
  - 405

#### File retrievement


`GET - /api/file/:path+`

Query {
  type: raw | json
  fields: String
}

Response Buffer | {
  name: String
  path: String,
  metadata: {
    modified: Date
    mimetype: String,
    size: Number
  }
}

Statuses
  - 200
  - 400
  - 401
  - 402
  - 405

#### File deletion


`DELETE - /api/file/:path+`

Response {
  name: String
  path: String,
  metadata: {
    modified: Date
    mimetype: String,
    size: Number
  }
}

Statuses
  - 200
  - 400
  - 401
  - 402
  - 405

