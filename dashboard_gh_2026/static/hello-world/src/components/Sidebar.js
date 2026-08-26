import React, { useEffect } from 'react';

export default function Sidebar({ open, onClose, onGoHome, onOpenProgramPage }){
    useEffect(()=>{
        function onKey(e){ if(e.key==='Escape') onClose(); }
        if(open) document.addEventListener('keydown', onKey);
        return ()=>document.removeEventListener('keydown', onKey);
    },[open,onClose]);

    return (
        <div className={`sidebar-root ${open ? 'open' : ''}`} aria-hidden={!open}>
            <div className="sidebar-backdrop" onClick={onClose} />
            <aside className="sidebar-panel" role="dialog" aria-label="menu">
                <div className="sidebar-header">MENU</div>
                <div className="sidebar-body">
                    <button className="side-item" onClick={() => {
                        onOpenProgramPage();
                        onClose();
                    }}>
                        gestions des programmes
                    </button>
                    <button className="side-item" onClick={() => {
                        onGoHome();
                        onClose();
                    }}>
                        dashboard GIM-HORIZON 2026
                    </button>
                </div>
                <div className="sidebar-footer">
                    <button className="side-logout">Se déconnecter</button>
                </div>
            </aside>
        </div>
    );
}
