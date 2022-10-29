import React, {useState} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import Login from "../components/Login";
import {default as ProtectedRoute, ProtectedRouteProps} from "../components/ProtectedRoute";

function AppRoutes() {
    const defaultProtectedRouteProps: Omit<ProtectedRouteProps, 'outlet'> = {
      isAuthenticated: localStorage.getItem('token') ? true : false,
      authenticationPath: '/login',
    };
    debugger;
    return (
        <BrowserRouter>
            <Routes>
                {/*<Route index path='/' element={<Dashboard />} />*/}
                <Route path='/' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Dashboard />} />} />
                <Route path="/login" element={<Login />}  />
            </Routes>
        </BrowserRouter>
    );
}


export default AppRoutes;
