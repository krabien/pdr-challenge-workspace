# PDR.cloud Coding Challenge Workspace

### General Notes

- AI estimated this at 10-16 hours for someone experienced with all the technologies.I think I pretty much stayed within that time frame.
- troubleshooting Nx and Angular took quite some time… see Angular vs TypeScript workspaces problems: https://github.com/nrwl/nx/issues/28322#issuecomment-2402623507. It’s still not working properly, I can’t use the Angular CLI for anything... I took it as an exercise in creating everything manually.
- setting up the monorepo failed twice, but worked the third time without any changes

#### Backend

- the data in users.json was not valid, I pre-processed it as seemed reasonable. In a real-world scenario, I would check with the data owner first.
  - replaced misspelled birthDtae with birthDate in some places
  - removed invalid birthDate
  - removed invalid-number phone numbers
- flat file storage is not going to perform well for multiple users accessing the system concurrently. ideally, we would switch to a database in that scenario. but assuming we have to stick with the file approach for some reason, here are some ideas:
  - id should be a UUID instead of a number. that way even in a complex concurrent system (i.e. using load-balancing) collisions are practically impossible.
  - newly created users should be collected in an in-memory cache and written to the file periodically. in that scenario, file writes should be handled by an additional service. note that in this scenario, special care should be taken to return error feedback to the user if the write operation fails.
- in most real-world scenarios, no backend calls should be possible without proper authentication and authorization. That’s beyond the scope of this exercise, however.
- I’ve provided a few AI-generated (and checked by me) unit and e2e tests which was out of scope of the assignment, but I like to use them during development, so I didn’t see any harm in committing them.

#### Frontend

- doing pagination only in the frontend does not have any beneficial effects on network and database usage. a more scalable solution would be to paginate requests to the backend, which can then in turn paginate its requests to the database. this, however, will become most useful once we reach a scale at which we decide to use a database for persistence.
