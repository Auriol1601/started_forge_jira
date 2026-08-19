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
                        <button className="menu-item">EXPORTER</button>
                        <button className="menu-item">AFFICHAGE</button>
                        <button className="menu-item">PARTAGER</button>
                    </div>
                </div>
            )}
        </div>
    );
}
