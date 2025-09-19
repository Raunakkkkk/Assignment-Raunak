// In-memory store for call logs
const callLogs = [];

function addCallLog(entry) {
  callLogs.push(entry);
  return entry;
}

function getAllCallLogs() {
  return callLogs;
}

module.exports = { addCallLog, getAllCallLogs };
