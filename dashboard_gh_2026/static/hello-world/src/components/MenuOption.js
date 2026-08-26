import React, { useState, useRef, useEffect } from 'react';

export default function MenuOption(){
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(()=>{
        function onDoc(e){
            if(ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', onDoc);
        return ()=>document.removeEventListener('mousedown', onDoc);
    },[]);

    const handleExport = async () => {
        try {
            const { invoke } = await import('@forge/bridge');
            const res = await invoke('getIssues', { jql: 'project=GIM' });
            console.log('issues', res);
            alert(`Récupéré ${res.total} issues (voir console)`);
        } catch (err) {
            const message = err && err.message && err.message.includes('Unable to establish a connection with the Custom UI bridge')
                ? 'Bridge Forge non disponible hors du contexte Jira. Lance forge tunnel et ouvre l’app depuis Jira.'
                : 'Erreur: ' + (err?.message || err);
            console.error(err);
            alert(message);
        }
    };

    return (
        <div className="menu-option" ref={ref}>
            <button className="dots-button" onClick={()=>setOpen(o=>!o)} aria-label="options">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
            </button>
            {open && (
                <div className="menu-dropdown">
                    <div className="menu-header">OPTION</div>
                    <div className="menu-body">
                        <button className="menu-item" onClick={handleExport}>EXPORTER</button>
                        <button className="menu-item">AFFICHAGE</button>
                        <button className="menu-item">PARTAGER</button>
                    </div>
                </div>
            )}
        </div>
    );
}
