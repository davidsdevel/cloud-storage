  # Development plan for Storage Application

## Description

Storage sync is a cloud storage like DropBox, platform provide a sync folder, file storage, file edition and cross-platform.

Service will be able to:

- [ ] Sync files between devices
- [ ] Upload files
- [ ] Handle Storage Usage
- [ ] Handled connected Devices
- [ ] Hanlded users

### UI

UI is the web application, this how you all the files stored, your usage and file edition

#### Features

- [ ] Edit and save directly from GDocs
- [ ] View PDF online
- [ ] View Storage Usage
- [ ] View connected Devices
- [ ] Remove devices access

### Sync service

Sync service is the main service to receive and handle file modifications. This will handle Web clients and Desktop clients.

#### Features

- [ ] Handle file upload
- [ ] Handle file Sync 

### Desktop application

Desktop application allow client to receive, edit and modify files in local machine.

#### Features

- [ ] Identify machine
- [ ] Sync files
- [ ] Authenticate machine
- [ ] Login
- [ ] Sync Local Folder


### Models

Users

```js
{
  name: String,
  password: String,
  email: String,
  storageSize: Number,
  connectedDevices: Number
}
```

Devices

```js
{
  user: Schema.ObjectId,
  os: String,
  deviceType: String,
  deviceName: String,
  location: String,
  lastSync: Date
}
```

