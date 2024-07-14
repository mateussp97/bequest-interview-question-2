import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>("");
  const [originalData, setOriginalData] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await fetch(API_URL);
      const { data, hash } = await response.json();
      setData(data);
      setOriginalData(data); // Save original data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateData = async () => {
    try {
      await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ data }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      await getData();
      setStatus("Data updated successfully");
    } catch (error) {
      console.error("Error updating data:", error);
      setStatus("Error updating data");
    }
  };

  const verifyData = async () => {
    try {
      console.log("Verifying data...");
      const response = await fetch(`${API_URL}/verify`);
      const { valid } = await response.json();
      const verificationStatus = valid
        ? "Data is intact"
        : "Data has been tampered with";
      console.log("Verify status:", verificationStatus);
      setStatus(verificationStatus);
    } catch (error) {
      console.error("Error verifying data:", error);
      setStatus("Error verifying data");
    }
  };

  const recoverData = async () => {
    try {
      console.log("Recovering data...");
      const response = await fetch(`${API_URL}/recover`, { method: "POST" });
      if (response.ok) {
        await getData(); // Update data after recovery
        setStatus("Data recovered successfully");
      } else {
        setStatus("Error recovering data");
      }
    } catch (error) {
      console.error("Error recovering data:", error);
      setStatus("Error recovering data");
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
      {status && <div>Status: {status}</div>}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          style={{ fontSize: "20px" }}
          onClick={updateData}
          disabled={data === originalData} // Disabled button if data is not changed
        >
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={recoverData}>
          Recover Data
        </button>
      </div>
    </div>
  );
}

export default App;
