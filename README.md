# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal server or database is breached.

**1. How does the client ensure that their data has not been tampered with?**
<br />
The client can check if their data has been tampered with by using a hash function. Every time the data is saved, a SHA-256 hash of the data is created and stored with it. To verify the data, the client can use the /verify route on the backend. This route recalculates the hash of the current data and compares it with the stored hash. If they match, the data is intact. If they don't match, the data has been tampered with. On the frontend, the client can click the "Verify Data" button to see the result.
<br />
<br />
**2. If the data has been tampered with, how can the client recover the lost data?**
<br />
If the data has been tampered with, the client can recover the original data using the backup. Every time the data is updated, a backup copy is saved in a file called backup.json. To restore the data, the client can use the /recover route on the backend. This route reads the backup file and restores the original data. On the frontend, the client can click the "Recover Data" button to bring back the original data and see a message that confirms the recovery was successful.

### To run the apps:

`npm run start` in both the frontend and backend

## Evidence

<video src='./video-demo.mp4' controls autoPlay></video>
