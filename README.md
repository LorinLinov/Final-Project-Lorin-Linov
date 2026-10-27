<div align="center">

# 🥦 Veggie Haven

**A marketplace where farmers publish fresh vegetable and fruit offers and customers browse and discuss them.**

SoftUni · ReactJS Regular Exam · 2026

</div>

---

## 📑 Table of Contents

- [About the Project](#-about-the-project)
- [Live Demo & Repository](#-live-demo--repository)
- [Technologies](#-technologies)
- [Main Features](#-main-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Functional Guide](#-functional-guide)
  - [1. Project Overview](#1-project-overview)
  - [2. User Access & Permissions](#2-user-access--permissions)
  - [3. Authentication & Session Handling](#3-authentication--session-handling)
  - [4. Routing Structure](#4-routing-structure)
  - [5. List → Details Flow](#5-list--details-flow)
  - [6. Data Source & Backend](#6-data-source--backend)
  - [7. Data Operations (CRUD)](#7-data-operations-crud)
  - [8. Forms & Validation](#8-forms--validation)
  - [9. React-Specific Techniques](#9-react-specific-techniques)
  - [10. Typical User Flow](#10-typical-user-flow)
  - [11. Error & Edge Case Handling](#11-error--edge-case-handling)

---

## 🌱 About the Project

Veggie Haven is a React single-page application about a list of vegetable and fruit offers. Registered users can publish their own offers, manage them, and comment on the offers of other users. Guests can browse everything but cannot take part until they register.

## 🔗 Live Demo & Repository

| | |
|---|---|
| **Live demo** | final-project-lorin-linov.lorin-linov.workers.dev |
| **GitHub repository** | https://github.com/LorinLinov/Final-Project-Lorin-Linov |

## 🛠 Technologies

| Area | Technology |
|---|---|
| Front end | React, JavaScript, React Router, Vite |
| Styling | Plain CSS (`App.css`) |
| Backend | Supabase (PostgreSQL + auto-generated REST API) |
| Authentication | Supabase Auth |
| Notifications | react-toastify |
| Testing | Vitest, React Testing Library |
| Code quality | ESLint |

## ✨ Main Features

- 🛒 Public catalog and product details page
- 🔐 User registration, login and logout
- ➕ Create, ✏️ edit and 🗑 delete your own products
- 💬 Comments on products
- 🛡 Protected routes (logged-in users only) and guest-only routes
- 🧱 Supabase Row Level Security
- 🚫 Custom 404 page
- ✅ Unit tests with Vitest

## 📁 Project Structure

| Folder | Purpose |
|---|---|
| `components` | The pages and UI components, each next to its unit test (`*.spec.jsx`) |
| `api` | Functions that call the backend (auth, products, comments) |
| `contexts` | `auth-context.jsx` and `comment-context.jsx` |
| `hooks` | Custom hooks for authentication and persisted state (`useAuth`, `usePersistedState`) |
| `test` | Test setup (`setupTest.js`) |
| `utils` | The shared `request` helper used by all API calls |

## 🚀 Getting Started

**1. Install the dependencies**

```bash
npm install
```

**2. Add a `.env` file** in the project root with your Supabase settings:

```env
VITE_dataAPI=<your Supabase REST URL>
VITE_authAPIUrl=<your Supabase Auth URL>
VITE_API_KEY=<your Supabase anon/public key>
```

**3. Run the project**

```bash
npm run dev
```

**4. Run the tests**

```bash
npx vitest        # watch mode
npx vitest run    # run once
```

---

# 📖 Functional Guide

## 1. Project Overview

| | |
|---|---|
| **Application name** | Veggie Haven |
| **Category / topic** | Shop (product catalog with comments) |

**Main purpose:** Veggie Haven connects farmers and customers. Registered users publish their own vegetable and fruit offers, and other registered users can comment on them. It solves the problem of small producers having no simple place to present their products directly to buyers.

---

## 2. User Access & Permissions

### Guest (not authenticated)

A guest can view all the offers in the catalog.

- **Pages:** Home, Catalog, Details, Login, Register
- **Public data:** the newest products on the home page, the full catalog, and every product's details. Comments and action buttons are hidden.

### Authenticated user

A logged-in user can view all products, create their own, edit and delete their own, and comment on products of others.

- **Pages:** Home, Catalog, Details (with comments), Add product, Edit product, Logout
- **Create:** any logged-in user
- **Edit / Delete:** only the owner of the product (`user.id === product.user_id`)
- **Comments:** every logged-in user except the owner of the product

---

## 3. Authentication & Session Handling

### Authentication flow

Authentication is handled by **Supabase Auth**.

1. **App load:** `AuthProvider` wraps the app and initializes its state with `usePersistedState('auth', null)`, which restores a saved session if there is one.
2. **Status check:** components call the custom `useAuth()` hook, which exposes `accessToken`, `user`, `isAuthenticated`, `login`, `register` and `logout`.
3. **Login / registration success:** the response (access token and user) is saved, `isAuthenticated` becomes `true`, the header switches from the guest links (Login, Sign Up) to the user links (Add Item, Logout), and the user is redirected to the home page (`/`).
4. **Logout:** the `/logout` route renders `Logout`, which calls `logout()` on mount. The provider calls the backend logout endpoint and then always clears the session (`setAuth(null)`), even if the request fails. The user is redirected to `/` with `<Navigate>`.

### Session persistence

- **Storage:** the session lives in `AuthContext` while the app runs and is persisted in `localStorage` under the key **`auth`**. The saved value is the response from Supabase Auth: the `access_token` and the `user` object. Logout sets it to `null`, which clears the session.
- **Automatic login after refresh:** a reload resets the React state, so `usePersistedState('auth', null)` reads the `auth` key when `AuthProvider` mounts and uses it as the initial state. If a session is saved, the user stays logged in; otherwise the user is a guest.
- **Authorized requests:** the `request` helper reads the same key and sends the token with every API call as `Authorization: Bearer <access_token>`.

---

## 4. Routing Structure

### Route guards logic

Routes are split into **guest-only** routes (`/login`, `/register`) and **private** routes (`/create`, `/edit/:id`, `/logout`).

- A guest who opens a private route is redirected to `/login`.
- A logged-in user who opens a guest-only route is redirected to the home page.
- `/edit/:id` is shown to the product owner only.

### Main routes

| Route | Page | Access |
|---|---|---|
| `/` | Home | Everyone |
| `/catalog` | Catalog | Everyone |
| `/details/:id` | Product details | Everyone (comments for logged-in users only) |
| `/create` | Create product | Authenticated |
| `/edit/:id` | Edit product | Authenticated (owner) |
| `/login` | Login | Guests only |
| `/register` | Register | Guests only |
| `/logout` | Logout (redirects to `/`) | Authenticated |
| `*` | 404 "Page Not Found" | Everyone |

### Nested & parameterized routes

- **Nested routing:** the two guards are layout routes. They render `<Outlet />` for their child routes (private routes and guest-only routes). `Header`, `Footer` and `ToastContainer` are rendered once in `App`, around the `<Routes>` block and inside `AuthProvider`, so they appear on every page.
- **URL parameters:** `/details/:id` and `/edit/:id` read the product `id` with `useParams()`.

---

## 5. List → Details Flow

### Catalog / list page

- **Data displayed:** every product as a card (`CardElement`) with image, name, description and price per kg. The home page shows the 3 newest products (`order=created_at.desc&limit=3`).
- **Interaction:** the user browses the grid of cards. Logged-in users also see a "+ Add New Vegetable" button. There is currently no filter, sort or search.

### Details page

- **Navigation:** every card has a **Details** `<Link to="/details/:id">`. After create, edit or delete, the app uses `useNavigate()` to go to `/catalog` or back to the details page.
- **Route data:** the `id` from the URL is used to fetch the product (`products?id=eq.<id>`) and to load the comments of that product.

---

## 6. Data Source & Backend

### Backend type

A real hosted backend: **Supabase**, which provides a PostgreSQL database with an auto-generated REST API, plus Supabase Auth. It is accessed with `fetch` through two base URLs configured in environment variables:

| Variable | Used for |
|---|---|
| `VITE_dataAPI` | Data (products, comments) |
| `VITE_authAPIUrl` | Authentication (login, register, logout) |
| `VITE_API_KEY` | Sent as the `apiKey` header with every request |

Requests from a logged-in user also send `Authorization: Bearer <access_token>`.

### Collections

| Collection | Fields |
|---|---|
| `products` | `id`, `user_id`, `product_name`, `price`, `imageURL`, `description`, `category`, `farm`, `inStock`, `created_at` |
| `comments` | `comment_id`, `product_id`, `user_id`, `email`, `comment` |

API helpers live in `api/` (`products-api.js`, `comment-api.js`, `auth-api.js`) and use the shared `request` helper from `utils/request.js`.

---

## 7. Data Operations (CRUD)

### Create (POST)

A logged-in user opens `/create`, fills in the product form and submits. The app sends a POST request, shows a success toast and navigates to `/catalog`. Comments are created the same way from the details page.

### Read (GET)

| Where | What is fetched |
|---|---|
| Home | The 3 newest products |
| Catalog | All products (`getAll('/products')`) |
| Details / Edit | A single product (`products?id=eq.<id>`) |
| Details (comments) | All comments of the product (`comment_api.getAll(product_id)`) |

### Update (PUT/PATCH)

The owner clicks **Edit Product** on the details page. The edit form is pre-filled with the loaded product. On submit, `update(product, id)` is called, a success toast is shown and the user is redirected to the details page, which fetches the fresh data.

### Delete

The owner clicks **Delete Product**. A `window.confirm` dialog asks for confirmation, then `remove(id)` is called, a success toast is shown and the user is redirected to `/catalog`, which reloads the list without the deleted product.

---

## 8. Forms & Validation

### Forms used

1. Login
2. Register
3. Create product
4. Edit product
5. Post comment (details page)

### Validation rules

| Form / field | Rules |
|---|---|
| **Create product, all fields** | Every field is required. If any is empty, the toast "All fields are required!" is shown and nothing is sent. |
| **Price (Create)** | `type="number"`, `min="0"`, `step="0.01"`. The keys `-`, `+`, `e` and `E` are blocked. Converted to a number before sending. |
| **Stock (Create)** | `type="number"`, `min="0"`, `step="1"`. Same blocked keys. Converted to a number before sending. |
| **Image URL** | `type="url"`, so the browser checks the format. |
| **Login** | Email and password are required. The email input uses `type="email"`. |
| **Register** | Email, password and confirm password are required. The email uses `type="email"`. Password and confirmation must match ("Passwords don't match."). |

---

## 9. React-Specific Techniques

### Hooks & component lifecycle

| Hook | Where it is used |
|---|---|
| `useState` | Form values (Create, Edit), the loaded product (Details, Edit), product lists (Home, Catalog) |
| `useEffect` | Fetching data on mount or when the route `id` changes (Home, Catalog, Details, Edit, CommentList); calling `logout()` on mount in Logout |
| `useContext` | Reading `AuthContext` and `CommentContext` |
| `useNavigate`, `useParams` | Redirects and reading the `id` from the URL |
| Custom hooks | `useAuth()` for the authentication state and actions; `usePersistedState()` for the saved session |

**Lifecycle example:** when `Details` mounts, its effect fetches the product by `id`. When the `id` in the URL changes, the effect runs again and loads the new product. Until the data arrives, the "Product not found" card is shown.

### Context API

- **`AuthContext`** (provided by `AuthProvider`, wrapping the whole app): `accessToken`, `user`, `isAuthenticated`, `login`, `register`, `logout`. Consumed through `useAuth()` by `Header`, `Catalog`, `Details`, `Login`, `Register` and `CommentList`, and directly by `Logout`.
- **`CommentContext`** (provided by `CommentProvider`, wrapping the content of `Details`): the `comments` list and a `dispatch` function (`SET_COMMENTS`). Consumed by `CommentList`. The two providers are nested, and the comments state exists only on the details page.

### Component styling

Plain CSS in one global stylesheet, `App.css`, with no CSS framework or CSS Modules.

- **Theme variables:** colors are defined once as CSS custom properties in `:root` (`--primary-color`, `--primary-dark`, `--secondary-color`, `--text-color`, `--bg-color`, `--card-bg`).
- **Layout:** Flexbox for the page structure (sticky footer), header, details page and comments; CSS Grid for the product cards.
- **Reusable classes:** `.card`, `.btn` (with `.btn-secondary` and `.btn-danger`), `.form-group`, `.text-center`.
- **Interaction:** hover and focus states with transitions on links, buttons and form fields.

---

## 10. Typical User Flow

1. A visitor opens the home page, sees the newest products and clicks **Explore Our Catalog**.
2. They open a product's **Details** page to read the description, farm and stock.
3. They **register** or **log in** to unlock comments and product management.
4. They add a new vegetable with **Add Item**, then edit or delete it from its details page, and leave comments on other farmers' products.
5. They click **Logout** and are redirected to the home page.

---

## 11. Error & Edge Case Handling

**Authentication errors**
- Missing fields or mismatching passwords show a toast (`react-toastify`).
- If login or registration returns no result, the toast "Invalid input!" is shown. If the request fails (for example wrong credentials), the error message is shown in a toast and the user stays on the form.
- Guests cannot reach private routes (they are redirected to `/login`), and the Create / Edit / Delete buttons and the comments section are hidden from them.

**Network or data errors**
- The `request` helper throws an error for every non-OK HTTP response (`HTTP error! status: <code>`).
- Failed create, update, delete and comment requests show an error toast, and the user stays on the page.
- Failed list requests (Home, Catalog) are logged to the console and show an empty list.

**Empty or missing data**
- An empty product list renders no cards.
- A product that cannot be found shows a "Product not found" card.
- An unknown URL shows the 404 page.
- A product with no comments shows a count of 0.

---

## 🧪 Tests

The components are covered with unit tests (Vitest + React Testing Library):

```bash
npx vitest
```
