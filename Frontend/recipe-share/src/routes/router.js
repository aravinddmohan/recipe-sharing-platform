import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import SignUp from "../components/SignUp";
import Login from "../components/Login";
import HomePage from "../components/HomePage";
import CreateRecipe from "../components/CreateRecipe";
import SingleRecipe from "../components/SingleRecipe";
import Profile from "../components/Profile";
import MyRecipes from "../components/MyRecipes";
import EditRecipe from "../components/EditRecipe";
import ChangePassword from "../components/ChangePassword";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([

  // PUBLIC ROUTES
  { path: "/", element: <LandingPage /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <Login /> },

  // PROTECTED ROUTES
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    )
  },
  {
    path: "/create-recipe",
    element: (
      <ProtectedRoute>
        <CreateRecipe />
      </ProtectedRoute>
    )
  },
  {
    path: "/recipe/:id",
    element: (
      <ProtectedRoute>
        <SingleRecipe />
      </ProtectedRoute>
    )
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: "/my-recipes",
    element: (
      <ProtectedRoute>
        <MyRecipes />
      </ProtectedRoute>
    )
  },
  {
    path: "/edit-recipe/:id",
    element: (
      <ProtectedRoute>
        <EditRecipe />
      </ProtectedRoute>
    )
    
  },
  {
    path: "/change-password",
    element: (
      <ProtectedRoute>
        <ChangePassword />
      </ProtectedRoute>
    )
  },

  // 🔁 FALLBACK
  { path: "*", element: <Login /> },

]);

export default router;
