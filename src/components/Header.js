import React from 'react';
import { HomeIcon } from 'lucide-react';

function Header() {
    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <HomeIcon className="icon" />
                    <span>MelRent</span>
                </div>
            </div>
        </header>
    );
}

export default Header;