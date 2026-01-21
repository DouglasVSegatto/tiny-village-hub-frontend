// src/App.jsx 🏡

import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import AuthProvider, {useAuth} from './context/AuthContext.jsx';

// Import Core Layout and Utility Components
import Navigation from './components/Navigation.jsx';
import AuthContext from './context/AuthContext.jsx'; // We'll create this next

// Import Views (Components that map to full pages)
import ItemListView from './views/ItemListView.jsx';
import ItemDetails from './views/ItemDetails.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MyItems from './views/MyItems.jsx';
import Profile from './views/Profile.jsx';


// --- Placeholder Components ---
// Ensure these files exist in your views/components folder.
const Home = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="text-center mt-5">
            <h1>
                {isAuthenticated ? `Hello, ${user?.username}!` : 'Welcome to Tiny Village!'}
            </h1>
            <p>Your local marketplace for sharing and trading items.</p>
            <p>Use the navigation links above to get started.</p>
        </div>
    );
};
const NotFound = () => <h2>404 - Page Not Found</h2>;

// --- Main Application Structure ---

function App() {
    // Note: We wrap the entire application in AuthContext to manage global login state
    return (
        <AuthProvider>
            <Router>
                <Navigation/>
                <div className="container-fluid p-3 min-vh-100">
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/list" element={<ItemListView/>}/>
                        <Route path="/items/:itemId" element={<ItemDetails/>}/>

                        {/* Authentication Routes */}
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>

                        {/* Protected Routes */}
                        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
                        <Route path="/my-items" element={<MyItems/>}/>

                        {/* Fallback Route */}
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;