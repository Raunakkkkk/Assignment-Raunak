const { addCallLog, getAllCallLogs } = require("../data/store");

// POST /postcall
function postcall(req, res) {
  try {
    console.log("POST /postcall endpoint called");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    const {
      type,
      sessionId,
      toPhoneNumber,
      fromPhoneNumber,
      callType,
      disconnectionReason,
      direction,
      createdAt,
      endedAt,
      transcript,
      summary,
      isSuccessful,
      dynamicVariables,
    } = req.body;

    // Validate required fields
    if (!sessionId) {
      console.log("Missing sessionId in request body");
      return res.status(400).json({
        success: false,
        error: "Bad request",
        message: "sessionId is required in request body",
      });
    }

    // Determine if call was successful based on isSuccessful field or disconnection reason
    const callSuccessful =
      isSuccessful !== undefined
        ? isSuccessful
        : disconnectionReason !== "user_ended_call" &&
          disconnectionReason !== "call_failed";

    const callLogEntry = {
      type: type || "end-of-call-report",
      sessionId,
      toPhoneNumber: toPhoneNumber || "",
      fromPhoneNumber: fromPhoneNumber || "",
      callType: callType || "phonecall",
      disconnectionReason: disconnectionReason || "",
      direction: direction || "outbound",
      createdAt: createdAt || new Date().toISOString(),
      endedAt: endedAt || new Date().toISOString(),
      transcript: transcript || [],
      summary: summary || "",
      isSuccessful: callSuccessful,
      dynamicVariables: dynamicVariables || {},
      timestamp: new Date().toISOString(),
      saved: true,
    };

    addCallLog(callLogEntry);

    const callStatus = callSuccessful ? "successful" : "failed";
    console.log(
      `Call log saved successfully. SessionId: ${sessionId}, Status: ${callStatus}`
    );

    res.status(200).json({
      status: "saved",
      success: true,
      sessionId,
      callSuccessful: callSuccessful,
      disconnectionReason: disconnectionReason,
      timestamp: callLogEntry.timestamp,
    });
  } catch (error) {
    console.error("Error in /postcall endpoint:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "Failed to save call log",
    });
  }
}

// GET /logs
function logs(req, res) {
  try {
    console.log("GET /logs endpoint called");
    const logs = getAllCallLogs();
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    console.error("Error in /logs endpoint:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "Failed to retrieve call logs",
    });
  }
}

module.exports = { postcall, logs };
