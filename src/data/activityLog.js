const { randomUUID } = require('crypto');

const MAX_EVENTS = 50;
const events = [];

const buildId = () => {
  if (typeof randomUUID === 'function') {
    return randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const logEvent = ({ type, summary, details = {} }) => {
  const event = {
    id: buildId(),
    type,
    summary,
    details,
    timestamp: new Date().toISOString(),
  };

  events.unshift(event);
  if (events.length > MAX_EVENTS) {
    events.pop();
  }
};

const getEvents = () => [...events];

module.exports = {
  logEvent,
  getEvents,
};
