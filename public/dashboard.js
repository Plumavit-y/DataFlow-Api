const FETCH_INTERVAL = 2000;
const MAX_EVENTS = 50;
const TIMELINE_MINUTES = 10;

let eventHistory = [];
let lastEventTime = null;

// Helper para obtener el token
function getToken() {
  return localStorage.getItem('df_token');
}

// Interceptar si no hay token (redundante con HTML, pero seguro)
if (!getToken() && window.location.pathname === '/') {
  window.location.href = '/login.html';
}

function getEventType(event) {
  if (!event) return 'other';
  const type = (event.type || '').toLowerCase();
  if (type.includes('auth') || type.includes('user')) return 'auth';
  if (type.includes('product')) return 'product';
  if (type.includes('order')) return 'order';
  if (type.includes('health') || type.includes('status')) return 'health';
  return 'other';
}

function formatTimestamp(date) {
  const now = new Date();
  const diff = now - date;
  if (diff < 1000) return 'now';
  if (diff < 60000) return `${Math.floor(diff / 1000)}s`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  return `${Math.floor(diff / 3600000)}h`;
}

function renderEventLog() {
  const logEl = document.getElementById('event-log');
  if (eventHistory.length === 0) {
    logEl.innerHTML = `
      <div class="empty-state">
        <p>No activity detected yet.</p>
        <small>Try calling the API or run the demo script.</small>
      </div>`;
    return;
  }

  logEl.innerHTML = eventHistory
    .slice(0, 25)
    .map((event) => {
      const type = getEventType(event);
      const timeAgo = formatTimestamp(new Date(event.timestamp));
      const message = event.summary || 'Event';
      const details = event.details ? JSON.stringify(event.details).substring(0, 100) : '';

      return `
      <div class="event-item">
        <div class="event-meta">
          <span class="event-type-badge type-${type}">${type}</span>
          <span class="event-time">${timeAgo}</span>
        </div>
        <div class="event-msg">${escapeHtml(message)}</div>
        ${details ? `<div class="event-details">${escapeHtml(details)}</div>` : ''}
      </div>
    `;
    })
    .join('');
}

function renderTimeline() {
  const timelineEl = document.getElementById('timeline-bars');
  const now = new Date();
  const tenMinutesAgo = new Date(now - TIMELINE_MINUTES * 60 * 1000);

  const slots = Array(20).fill(0); // 20 bars

  eventHistory.forEach((event) => {
    const eventDate = new Date(event.timestamp);
    if (eventDate >= tenMinutesAgo) {
      const slotIndex = Math.floor(
        (eventDate - tenMinutesAgo) / ((TIMELINE_MINUTES * 60 * 1000) / 20)
      );
      if (slotIndex >= 0 && slotIndex < 20) {
        slots[slotIndex]++;
      }
    }
  });

  const maxEvents = Math.max(...slots, 1);
  timelineEl.innerHTML = slots
    .map((count) => {
      const height = Math.max(5, (count / maxEvents) * 100);
      const opacity = count > 0 ? 1 : 0.2;
      return `<div class="timeline-bar" style="height: ${height}%; opacity: ${opacity}" title="${count} events"></div>`;
    })
    .join('');
}

function updateStats() {
  document.getElementById('event-count').textContent = eventHistory.length;
  document.getElementById('log-count').textContent = eventHistory.length;

  if (eventHistory.length > 0) {
    const latest = eventHistory[0];
    const type = getEventType(latest);
    const message = latest.summary || 'Event';

    document.getElementById('last-action-type').textContent =
      type.charAt(0).toUpperCase() + type.slice(1);
    document.getElementById('last-action-desc').textContent =
      message.substring(0, 40) + (message.length > 40 ? '...' : '');

    const oneMinuteAgo = new Date(Date.now() - 60000);
    const recentEvents = eventHistory.filter((e) => new Date(e.timestamp) >= oneMinuteAgo).length;
    document.getElementById('event-rate').textContent = `${recentEvents} req/min`;
  }

  const now = new Date();
  document.getElementById('last-update-time').textContent = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const isActive = eventHistory.length > 0 && lastEventTime && Date.now() - lastEventTime < 30000;
  const statusBadge = document.getElementById('global-status');
  if (isActive) {
    statusBadge.querySelector('.status-text').textContent = 'System Online';
    statusBadge.querySelector('.status-dot').style.background = 'var(--success)';
  } else {
    statusBadge.querySelector('.status-text').textContent = 'System Idle';
    statusBadge.querySelector('.status-dot').style.background = 'var(--warning)';
  }
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

async function fetchEvents() {
  const token = getToken();
  if (!token) return;

  try {
    const response = await fetch('/api/events?limit=100', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401 || response.status === 403) {
      // Token expiado o inválido
      localStorage.removeItem('df_token');
      window.location.href = '/login.html';
      return;
    }

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const events = data.events || [];

    const existingIds = new Set(eventHistory.map((e) => e.timestamp + e.summary));
    const newEvents = events.filter((e) => !existingIds.has(e.timestamp + e.summary)).reverse();

    if (newEvents.length > 0) {
      eventHistory = [...newEvents, ...eventHistory].slice(0, MAX_EVENTS);
      lastEventTime = Date.now();
    }

    renderEventLog();
    renderTimeline();
    updateStats();
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

// Download logs
function downloadLogs(format) {
  window.location.href = `/api/export/logs?format=${format}`;
}

document.addEventListener('DOMContentLoaded', () => {
  if (getToken()) {
    fetchEvents();
    setInterval(fetchEvents, FETCH_INTERVAL);
  }
});
