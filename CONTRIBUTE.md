# Issues #
This document is to provide an explanation regarding how we've decided to utilize the GitLab issues board for this group project.

## User Story Issues ##
User Story issues are located in the Backlog list on the issue board.
- The title is the user story.
- Each User Story issue needs at least one label created for it. These are to be used later when the user stories are broken down into smaller tasks.

## Task Issues ##
Task issues are located in the Tasks list on the issue board.
- The title is a one sentence description of the task.
- Further details/specifics can be added as a comment in the issue. 
- Each task should have the label of the User Story Issue it is related to. As well as any other relevant labels, more details in the labels section below.

Usage: 
- Tasks are created from user stories and are anything that requires 1 hour or more of work to implement.
- Tasks may also include bugs or minor features such as styling, etc.

#### Creating Tasks ####
- Anyone can create a task.
- Anyone can break down one task in to multiple smaller tasks.

#### Ordering Tasks ####
- After creating a task order it based on the order of the Backlog User Stories otherwise, move it to the bottom of the Tasks list.
- Ordering the Tasks and Backlog User Stories is the responsibility of the Product Owner.

#### Assigning Tasks ####
- Anyone can assign themselves to open tasks on the Tasks list.
- Once assigned the Task issue must be moved to the "Tasks In Progress" board.

## Labels ##
Labels are created for each user story and each sub-section of the project: 
- backend
- frontend
- database
- testing
- bug
- clean-up

# Branches #
Branch names should start with the number of the issue that they are fixing/implementing.

Ex: 17-contribution-guidelines is the name of the branch that resolves issue #17.

# Commits # 
Commits should follow this general format:
- Line 1: Brief one line description of the changes.
- Line 2: Empty
- Line 3: Further details of changes.

# Merge Requests #
Anything other than minor spelling changes or 1 line fixes require an issue to be created, a separate branch for the changes, and a merge request created before it can be merged into master.

Each merge request requires:
- A description that at the top that includes "Closes #<number of issue>" and a short description of the changes or any initial setup that is required to make the changes such as database commands.
- The Assignee is the current Repo Manager.
  - Note: For iteration 3, we've decided to change the Assignee to also be the reviewer to avoid spamming the Repo Manager's email.
- The Reviewer is the maintainer who will test the branch and perform a code review. Reviewers are chosen from the top of the "Code Review" List on the issue board. Once assigned move the reviewer to the bottom of the list.
- The Milestone should be set to the relevant sprint and iteration.
- Labels should match the issue that is being resolved. This can be done automatically by creating the merge request from the issue.
- Once a merge request has been created, they are to also notified the assigned reviewer via our Discord channel dedicated to merge requests.

In order to be merged:
- The merge request must have at least 1 Approval. This approval is ideally from the reviewer that was assigned.
  - Once a merge request has been approved, the reviewer is to send a message in a dedicated Discord channel for Merge requests to indicate they've approved it.
- All merge conflicts must be resolved.

# Code Style #
Follow code style guidelines found at: https://github.com/airbnb/javascript/react

Enforcement through ESlint: https://eslint.org/docs/user-guide/getting-started
