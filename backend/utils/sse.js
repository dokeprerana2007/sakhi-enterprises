const clients = new Set();

export function addClient(res){
  // Keep connection open
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  res.write('\n');
  clients.add(res);
  res.on('close', ()=>{ clients.delete(res); });
}

export function broadcast(event, data){
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for(const res of clients){
    try{ res.write(payload); }catch(e){ clients.delete(res); }
  }
}

export function clientCount(){ return clients.size; }
