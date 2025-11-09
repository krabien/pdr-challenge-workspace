# PDR.cloud Coding Challenge Workspace

For installation instructions, see [INSTALLATION.md](INSTALLATION.md).

---

## General Notes

- AI estimated this at 10-16 hours for someone experienced with all the technologies. Without much experience with both Nx and Zod, it took me about 18 hours.
- I made a few assumptions about the **scope of the assignment** to minimize friction.
- Other **assumptions** include:
  - Data will only be modified using the api going forward - i.e. no special robustness against invalid new data is needed
  - The app is mostly intended for **large screens** - some responsiveness is included, but it’s not optimized for small screens

---

## Backend

- The data in `users.json` was not valid. I pre-processed it as seemed reasonable. In a real-world scenario, I would check with the data owner first.
  - replaced misspelled `birthDtae` with `birthDate` in some places
  - removed invalid `birthDate` value
  - removed `invalid-number` values in `phoneNumber` field
- I’ve provided a few **unit and e2e tests** which could be considered out of scope of the assignment.
  But I like to use them during development, so I left them in to show my process.
- Flat file storage is not going to perform well for multiple users accessing the system concurrently.
  ideally, we would switch to a database in that scenario. but assuming we have to stick with the file approach for some reason, here are some ideas:
  - `id` should be a `UUID` instead of a `number`. that way even in a complex concurrent system (i.e. using load-balancing) collisions are practically impossible.
  - newly created users should be collected in an **in-memory cache** and written to the file periodically.
    in that scenario, file writes should be handled by an additional service.
  - alternatively, the in-memory cache might be implemented using `RxJs` features such as `Subject` and `ConcatMap`.
    That was not implemented because the frontend currently relies on blocking writes (it fetches the users list after posting a new one).
    So a change here would require broader architectural considerations.
  - Note that with both caching approaches described above, special care has to be taken
    to return error feedback to the user if the write operation fails.
- in most real-world scenarios, no backend calls should be possible without **authentication** and **authorization**.
  I considered that beyond the scope of this exercise.
- To avoid unnecessary data transmission, separate DTOs could be used for the `/users` and `/users/:id` routes.

---

## Frontend

- Doing pagination only in the frontend misses out on potential beneficial effects on network and database usage.
  A more scalable solution would be to paginate requests to the backend, which can then in turn paginate its requests to the database.
  This, however, will become most useful once we reach a scale at which we decide to use a database for persistence.
