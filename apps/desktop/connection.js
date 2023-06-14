const express = require('express')
const localtunnel = require('localtunnel');

const PORT = 3000;

const app = express();

app.get('*', (req, res) => {
  console.log(req.url);

  res.json({
    status: 'OK'
  });
});

app.listen(PORT, async () => {
  let localTunnel = null;

  const createTunnel = async () => {
    const tunnel = await localtunnel({port: PORT});

    tunnel.on('close', async () => {
      localtunnel = await createTunnel();
    })
    
    return tunnel;
  }

  tunnel = await createTunnel()

  console.log(tunnel.url);
});