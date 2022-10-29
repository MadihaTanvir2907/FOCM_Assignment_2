import React from 'react';

function Dashboard() {
    const Source = localStorage.getItem("source")
    return (
        <div>
            <h1>Dashboard Works for {Source}</h1>
        </div>
    );
}

export default Dashboard;
