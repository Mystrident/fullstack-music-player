# Fullstack Music Player — Engineering Journey

## Repository status
The local clone available in this workspace is shallow and shows only one visible commit, with the message: `fix reset password token bug`.

That limits the historical reconstruction, but the source code still provides strong evidence of the actual engineering decisions and the problems the project was designed to solve.

## Challenge matrix

| Challenge | Evidence from code/history | What changed | Engineering reasoning | Learning outcome |
|---|---|---|---|---|
| Secure reset-token handling | `git log` shows `fix reset password token bug`; `authController.js` hashes tokens before save and re-hashes during verification | Token handling is moved from raw token use to hashed token storage | Protects reset links from database compromise and avoids storing sensitive values directly | Learned to treat auth tokens as sensitive state |
| JWT auth and session hydration | `App.jsx` reads localStorage fallback and calls `/api/auth/getMe`; `authMiddleware.js` protects routes | UI restores user state after refresh using bearer token | Keeps auth consistent across page reloads and route changes | Learned end-to-end identity handling across client and server |
| User-specific favourites | `songController.js` checks `String(fav.id) === String(song.id)` and normalizes ID types before toggling | Favourites are stored per user and duplicates are prevented | Prevents inconsistent state when IDs arrive as strings or numbers | Learned to normalize data before comparing API values |
| Third-party API separation | Backend fetches Jamendo data; frontend calls backend instead of using the API key directly | Server acts as mediator for external data | Keeps API keys off the browser and centralizes external calls | Learned to isolate infra concerns and external integrations |
| Profile update safety | `editProfile` validates current and new password, and updates only provided fields | Password change path is separated from general profile edits | Reduces accidental mutation and enforces safer validation | Learned to distinguish between ordinary updates and privileged changes |

## Interview questions and evidence-backed answers
1. Why did you use JWT for authentication?
   Answer: The project creates a signed JWT in `createToken()` and verifies it in `authMiddleware.js` before returning protected data.

2. Why was the reset token bug important?
   Answer: The commit message explicitly says `fix reset password token bug`, and the code hashes reset tokens before saving and compares the hash during reset.

3. How did you prevent raw reset tokens from being stored in the database?
   Answer: `forgotPassword()` hashes `resetToken` before assigning it to `user.resetPasswordToken` and clears it after use.

4. How did you keep the user session alive across refreshes?
   Answer: `App.jsx` checks Redux state first, then falls back to `localStorage.getItem("token")` before calling `/api/auth/getMe`.

5. Why did you keep the music API on the backend instead of the frontend?
   Answer: `backend/controllers/songController.js` handles Jamendo requests, which keeps credentials and API logic away from the browser.

6. How did you prevent duplicate favourites?
   Answer: The toggle logic checks if `some()` finds an existing favourite by comparing normalized IDs before either removing or adding it.

7. What problem does the `String(fav.id)` normalization solve?
   Answer: It prevents false mismatches between numeric and string IDs from external or database data.

8. Why did you split profile update logic from password reset logic?
   Answer: `editProfile` checks `currentPassword` and `newPassword` separately and avoids mutating unrelated fields if they are not provided.

9. What was the hardest part of the app state design?
   Answer: Keeping auth state and audio playback state synchronized across a client-side app with protected routes and user-specific favourites.

10. How did you handle invalid or expired auth sessions?
   Answer: The app dispatches `logout()` and sets an error message when `getMe` fails, and protected routes reject unauthenticated requests.

11. Why is ImageKit used instead of storing avatar files directly in MongoDB?
   Answer: `authController.js` uploads avatar data to ImageKit and stores only the resulting URL, separating media storage from document data.

12. How did you ensure the reset flow could not be exploited via stale tokens?
   Answer: `resetPassword()` checks `resetPasswordExpires: { $gt: Date.now() }` together with the hashed token before accepting a reset.

13. What trade-off did you make in the data model?
   Answer: Favourites are stored in the user document, which is simpler than a separate table but ties playlist state to the authenticated user.

14. What would you improve if rebuilding this project?
   Answer: I would likely separate song data caching, add stronger validation on API payloads, and make the frontend state more modular. This is a reasonable improvement, but it is not directly evidenced by the current code.

15. What did the code teach you about real-world backend engineering?
   Answer: It reinforced that session state, auth correctness, and data normalization are often more important than the UI itself in production-grade web apps.

## Strongest evidence-backed takeaways
- The project is best understood as a practical full-stack app built around secure user state and client-server coordination.
- The highest-confidence engineering problem is correctly handling authentication tokens and reset-token security.
- The app also shows a real awareness of data consistency around user favourites and identity hydration.
