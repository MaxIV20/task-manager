# Task manager — design specification

## Goal and scope

Build a Vue 3 single-page task manager for a team. The application uses TypeScript, Pinia, Element Plus, Yup, Vite, hash-based routing and Feature-Sliced Design (FSD). It uses a delayed in-memory mock API; no backend is required.

Included scope:

- Kanban task list with filtering, creation, cloning and deletion.
- Task details with editing and comment CRUD.
- Comments modelled with an identifier, text and creation timestamp, sortable in ascending or descending timestamp order.
- Element Plus notifications for successful operations and unexpected failures.
- DTO-to-domain mappers.
- Responsive Jira-inspired layout with functional mobile support.
- Custom asynchronous query infrastructure, replacing TanStack Query.

Excluded scope:

- Unit tests.
- Drag-and-drop between Kanban columns.

## Architecture

The project follows FSD and only imports another slice through its root public API.

```text
src/
  app/                         application bootstrap, Pinia, Element Plus and hash router
  layouts/
    default/                   application shell and persistent header
  pages/
    task-list/                 route-level composition for /tasks
    task-details/              route-level composition for /tasks/:id
  widgets/
    kanban-board/              task toolbar, loading/empty/error states and status columns
    task-content/              task title, description and primary task actions
    task-comments/             comments list, sort control and comment feature composition
    task-info-sidebar/         status, priority, assignee and creation timestamp
  features/
    create-task/               creation dialog and validation
    edit-task/                 editing dialog and validation
    task-filters/              draft/applied filters and filter form
    task-actions/              clone and delete actions
    manage-comments/           comment create, edit and delete actions
  entities/
    task/                      domain types, constants, DTOs, mappers, API, queries and Pinia store
  shared/                      generic UI and neutral utilities when needed
  utils/
    api/                       API client and generic async-query composable
```

`pages` compose public APIs from lower layers and contain no data-fetching, mutation or validation logic. Every route is rendered inside `layouts/default`, which provides the application shell and a persistent header shared by all pages. The header contains the app identity and the Create task feature, so task creation is available from both the board and task details, similarly to Jira. `entities/task` owns the application task state. Features own user intents and their validation. Widgets compose the visible page blocks.

## Domain model and DTO boundary

The UI and Pinia store use only domain models.

```ts
type TaskStatus = 'todo' | 'in_progress' | 'done';
type TaskPriority = 'low' | 'medium' | 'high';

type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee: string;
  priority: TaskPriority;
  createdAt: string;
};

type TaskComment = {
  id: string;
  text: string;
  createdAt: string;
};

type TaskFull = Task & {
  comments: TaskComment[];
};
```

The in-memory mock API stores and returns DTOs, which may use transport-specific field names such as `created_at`, `assignee_email` and `null` descriptions. A mapper converts each API response to a domain model and normalises optional values. Mutation payload mappers convert form/domain values into DTO request payloads. This prevents transport details from leaking into UI or store code.

`Task` is used for Kanban previews. `TaskFull` is used for a selected task and its comments. Status and priority constants provide human-readable Russian labels and Element Plus control options.

## State and API operations

The Pinia setup store owns:

- `tasks`: task previews used by the board and duplicate-title validation.
- `currentTask`: complete task used by the detail route.
- mutation state and errors needed by create, update, clone, delete and comment actions.

The mock API supports list, detail, create, update, clone, delete and comment CRUD. Read operations simulate two seconds of latency and support `AbortSignal`; mutations update the same in-memory source. A successful mutation reconciles both `tasks` and `currentTask` where applicable.

Filtering is applied by title, multiple statuses and multiple priorities. The visible list is obtained from the mock API using the applied filters. The duplicate-title rule checks `store.tasks.some((task) => task.title === data.title)` before create or update, excluding the current task during editing.

## Custom query infrastructure

No TanStack Query is used. `utils/api` contains a generic `useAsyncQuery` composable. It owns `data`, `error` and `isLoading` refs, creates an `AbortController` for every request, passes its signal to the query function, and aborts the active request through `onScopeDispose`.

The utility guards against stale results with a request sequence identifier. Only the latest active request may change `data`, `error` or `isLoading`. An abort is silent and never shown as a user-facing error. The API client preserves an abort instead of normalising it to an `ApiError`.

Each endpoint gets an entity-level query composable analogous to the style guide's Vue Query hooks. It accepts its domain-specific reactive arguments, calls `useAsyncQuery` internally, invokes the relevant endpoint, maps its DTOs, and receives required store actions as explicit arguments. Query modules never import, instantiate or read a Pinia store; there is no hidden store dependency.

For example, `useTasksQuery(appliedFilters, setTasks)` watches the applied filter ref and writes mapped tasks with the passed callback. The filters form updates `appliedFilters` only after Yup validation and an explicit Apply action, so typing does not cause requests. `useTaskQuery(taskId, setCurrentTask)` handles the detail request. A `refetch` action is available for explicit retry after an error.

## Routes and user flows

The router uses `createWebHashHistory`.

- `/` redirects to `/tasks`.
- `/tasks` shows the board.
- `/tasks/:id` shows details. Once its request completes with no task, it redirects to `/tasks`.

The default layout displays a persistent Jira-inspired header with the app identity and a Create task button. The tasks page shows a dense toolbar with its title and filter controls. The board contains Todo, In progress and Done columns. Cards show title, readable status, readable priority, assignee and formatted creation date. Selecting a card opens its detail route.

The Create task dialog includes title, description, assignee and priority. Status is omitted and defaults to `todo`. On successful creation the app navigates to `/tasks/:id`; Cancel closes the dialog without changing the route.

The detail page composes three widgets: `task-content` for the title, description and primary task actions; `task-comments` for the comments list and its sort control; and `task-info-sidebar` for status, priority, assignee and creation timestamp. The page initially renders read-only fields plus Back, Edit, Clone and Delete actions. Edit opens a dialog with the editable task fields. Saving updates state and closes it. Clone creates a full copy, including comments, with a new task id. Delete requires a user confirmation before removal. The comments area supports create, edit and confirmed delete, plus ascending/descending timestamp sort.

## Validation, loading and errors

Yup schemas validate task forms:

- title is required and has 3–200 characters;
- description is optional and has at most 2,000 characters;
- priority is required and limited to low, medium or high.

The filter title uses the same 3–200 character bounds when present. Field-level errors are visible in Element Plus forms. Duplicate titles are reported as a form error.

While a list or detail request is in progress, the corresponding widget displays a loader. Network/request failures display a visible error state and a retry action. Mutation errors stay associated with the relevant form or action. Action buttons are disabled during pending mutations to prevent duplicate submissions. `ElNotification` reports successful mutations and unexpected failures; `ElMessageBox` confirms destructive task and comment deletions.

## Responsive presentation

On desktop, the board uses three visible columns and a compact Jira-inspired visual hierarchy. On mobile, the header keeps the Create task action accessible, while controls stack or become full-width and Kanban columns retain their meaning through horizontal scrolling. Cards, forms, dialog actions and detail content remain readable at the existing media breakpoints.

## Verification

Unit tests and drag-and-drop are deliberately out of scope. Completion requires successful type checking, ESLint, formatting verification and production build. Manual verification covers loading, error/retry, filtering and reset, task creation, details, editing, cloning, deletion, comment CRUD and both comment sort orders on desktop and mobile layouts.
