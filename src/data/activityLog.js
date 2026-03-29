/**
 * @file In-memory activity log for real-time event streaming.
 *
 * Maintains a capped circular buffer of the most recent {@link MAX_EVENTS}
 * system events so the live dashboard always reflects up-to-date activity
 * without requiring a persistent database.
 *
 * @module data/activityLog
 */

const { randomUUID } = require('crypto');

/**
 * Maximum number of events retained in memory.
 *
 * @type {number}
 */
const MAX_EVENTS = 50;

/** @type {object[]} Internal events buffer. */
const events = [];

/**
 * Generates a unique event identifier.
 * Uses `crypto.randomUUID()` when available; falls back to a timestamp-based
 * string for compatibility with older Node.js versions.
 *
 * @returns {string} A unique ID string.
 */
const buildId = () => {
  if (typeof randomUUID === 'function') {
    return randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

/**
 * Records a new event in the activity log.
 *
 * Prepends the event to the buffer so the most recent entry is always first.
 * When the buffer exceeds {@link MAX_EVENTS} entries the oldest event is
 * removed.
 *
 * @param {{ type: string, summary: string, details?: object }} params
 *   Event parameters.
 * @param {string} params.type    - Dot-namespaced event type (e.g. `'auth.login'`).
 * @param {string} params.summary - Short human-readable description.
 * @param {object} [params.details={}] - Additional structured metadata.
 */
const logEvent = ({ type, summary, details = {} }) => {
  const event = {
    id: buildId(),
    type,
    summary,
    details,
    timestamp: new Date().toISOString()
  };

  events.unshift(event);
  if (events.length > MAX_EVENTS) {
    events.pop();
  }
};

/**
 * Returns a shallow copy of all stored events.
 *
 * A copy is returned so callers cannot mutate the internal buffer.
 *
 * @returns {object[]} Array of event objects, most recent first.
 */
const getEvents = () => [...events];

module.exports = {
  logEvent,
  getEvents
};
