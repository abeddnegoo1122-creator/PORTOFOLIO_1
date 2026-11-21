# Portfolio CMS Security Specification

## 1. Data Invariants
1. Only a verified administrator (`abeddnegoo1122@gmail.com` with `email_verified == true` or an entry in `/admins/{uid}`) may create, update, or delete CMS documents (`/portfolio_profile`, `/projects`, `/education`, `/experiences`, `/achievements`, `/deck_cards`, `/contact_links`).
2. Public visitors may only read published documents (`published == true`) or the public profile (`/portfolio_profile/public`). Unpublished draft items are readable only by the verified admin.
3. All document writes must strictly match the blueprint keys (`hasAll` + `hasOnly`), enforce string `.size()` bounds, constrain array lengths, bind `ownerId == request.auth.uid` on creation, preserve immutable `ownerId` and `createdAt` on updates, and enforce server-side `request.time` timestamps.
4. No `get()` or `exists()` lookups are ever executed inside `allow list` rules.
5. No user may self-assign admin status in `/admins/{userId}` unless they match the verified bootstrapped admin identity.

## 2. Dirty Dozen Adversarial Payloads (Must Return PERMISSION_DENIED)
1. **Unauthenticated Create**: Anonymous caller tries `setDoc('/projects/p1', ...)` -> Denied (`isSignedIn()` false).
2. **Unverified Email Spoofing**: Caller with `email == 'abeddnegoo1122@gmail.com'` and `email_verified == false` tries to update `/portfolio_profile/public` -> Denied (`email_verified == true` required).
3. **Non-Admin Authenticated Write**: Random signed-in Google user tries to create `/experiences/e1` -> Denied (`isAdmin()` false).
4. **Shadow / Ghost Field Injection**: Admin sends `{ ...validProject, isFeaturedOverride: true }` -> Denied (`hasOnly` rejects unknown key).
5. **Oversized ID Poisoning**: Admin creates `/projects/${'a'.repeat(200)}` or invalid characters `/projects/bad$id` -> Denied (`isValidId()` rejects).
6. **Denial-of-Wallet Oversized String**: Admin creates project with 50KB `description` -> Denied (`size() <= 500` rejects).
7. **Unbounded Array Injection**: Admin updates profile with 50 items in `technicalStack` -> Denied (`size() <= 20` rejects).
8. **Array Element Type Poisoning**: Admin sets `tags: [12345]` on a project -> Denied (`tags[0] is string` rejects).
9. **Owner Spoofing on Create**: Admin sets `ownerId: 'someone-else'` -> Denied (`ownerId == request.auth.uid` rejects).
10. **Immutable Field Tampering**: Admin attempts to mutate `createdAt` or `ownerId` on update -> Denied (`incoming().createdAt == existing().createdAt` & `incoming().ownerId == existing().ownerId`).
11. **Client Timestamp Forgery**: Caller sends `updatedAt: new Date(0)` instead of `serverTimestamp()` -> Denied (`updatedAt == request.time` rejects).
12. **Draft Enumeration / Scraping**: Unauthenticated caller queries `/projects` without `where('published', '==', true)` -> Denied (`allow list` requires `resource.data.published == true || isBootstrappedAdmin()`).
