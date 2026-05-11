export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const ua = request.headers.get('User-Agent') || '';
    const visitorKey = hashKey(ip, ua);
    const SESSION_TTL = 30 * 60;

    const seenKey = `seen:${visitorKey}`;
    const lastSeen = await env.WAYHHOW_VISITORS.get(seenKey);

    if (lastSeen !== null) {
      const counter = (await env.WAYHHOW_VISITORS.get('counter')) || '0';
      return jsonResp({ count: parseInt(counter, 10) });
    }

    const counter = (await env.WAYHHOW_VISITORS.get('counter')) || '0';
    const newCount = parseInt(counter, 10) + 1;
    await env.WAYHHOW_VISITORS.put('counter', String(newCount));
    await env.WAYHHOW_VISITORS.put(seenKey, String(Date.now()), { expirationTtl: SESSION_TTL });

    return jsonResp({ count: newCount });
  },
};

function hashKey(ip, ua) {
  const data = ip + ua;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash) + data.charCodeAt(i);
    hash |= 0;
  }
  return String(Math.abs(hash));
}

function jsonResp(data) {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    },
  });
}
