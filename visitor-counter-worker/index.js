export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const counter = (await env.WAYHHOW_VISITORS.get('counter')) || '0';
    const newCount = parseInt(counter, 10) + 1;
    await env.WAYHHOW_VISITORS.put('counter', String(newCount));

    return new Response(JSON.stringify({ count: newCount }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  },
};
